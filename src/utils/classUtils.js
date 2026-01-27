// Utilitários para manipulação de aulas

/**
 * Filtra aulas por status
 * @param {Array} classes - Lista de aulas
 * @param {string} status - Status a filtrar
 * @returns {Array} Aulas filtradas
 */
export const filterClassesByStatus = (classes, status) => {
  return classes.filter(cls => cls.status === status);
};

/**
 * Filtra aulas pendentes de aceite
 * @param {Array} classes - Lista de aulas
 * @returns {Array} Aulas pendentes de aceite
 */
export const getPendingAcceptanceClasses = (classes) => {
  return classes.filter(cls => cls.status === 'pendente_aceite');
};

/**
 * Retorna todas as aulas sem filtro
 * @param {Array} classes - Lista de aulas
 * @returns {Array} Todas as aulas
 */
export const getAllClasses = (classes) => {
  return classes;
};

/**
 * Filtra aulas agendadas (apenas agendada ou confirmada, sem pendentes)
 * IMPORTANTE: Aulas agendadas só aparecem após o pagamento
 * @param {Array} classes - Lista de aulas
 * @returns {Array} Aulas agendadas/confirmadas (excluindo canceladas, pendentes, etc)
 */
export const getAgendadasClasses = (classes) => {
  if (!classes || !Array.isArray(classes)) {
    return [];
  }
  
  return classes.filter(cls => {
    // Apenas aulas com status 'agendada' ou 'confirmada'
    // Excluir explicitamente canceladas, pendentes, concluídas
    if (!cls || !cls.status) {
      return false;
    }
    
    const status = cls.status.toLowerCase();
    return (status === 'agendada' || status === 'confirmada') && 
           status !== 'cancelada' && 
           status !== 'pendente_aceite' && 
           status !== 'pendente_pagamento' && 
           status !== 'pendente_avaliacao' && 
           status !== 'concluida';
  });
};

/**
 * Filtra aulas pendentes de pagamento
 * @param {Array} classes - Lista de aulas
 * @returns {Array} Aulas pendentes de pagamento
 */
export const getPendingPaymentClasses = (classes) => {
  return classes.filter(cls => {
    // Incluir apenas aulas com status pendente_pagamento
    return cls.status === 'pendente_pagamento';
  });
};

/**
 * Filtra aulas pendentes de avaliação
 * @param {Array} classes - Lista de aulas
 * @returns {Array} Aulas pendentes de avaliação
 */
export const getPendingEvaluationClasses = (classes) => {
  return filterClassesByStatus(classes, 'pendente_avaliacao');
};

/**
 * Filtra aulas agendadas (confirmadas ou agendadas)
 * @deprecated Use getAgendadasClasses() para apenas agendadas/confirmadas
 * ou getPendingPaymentClasses() para pendentes de pagamento
 * @param {Array} classes - Lista de aulas
 * @returns {Array} Aulas agendadas
 */
export const getScheduledClasses = (classes) => {
  return classes.filter(cls => 
    cls.status === 'agendada' || 
    cls.status === 'confirmada' ||
    cls.status === 'pendente_pagamento'
  );
};

/**
 * Filtra histórico de aulas (concluídas ou canceladas)
 * @param {Array} classes - Lista de aulas
 * @returns {Array} Aulas do histórico
 */
export const getHistoryClasses = (classes) => {
  if (!classes || !Array.isArray(classes)) {
    return [];
  }
  
  return classes.filter(cls => {
    if (!cls || !cls.status) {
      return false;
    }
    
    const status = cls.status.toLowerCase();
    return status === 'concluida' || status === 'cancelada';
  });
};

/**
 * Agrupa aulas concluídas por tipo
 * @param {Array} classes - Lista de todas as aulas
 * @returns {object} Objeto com contagem de aulas por tipo
 */
export const getCompletedClassesByType = (classes) => {
  const completed = filterClassesByStatus(classes, 'concluida');
  const typeCounts = {};

  completed.forEach(cls => {
    const types = normalizeClassTypes(cls.type);
    types.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
  });

  return typeCounts;
};

