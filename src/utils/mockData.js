// Dados mockados para desenvolvimento
// TODO: Substituir por chamadas de API reais

/**
 * Retorna o caminho da foto do instrutor
 * @param {number} instructorId - ID do instrutor
 * @returns {string} Caminho da foto do instrutor
 */
const getInstructorPhoto = (instructorId) => {
  // Mapeamento dos IDs dos instrutores para os arquivos de foto
  // Fotos 1-4: masculinas | Fotos 5-7: femininas
  const photoMap = {
    1: '1', // Carlos Silva (masculino)
    2: '5', // Ana Paula Santos (feminino)
    3: '2', // Roberto Oliveira (masculino)
    4: '6', // Mariana Costa (feminino)
    5: '3', // João Pedro Lima (masculino)
    6: '7', // Patricia Mendes (feminino)
    7: '4'  // Fernando Alves (masculino)
  };
  
  const photoNumber = photoMap[instructorId] || instructorId;
  return `/imgs/instructors/${photoNumber}.png`;
};

/**
 * Retorna o caminho da foto do usuário/aluno
 * @param {number} userId - ID do usuário/aluno
 * @returns {string} Caminho da foto do usuário
 */
const getUserPhoto = (userId) => {
  // Retorna o caminho da foto do usuário
  // Por padrão, usa o ID do usuário como nome do arquivo
  return `/imgs/users/${userId}.png`;
};

