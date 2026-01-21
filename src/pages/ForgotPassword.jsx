import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackEvent, trackingEvents } from '../utils/trackingUtils';
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

    // Tracking do evento
    trackEvent(trackingEvents.AUTH_FORGOT_PASSWORD, {
      user_type: type,
      page: 'forgot_password',
      has_email: !!email
    });

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
            {!isSuccess ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                    Esqueci minha senha
                  </h1>
                  <p className="text-gray-600">
                    Digite seu e-mail e enviaremos instruções para redefinir sua senha
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="seu@email.com"
                      autoComplete="email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                      <p className="text-red-700 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to={`/login?type=${type}`}
                    className="text-sm text-primary hover:text-blue-600 font-semibold transition-colors"
                  >
                    Voltar para o login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary mb-4">
                  E-mail enviado!
                </h2>
                <p className="text-gray-600 mb-6">
                  Enviamos instruções para redefinir sua senha. Verifique sua caixa de entrada e siga as instruções.
                </p>
                <Link
                  to={`/login?type=${type}`}
                  className="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
