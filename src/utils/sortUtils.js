// Utilitários para ordenação de instrutores

/**
 * Ordena instrutores por relevância
 * Critérios de ordenação:
 * 1. Instrutores premium aparecem primeiro
 * 2. Maior quantidade de aulas (totalClasses)
 * 3. Melhor avaliação (rating)
 * 4. Instrutores com avaliação <= 4.5 têm menor relevância (aparecem por último)
 * 
 * @param {object} a - Primeiro instrutor
 * @param {object} b - Segundo instrutor
 * @returns {number} Valor negativo se a vem antes de b, positivo se b vem antes de a, 0 se iguais
 */
export const sortByRelevance = (a, b) => {
  const aPremium = a.premium === true ? 1 : 0;
  const bPremium = b.premium === true ? 1 : 0;
  
  // 1. Premium primeiro
  if (aPremium !== bPremium) {
    return bPremium - aPremium; // Premium (1) vem antes de não-premium (0)
  }
  
  // Se ambos são premium ou ambos não são premium, continuar com outros critérios
  
  const aLowRating = (a.rating || 0) <= 4.5;
  const bLowRating = (b.rating || 0) <= 4.5;
  
  // 4. Instrutores com avaliação <= 4.5 têm menor relevância
  if (aLowRating !== bLowRating) {
    return aLowRating ? 1 : -1; // Baixa avaliação (true) vem depois
  }
  
  // 2. Maior quantidade de aulas
  const aTotalClasses = a.totalClasses || 0;
  const bTotalClasses = b.totalClasses || 0;
  
  if (aTotalClasses !== bTotalClasses) {
    return bTotalClasses - aTotalClasses; // Maior quantidade primeiro
  }
  
  // 3. Melhor avaliação
  const aRating = a.rating || 0;
  const bRating = b.rating || 0;
  
  return bRating - aRating; // Maior avaliação primeiro
};
