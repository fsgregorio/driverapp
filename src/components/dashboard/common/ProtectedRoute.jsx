import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { isAuthenticated, userType, loading, isAuthenticatedAs, setActiveUser } = useAuth();

  // Quando acessar uma rota protegida, ativar o usuário do tipo requerido se existir
  useEffect(() => {
    if (!loading && requiredUserType && isAuthenticatedAs(requiredUserType)) {
      setActiveUser(requiredUserType);
    }
  }, [loading, requiredUserType, isAuthenticatedAs, setActiveUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Verificar se há sessão ativa do tipo requerido
  const hasRequiredSession = requiredUserType ? isAuthenticatedAs(requiredUserType) : isAuthenticated;

  if (!hasRequiredSession) {
    // Se não tem sessão do tipo requerido, redirecionar para login
    if (requiredUserType === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    }
    return <Navigate to={`/login?type=${requiredUserType || 'student'}`} replace />;
  }

  // Se tem sessão mas o userType não corresponde, atualizar o usuário ativo
  if (requiredUserType && userType !== requiredUserType && isAuthenticatedAs(requiredUserType)) {
    setActiveUser(requiredUserType);
    // Retornar loading enquanto atualiza
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
