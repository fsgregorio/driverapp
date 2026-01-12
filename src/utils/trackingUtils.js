/**
 * Sistema de tracking de eventos para análise de comportamento do usuário
 * 
 * Para MVP, os eventos são logados no console. No futuro, pode ser integrado
 * com Google Analytics, Mixpanel, ou outro serviço de analytics.
 */

// Configuração de tracking
const TRACKING_ENABLED = process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_TRACKING === 'true';

/**
 * Registra um evento de tracking
 * @param {string} eventName - Nome do evento (ex: 'button_click', 'page_view')
 * @param {Object} properties - Propriedades adicionais do evento
 */
export const trackEvent = (eventName, properties = {}) => {
  if (!TRACKING_ENABLED) {
    // Em desenvolvimento, loga no console para debug
    console.log('[Tracking]', eventName, properties);
    return;
  }

  // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
  // Exemplo para Google Analytics 4:
  // if (window.gtag) {
  //   window.gtag('event', eventName, properties);
  // }

  // Exemplo para Mixpanel:
  // if (window.mixpanel) {
  //   window.mixpanel.track(eventName, properties);
  // }

  // Por enquanto, apenas loga no console
  console.log('[Tracking]', eventName, properties);
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
  DASHBOARD_ALUNO_CLASS_SCHEDULED: 'dashboard_aluno_class_scheduled',
  DASHBOARD_ALUNO_CLASS_CANCELED: 'dashboard_aluno_class_canceled',
  DASHBOARD_ALUNO_INSTRUCTOR_SEARCH: 'dashboard_aluno_instructor_search',
  DASHBOARD_ALUNO_INSTRUCTOR_VIEW: 'dashboard_aluno_instructor_view',
  DASHBOARD_ALUNO_LOGOUT: 'dashboard_aluno_logout',
  
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
