import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cnh: '',
    cnhCategory: 'B',
    vehicle: '',
    vehicleYear: '',
    certifications: '',
    availability: 'flexivel'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 11);
    if (limited.length <= 10) {
      return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido (com DDD)';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.cnh.trim()) {
      newErrors.cnh = 'Número da CNH é obrigatório';
    }

    if (!formData.vehicle.trim()) {
      newErrors.vehicle = 'Veículo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Substituir por chamada de API real
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        password: formData.password,
        cnh: formData.cnh,
        cnhCategory: formData.cnhCategory,
        vehicle: formData.vehicle,
        vehicleYear: formData.vehicleYear,
        certifications: formData.certifications,
        availability: formData.availability
      }, 'instructor');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setErrors({ submit: 'Erro ao cadastrar. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
              errors.name ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Seu nome completo"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

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
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Telefone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
              errors.phone ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="(11) 99999-9999"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="cnh" className="block text-sm font-semibold text-gray-700 mb-2">
            Número da CNH <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cnh"
            name="cnh"
            value={formData.cnh}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
              errors.cnh ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="00000000000"
          />
          {errors.cnh && <p className="mt-1 text-sm text-red-600">{errors.cnh}</p>}
        </div>

        <div>
          <label htmlFor="cnhCategory" className="block text-sm font-semibold text-gray-700 mb-2">
            Categoria CNH <span className="text-red-500">*</span>
          </label>
          <select
            id="cnhCategory"
            name="cnhCategory"
            value={formData.cnhCategory}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="A">A - Motocicleta</option>
            <option value="B">B - Carro</option>
            <option value="AB">AB - Carro e Motocicleta</option>
          </select>
        </div>

        <div>
          <label htmlFor="vehicle" className="block text-sm font-semibold text-gray-700 mb-2">
            Veículo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
              errors.vehicle ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Ex: Honda Civic 2020"
          />
          {errors.vehicle && <p className="mt-1 text-sm text-red-600">{errors.vehicle}</p>}
        </div>

        <div>
          <label htmlFor="vehicleYear" className="block text-sm font-semibold text-gray-700 mb-2">
            Ano do Veículo
          </label>
          <input
            type="text"
            id="vehicleYear"
            name="vehicleYear"
            value={formData.vehicleYear}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            placeholder="2020"
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-semibold text-gray-700 mb-2">
            Disponibilidade
          </label>
          <select
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="flexivel">Flexível</option>
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
            <option value="noite">Noite</option>
            <option value="finais">Finais de Semana</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="certifications" className="block text-sm font-semibold text-gray-700 mb-2">
          Certificações Adicionais
        </label>
        <textarea
          id="certifications"
          name="certifications"
          value={formData.certifications}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="Liste suas certificações, cursos ou especializações..."
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Senha <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
            errors.password ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder="Mínimo 6 caracteres"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
          Confirmar Senha <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
            errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder="Confirme sua senha"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload de Documentos (Opcional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600">Arraste arquivos aqui ou clique para selecionar</p>
          <p className="text-xs text-gray-500 mt-1">CNH, Certificados (PDF, JPG, PNG)</p>
          {/* TODO: Implementar upload real */}
        </div>
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
            Cadastrando...
          </span>
        ) : (
          'Criar Conta de Instrutor'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
