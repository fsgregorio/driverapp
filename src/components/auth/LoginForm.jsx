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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Timeout de segurança - reseta isSubmitting após 15 segundos
    const safetyTimeout = setTimeout(() => {
      console.error('Login timeout - taking too long');
      setIsSubmitting(false);
      setErrors({ submit: 'O login está demorando muito. Tente novamente.' });
    }, 15000);

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
      console.log('[LoginForm] Calling login function...');
      const result = await login(formData.email, formData.password, userType);
      console.log('[LoginForm] Login successful, result:', result);
      
      clearTimeout(safetyTimeout);
      console.log('[LoginForm] Safety timeout cleared');

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

      // Chamar onSuccess para atualizar estado na página de login
      if (onSuccess) {
        console.log('[LoginForm] Calling onSuccess callback');
        onSuccess();
      }

      // Redirecionar imediatamente - não esperar pelo loadUserProfile
      const dashboardPath = userType === 'student' ? '/dashboard/aluno' : '/dashboard/instrutor';
      console.log('[LoginForm] About to redirect to:', dashboardPath);
      
      // Resetar isSubmitting antes de navegar
      setIsSubmitting(false);
      console.log('[LoginForm] isSubmitting reset to false');
      
      console.log('[LoginForm] Calling navigate...');
      navigate(dashboardPath, { replace: true });
      console.log('[LoginForm] Navigate called, should redirect now');
      
    } catch (error) {
      console.error('Login error caught:', error);
      clearTimeout(safetyTimeout);
      
      // Ignore abort errors
      if (error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('cancelada')) {
        setIsSubmitting(false);
        return;
      }
      
      const errorMessage = error.message || 'E-mail ou senha incorretos. Tente novamente.';
      setErrors({ submit: errorMessage });
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
