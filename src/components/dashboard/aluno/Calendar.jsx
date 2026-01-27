import React from 'react';

const Calendar = ({ 
  selectedDate, 
  onDateSelect, 
  minDate, 
  maxDate,
  disabledDates = [],
  getDateAvailability = () => true
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const min = new Date(minDate || today);
    return new Date(min.getFullYear(), min.getMonth(), 1);
  });

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Verificar se está antes da data mínima
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }
    
    // Verificar se está depois da data máxima
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(23, 59, 59, 999);
      if (date > max) return true;
    }
    
    // Verificar se está na lista de datas desabilitadas
    if (disabledDates.includes(dateStr)) return true;
    
    // Verificar disponibilidade usando a função fornecida
    return !getDateAvailability(dateStr);
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

  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!isDateDisabled(date)) {
      // Se a data já está selecionada, desmarcar (passar null)
      if (selectedDate === dateStr) {
        onDateSelect(null);
      } else {
        onDateSelect(dateStr);
      }
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const canGoPrevious = () => {
    if (!minDate) return true;
    const min = new Date(minDate);
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth >= new Date(min.getFullYear(), min.getMonth(), 1);
  };

  const canGoNext = () => {
    if (!maxDate) return true;
    const max = new Date(maxDate);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return nextMonth <= new Date(max.getFullYear(), max.getMonth() + 1, 0);
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Cabeçalho do calendário */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious()}
          className={`p-2 rounded-lg transition-colors ${
            canGoPrevious()
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={goToNextMonth}
          disabled={!canGoNext()}
          className={`p-2 rounded-lg transition-colors ${
            canGoNext()
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
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
          const disabled = isDateDisabled(date);
          const selected = isDateSelected(date);
          const isTodayDate = isToday(date);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                ${disabled
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : selected
                  ? 'bg-primary text-white shadow-md transform scale-105'
                  : isTodayDate
                  ? 'bg-blue-50 text-primary border-2 border-primary font-bold hover:bg-blue-100'
                  : 'text-gray-700 hover:bg-gray-100 hover:border hover:border-gray-300'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
