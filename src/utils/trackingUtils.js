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
 * Obtém o usuário atual de qualquer cliente Supabase autenticado
 * Exclui admin, pois eventos são gerados apenas por ações de usuários (alunos/instrutores)
 */
const getCurrentUser = async () => {
  // Tentar obter usuário apenas dos clientes de usuários (não admin)
  // Eventos são gerados por ações de alunos/instrutores, não de admin
  const clients = [
    { client: supabaseStudent, type: 'student' },
    { client: supabaseInstructor, type: 'instructor' },
    { client: supabase, type: 'default' }
    // Não incluir supabaseAdmin, pois admin não gera eventos de tracking de usuários
  ];

  for (const { client } of clients) {
    try {
      const { data: { user }, error } = await client.auth.getUser();
      if (!error && user) {
        return user;
      }
    } catch (err) {
      // Continuar tentando outros clientes
      continue;
    }
  }
  
  return null;
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

  // Get current user if available (tenta todos os clientes)
  const user = await getCurrentUser();
  
  // Extract user type from properties or determine from context
  const userType = properties.user_type || (user ? null : null); // Will be set by components
  
  // Extract page from properties or use current location
  const page = properties.page || (typeof window !== 'undefined' ? window.location.pathname : null);

  // Prepare event data
  const eventData = {
    user_id: user?.id || null,
    user_email: user?.email || null,
    event_name: eventName,
    properties: properties,
    timestamp: new Date().toISOString(),
    user_type: userType,
    page: page,
    session_id: getSessionId(),
  };

  // Save to Supabase (non-blocking)
  if (TRACKING_ENABLED || process.env.NODE_ENV === 'development') {
    supabase
      .from('events')
      .insert([eventData])
      .then(({ error }) => {
        if (error && process.env.NODE_ENV === 'development') {
          console.warn('[Tracking] Error saving event:', error);
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Tracking] Error saving event:', error);
        }
      });
  }
};

/**
 * Eventos pré-definidos para facilitar o uso
 */
export const trackingEvents = {
  // Landing Page - Aluno
  LANDING_ALUNO_CTA_HERO: 'landing_aluno_cta_hero',
  LANDING_ALUNO_CTA_FINAL: 'landing_aluno_cta_final',
  LANDING_ALUNO_NAV_SECTION: 'landing_aluno_nav_section',
  LANDING_ALUNO_LOGIN: 'landing_aluno_login',
  LANDING_ALUNO_SWITCH_PROFILE: 'landing_aluno_switch_profile',
  
  // Landing Page - Instrutor
  LANDING_INSTRUTOR_CTA_HERO: 'landing_instrutor_cta_hero',
  LANDING_INSTRUTOR_CTA_FINAL: 'landing_instrutor_cta_final',
  LANDING_INSTRUTOR_NAV_SECTION: 'landing_instrutor_nav_section',
  LANDING_INSTRUTOR_LOGIN: 'landing_instrutor_login',
  LANDING_INSTRUTOR_SWITCH_PROFILE: 'landing_instrutor_switch_profile',
  
  // Dashboard - Aluno
  DASHBOARD_ALUNO_SECTION_CHANGE: 'dashboard_aluno_section_change',
  DASHBOARD_ALUNO_SCHEDULE_NEW_CLASS: 'dashboard_aluno_schedule_new_class',
  DASHBOARD_ALUNO_SCHEDULE_CONFIRM_CLICK: 'dashboard_aluno_schedule_confirm_click',
  DASHBOARD_ALUNO_CLASS_SCHEDULED: 'dashboard_aluno_class_scheduled',
  DASHBOARD_ALUNO_CLASS_CANCELED: 'dashboard_aluno_class_canceled',
  DASHBOARD_ALUNO_INSTRUCTOR_SEARCH: 'dashboard_aluno_instructor_search',
  DASHBOARD_ALUNO_INSTRUCTOR_VIEW: 'dashboard_aluno_instructor_view',
  DASHBOARD_ALUNO_LOGOUT: 'dashboard_aluno_logout',
  
  // Pagamento - Eventos críticos para MVP
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  
  // Cupom - Evento crítico para MVP
  COUPON_REQUESTED: 'coupon_requested',
  
  // Dashboard - Instrutor
  DASHBOARD_INSTRUTOR_SECTION_CHANGE: 'dashboard_instrutor_section_change',
  DASHBOARD_INSTRUTOR_CLASS_ACCEPTED: 'dashboard_instrutor_class_accepted',
  DASHBOARD_INSTRUTOR_CLASS_REJECTED: 'dashboard_instrutor_class_rejected',
  DASHBOARD_INSTRUTOR_LOGOUT: 'dashboard_instrutor_logout',
  
  // Autenticação
  AUTH_LOGIN_GOOGLE: 'auth_login_google',
  AUTH_LOGIN_FORM: 'auth_login_form',
  AUTH_REGISTER_FORM: 'auth_register_form',
  AUTH_LOGIN_SUCCESS: 'auth_login_success',
  AUTH_REGISTER_SUCCESS: 'auth_register_success',
  AUTH_FORGOT_PASSWORD: 'auth_forgot_password',
  AUTH_COMPLETE_PROFILE: 'auth_complete_profile',
  AUTH_COMPLETE_PROFILE_SUCCESS: 'auth_complete_profile_success',
  
  // Navegação geral
  NAV_HOME_CLICK: 'nav_home_click',
  NAV_PROFILE_SWITCH: 'nav_profile_switch',
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
