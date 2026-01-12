import React, { useState } from 'react';
import ClassCard from '../common/ClassCard';
import { mockInstructorClasses } from '../../../utils/mockData';

const ClassControl = () => {
  const [classes, setClasses] = useState(mockInstructorClasses);
  const [activeTab, setActiveTab] = useState('pendentes'); // pendentes, proximas, historico
  const [viewMode, setViewMode] = useState('list'); // list, calendar

  const pendentes = classes.filter(c => c.status === 'pendente');
  const proximas = classes.filter(c => c.status === 'confirmada');
  const historico = classes.filter(c => c.status === 'concluída' || c.status === 'cancelada');

  const handleConfirm = (classId) => {
    // TODO: Substituir por chamada de API real
    setClasses(classes.map(c => 
      c.id === classId ? { ...c, status: 'confirmada' } : c
    ));
    alert('Aula confirmada com sucesso!');
  };

  const handleReject = (classId) => {
    // TODO: Substituir por chamada de API real
    if (window.confirm('Tem certeza que deseja rejeitar esta aula?')) {
      setClasses(classes.map(c => 
        c.id === classId ? { ...c, status: 'cancelada' } : c
      ));
      alert('Aula rejeitada.');
    }
  };

  const handleCancel = (classId) => {
    // TODO: Substituir por chamada de API real
    if (window.confirm('Tem certeza que deseja cancelar esta aula?')) {
      setClasses(classes.map(c => 
        c.id === classId ? { ...c, status: 'cancelada' } : c
      ));
      alert('Aula cancelada.');
    }
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pendentes')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'pendentes'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pendentes ({pendentes.length})
          </button>
          <button
            onClick={() => setActiveTab('proximas')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'proximas'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Próximas ({proximas.length})
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'historico'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Histórico ({historico.length})
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Calendário de Aulas</h3>
            <p className="text-sm text-gray-500">Visualização mensal em desenvolvimento</p>
          </div>
          {/* TODO: Implementar calendário completo */}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="grid gap-6">
          {activeTab === 'pendentes' && pendentes.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg">Nenhuma aula pendente</p>
            </div>
          )}

          {activeTab === 'proximas' && proximas.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg">Nenhuma aula agendada</p>
            </div>
          )}

          {activeTab === 'historico' && historico.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg">Nenhuma aula no histórico</p>
            </div>
          )}

          {(activeTab === 'pendentes' ? pendentes : 
            activeTab === 'proximas' ? proximas : historico).map((classItem) => (
            <ClassCard
              key={classItem.id}
              classData={classItem}
              userType="instructor"
              onConfirm={handleConfirm}
              onReject={handleReject}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassControl;
