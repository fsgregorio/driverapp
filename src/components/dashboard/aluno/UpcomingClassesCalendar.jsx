import React, { useState } from 'react';
import { formatDate } from '../../../utils/dateUtils';

const UpcomingClassesCalendar = ({ classes }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Filtrar apenas aulas futuras e agendadas/confirmadas
  const upcomingClasses = classes.filter(cls => {
    if (!cls.date || !cls.time) return false;
    
    const status = cls.status?.toLowerCase();
    const validStatuses = ['agendada', 'confirmada', 'pendente_aceite', 'pendente_pagamento'];
    if (!validStatuses.includes(status)) return false;

    const classDateTime = new Date(`${cls.date}T${cls.time}`);
    return classDateTime >= today;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA; // Ordem decrescente: datas mais recentes primeiro
  });

  // Agrupar aulas por data
  const classesByDate = {};
  upcomingClasses.forEach(cls => {
    const dateStr = cls.date;
    if (!classesByDate[dateStr]) {
      classesByDate[dateStr] = [];
    }
    classesByDate[dateStr].push(cls);
  });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === selectedDate;
  };

  const isToday = (date) => {
    const todayStr = today.toISOString().split('T')[0];
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === todayStr;
  };

  const hasClasses = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return classesByDate[dateStr] && classesByDate[dateStr].length > 0;
  };

  const getClassesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return classesByDate[dateStr] || [];
  };

  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    if (hasClasses(date)) {
      // Se já está selecionada, desmarcar
      if (selectedDate === dateStr) {
        setSelectedDate(null);
      } else {
        setSelectedDate(dateStr);
      }
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Adicionar dias vazios no início
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Adicionar dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const selectedDateClasses = selectedDate ? getClassesForDate(new Date(selectedDate)) : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Próximas Aulas
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Visualize suas aulas agendadas no calendário
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Calendário */}
        <div className="flex-shrink-0 w-full lg:w-80">
          {/* Cabeçalho do calendário */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const dateStr = date.toISOString().split('T')[0];
              const disabled = date < today;
              const selected = isDateSelected(date);
              const isTodayDate = isToday(date);
              const hasClassesOnDate = hasClasses(date);
              const classesCount = hasClassesOnDate ? getClassesForDate(date).length : 0;

              return (
                <button
                  key={day}
                  onClick={() => !disabled && handleDateClick(day)}
                  disabled={disabled}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all relative
                    ${disabled
                      ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                      : selected
                      ? 'bg-primary text-white shadow-md transform scale-105'
                      : isTodayDate
                      ? 'bg-blue-50 text-primary border-2 border-primary font-bold hover:bg-blue-100'
                      : hasClassesOnDate
                      ? 'bg-green-50 text-gray-700 border border-green-300 hover:bg-green-100'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {day}
                  {hasClassesOnDate && !selected && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  )}
                  {hasClassesOnDate && selected && classesCount > 1 && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">
                      {classesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de aulas do dia selecionado */}
        <div className="flex-1 min-w-0">
          {selectedDate && selectedDateClasses.length > 0 ? (
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Aulas em {formatDate(new Date(selectedDate), { weekday: 'long', day: 'numeric', month: 'long' })}
              </h4>
              <div className="space-y-3">
                {selectedDateClasses.map((cls) => {
                  const statusColors = {
                    'agendada': 'bg-blue-100 text-blue-800',
                    'confirmada': 'bg-green-100 text-green-800',
                    'pendente_aceite': 'bg-yellow-100 text-yellow-800',
                    'pendente_pagamento': 'bg-orange-100 text-orange-800'
                  };
                  const statusLabels = {
                    'agendada': 'Agendada',
                    'confirmada': 'Confirmada',
                    'pendente_aceite': 'Aguardando Aceite',
                    'pendente_pagamento': 'Aguardando Pagamento'
                  };
                  
                  return (
                    <div
                      key={cls.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm sm:text-base font-semibold text-gray-900">
                              {cls.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            {cls.instructorName || 'Instrutor não informado'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[cls.status] || 'bg-gray-100 text-gray-800'}`}>
                          {statusLabels[cls.status] || cls.status}
                        </span>
                      </div>
                      {cls.location && (
                        <p className="text-xs text-gray-600 mt-2">
                          📍 {typeof cls.location === 'string' ? cls.location : cls.location.neighborhood || cls.location.address || 'Local a combinar'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : selectedDate ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-600">
                Nenhuma aula agendada para esta data
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600">
                Selecione uma data no calendário para ver as aulas agendadas
              </p>
              {upcomingClasses.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Você tem {upcomingClasses.length} aula{upcomingClasses.length > 1 ? 's' : ''} agendada{upcomingClasses.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingClassesCalendar;
