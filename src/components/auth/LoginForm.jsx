import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trackEvent, trackingEvents } from '../../utils/trackingUtils';

const LoginForm = ({ onSuccess, userType = 'student' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', { isValid, errors: newErrors });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', { email: formData.email, password: formData.password ? '***' : '' });
    
    const isValid = validate();
    if (!isValid) {
      console.log('Validation failed');
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    // Tracking do início do login
    try {
      trackEvent(trackingEvents.AUTH_LOGIN_FORM, {
        user_type: userType,
        page: userType === 'student' ? 'login_aluno' : 'login_instrutor',
        section: 'auth',
        has_email: !!formData.email
      });
    } catch (trackError) {
      console.warn('Tracking error:', trackError);
    }

    try {
      console.log('Calling login function...');
      await login(formData.email, formData.password, userType);
      console.log('Login successful');

      // Tracking de sucesso
      try {
        trackEvent(trackingEvents.AUTH_LOGIN_SUCCESS, {
          method: 'form',
          user_type: userType,
          page: userType === 'student' ? 'login_aluno' : 'login_instrutor'
        });
      } catch (trackError) {
        console.warn('Tracking error:', trackError);
      }

      // Chamar onSuccess primeiro para atualizar o estado na página de login
      if (onSuccess) {
        onSuccess();
      }

      // Redirecionar diretamente após login bem-sucedido
      // O login() já atualizou o estado no contexto, então podemos redirecionar
      const dashboardPath = userType === 'student' ? '/dashboard/aluno' : '/dashboard/instrutor';
      console.log('Login successful, redirecting to:', dashboardPath);
      
      // Aguardar um pouco para garantir que o onAuthStateChange foi processado
      // e que o estado foi atualizado no contexto
      setTimeout(() => {
        console.log('Navigating to dashboard now...');
        navigate(dashboardPath, { replace: true });
      }, 800);
    } catch (error) {
      console.error('Login error:', error);
      
      // Ignore abort errors (common in React Strict Mode)
      if (error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('cancelada')) {
        // Don't show error for aborted requests, just reset submitting state
        setIsSubmitting(false);
        return;
      }
      
      // Show user-friendly error message
      const errorMessage = error.message || 'E-mail ou senha incorretos. Tente novamente.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          E-mail <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
            errors.email ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder="seu@email.com"
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Senha <span className="text-red-500">*</span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
            errors.password ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder="Digite sua senha"
          autoComplete="current-password"
        />
        <label className="flex items-center mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
          />
          <span className="ml-2 text-sm text-gray-600">Mostrar senha</span>
        </label>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-red-700 text-sm">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        onClick={(e) => {
          console.log('Button clicked', { isSubmitting, formData });
          // Let the form handle the submit
        }}
        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Entrando...
          </span>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
