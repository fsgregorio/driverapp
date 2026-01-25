import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import CompleteProfileModal from '../components/auth/CompleteProfileModal';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, isProfileComplete, user } = useAuth();
  const type = searchParams.get('type') || 'student';
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  // Não redirecionar automaticamente - permitir múltiplos logins
  // O usuário pode estar logado como aluno e querer logar como admin também

  const handleAuthSuccess = () => {
    console.log('handleAuthSuccess called');
    // O LoginForm agora faz o redirecionamento
    // Aqui só verificamos se precisa mostrar o modal de completar perfil
    if (user && !user.profileComplete && !isProfileComplete) {
      setShowCompleteProfile(true);
    }
  };

  const handleProfileComplete = () => {
    setShowCompleteProfile(false);
    const dashboardPath = type === 'student' ? '/dashboard/aluno' : '/dashboard/instrutor';
    navigate(dashboardPath);
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Permitir login mesmo se já estiver autenticado como outro tipo

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-accent via-white to-accent">
      <SEO
        title={`Login - ${type === 'student' ? 'Aluno' : 'Instrutor'} - iDrive`}
        description={`Faça login na sua conta ${type === 'student' ? 'de aluno' : 'de instrutor'} na iDrive`}
      />
      
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/imgs/logo/idrive.png" 
                alt="iDrive Logo" 
                className="h-7 sm:h-9 md:h-11 lg:h-12 w-auto"
              />
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

      <CompleteProfileModal
        isOpen={showCompleteProfile}
        onComplete={handleProfileComplete}
        userType={type}
      />
    </div>
  );
};

export default Login;
