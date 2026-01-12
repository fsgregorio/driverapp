// API Service - Estrutura preparada para integração futura
// TODO: Substituir por chamadas reais quando o backend estiver disponível

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function para fazer requisições
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('driveToPass_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password, userType) => {
    // TODO: Implementar chamada real
    // return request('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password, userType }),
    // });
    throw new Error('Not implemented - use mockup');
  },

  register: async (userData, userType) => {
    // TODO: Implementar chamada real
    // return request('/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify({ ...userData, userType }),
    // });
    throw new Error('Not implemented - use mockup');
  },

  loginWithGoogle: async (userType) => {
    // TODO: Implementar integração com Firebase/Supabase
    // return request('/auth/google', {
    //   method: 'POST',
    //   body: JSON.stringify({ userType }),
    // });
    throw new Error('Not implemented - use mockup');
  },

  logout: async () => {
    // TODO: Implementar logout real
    localStorage.removeItem('driveToPass_token');
  },
};

// Students API
export const studentsAPI = {
  getClasses: async () => {
    // TODO: Implementar
    // return request('/students/classes');
    throw new Error('Not implemented - use mockup');
  },

  getPendingClasses: async () => {
    // TODO: Implementar
    // return request('/students/classes/pending');
    throw new Error('Not implemented - use mockup');
  },

  getIndicators: async () => {
    // TODO: Implementar
    // return request('/students/indicators');
    throw new Error('Not implemented - use mockup');
  },

  scheduleClass: async (classData) => {
    // TODO: Implementar
    // return request('/students/classes', {
    //   method: 'POST',
    //   body: JSON.stringify(classData),
    // });
    throw new Error('Not implemented - use mockup');
  },

  cancelClass: async (classId) => {
    // TODO: Implementar
    // return request(`/students/classes/${classId}/cancel`, {
    //   method: 'POST',
    // });
    throw new Error('Not implemented - use mockup');
  },

  rescheduleClass: async (classId, newData) => {
    // TODO: Implementar
    // return request(`/students/classes/${classId}/reschedule`, {
    //   method: 'POST',
    //   body: JSON.stringify(newData),
    // });
    throw new Error('Not implemented - use mockup');
  },

  payClass: async (classId, paymentMethod) => {
    // TODO: Implementar
    // return request(`/students/classes/${classId}/pay`, {
    //   method: 'POST',
    //   body: JSON.stringify({ paymentMethod }),
    // });
    throw new Error('Not implemented - use mockup');
  },

  evaluateClass: async (classId, rating, review) => {
    // TODO: Implementar
    // return request(`/students/classes/${classId}/evaluate`, {
    //   method: 'POST',
    //   body: JSON.stringify({ rating, review }),
    // });
    throw new Error('Not implemented - use mockup');
  },

  getInstructors: async (filters = {}) => {
    // TODO: Implementar
    // const queryParams = new URLSearchParams(filters).toString();
    // return request(`/students/instructors?${queryParams}`);
    throw new Error('Not implemented - use mockup');
  },

  updateProfile: async (profileData) => {
    // TODO: Implementar
    // return request('/students/profile', {
    //   method: 'PUT',
    //   body: JSON.stringify(profileData),
    // });
    throw new Error('Not implemented - use mockup');
  },

  updateAccountSettings: async (settings) => {
    // TODO: Implementar
    // return request('/students/settings', {
    //   method: 'PUT',
    //   body: JSON.stringify(settings),
    // });
    throw new Error('Not implemented - use mockup');
  },

  changePassword: async (currentPassword, newPassword) => {
    // TODO: Implementar
    // return request('/students/password', {
    //   method: 'POST',
    //   body: JSON.stringify({ currentPassword, newPassword }),
    // });
    throw new Error('Not implemented - use mockup');
  },
};

// Instructors API
export const instructorsAPI = {
  getClasses: async () => {
    // TODO: Implementar
    // return request('/instructors/classes');
    throw new Error('Not implemented - use mockup');
  },

  confirmClass: async (classId) => {
    // TODO: Implementar
    // return request(`/instructors/classes/${classId}/confirm`, {
    //   method: 'POST',
    // });
    throw new Error('Not implemented - use mockup');
  },

  rejectClass: async (classId) => {
    // TODO: Implementar
    // return request(`/instructors/classes/${classId}/reject`, {
    //   method: 'POST',
    // });
    throw new Error('Not implemented - use mockup');
  },

  getIndicators: async (period = 'month') => {
    // TODO: Implementar
    // return request(`/instructors/indicators?period=${period}`);
    throw new Error('Not implemented - use mockup');
  },

  getTransactions: async (period = 'month') => {
    // TODO: Implementar
    // return request(`/instructors/transactions?period=${period}`);
    throw new Error('Not implemented - use mockup');
  },

  requestWithdraw: async (amount, accountId) => {
    // TODO: Implementar
    // return request('/instructors/withdraw', {
    //   method: 'POST',
    //   body: JSON.stringify({ amount, accountId }),
    // });
    throw new Error('Not implemented - use mockup');
  },
};

export default {
  auth: authAPI,
  students: studentsAPI,
  instructors: instructorsAPI,
};
