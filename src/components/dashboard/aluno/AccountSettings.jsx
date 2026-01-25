import React, { useState } from 'react';

const AccountSettings = () => {
  // Component for account settings
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
    </div>
  );
};

export default AccountSettings;
