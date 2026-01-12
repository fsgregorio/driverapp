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

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('driveToPass_user');
    const savedUserType = localStorage.getItem('driveToPass_userType');
    
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
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
        const mockUser = {
          id: Date.now(),
          ...userData,
          type: type,
          photo: type === 'student' 
            ? '/imgs/users/image.png' 
            : getMockUser('instructor').photo
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
        const mockUser = getMockUser(type);
        mockUser.email = 'usuario@gmail.com';
        mockUser.name = 'Usuário Google';
        setUser(mockUser);
        setUserType(type);
        localStorage.setItem('driveToPass_user', JSON.stringify(mockUser));
        localStorage.setItem('driveToPass_userType', type);
        resolve(mockUser);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('driveToPass_user');
    localStorage.removeItem('driveToPass_userType');
  };

  const value = {
    user,
    userType,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
