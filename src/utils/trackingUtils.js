/**
 * Sistema de tracking de eventos para análise de comportamento do usuário
 * Integrado com Supabase para armazenamento persistente
 */

import { supabase, supabaseStudent, supabaseInstructor, supabaseAdmin } from '../services/supabase';

// Configuração de tracking
const TRACKING_ENABLED = process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_TRACKING === 'true';

// Generate or get session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Tenta obter o usuário atual baseado no tipo de usuário especificado
 * Se o tipo não for especificado, tenta detectar automaticamente
 * Retorna o usuário e o cliente correspondente
 * 
 * IMPORTANTE: Se preferredUserType for especificado, NÃO fazer fallback para outros tipos
 * Isso evita usar o email do admin em eventos de aluno
 */
const getCurrentUser = async (preferredUserType = null) => {
  // Se um tipo de usuário foi especificado, usar APENAS o cliente correspondente
  // NÃO fazer fallback para outros tipos
  if (preferredUserType === 'student') {
    try {
      const { data: { user }, error } = await supabaseStudent.auth.getUser();
      if (!error && user) {
        return { user, client: supabaseStudent, userType: 'student' };
      }
      // Se não encontrou usuário no cliente student, retornar null (não fazer fallback)
      return { user: null, client: supabaseStudent, userType: null };
    } catch (error) {
      return { user: null, client: supabaseStudent, userType: null };
    }
  } else if (preferredUserType === 'instructor') {
    try {
      const { data: { user }, error } = await supabaseInstructor.auth.getUser();
      if (!error && user) {
        return { user, client: supabaseInstructor, userType: 'instructor' };
      }
      // Se não encontrou usuário no cliente instructor, retornar null (não fazer fallback)
      return { user: null, client: supabaseInstructor, userType: null };
    } catch (error) {
      return { user: null, client: supabaseInstructor, userType: null };
    }
  } else if (preferredUserType === 'admin') {
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser();
      if (!error && user) {
        return { user, client: supabaseAdmin, userType: 'admin' };
      }
      // Se não encontrou usuário no cliente admin, retornar null (não fazer fallback)
      return { user: null, client: supabaseAdmin, userType: null };
    } catch (error) {
      return { user: null, client: supabaseAdmin, userType: null };
    }
  }

  // Se não foi especificado um tipo, tentar detectar automaticamente
  // Ordem: student > instructor > admin > default (para evitar pegar admin quando é aluno)
  const clients = [
    { client: supabaseStudent, type: 'student' },
    { client: supabaseInstructor, type: 'instructor' },
    { client: supabaseAdmin, type: 'admin' },
    { client: supabase, type: null }
  ];

  for (const { client, type } of clients) {
    try {
      const { data: { user }, error } = await client.auth.getUser();
      if (!error && user) {
        return { user, client, userType: type };
      }
    } catch (error) {
      // Continuar tentando outros clientes
      continue;
    }
  }

  return { user: null, client: supabase, userType: null };
};

/**
 * Registra um evento de tracking
 * @param {string} eventName - Nome do evento (ex: 'button_click', 'page_view')
 * @param {Object} properties - Propriedades adicionais do evento
 */
