import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // Se a rota exigir admin e o usuário não for admin,
    // redirecionar para o dashboard correspondente ao tipo atual
    if (requiredUserType === 'admin') {
      if (userType === 'student') {
        return <Navigate to="/dashboard/aluno" replace />;
      }
      if (userType === 'instructor') {
        return <Navigate to="/dashboard/instrutor" replace />;
      }
      // Se o tipo não for reconhecido, volta para home
      return <Navigate to="/" replace />;
    }

    return (
      <Navigate
        to={`/dashboard/${requiredUserType === 'student' ? 'aluno' : 'instrutor'}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
