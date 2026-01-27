import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../../services/api';

const AdminClassesManagement = ({ period }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [sortColumn, setSortColumn] = useState('statusDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const classesPerPage = 20;

  const statusOptions = [
    { value: 'pendente_aceite', label: 'Pendente de Aceite' },
    { value: 'pendente_pagamento', label: 'Pendente de Pagamento' },
    { value: 'agendada', label: 'Agendada' },
    { value: 'pendente_avaliacao', label: 'Pendente de Avaliação' },
    { value: 'concluida', label: 'Concluída' },
    { value: 'cancelada', label: 'Cancelada' },
  ];

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminAPI.getAllClasses({
        period,
        page,
        limit: classesPerPage,
        status: filterStatus || undefined,
        sortBy: sortColumn,
        sortOrder: sortDirection,
      });
      
      // Ordenar localmente para todas as colunas (mais flexível e permite ordenação por statusDate)
      let sortedClasses = result.classes || [];
      if (sortColumn) {
        sortedClasses = [...sortedClasses].sort((a, b) => {
          let aVal, bVal;
          
          switch (sortColumn) {
            case 'statusDate':
              // Usar updatedAt se existir, senão createdAt
              aVal = new Date(a.updatedAt || a.createdAt || 0).getTime();
              bVal = new Date(b.updatedAt || b.createdAt || 0).getTime();
              break;
            case 'date':
              // Combinar date e time para ordenação
              const aDate = new Date(`${a.date}T${a.time || '00:00'}`);
              const bDate = new Date(`${b.date}T${b.time || '00:00'}`);
              aVal = aDate.getTime();
              bVal = bDate.getTime();
              break;
            case 'studentName':
              aVal = (a.studentName || '').toLowerCase();
              bVal = (b.studentName || '').toLowerCase();
              break;
            case 'studentEmail':
              aVal = (a.studentEmail || '').toLowerCase();
              bVal = (b.studentEmail || '').toLowerCase();
              break;
            case 'instructorName':
              aVal = (a.instructorName || '').toLowerCase();
              bVal = (b.instructorName || '').toLowerCase();
              break;
            case 'price':
              aVal = a.price || 0;
              bVal = b.price || 0;
              break;
            case 'status':
              aVal = (a.status || '').toLowerCase();
              bVal = (b.status || '').toLowerCase();
              break;
            default:
              return 0;
          }
          
          if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      setClasses(sortedClasses);
      setTotalCount(result.total || 0);
    } catch (err) {
      console.error('Erro ao carregar aulas:', err);
      setError('Erro ao carregar aulas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [period, page, filterStatus, sortColumn, sortDirection]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleStatusChange = async (classId, newStatusValue) => {
    try {
      await adminAPI.updateClassStatus(classId, newStatusValue);
      setEditingClass(null);
      setNewStatus('');
      await loadClasses();
    } catch (err) {
      console.error('Erro ao atualizar status da aula:', err);
      alert('Erro ao atualizar status da aula. Tente novamente.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusDate = (classItem) => {
    // Retorna a data do status atual (updatedAt se existir, senão createdAt)
    return classItem.updatedAt || classItem.createdAt;
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Se já está ordenando por esta coluna, inverte a direção
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Se é uma nova coluna, define como descendente por padrão
      setSortColumn(column);
      setSortDirection('desc');
    }
    setPage(1); // Resetar para primeira página ao ordenar
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return (
        <span className="ml-1 text-gray-400">
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      );
    }
    return sortDirection === 'asc' ? (
      <span className="ml-1 text-primary">
        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </span>
    ) : (
      <span className="ml-1 text-primary">
        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    );
  };

  const formatCurrency = (value) => {
    if (value == null || Number.isNaN(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendente_aceite': 'bg-yellow-100 text-yellow-800',
      'pendente_pagamento': 'bg-orange-100 text-orange-800',
      'agendada': 'bg-blue-100 text-blue-800',
      'pendente_avaliacao': 'bg-purple-100 text-purple-800',
      'concluida': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const totalPages = Math.ceil(totalCount / classesPerPage);

  return (
    <section aria-label="Gerenciamento de aulas">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Gerenciamento de Aulas</h2>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Todos os status</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-gray-600">Carregando aulas...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhuma aula encontrada para o período selecionado.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('statusDate')}
                    >
                      <div className="flex items-center">
                        Data Status
                        {getSortIcon('statusDate')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('studentName')}
                    >
                      <div className="flex items-center">
                        Aluno
                        {getSortIcon('studentName')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('studentEmail')}
                    >
                      <div className="flex items-center">
                        E-mail
                        {getSortIcon('studentEmail')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('instructorName')}
                    >
                      <div className="flex items-center">
                        Instrutor
                        {getSortIcon('instructorName')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Data/Hora
                        {getSortIcon('date')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center">
                        Valor
                        {getSortIcon('price')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.map((classItem) => (
                    <tr key={classItem.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="font-medium">{formatDateTime(getStatusDate(classItem))}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {classItem.studentName || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {classItem.studentEmail || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {classItem.instructorName || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="font-medium">{formatDate(classItem.date)}</div>
                        <div className="text-xs text-gray-500">{classItem.time}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                        {formatCurrency(classItem.price)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            classItem.status
                          )}`}
                        >
                          {getStatusLabel(classItem.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingClass === classItem.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="">Selecione...</option>
                              {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleStatusChange(classItem.id, newStatus)}
                              disabled={!newStatus}
                              className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => {
                                setEditingClass(null);
                                setNewStatus('');
                              }}
                              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingClass(classItem.id);
                              setNewStatus(classItem.status);
                            }}
                            className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Alterar Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((page - 1) * classesPerPage) + 1} a {Math.min(page * classesPerPage, totalCount)} de {totalCount} aulas
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AdminClassesManagement;