export const trackEvent = async (eventName, properties = {}) => {
  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Tracking]', eventName, properties);
  }

  // Extract user type from properties first (this is the most reliable)
  const userType = properties.user_type;
  
  // Extract page from properties or use current location
  const page = properties.page || (typeof window !== 'undefined' ? window.location.pathname : null);
  
  // Verificar se é um evento de landing page (não precisa buscar usuário)
  const isLandingPageEvent = eventName.includes('landing_aluno') || eventName.includes('landing_instrutor');
  
  // Para eventos de landing page, não buscar usuário (usuário normalmente ainda não tem conta)
  let user = null;
  let client = supabase;
  let detectedUserType = null;
  
  if (!isLandingPageEvent) {
    // Get current user from the appropriate Supabase client based on user_type
    // IMPORTANTE: Se user_type está especificado, usar APENAS o cliente correspondente
    // Isso evita pegar o admin quando o evento é de um aluno
    const userResult = await getCurrentUser(userType);
    user = userResult.user;
    client = userResult.client;
    detectedUserType = userResult.userType;
  } else {
    // Para eventos de landing page, definir user_type baseado no nome do evento
    // mas não buscar usuário/email
    if (eventName.includes('landing_aluno')) {
      detectedUserType = 'student';
    } else if (eventName.includes('landing_instrutor')) {
      detectedUserType = 'instructor';
    }
  }
  
  // Use detected type only if user_type wasn't provided in properties
  // Para landing page, usar o tipo detectado do nome do evento
  const finalUserType = userType || detectedUserType;

  // Get user email if available
  // REGRA CRÍTICA: Só usar o email se:
  // 1. O user_type do evento corresponde ao tipo detectado do usuário, OU
  // 2. Não há user_type especificado (eventos sem contexto de usuário)
  let userEmail = null;
  let finalUserId = null;
  
  // Se temos um user_type específico, só usar o usuário se o tipo corresponder
  if (userType && detectedUserType !== userType) {
    // Tipo não corresponde - não usar este usuário
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Tracking] ⚠️ User type mismatch - ignoring user:', {
        eventUserType: userType,
        detectedUserType: detectedUserType,
        userId: user?.id,
        userEmail: user?.email
      });
    }
    // Não usar user nem email neste caso
  } else if (user?.id) {
    // Tipos correspondem ou não há user_type especificado - usar este usuário
    finalUserId = user.id;
    
    if (user.email) {
      userEmail = user.email;
    } else {
      // Tentar buscar email do perfil usando o cliente correto
      try {
        const { data: profile } = await client
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single();
        if (profile?.email) {
          userEmail = profile.email;
        }
      } catch (error) {
        // Silently fail - email is optional
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Tracking] Could not fetch email from profile:', error);
        }
      }
    }
  }

  // Log email capture for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Tracking] Event:', eventName);
    console.log('[Tracking] User Type (from properties):', userType);
    console.log('[Tracking] Detected User Type:', detectedUserType);
    console.log('[Tracking] User ID:', user?.id || 'none');
    console.log('[Tracking] User Email:', userEmail || 'not available');
  }

  // Prepare event data
  const eventData = {
    user_id: finalUserId,
    user_email: userEmail,
    event_name: eventName,
    properties: properties,
    timestamp: new Date().toISOString(),
    user_type: finalUserType,
    page: page,
    session_id: getSessionId(),
  };

  // Save to Supabase (non-blocking) - use the client that has the user session
  if (TRACKING_ENABLED || process.env.NODE_ENV === 'development') {
    client
      .from('events')
      .insert([eventData])
      .then(({ error, data }) => {
        if (error) {
          console.error('[Tracking] ❌ Error saving event:', error);
          console.error('[Tracking] Event data:', JSON.stringify(eventData, null, 2));
          console.error('[Tracking] Error code:', error.code);
          console.error('[Tracking] Error message:', error.message);
          console.error('[Tracking] Error details:', error.details);
          console.error('[Tracking] Error hint:', error.hint);
          
          // Se o erro for sobre coluna não existente, informar ao usuário
          if (error.message?.includes('column') && error.message?.includes('user_email')) {
            console.error('[Tracking] ⚠️ A coluna user_email não existe na tabela events!');
            console.error('[Tracking] Execute o script: docs/add_user_email_to_events.sql no Supabase SQL Editor');
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Tracking] ✅ Event saved successfully:', eventName);
            console.log('[Tracking] User ID:', user?.id || 'none');
            console.log('[Tracking] User Email:', userEmail || 'none');
            console.log('[Tracking] User Type:', userType || 'none');
          }
        }
      })
      .catch((error) => {
        console.error('[Tracking] ❌ Exception saving event:', error);
      });
  }
};

/**
 * Eventos pré-definidos para facilitar o uso
 * Apenas eventos importantes são rastreados inicialmente
 */
export const trackingEvents = {
  // Landing Page - Aluno - CTAs importantes
  LANDING_ALUNO_CTA_HERO: 'landing_aluno_cta_hero',
  LANDING_ALUNO_CTA_FINAL: 'landing_aluno_cta_final',
  
  // Autenticação - Eventos importantes
  AUTH_REGISTER_FORM: 'auth_register_form',
  AUTH_REGISTER_SUCCESS: 'auth_register_success',
  AUTH_COMPLETE_PROFILE: 'auth_complete_profile',
  AUTH_COMPLETE_PROFILE_SUCCESS: 'auth_complete_profile_success',
  
  // Dashboard - Aluno - Eventos importantes
  DASHBOARD_ALUNO_SCHEDULE_CONFIRM_CLICK: 'dashboard_aluno_schedule_confirm_click',
  
  // Pagamento - Eventos críticos
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  
  // Cupom - Evento crítico
  COUPON_REQUESTED: 'coupon_requested',
};

/**
 * Helper para tracking de cliques em botões
 */
export const trackButtonClick = (eventName, buttonLabel, additionalProps = {}) => {
  trackEvent(eventName, {
    button_label: buttonLabel,
    timestamp: new Date().toISOString(),
    ...additionalProps,
  });
};

/**
 * Helper para tracking de navegação
 */
export const trackNavigation = (eventName, destination, additionalProps = {}) => {
  trackEvent(eventName, {
    destination,
    timestamp: new Date().toISOString(),
    ...additionalProps,
  });
};

/**
 * Helper para tracking de seções visualizadas
 */
export const trackSectionView = (sectionName, page, additionalProps = {}) => {
  trackEvent('section_view', {
    section_name: sectionName,
    page,
    timestamp: new Date().toISOString(),
    ...additionalProps,
  });
};
