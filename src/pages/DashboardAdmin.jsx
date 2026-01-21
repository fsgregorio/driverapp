import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/dashboard/common/DashboardNavbar';
import SEO from '../components/SEO';
import { adminAPI } from '../services/api';
import AdminIndicatorsGrid from '../components/dashboard/admin/AdminIndicatorsGrid';
import AdminFunnel from '../components/dashboard/admin/AdminFunnel';

const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = '123456';
// Email válido para autenticação no Supabase
const ADMIN_EMAIL = 'admin@idrive.com';

const DashboardAdmin = () => {
  const { loading, userType, login } = useAuth();
  const [period, setPeriod] = useState('all');
  const [indicators, setIndicators] = useState(null);
  const [funnelMetrics, setFunnelMetrics] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const activeSection = 'admin';
  const adminAuthenticated = userType === 'admin';

  // Debug: log quando userType muda
  useEffect(() => {
    console.log('🔍 DashboardAdmin - userType mudou:', userType, 'loading:', loading, 'adminAuthenticated:', adminAuthenticated);
  }, [userType, loading, adminAuthenticated]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        setError(null);

        const [indicatorsResult, funnelResult] = await Promise.all([
          adminAPI.getIndicators(period),
          adminAPI.getFunnelMetrics(period),
        ]);

        setIndicators(indicatorsResult);
        setFunnelMetrics(funnelResult);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard admin:', err);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setIsLoadingData(false);
      }
    };

    // Apenas carrega se o usuário estiver logado como admin
    if (!loading && userType === 'admin') {
      loadData();
    }
  }, [loading, userType, period]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleAdminAuthSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');

    if (adminLogin !== ADMIN_LOGIN || adminPassword !== ADMIN_PASSWORD) {
      setAdminError('Login ou senha de admin incorretos.');
      return;
    }

    setAdminSubmitting(true);

    try {
      // Faz login na aplicação como usuário admin usando o email válido
      await login(ADMIN_EMAIL, ADMIN_PASSWORD, 'admin');
      
      // Aguardar um pouco para o perfil ser carregado do banco
      // O loadUserProfile é chamado assincronamente após o login
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Login admin concluído');
    } catch (err) {
      console.error('❌ Erro ao autenticar admin:', err);
      setAdminError(err.message || 'Falha ao autenticar admin. Verifique as credenciais.');
    } finally {
      setAdminSubmitting(false);
    }
  };

  // Caso não esteja logado como admin, mostra tela de login de admin
  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <SEO
          title="Login Admin - iDrive"
          description="Autenticação adicional para o dashboard de admin"
        />
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">
            Acesso Admin
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Informe o login e a senha de administrador para acessar o dashboard.
          </p>

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Login
              </label>
              <input
                type="text"
                value={adminLogin}
                onChange={(e) => setAdminLogin(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                autoComplete="off"
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  Visualizar senha
                </label>
              </div>
            </div>

            {adminError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                {adminError}
              </div>
            )}

            <button
              type="submit"
              disabled={adminSubmitting}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {adminSubmitting ? 'Validando...' : 'Entrar como admin'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Se já está logado como admin, mostra o dashboard diretamente
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO
        title="Dashboard Admin - iDrive"
        description="Visão geral de alunos, instrutores e funil de conversão na iDrive"
      />

      <DashboardNavbar activeSection={activeSection} onSectionChange={() => {}} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard Admin
          </h1>

          {/* Filtros de período */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Acumulado' },
              { id: '7d', label: 'Últimos 7 dias' },
              { id: '30d', label: 'Últimos 30 dias' },
              { id: 'month', label: 'Mês atual' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handlePeriodChange(option.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                  period === option.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <AdminIndicatorsGrid indicators={indicators} loading={isLoadingData} />

        <div className="mt-8">
          <AdminFunnel metrics={funnelMetrics} loading={isLoadingData} />
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;