export const mockInstructors = [
  {
    id: 1,
    name: 'Carlos Silva',
    photo: getInstructorPhoto(1),
    rating: 4.8,
    totalReviews: 127,
    totalClasses: 450,
    premium: true,
    pricePerClass: 120,
    specialties: ['Carro Manual', 'Carro Automático', 'Moto'],
    classTypes: ['Rua', 'Baliza', 'Rodovia', 'Geral'],
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      fullAddress: 'João Pessoa - PB'
    },
    available: true,
    description: 'Instrutor experiente com mais de 10 anos de ensino. Paciente e dedicado.',
    cnh: 'Categoria B',
    vehicle: 'Honda Civic 2020',
    responseTime: 'Responde em até 2h',
    homeService: true,
    carTypes: ['Manual', 'Automático'],
    // Agenda de disponibilidade: dias da semana (0=domingo, 6=sábado) e horários
    availability: {
      // Horários disponíveis por dia da semana
      weeklySchedule: {
        1: { start: '08:00', end: '12:00' }, // Segunda-feira
        2: { start: '08:00', end: '12:00' }, // Terça-feira
        3: { start: '08:00', end: '12:00' }, // Quarta-feira
        4: { start: '08:00', end: '12:00' }, // Quinta-feira
        5: { start: '08:00', end: '12:00' }, // Sexta-feira
        6: { start: '08:00', end: '18:00' }  // Sábado
      },
      // Dias específicos bloqueados (formato YYYY-MM-DD)
      blockedDates: [],
      // Dias específicos com horários diferentes (formato YYYY-MM-DD)
      customSchedule: {}
    }
  },
  {
    id: 2,
    name: 'Ana Paula Santos',
    photo: getInstructorPhoto(2),
    rating: 4.9,
    totalReviews: 89,
    totalClasses: 320,
    premium: true,
    pricePerClass: 150,
    specialties: ['Carro Automático', 'Defensiva'],
    classTypes: ['Rua', 'Baliza', 'Geral'],
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      fullAddress: 'João Pessoa - PB'
    },
    available: true,
    description: 'Especialista em ensino para iniciantes. Método prático e eficiente.',
    cnh: 'Categoria B',
    vehicle: 'Toyota Corolla 2021',
    responseTime: 'Responde em até 1h',
    homeService: true,
    carTypes: ['Automático'],
    availability: {
      weeklySchedule: {
        1: { start: '09:00', end: '17:00' },
        2: { start: '09:00', end: '17:00' },
        3: { start: '09:00', end: '17:00' },
        4: { start: '09:00', end: '17:00' },
        5: { start: '09:00', end: '17:00' }
      },
      blockedDates: [],
      customSchedule: {}
    }
  },
  {
    id: 3,
    name: 'Roberto Oliveira',
    photo: getInstructorPhoto(3),
    rating: 4.7,
    totalReviews: 203,
    totalClasses: 680,
    premium: false,
    pricePerClass: 100,
    specialties: ['Carro Manual', 'Moto'],
    classTypes: ['Rua', 'Baliza', 'Rodovia'],
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Estados',
      fullAddress: 'João Pessoa - PB'
    },
    available: true,
    description: 'Instrutor certificado com foco em aprovação rápida no exame.',
    cnh: 'Categoria A e B',
    vehicle: 'Fiat Palio 2019',
    responseTime: 'Responde em até 3h',
    homeService: false,
    carTypes: ['Manual'],
    availability: {
      weeklySchedule: {
        1: { start: '08:00', end: '18:00' },
        2: { start: '08:00', end: '18:00' },
        3: { start: '08:00', end: '18:00' },
        4: { start: '08:00', end: '18:00' },
        5: { start: '08:00', end: '18:00' },
        6: { start: '08:00', end: '12:00' }
      },
      blockedDates: [],
      customSchedule: {}
    }
  },
  {
    id: 4,
    name: 'Mariana Costa',
    photo: getInstructorPhoto(4),
    rating: 5.0,
    totalReviews: 156,
    totalClasses: 520,
    premium: true,
    pricePerClass: 180,
    specialties: ['Carro Automático', 'Carro Manual', 'Defensiva'],
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Mangabeira',
      fullAddress: 'João Pessoa - PB'
    },
    available: true,
    description: 'Instrutora premiada com excelente taxa de aprovação.',
    cnh: 'Categoria B',
    vehicle: 'Volkswagen Golf 2022',
    responseTime: 'Responde em até 30min',
    homeService: true,
    carTypes: ['Manual', 'Automático'],
    availability: {
      weeklySchedule: {
        1: { start: '07:00', end: '19:00' },
        2: { start: '07:00', end: '19:00' },
        3: { start: '07:00', end: '19:00' },
        4: { start: '07:00', end: '19:00' },
        5: { start: '07:00', end: '19:00' },
        6: { start: '08:00', end: '16:00' }
      },
      blockedDates: [],
      customSchedule: {}
    }
  },
  {
    id: 5,
    name: 'João Pedro Lima',
    photo: getInstructorPhoto(5),
    rating: 4.6,
    totalReviews: 94,
    totalClasses: 180,
    premium: false,
    pricePerClass: 110,
    specialties: ['Carro Manual'],
    classTypes: ['Rua', 'Baliza'],
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Centro',
      fullAddress: 'João Pessoa - PB'
    },
    available: true,
    description: 'Instrutor experiente com metodologia moderna e tecnologia.',
    cnh: 'Categoria B',
    vehicle: 'Chevrolet Onix 2020',
    responseTime: 'Responde em até 2h',
    homeService: false,
    carTypes: ['Manual'],
    availability: {
      weeklySchedule: {
        1: { start: '10:00', end: '16:00' },
        2: { start: '10:00', end: '16:00' },
        3: { start: '10:00', end: '16:00' },
        4: { start: '10:00', end: '16:00' },
        5: { start: '10:00', end: '16:00' }
      },
      blockedDates: [],
      customSchedule: {}
    }
  },
  {
    id: 6,
    name: 'Patricia Mendes',
    photo: getInstructorPhoto(6),
    rating: 4.5,
    totalReviews: 67,
    totalClasses: 250,
    premium: false,
    pricePerClass: 130,
    specialties: ['Carro Automático', 'Defensiva'],
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Bessa',
      fullAddress: 'João Pessoa - PB'
    },
    available: true,
    description: 'Instrutora especializada em aulas para mulheres.',
    cnh: 'Categoria B',
    vehicle: 'Hyundai HB20 2021',
    responseTime: 'Responde em até 1h',
    homeService: true,
    carTypes: ['Automático'],
    availability: {
      weeklySchedule: {
        1: { start: '08:00', end: '17:00' },
        2: { start: '08:00', end: '17:00' },
        3: { start: '08:00', end: '17:00' },
        4: { start: '08:00', end: '17:00' },
        5: { start: '08:00', end: '17:00' },
        6: { start: '09:00', end: '13:00' }
      },
      blockedDates: [],
      customSchedule: {}
    }
  },
  {
    id: 7,
    name: 'Fernando Alves',
    photo: getInstructorPhoto(7),
    rating: 4.9,
    totalReviews: 145,
    totalClasses: 420,
    premium: true,
    pricePerClass: 140,
    specialties: ['Carro Manual', 'Carro Automático'],
    classTypes: ['Rua', 'Baliza', 'Rodovia', 'Geral'],
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Cabo Branco',
      fullAddress: 'João Pessoa - PB'
    },
    available: true,
    description: 'Instrutor com mais de 15 anos de experiência.',
    cnh: 'Categoria B',
    vehicle: 'Ford Ka 2020',
    responseTime: 'Responde em até 2h',
    homeService: true,
    carTypes: ['Manual', 'Automático'],
    availability: {
      weeklySchedule: {
        1: { start: '08:00', end: '18:00' },
        2: { start: '08:00', end: '18:00' },
        3: { start: '08:00', end: '18:00' },
        4: { start: '08:00', end: '18:00' },
        5: { start: '08:00', end: '18:00' },
        6: { start: '08:00', end: '14:00' }
      },
      blockedDates: [],
      customSchedule: {}
    }
  }
];

