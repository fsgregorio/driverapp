import React, { useState } from 'react';

const AccountSettings = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Substituir por chamada de API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setPasswordError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // TODO: Substituir por chamada de API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta</h2>
        <p className="text-gray-600">Gerencie as configurações da sua conta</p>
      </div>

      {/* Alterar Senha */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Alterar Senha</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha Atual <span className="text-red-500">*</span>
            </label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            />
            <label className="flex items-center mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCurrentPassword}
                onChange={(e) => setShowCurrentPassword(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600">Mostrar senha</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nova Senha <span className="text-red-500">*</span>
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            />
            <label className="flex items-center mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showNewPassword}
                onChange={(e) => setShowNewPassword(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600">Mostrar senha</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar Nova Senha <span className="text-red-500">*</span>
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            />
            <label className="flex items-center mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showConfirmPassword}
                onChange={(e) => setShowConfirmPassword(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600">Mostrar senha</span>
            </label>
          </div>

          {passwordError && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{passwordError}</p>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">Senha alterada com sucesso!</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </form>
      </div>

      {/* Preferências de Notificação */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferências de Notificação</h3>
        <form onSubmit={handleNotificationsSubmit} className="space-y-4">
          <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <span className="font-medium text-gray-900">Notificações por E-mail</span>
                <p className="text-sm text-gray-500">Receba atualizações sobre suas aulas por e-mail</p>
              </div>
            </div>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={notifications.emailNotifications}
              onChange={handleNotificationChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div>
                <span className="font-medium text-gray-900">Notificações por SMS</span>
                <p className="text-sm text-gray-500">Receba lembretes importantes por SMS</p>
              </div>
            </div>
            <input
              type="checkbox"
              name="smsNotifications"
              checked={notifications.smsNotifications}
              onChange={handleNotificationChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-2-2H9a2 2 0 00-2 2v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <span className="font-medium text-gray-900">Notificações Push</span>
                <p className="text-sm text-gray-500">Receba notificações no navegador</p>
              </div>
            </div>
            <input
              type="checkbox"
              name="pushNotifications"
              checked={notifications.pushNotifications}
              onChange={handleNotificationChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
          </label>

          {saveSuccess && (
            <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">Preferências salvas com sucesso!</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Salvando...' : 'Salvar Preferências'}
            </button>
          </div>
        </form>
      </div>

      {/* Configurações de Privacidade */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacidade</h3>
        <div className="space-y-4">
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">Perfil Público</span>
                <p className="text-sm text-gray-500">Permitir que instrutores vejam seu perfil básico</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
