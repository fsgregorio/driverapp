// Utilitários para manipulação de datas

/**
 * Calcula a diferença em horas entre duas datas
 * @param {string|Date} date1 - Data inicial
 * @param {string|Date} date2 - Data final (padrão: agora)
 * @returns {number} Diferença em horas
 */
export const getHoursDifference = (date1, date2 = new Date()) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = d2 - d1;
  return diffMs / (1000 * 60 * 60);
};

/**
 * Valida se o cancelamento/reagendamento é antes de 24h da aula
 * @param {string} classDate - Data da aula (formato YYYY-MM-DD)
 * @param {string} classTime - Hora da aula (formato HH:MM)
 * @returns {boolean} true se for antes de 24h, false caso contrário
 */
export const isBefore24Hours = (classDate, classTime) => {
  const classDateTime = new Date(`${classDate}T${classTime}:00`);
  const now = new Date();
  const hoursDiff = getHoursDifference(classDateTime, now);
  return hoursDiff < 24;
};

/**
 * Formata data para exibição em português
 * @param {string|Date} date - Data a ser formatada
 * @param {object} options - Opções de formatação
 * @returns {string} Data formatada
 */
export const formatDate = (date, options = {}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  return dateObj.toLocaleDateString('pt-BR', defaultOptions);
};

/**
 * Formata data e hora para exibição
 * @param {string} date - Data (formato YYYY-MM-DD)
 * @param {string} time - Hora (formato HH:MM)
 * @returns {string} Data e hora formatadas
 */
export const formatDateTime = (date, time) => {
  const dateFormatted = formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' });
  return `${dateFormatted}, ${time}`;
};

/**
 * Obtém a data mínima para agendamento (amanhã)
 * @returns {string} Data no formato YYYY-MM-DD
 */
export const getMinDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split('T')[0];
};

/**
 * Verifica se uma data é válida para agendamento
 * @param {string} date - Data a ser validada
 * @returns {boolean} true se a data for válida
 */
export const isValidScheduleDate = (date) => {
  const selectedDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return selectedDate >= tomorrow;
};
