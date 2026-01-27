import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseStudent } from '../services/supabase';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    // Verificar se há um token válido na URL (Supabase adiciona hash fragments)
    const checkToken = async () => {
      try {
        // O Supabase automaticamente detecta o token no hash da URL
        const { data: { session }, error } = await supabaseStudent.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar token:', error);
          setIsValidToken(false);
        } else if (session) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setIsValidToken(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, []);

  const validatePassword = (pwd) => {
    // Mínimo 6 caracteres
    return pwd.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
    
    // Limpar erros quando o usuário começar a digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!validatePassword(password)) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 Atualizando senha...');
      
      // Atualizar a senha usando o Supabase
      // O Supabase detecta automaticamente o token do hash da URL
      const { error } = await supabaseStudent.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Erro ao atualizar senha:', error);
        throw error;
      }
      
      console.log('✅ Senha atualizada com sucesso');
      setIsSuccess(true);
      setPassword('');
      setConfirmPassword('');
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('❌ Erro ao atualizar senha:', error);
      setErrors({ 
        submit: error.message || 'Erro ao atualizar senha. O link pode ter expirado. Tente solicitar um novo link.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-accent via-white to-accent">
        <SEO
          title="Link inválido - iDrive"
          description="Link de recuperação de senha inválido ou expirado"
        />
        
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
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

        <main className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-12 text-center">
              <div className="mb-4 sm:mb-6">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-3 sm:mb-4">
                Link inválido ou expirado
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                Este link de recuperação de senha é inválido ou expirou. Por favor, solicite um novo link.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Solicitar novo link
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-accent via-white to-accent">
      <SEO
        title="Redefinir senha - iDrive"
        description="Redefina sua senha na iDrive"
      />
      
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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

      <main className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-12">
            {!isSuccess ? (
              <>
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-3 sm:mb-4">
                    Redefinir senha
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Digite sua nova senha abaixo
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Nova senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm sm:text-base ${
                          errors.password ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Confirmar senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm sm:text-base ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Digite a senha novamente"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  {errors.submit && (
                    <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl">
                      <p className="text-red-700 text-xs sm:text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 sm:py-3.5 md:py-4 px-6 sm:px-7 md:px-8 rounded-lg sm:rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Atualizando...
                      </span>
                    ) : (
                      'Redefinir senha'
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="text-xs sm:text-sm text-primary hover:text-blue-600 font-semibold transition-colors"
                  >
                    Voltar para o login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-4 sm:mb-6">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-3 sm:mb-4">
                  Senha redefinida com sucesso!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                  Sua senha foi atualizada. Você será redirecionado para a página de login em instantes.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Ir para o login
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
