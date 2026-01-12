import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import GoogleAuthButton from '../components/dashboard/aluno/GoogleAuthButton';
import CompleteProfileModal from '../components/auth/CompleteProfileModal';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, userType, loading, isProfileComplete } = useAuth();
  const type = searchParams.get('type') || 'student'; // 'student' ou 'instructor'
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && isProfileComplete) {
      // Redirecionar para o dashboard apropriado apenas se o perfil estiver completo
      if (userType === 'student') {
        navigate('/dashboard/aluno');
      } else if (userType === 'instructor') {
        navigate('/dashboard/instrutor');
      }
    }
    // Não mostrar modal automaticamente aqui - apenas quando GoogleAuthButton detectar perfil incompleto
  }, [loading, isAuthenticated, userType, isProfileComplete, navigate]);

  const handleAuthSuccess = () => {
    // Verificar se precisa completar perfil antes de redirecionar
    if (!isProfileComplete) {
      setShowCompleteProfile(true);
      return;
    }
    
    // Redirecionar após login bem-sucedido
    if (type === 'student') {
      navigate('/dashboard/aluno');
    } else {
      navigate('/dashboard/instrutor');
    }
  };

  const handleProfileComplete = () => {
    setShowCompleteProfile(false);
    // Aguardar um pouco para garantir que o estado foi atualizado
    setTimeout(() => {
      // Redirecionar após completar perfil
      if (type === 'student') {
        navigate('/dashboard/aluno');
      } else {
        navigate('/dashboard/instrutor');
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-accent via-white to-accent">
      <SEO
        title={`Login - ${type === 'student' ? 'Aluno' : 'Instrutor'} - DriveToPass`}
        description={`Faça login na sua conta ${type === 'student' ? 'de aluno' : 'de instrutor'} na DriveToPass`}
      />
      
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                <span className="text-primary">DriveTo</span>
                <span className="text-secondary">Pass</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Bem-vindo de volta!
              </h1>
              <p className="text-gray-600">
                Faça login na sua conta {type === 'student' ? 'de aluno' : 'de instrutor'}
              </p>
            </div>

            <div className="space-y-4">
              <GoogleAuthButton 
                onSuccess={handleAuthSuccess} 
                onProfileIncomplete={() => setShowCompleteProfile(true)}
                userType={type} 
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <LoginForm onSuccess={handleAuthSuccess} userType={type} />

              <div className="text-center space-y-2 pt-4">
                <Link
                  to={`/forgot-password?type=${type}`}
                  className="text-sm text-primary hover:text-blue-600 font-semibold transition-colors"
                >
                  Esqueci minha senha
                </Link>
                <div className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <Link
                    to={`/register?type=${type}`}
                    className="text-primary hover:text-blue-600 font-semibold transition-colors"
                  >
                    Criar conta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de completar perfil */}
      <CompleteProfileModal
        isOpen={showCompleteProfile}
        onComplete={handleProfileComplete}
        userType={type}
      />
    </div>
  );
};

export default Login;