export const mockStudentClasses = [
  // 2 Aulas Agendadas
  {
    id: 1,
    instructorId: 1,
    instructorName: 'Carlos Silva',
    instructorPhoto: getInstructorPhoto(1),
    date: '2026-01-18',
    time: '10:00',
    duration: 60,
    status: 'agendada',
    price: 120,
    type: ['Baliza'],
    car: 'Honda Civic 2020',
    location: {
      fullAddress: 'Rua das Flores, 123 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      address: 'Rua das Flores, 123'
    },
    pickupType: 'vai_local',
    paymentStatus: 'pago',
    createdAt: '2026-01-12T10:00:00Z'
  },
  {
    id: 2,
    instructorId: 2,
    instructorName: 'Ana Paula Santos',
    instructorPhoto: getInstructorPhoto(2),
    date: '2026-01-20',
    time: '14:00',
    duration: 60,
    status: 'confirmada',
    price: 150,
    type: ['Rua', 'Baliza'],
    car: 'Toyota Corolla 2021',
    location: {
      fullAddress: 'Av. Epitácio Pessoa, 1000 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      address: 'Av. Epitácio Pessoa, 1000'
    },
    pickupType: 'busca_casa',
    paymentStatus: 'pago',
    createdAt: '2026-01-13T08:00:00Z'
  },
  
  // 3 Aulas Pendentes de Aceite
  {
    id: 3,
    instructorId: 3,
    instructorName: 'Roberto Oliveira',
    instructorPhoto: getInstructorPhoto(3),
    date: '2026-01-22',
    time: '09:00',
    duration: 60,
    status: 'pendente_aceite',
    price: 100,
    type: 'Baliza',
    car: 'Fiat Palio 2019',
    location: {
      fullAddress: 'Rua Principal, 500 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Estados',
      address: 'Rua Principal, 500'
    },
    pickupType: 'vai_local',
    paymentStatus: 'pendente',
    createdAt: '2026-01-15T10:30:00Z'
  },
  {
    id: 4,
    instructorId: 4,
    instructorName: 'Mariana Costa',
    instructorPhoto: getInstructorPhoto(4),
    date: '2026-01-25',
    time: '16:00',
    duration: 60,
    status: 'pendente_aceite',
    price: 180,
    type: ['Rodovia'],
    car: 'Volkswagen Golf 2022',
    location: {
      fullAddress: 'Av. João Câncio, 1500 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Mangabeira',
      address: 'Av. João Câncio, 1500'
    },
    pickupType: 'busca_casa',
    paymentStatus: 'pendente',
    createdAt: '2026-01-16T08:15:00Z'
  },
  {
    id: 5,
    instructorId: 5,
    instructorName: 'João Pedro Lima',
    instructorPhoto: getInstructorPhoto(5),
    date: '2026-01-24',
    time: '11:30',
    duration: 60,
    status: 'pendente_aceite',
    price: 110,
    type: ['Rua'],
    car: 'Chevrolet Onix 2020',
    location: {
      fullAddress: 'Rua do Comércio, 200 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Centro',
      address: 'Rua do Comércio, 200'
    },
    pickupType: 'vai_local',
    paymentStatus: 'pendente',
    createdAt: '2026-01-17T14:20:00Z'
  },
  
  // 1 Aula Pendente de Pagamento
  {
    id: 6,
    instructorId: 1,
    instructorName: 'Carlos Silva',
    instructorPhoto: getInstructorPhoto(1),
    date: '2026-01-19',
    time: '15:00',
    duration: 60,
    status: 'pendente_pagamento',
    price: 120,
    type: 'Geral',
    car: 'Honda Civic 2020',
    location: {
      fullAddress: 'Rua das Flores, 123 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      address: 'Rua das Flores, 123'
    },
    pickupType: 'vai_local',
    paymentStatus: 'pendente',
    createdAt: '2026-01-14T11:00:00Z'
  },
  
  // 1 Aula Pendente de Avaliação
  {
    id: 7,
    instructorId: 2,
    instructorName: 'Ana Paula Santos',
    instructorPhoto: getInstructorPhoto(2),
    date: '2026-01-12',
    time: '14:00',
    duration: 60,
    status: 'pendente_avaliacao',
    price: 150,
    type: ['Rua'],
    car: 'Toyota Corolla 2021',
    location: {
      fullAddress: 'Av. Epitácio Pessoa, 1000 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      address: 'Av. Epitácio Pessoa, 1000'
    },
    pickupType: 'busca_casa',
    paymentStatus: 'pago',
    createdAt: '2026-01-05T10:00:00Z'
  },
  
  // 3 Aulas no Histórico
  {
    id: 8,
    instructorId: 1,
    instructorName: 'Carlos Silva',
    instructorPhoto: getInstructorPhoto(1),
    date: '2026-01-10',
    time: '16:00',
    duration: 60,
    status: 'concluida',
    price: 120,
    type: 'Geral',
    car: 'Honda Civic 2020',
    location: {
      fullAddress: 'Rua das Flores, 123 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      address: 'Rua das Flores, 123'
    },
    pickupType: 'vai_local',
    paymentStatus: 'pago',
    createdAt: '2026-01-03T08:00:00Z',
    rating: 5,
    review: 'Excelente instrutor, muito paciente!'
  },
  {
    id: 9,
    instructorId: 3,
    instructorName: 'Roberto Oliveira',
    instructorPhoto: getInstructorPhoto(3),
    date: '2026-01-08',
    time: '09:00',
    duration: 60,
    status: 'concluida',
    price: 100,
    type: 'Baliza',
    car: 'Fiat Palio 2019',
    location: {
      fullAddress: 'Rua Principal, 500 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Estados',
      address: 'Rua Principal, 500'
    },
    pickupType: 'vai_local',
    paymentStatus: 'pago',
    createdAt: '2026-01-01T10:00:00Z',
    rating: 4,
    review: 'Bom instrutor, recomendo.'
  },
  {
    id: 10,
    instructorId: 4,
    instructorName: 'Mariana Costa',
    instructorPhoto: getInstructorPhoto(4),
    date: '2026-01-06',
    time: '10:00',
    duration: 60,
    status: 'cancelada',
    price: 180,
    type: ['Rodovia'],
    car: 'Volkswagen Golf 2022',
    location: {
      fullAddress: 'Av. João Câncio, 1500 - João Pessoa - PB',
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Mangabeira',
      address: 'Av. João Câncio, 1500'
    },
    pickupType: 'busca_casa',
    paymentStatus: 'reembolsado',
    createdAt: '2025-12-29T08:00:00Z'
  }
];

