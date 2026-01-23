import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { trackEvent, trackingEvents } from '../../utils/trackingUtils';

const CompleteProfileModal = ({ isOpen, onComplete, userType = 'student' }) => {
  const { completeProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    // Campos específicos de instrutor
    cnh: '',
    cnhCategory: 'B',
    vehicle: '',
    vehicleYear: '',
    certifications: '',
    availability: 'flexivel'
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'Por favor, selecione uma imagem válida' });
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'A imagem deve ter no máximo 5MB' });
        return;
      }

      setPhoto(file);
      setErrors({ ...errors, photo: '' });
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = 'Digite seu nome completo';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido (com DDD)';
    }

    // Validações específicas para instrutor
    if (userType === 'instructor') {
      if (!formData.cnh.trim()) {
        newErrors.cnh = 'Número da CNH é obrigatório';
      }
      if (!formData.vehicle.trim()) {
        newErrors.vehicle = 'Veículo é obrigatório';
      }
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

    // Tracking do evento
    trackEvent(trackingEvents.AUTH_COMPLETE_PROFILE, {
      user_type: userType,
      page: 'complete_profile',
      has_photo: !!photo
    });

    try {
      // Criar FormData para enviar foto
      const profileData = {
        name: formData.name.trim(),
        phone: formData.phone.replace(/\D/g, '')
      };

      // Adicionar campos específicos de instrutor
      if (userType === 'instructor') {
        profileData.cnh = formData.cnh.trim();
        profileData.cnhCategory = formData.cnhCategory;
        profileData.vehicle = formData.vehicle.trim();
        profileData.vehicleYear = formData.vehicleYear.trim();
        profileData.certifications = formData.certifications.trim();
        profileData.availability = formData.availability;
      }

      // Se houver foto, converter para base64 ou URL (dependendo da implementação)
      let photoUrl = null;
      if (photo) {
        // Por enquanto, usar a preview como URL temporária
        // Em produção, você faria upload para um serviço de storage
        photoUrl = photoPreview;
      }

      // Prepare data in format expected by AuthContext
      const completeProfileData = {
        name: profileData.name,
        phone: profileData.phone,
        photo_url: photoUrl || null, // Use photo_url for Supabase - null se não houver foto
      };

      // Add instructor-specific fields
      if (userType === 'instructor') {
        completeProfileData.cnh = profileData.cnh;
        completeProfileData.vehicle = profileData.vehicle;
        completeProfileData.responseTime = profileData.responseTime || '';
        completeProfileData.homeService = profileData.homeService || false;
        completeProfileData.carTypes = profileData.carTypes || [];
        completeProfileData.specialties = profileData.specialties || [];
        completeProfileData.classTypes = profileData.classTypes || [];
      }

      await completeProfile(completeProfileData);

      // Tracking de sucesso
      trackEvent(trackingEvents.AUTH_COMPLETE_PROFILE_SUCCESS, {
        user_type: userType,
        has_photo: !!photo
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      setErrors({ submit: 'Erro ao completar perfil. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        ></div>

        {/* Modal */}
        <div className={`inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${userType === 'instructor' ? 'sm:max-w-3xl' : 'sm:max-w-lg'} sm:w-full`}>
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
                Complete seu perfil
              </h3>
              <p className="text-gray-600 text-sm">
                Precisamos de algumas informações para finalizar seu cadastro
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Foto de perfil */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {photoPreview ? 'Trocar foto' : 'Adicionar foto'}
                </label>
                {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
              </div>

              {/* Nome */}
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

              {/* Telefone */}
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

              {/* Campos específicos de instrutor */}
              {userType === 'instructor' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </>
              )}

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
                    Salvando...
                  </span>
                ) : (
                  'Finalizar Cadastro'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
