import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMockUser } from '../utils/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'student' or 'instructor'

  // Verifica se o perfil está completo
  const isProfileComplete = (userData) => {
    if (!userData) return false;
    // Verifica se tem nome completo (não apenas nome simples), telefone e foto
    const hasFullName = userData.name && userData.name.trim().split(' ').length >= 2;
    const hasPhone = userData.phone && userData.phone.length >= 10;
    const hasPhoto = userData.photo && userData.photo !== '/imgs/users/image.png';
    
    // Para instrutor, também verificar campos específicos
    if (userData.type === 'instructor') {
      const hasCNH = userData.cnh && userData.cnh.trim().length > 0;
      const hasVehicle = userData.vehicle && userData.vehicle.trim().length > 0;
      return hasFullName && hasPhone && hasPhoto && hasCNH && hasVehicle;
    }
    
    return hasFullName && hasPhone && hasPhoto;
  };

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('driveToPass_user');
    const savedUserType = localStorage.getItem('driveToPass_userType');
    
    if (savedUser && savedUserType) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setUserType(savedUserType);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password, type) => {
    // Mockup: simula login
    // TODO: Substituir por chamada de API real
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = getMockUser(type);
        mockUser.email = email;
        setUser(mockUser);
        setUserType(type);
        localStorage.setItem('driveToPass_user', JSON.stringify(mockUser));
        localStorage.setItem('driveToPass_userType', type);
        resolve(mockUser);
      }, 500);
    });
  };

  const register = async (userData, type) => {
    // Mockup: simula cadastro
    // TODO: Substituir por chamada de API real
    return new Promise((resolve) => {
      setTimeout(() => {
        // Criar usuário incompleto - apenas com email e senha
        // Perfil será completado depois
        const mockUser = {
          id: Date.now(),
          email: userData.email,
          password: userData.password, // Em produção, isso seria hash
          name: '', // Nome será preenchido depois
          phone: '', // Telefone será preenchido depois
          type: type,
          photo: '/imgs/users/image.png', // Foto padrão
          profileComplete: false, // Marcar perfil como incompleto
          isGoogleUser: false // Não é usuário Google
        };
        setUser(mockUser);
        setUserType(type);
        localStorage.setItem('driveToPass_user', JSON.stringify(mockUser));
        localStorage.setItem('driveToPass_userType', type);
        resolve(mockUser);
      }, 500);
    });
  };

  const loginWithGoogle = async (type) => {
    // Mockup: simula login com Google
    // TODO: Substituir por integração real com Firebase/Supabase
    return new Promise((resolve) => {
      setTimeout(() => {
        // Verificar se já existe um usuário salvo com este email
        const savedUser = localStorage.getItem('driveToPass_user');
        const savedUserType = localStorage.getItem('driveToPass_userType');
        
        if (savedUser && savedUserType === type) {
          const parsedUser = JSON.parse(savedUser);
          // Se o email corresponde e o perfil está completo, usar o usuário salvo
          if (parsedUser.email === 'usuario@gmail.com' && isProfileComplete(parsedUser)) {
            setUser(parsedUser);
            setUserType(type);
            resolve(parsedUser);
            return;
          }
        }
        
        // Primeira vez ou perfil incompleto - criar usuário básico
        const mockUser = getMockUser(type);
        mockUser.email = 'usuario@gmail.com';
        mockUser.name = 'Usuário'; // Nome incompleto para forçar completar perfil
        mockUser.phone = ''; // Sem telefone
        mockUser.photo = '/imgs/users/image.png'; // Foto padrão
        mockUser.isGoogleUser = true; // Marcar como usuário Google
        mockUser.profileComplete = false; // Marcar perfil como incompleto
        
        setUser(mockUser);
        setUserType(type);
        localStorage.setItem('driveToPass_user', JSON.stringify(mockUser));
        localStorage.setItem('driveToPass_userType', type);
        resolve(mockUser);
      }, 800);
    });
  };

  const completeProfile = async (profileData) => {
    // Mockup: completa o perfil do usuário
    // TODO: Substituir por chamada de API real
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = {
          ...user,
          ...profileData,
          profileComplete: true,
          isGoogleUser: user?.isGoogleUser || false // Manter flag se for usuário Google
        };
        setUser(updatedUser);
        localStorage.setItem('driveToPass_user', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('driveToPass_user');
    localStorage.removeItem('driveToPass_userType');
  };

  const resetPassword = async (email) => {
    // Mockup: simula reset de senha
    // TODO: Substituir por chamada de API real
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula envio de e-mail
        console.log('E-mail de recuperação enviado para:', email);
        resolve({ success: true });
      }, 1000);
    });
  };

  const value = {
    user,
    userType,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    completeProfile,
    isAuthenticated: !!user,
    isProfileComplete: isProfileComplete(user)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