export const mockInstructorClasses = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Maria Silva',
    studentPhoto: getUserPhoto(1),
    date: '2026-01-15',
    time: '14:00',
    duration: 60,
    status: 'confirmada',
    price: 120,
    type: 'Baliza',
    car: 'Honda Civic 2020',
    location: 'João Pessoa - PB',
    studentPhone: '(11) 99999-9999'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'João Santos',
    studentPhoto: getUserPhoto(2),
    date: '2026-01-16',
    time: '10:00',
    duration: 60,
    status: 'pendente',
    price: 150,
    type: ['Rua', 'Baliza'],
    car: 'Toyota Corolla 2021',
    location: 'João Pessoa - PB',
    studentPhone: '(11) 88888-8888'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Ana Costa',
    studentPhoto: getUserPhoto(3),
    date: '2026-01-17',
    time: '16:00',
    duration: 60,
    status: 'confirmada',
    price: 120,
    type: ['Rodovia'],
    car: 'Honda Civic 2020',
    location: 'João Pessoa - PB',
    studentPhone: '(11) 77777-7777'
  },
  {
    id: 4,
    studentId: 1,
    studentName: 'Maria Silva',
    studentPhoto: getUserPhoto(1),
    date: '2026-01-10',
    time: '14:00',
    duration: 60,
    status: 'concluida',
    price: 120,
    type: ['Geral'],
    car: 'Honda Civic 2020',
    location: 'João Pessoa - PB',
    studentPhone: '(11) 99999-9999',
    rating: 5,
    review: 'Ótima aula!'
  }
];

