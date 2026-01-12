// Utilitários para calcular disponibilidade de instrutores

/**
 * Gera horários disponíveis em intervalos de 1 hora
 * @param {string} startTime - Hora de início (formato HH:MM)
 * @param {string} endTime - Hora de fim (formato HH:MM)
 * @returns {string[]} Array de horários disponíveis
 */
export const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  // Converter para minutos para facilitar comparação
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // Gerar slots de hora em hora
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    const timeString = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    slots.push(timeString);
  }
  
  return slots;
};

/**
 * Verifica se uma data está bloqueada
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {string[]} blockedDates - Array de datas bloqueadas
 * @returns {boolean} true se a data estiver bloqueada
 */
export const isDateBlocked = (date, blockedDates = []) => {
  return blockedDates.includes(date);
};

/**
 * Obtém o horário disponível para uma data específica
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {object} availability - Objeto de disponibilidade do instrutor
 * @returns {object|null} Objeto com start e end ou null se não disponível
 */
export const getDateAvailability = (date, availability) => {
  if (!availability) return null;
  
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay(); // 0 = domingo, 6 = sábado
  
  // Verificar se a data está bloqueada
  if (isDateBlocked(date, availability.blockedDates)) {
    return null;
  }
  
  // Verificar se há horário customizado para essa data
  if (availability.customSchedule && availability.customSchedule[date]) {
    return availability.customSchedule[date];
  }
  
  // Usar horário da semana
  if (availability.weeklySchedule && availability.weeklySchedule[dayOfWeek]) {
    return availability.weeklySchedule[dayOfWeek];
  }
  
  return null;
};

/**
 * Obtém horários ocupados para um instrutor em uma data específica
 * @param {number} instructorId - ID do instrutor
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {array} scheduledClasses - Array de aulas agendadas
 * @returns {string[]} Array de horários ocupados
 */
export const getOccupiedTimes = (instructorId, date, scheduledClasses = []) => {
  const occupied = [];
  
  scheduledClasses.forEach(classItem => {
    // Verificar se é do mesmo instrutor e mesma data
    if (classItem.instructorId === instructorId && classItem.date === date) {
      // Verificar se a aula está em um status que ocupa o horário
      const occupiedStatuses = [
        'agendada',
        'confirmada',
        'pendente_aceite',
        'pendente_pagamento'
      ];
      
      if (occupiedStatuses.includes(classItem.status)) {
        occupied.push(classItem.time);
      }
    }
  });
  
  return occupied;
};

/**
 * Calcula horários disponíveis para um instrutor em uma data específica
 * @param {object} instructor - Objeto do instrutor
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {array} scheduledClasses - Array de aulas agendadas (mockStudentClasses + mockInstructorClasses)
 * @returns {string[]} Array de horários disponíveis
 */
export const getAvailableTimes = (instructor, date, scheduledClasses = []) => {
  if (!instructor || !instructor.availability) {
    // Se não houver disponibilidade configurada, retornar horários padrão
    return ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  }
  
  // Obter disponibilidade para a data
  const dateAvailability = getDateAvailability(date, instructor.availability);
  
  if (!dateAvailability) {
    return []; // Data bloqueada ou sem disponibilidade
  }
  
  // Gerar slots de horário baseado na disponibilidade
  const allSlots = generateTimeSlots(dateAvailability.start, dateAvailability.end);
  
  // Obter horários ocupados
  const occupiedTimes = getOccupiedTimes(instructor.id, date, scheduledClasses);
  
  // Filtrar horários ocupados
  const availableTimes = allSlots.filter(time => !occupiedTimes.includes(time));
  
  return availableTimes;
};

/**
 * Verifica se uma data tem horários disponíveis
 * @param {object} instructor - Objeto do instrutor
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {array} scheduledClasses - Array de aulas agendadas
 * @returns {boolean} true se houver horários disponíveis
 */
export const hasAvailableTimes = (instructor, date, scheduledClasses = []) => {
  const availableTimes = getAvailableTimes(instructor, date, scheduledClasses);
  return availableTimes.length > 0;
};