/**
 * Obtém lista de instrutores favoritos (ordenados por número de aulas)
 * @param {Array} classes - Lista de todas as aulas
 * @param {number} limit - Número máximo de instrutores a retornar (padrão: 3)
 * @returns {Array} Array de instrutores favoritos
 */
export const getFavoriteInstructors = (classes, limit = 3) => {
  const completed = filterClassesByStatus(classes, 'concluida');
  const instructorCounts = {};

  completed.forEach(cls => {
    if (cls.instructorId) {
      if (!instructorCounts[cls.instructorId]) {
        instructorCounts[cls.instructorId] = {
          id: cls.instructorId,
          name: cls.instructorName,
          photo: cls.instructorPhoto,
          count: 0
        };
      }
      instructorCounts[cls.instructorId].count += 1;
    }
  });

  return Object.values(instructorCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Obtém próximas aulas (próximos 7 dias)
 * @param {Array} classes - Lista de todas as aulas
 * @returns {Array} Array de aulas dos próximos 7 dias
 */
export const getUpcomingClasses = (classes, days = 7) => {
  const scheduled = getAgendadasClasses(classes);
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return scheduled
    .filter(cls => {
      const classDateTime = new Date(`${cls.date}T${cls.time}`);
      return classDateTime >= now && classDateTime <= futureDate;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB - dateA; // Ordem decrescente: datas mais recentes primeiro
    });
};

/**
 * Calcula indicadores do aluno
 * @param {Array} classes - Lista de todas as aulas
 * @returns {object} Objeto com indicadores
 */
export const calculateStudentIndicators = (classes) => {
  const completed = filterClassesByStatus(classes, 'concluida');
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const completedThisMonth = completed.filter(cls => {
    const classDate = new Date(cls.date);
    return classDate.getMonth() === currentMonth && 
           classDate.getFullYear() === currentYear;
  });

  const totalSpent = completed.reduce((sum, cls) => sum + (cls.price || 0), 0);

  // Próximas aulas (próximos 7 dias)
  const upcomingClasses = getUpcomingClasses(classes, 7);

  // Aulas concluídas por tipo
  const completedByType = getCompletedClassesByType(classes);

  // Instrutores favoritos (top 3)
  const favoriteInstructors = getFavoriteInstructors(classes, 3);

  return {
    completedClasses: completed.length,
    completedClassesThisMonth: completedThisMonth.length,
    completedByType,
    totalSpent,
    upcomingClasses,
    favoriteInstructors
  };
};

/**
 * Obtém o texto do tipo de aula formatado
 * @param {string|string[]} type - Tipo de aula (string ou array)
 * @returns {string} Tipo formatado
 */
export const getClassTypeLabel = (type) => {
  // Se for array, retorna o primeiro tipo formatado (para compatibilidade)
  if (Array.isArray(type)) {
    return getClassTypeLabel(type[0]);
  }
  
  const types = {
    'Baliza': 'Baliza',
    'Rua': 'Rua',
    'Rodovia': 'Rodovia',
    'Geral': 'Geral',
    'Todos': 'Todos os tipos',
    'Moto': 'Moto'
  };
  return types[type] || type;
};

/**
 * Normaliza o tipo de aula para array
 * @param {string|string[]} type - Tipo de aula
 * @returns {string[]} Array de tipos
 */
export const normalizeClassTypes = (type) => {
  if (!type) return [];
  if (Array.isArray(type)) return type;
  return [type];
};

/**
 * Obtém a cor do badge para um tipo de aula
 * @param {string} type - Tipo de aula
 * @returns {string} Classes CSS para o badge
 */
export const getClassTypeBadgeColor = (type) => {
  const colors = {
    'Baliza': 'bg-purple-100 text-purple-800',
    'Rua': 'bg-blue-100 text-blue-800',
    'Rodovia': 'bg-green-100 text-green-800',
    'Geral': 'bg-gray-100 text-gray-800',
    'Todos': 'bg-indigo-100 text-indigo-800',
    'Moto': 'bg-red-100 text-red-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

/**
 * Obtém o texto do pickup type formatado
 * @param {string} pickupType - Tipo de pickup
 * @returns {string} Texto formatado
 */
export const getPickupTypeLabel = (pickupType) => {
  return pickupType === 'vai_local' ? 'Vai até o local' : 'Busca em casa';
};

/**
 * Formata localização completa para exibição
 * @param {object} location - Objeto de localização
 * @returns {string} Localização formatada
 */
export const formatLocation = (location) => {
  if (typeof location === 'string') {
    return location;
  }
  
  if (location && location.fullAddress) {
    return location.fullAddress;
  }
  
  if (location && location.state && location.city) {
    const parts = [
      location.address,
      location.neighborhood,
      `${location.city} - ${location.state}`
    ].filter(Boolean);
    return parts.join(', ');
  }
  
  return 'Localização não informada';
};

/**
 * Obtém o último horário de uma aula (considerando múltiplas opções)
 * @param {object} classData - Dados da aula
 * @returns {Date|null} Data/hora do último horário ou null
 */
export const getLastScheduledDateTime = (classData) => {
  // Se tiver opções disponíveis (pendente_aceite), pegar o último horário
  if (classData.availableOptions && classData.availableOptions.length > 0) {
    let lastDateTime = null;
    
    classData.availableOptions.forEach(option => {
      option.times.forEach(time => {
        const dateTime = new Date(`${option.date}T${time}`);
        if (!lastDateTime || dateTime > lastDateTime) {
          lastDateTime = dateTime;
        }
      });
    });
    
    return lastDateTime;
  }
  
  // Caso contrário, usar a data/hora principal
  if (classData.date && classData.time) {
    return new Date(`${classData.date}T${classData.time}`);
  }
  
  return null;
};

/**
 * Verifica se uma aula passou da data e horário atual
 * @param {object} classData - Dados da aula
 * @returns {boolean} true se a aula já passou
 */
export const hasClassExpired = (classData) => {
  const lastDateTime = getLastScheduledDateTime(classData);
  if (!lastDateTime) {
    return false;
  }
  
  const now = new Date();
  // Verificar se a data e horário da aula já passaram
  return lastDateTime < now;
};

/**
 * Verifica se uma aula deve ser cancelada automaticamente
 * Cancela apenas aulas pendentes de aceite ou pagamento que passaram
 * @param {object} classData - Dados da aula
 * @returns {boolean} true se deve ser cancelada
 */
export const shouldAutoCancelClass = (classData) => {
  // Apenas aulas pendentes de aceite ou pagamento podem ser canceladas automaticamente
  const cancelableStatuses = ['pendente_aceite', 'pendente_pagamento'];
  if (!cancelableStatuses.includes(classData.status)) {
    return false;
  }
  
  return hasClassExpired(classData);
};

/**
 * Verifica se uma aula agendada deve mudar para aguardando avaliação
 * @param {object} classData - Dados da aula
 * @returns {boolean} true se deve mudar para pendente_avaliacao
 */
export const shouldMoveToPendingEvaluation = (classData) => {
  // Apenas aulas agendadas podem mudar para pendente_avaliacao
  if (classData.status !== 'agendada' && classData.status !== 'confirmada') {
    return false;
  }
  
  return hasClassExpired(classData);
};

/**
 * Processa automaticamente aulas que passaram da data e horário atual
 * - Cancela aulas pendentes de aceite/pagamento
 * - Muda aulas agendadas para pendente_avaliacao
 * @param {Array} classes - Lista de aulas
 * @returns {Array} Lista de aulas atualizada
 */
export const autoCancelExpiredClasses = (classes) => {
  return classes.map(classData => {
    // Verificar se deve cancelar (pendente_aceite ou pendente_pagamento)
    if (shouldAutoCancelClass(classData)) {
      return {
        ...classData,
        status: 'cancelada',
        paymentStatus: classData.paymentStatus === 'pendente' ? 'reembolsado' : classData.paymentStatus,
        autoCanceled: true,
        canceledAt: new Date().toISOString()
      };
    }
    
    // Verificar se deve mudar para pendente_avaliacao (agendada/confirmada)
    if (shouldMoveToPendingEvaluation(classData)) {
      return {
        ...classData,
        status: 'pendente_avaliacao',
        autoUpdated: true,
        updatedAt: new Date().toISOString()
      };
    }
    
    return classData;
  });
};
