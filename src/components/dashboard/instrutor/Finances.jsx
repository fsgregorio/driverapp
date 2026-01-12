import React, { useState } from 'react';
import { mockTransactions } from '../../../utils/mockData';

const Finances = () => {
  const [transactions] = useState(mockTransactions);
  const [period, setPeriod] = useState('month');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const totalEarnings = transactions
    .filter(t => t.type === 'aula' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingEarnings = transactions
    .filter(t => t.type === 'aula' && t.status === 'pendente')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = totalEarnings - transactions
    .filter(t => t.type === 'saque')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pago': 'bg-green-100 text-green-800',
      'pendente': 'bg-yellow-100 text-yellow-800',
      'saque': 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const handleWithdraw = () => {
    // TODO: Implementar lógica de saque real
    alert('Funcionalidade de saque em desenvolvimento');
    setShowWithdrawModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Ganhos Totais</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</p>
          <p className="text-sm text-gray-500 mt-2">Este mês</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Saldo Disponível</h3>
          <p className="text-3xl font-bold text-primary">{formatCurrency(availableBalance)}</p>
          <p className="text-sm text-gray-500 mt-2">Pronto para saque</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pendente</h3>
          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(pendingEarnings)}</p>
          <p className="text-sm text-gray-500 mt-2">Aguardando pagamento</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'week'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'month'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'year'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Ano
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Exportar
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={availableBalance <= 0}
            className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Solicitar Saque
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Transações</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.studentName || transaction.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.type === 'aula' ? 'Aula' : 'Saque'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                    transaction.type === 'saque' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'saque' ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Solicitar Saque</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Saldo Disponível</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(availableBalance)}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valor do Saque
                </label>
                <input
                  type="number"
                  max={availableBalance}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Conta Bancária
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                  <option>Selecione uma conta</option>
                  {/* TODO: Listar contas cadastradas */}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Solicitar Saque
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finances;
