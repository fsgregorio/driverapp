import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, resetPassword } = useAuth();
  const type = searchParams.get('type') || 'student';
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(email);
      
      // Simulação de sucesso
      setIsSuccess(true);
      setEmail('');
    } catch (error) {
      setErrors({ submit: 'Erro ao enviar e-mail. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
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
        title="Esqueci minha senha - iDrive"
        description="Recupere sua senha na iDrive"
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
                    Esqueci minha senha
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Digite seu e-mail e enviaremos instruções para redefinir sua senha
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm sm:text-base ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="seu@email.com"
                      autoComplete="email"
                    />
                    {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>}
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
                        Enviando...
                      </span>
                    ) : (
                      'Enviar instruções'
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <Link
                    to={`/login?type=${type}`}
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
                  E-mail enviado!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                  Enviamos instruções para redefinir sua senha. Verifique sua caixa de entrada e siga as instruções.
                </p>
                <Link
                  to={`/login?type=${type}`}
                  className="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Voltar para o login
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

export default ForgotPassword;