export const mockTransactions = [
  {
    id: 1,
    date: '2026-01-10',
    studentName: 'Maria Silva',
    amount: 120,
    status: 'pago',
    type: 'aula',
    classId: 4
  },
  {
    id: 2,
    date: '2026-01-08',
    studentName: 'João Santos',
    amount: 150,
    status: 'pago',
    type: 'aula',
    classId: 3
  },
  {
    id: 3,
    date: '2026-01-05',
    studentName: 'Ana Costa',
    amount: 120,
    status: 'pago',
    type: 'aula',
    classId: 2
  },
  {
    id: 4,
    date: '2025-12-28',
    studentName: 'Pedro Lima',
    amount: 100,
    status: 'pago',
    type: 'aula',
    classId: 1
  },
  {
    id: 5,
    date: '2025-12-20',
    amount: 490,
    status: 'saque',
    type: 'saque',
    description: 'Saque para conta bancária'
  }
];

export const mockIndicators = {
  totalStudents: 24,
  studentsChange: 12.5, // porcentagem
  scheduledClasses: 8,
  completedClasses: 45,
  completedClassesChange: 8.3,
  totalRevenue: 5400,
  revenueChange: 15.2,
  averageRating: 4.8,
  ratingChange: 0.2,
  pendingClasses: 3
};

// Indicadores específicos para alunos
export const mockStudentIndicators = {
  completedClasses: 12,
  completedClassesThisMonth: 3,
  totalSpent: 1440,
  nextClass: {
    date: '2026-01-18',
    time: '10:00',
    instructorName: 'Ana Paula Santos'
  },
  favoriteInstructor: {
    name: 'Carlos Silva',
    classesCount: 5
  }
};

export const getMockUser = (type) => {
  if (type === 'student') {
    return {
      id: 1,
      name: 'Francisco Gregório',
      email: 'aluno@teste.com',
      phone: '(11) 99999-9999',
      type: 'student',
      photo: '/imgs/users/image.png'
    };
  } else {
    return {
      id: 1,
      name: 'Instrutor Teste',
      email: 'instrutor@teste.com',
      phone: '(11) 88888-8888',
      type: 'instructor',
      photo: getInstructorPhoto(1),
      cnh: 'Categoria B',
      vehicle: 'Honda Civic 2020'
    };
  }
};
