import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../../services/api';

// Eventos do funil que devem aparecer na aba de rastreamento
const FUNNEL_EVENTS = [
  'landing_aluno_cta_hero',
  'auth_register_success',
  'auth_complete_profile_success',
  'dashboard_aluno_schedule_confirm_click',
  'payment_initiated',
  'coupon_requested',
  'class_comment_sent',
];

const AdminEventsTracking = ({ period }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterEventName, setFilterEventName] = useState('');
  const [filterUserType, setFilterUserType] = useState('');
  const eventsPerPage = 50;

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sempre filtrar apenas eventos do funil
      // Se houver filtro de nome de evento, aplicar dentro dos eventos do funil
      let eventNames = FUNNEL_EVENTS;
      if (filterEventName) {
        // Filtrar eventos do funil que correspondem ao filtro
        eventNames = FUNNEL_EVENTS.filter(event => 
          event.toLowerCase().includes(filterEventName.toLowerCase())
        );
      }
      
      // Se não houver eventos do funil após o filtro, retornar vazio
      if (eventNames.length === 0) {
        setEvents([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }
      
      const result = await adminAPI.getEvents({
        period,
        page,
        limit: eventsPerPage,
        eventNames: eventNames,
        userType: filterUserType || undefined,
      });
      setEvents(result.events || []);
      setTotalCount(result.total || 0);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError('Erro ao carregar eventos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [period, page, filterEventName, filterUserType]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const formatDate = (dateString) => {
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

  const formatEventName = (eventName) => {
    return eventName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getEventTypeColor = (eventName) => {
    if (eventName.includes('landing')) return 'bg-blue-100 text-blue-800';
    if (eventName.includes('dashboard')) return 'bg-purple-100 text-purple-800';
    if (eventName.includes('auth')) return 'bg-green-100 text-green-800';
    if (eventName.includes('payment')) return 'bg-yellow-100 text-yellow-800';
    if (eventName.includes('comment')) return 'bg-pink-100 text-pink-800';
    if (eventName.includes('coupon')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const totalPages = Math.ceil(totalCount / eventsPerPage);

  return (
    <section aria-label="Rastreamento de eventos">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Rastreamento de Eventos</h2>
          <p className="text-xs text-gray-500 mt-1">Mostrando apenas eventos do funil de conversão</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Filtrar por evento..."
            value={filterEventName}
            onChange={(e) => {
              setFilterEventName(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <select
            value={filterUserType}
            onChange={(e) => {
              setFilterUserType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Todos os tipos</option>
            <option value="student">Aluno</option>
            <option value="instructor">Instrutor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
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
            <p className="mt-4 text-sm text-gray-600">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhum evento encontrado para o período selecionado.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Evento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tipo de Usuário
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Página
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Propriedades
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event, index) => (
                    <tr key={event.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(event.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getEventTypeColor(
                            event.event_name
                          )}`}
                        >
                          {formatEventName(event.event_name)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {event.user_email ? (
                          <span className="font-mono text-xs">{event.user_email}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {event.user_type ? (
                          <span className="capitalize">{event.user_type}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {event.page ? (
                          <span className="font-mono text-xs">{event.page}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {event.properties && Object.keys(event.properties).length > 0 ? (
                          <details className="cursor-pointer">
                            <summary className="text-primary hover:text-blue-700 text-xs">
                              Ver propriedades
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto max-w-md">
                              {JSON.stringify(event.properties, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-gray-400">-</span>
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
                  Mostrando {((page - 1) * eventsPerPage) + 1} a {Math.min(page * eventsPerPage, totalCount)} de {totalCount} eventos
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

export default AdminEventsTracking;
