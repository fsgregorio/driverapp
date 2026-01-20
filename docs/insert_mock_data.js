/**
 * Script para inserir dados mock no Supabase
 * Execute com: node docs/insert_mock_data.js
 * 
 * Requisitos:
 * - Ter @supabase/supabase-js instalado
 * - Ter variáveis de ambiente configuradas ou ajustar as URLs/chaves abaixo
 */

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://odmwardaafuvbusmrseq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY'; // Use a service role key do Supabase Dashboard

// Criar cliente com service role key (tem permissões administrativas)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função auxiliar para gerar UUID determinístico
function generateUUIDFromInt(seed) {
  const padded = seed.toString().padStart(12, '0');
  return `00000000-0000-0000-0000-${padded}`;
}

// Dados dos instrutores
const instructors = [
  {
    id: 1,
    name: 'Carlos Silva',
    email: 'carlos.silva@teste.com',
    password: 'senha123', // Senha padrão para todos os instrutores de teste
    phone: '(83) 99999-0001',
    photo: '/imgs/instructors/1.png',
    cnh: 'Categoria B',
    vehicle: 'Fiat Mobi',
    premium: true,
    responseTime: 'Responde em até 2h',
    homeService: true,
    carTypes: ['Manual', 'Automático'],
    specialties: ['Carro Manual', 'Carro Automático', 'Moto'],
    classTypes: ['Rua', 'Baliza', 'Rodovia', 'Geral'],
    rating: 4.8,
    totalReviews: 127,
    totalClasses: 37,
    pricePerClass: 110,
    priceOwnVehicle: 90,
    homeServicePrice: 20,
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      fullAddress: 'João Pessoa - PB'
    },
    availability: {
      weeklySchedule: {
        1: { start: '08:00', end: '12:00' },
        2: { start: '08:00', end: '12:00' },
        3: { start: '08:00', end: '12:00' },
        4: { start: '08:00', end: '12:00' },
        5: { start: '08:00', end: '12:00' },
        6: { start: '08:00', end: '18:00' }
      },
      blockedDates: [],
      customSchedule: {}
    },
    description: 'Instrutor experiente com mais de 10 anos de ensino. Paciente e dedicado.'
  },
  {
    id: 2,
    name: 'Ana Paula Santos',
    email: 'ana.santos@teste.com',
    password: 'senha123',
    phone: '(83) 99999-0002',
    photo: '/imgs/instructors/5.png',
    cnh: 'Categoria B',
    vehicle: 'Fiat Mobi',
    premium: true,
    responseTime: 'Responde em até 1h',
    homeService: true,
    carTypes: ['Automático'],
    specialties: ['Carro Automático', 'Defensiva'],
    classTypes: ['Rua', 'Baliza', 'Geral'],
    rating: 4.8,
    totalReviews: 89,
    totalClasses: 6,
    pricePerClass: 100,
    priceOwnVehicle: 90,
    homeServicePrice: 0,
    womenOnly: true, // Badge de aulas somente para mulheres
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Manaíra',
      fullAddress: 'João Pessoa - PB'
    },
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
    },
    description: 'Especialista em ensino para iniciantes. Método prático e eficiente.'
  },
  {
    id: 3,
    name: 'Roberto Oliveira',
    email: 'roberto.oliveira@teste.com',
    password: 'senha123',
    phone: '(83) 99999-0003',
    photo: '/imgs/instructors/2.png',
    cnh: 'Categoria A e B',
    vehicle: 'Hyundai HB20',
    premium: true,
    responseTime: 'Responde em até 3h',
    homeService: true,
    carTypes: ['Manual'],
    specialties: ['Carro Manual', 'Moto'],
    classTypes: ['Rua', 'Baliza', 'Rodovia'],
    rating: 5.0,
    totalReviews: 203,
    totalClasses: 42,
    pricePerClass: 120,
    priceOwnVehicle: 100,
    homeServicePrice: 30,
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Estados',
      fullAddress: 'João Pessoa - PB'
    },
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
    },
    description: 'Instrutor certificado com foco em aprovação rápida no exame.'
  },
  {
    id: 4,
    name: 'Mariana Costa',
    email: 'mariana.costa@teste.com',
    password: 'senha123',
    phone: '(83) 99999-0004',
    photo: '/imgs/instructors/6.png',
    cnh: 'Categoria B',
    vehicle: 'Volkswagen Gol',
    premium: true,
    responseTime: 'Responde em até 30min',
    homeService: true,
    carTypes: ['Manual', 'Automático'],
    specialties: ['Carro Automático', 'Carro Manual', 'Defensiva'],
    classTypes: ['Rua', 'Baliza', 'Rodovia', 'Geral'],
    rating: 4.5,
    totalReviews: 156,
    totalClasses: 26,
    pricePerClass: 100,
    priceOwnVehicle: null,
    homeServicePrice: 20,
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Mangabeira',
      fullAddress: 'João Pessoa - PB'
    },
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
    },
    description: 'Instrutora premiada com excelente taxa de aprovação.'
  },
  {
    id: 5,
    name: 'João Pedro Lima',
    email: 'joao.lima@teste.com',
    password: 'senha123',
    phone: '(83) 99999-0005',
    photo: '/imgs/instructors/3.png',
    cnh: 'Categoria B',
    vehicle: 'Chevrolet Onix',
    premium: false,
    responseTime: 'Responde em até 2h',
    homeService: true,
    carTypes: ['Manual'],
    specialties: ['Carro Manual'],
    classTypes: ['Rua', 'Baliza'],
    rating: 0, // Estrelas vazias (novo instrutor)
    totalReviews: 0,
    totalClasses: 0, // Badge Novo
    pricePerClass: 90,
    priceOwnVehicle: 80,
    homeServicePrice: 30,
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Centro',
      fullAddress: 'João Pessoa - PB'
    },
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
    },
    description: 'Instrutor experiente com metodologia moderna e tecnologia.'
  },
  {
    id: 6,
    name: 'Patricia Mendes',
    email: 'patricia.mendes@teste.com',
    password: 'senha123',
    phone: '(83) 99999-0006',
    photo: '/imgs/instructors/7.png',
    cnh: 'Categoria B',
    vehicle: 'Volkswagen Gol',
    premium: false,
    responseTime: 'Responde em até 1h',
    homeService: true,
    carTypes: ['Automático'],
    specialties: ['Carro Automático', 'Defensiva'],
    classTypes: ['Rua', 'Baliza', 'Geral'],
    rating: 4.1,
    totalReviews: 67,
    totalClasses: 32,
    pricePerClass: 75,
    priceOwnVehicle: 60,
    homeServicePrice: 20,
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Bessa',
      fullAddress: 'João Pessoa - PB'
    },
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
    },
    description: 'Instrutora especializada em aulas para mulheres.'
  },
  {
    id: 7,
    name: 'Fernando Alves',
    email: 'fernando.alves@teste.com',
    password: 'senha123',
    phone: '(83) 99999-0007',
    photo: '/imgs/instructors/4.png',
    cnh: 'Categoria B',
    vehicle: 'Fiat Uno',
    premium: true,
    responseTime: 'Responde em até 2h',
    homeService: false,
    carTypes: ['Manual', 'Automático'],
    specialties: ['Carro Manual', 'Carro Automático'],
    classTypes: ['Rua', 'Baliza', 'Rodovia', 'Geral'],
    rating: 4.6,
    totalReviews: 145,
    totalClasses: 18,
    pricePerClass: 100,
    priceOwnVehicle: null,
    homeServicePrice: 0,
    location: {
      state: 'PB',
      city: 'João Pessoa',
      neighborhood: 'Cabo Branco',
      fullAddress: 'João Pessoa - PB'
    },
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
    },
    description: 'Instrutor com mais de 15 anos de experiência.'
  }
];

// Dados do aluno de teste
const testStudent = {
  id: 100,
  name: 'Francisco Gregório',
  email: 'aluno@teste.com',
  password: 'senha123',
  phone: '(83) 99999-9999',
  photo: '/imgs/users/image.png'
};

// Classes de exemplo
const testClasses = [
  {
    instructorId: 1,
    date: '2026-01-18',
    time: '10:00',
    duration: 60,
    status: 'agendada',
    price: 120,
    classTypes: ['Baliza'],
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
    instructorId: 2,
    date: '2026-01-20',
    time: '14:00',
    duration: 60,
    status: 'confirmada',
    price: 150,
    classTypes: ['Rua', 'Baliza'],
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
  {
    instructorId: 3,
    date: '2026-01-22',
    time: '09:00',
    duration: 60,
    status: 'pendente_aceite',
    price: 100,
    classTypes: ['Baliza'],
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
  }
];

// Função principal
async function insertMockData() {
  console.log('🚀 Iniciando inserção de dados mock...\n');

  try {
    // Criar aluno de teste
    console.log('📝 Criando aluno de teste...');
    const { data: studentAuth, error: studentAuthError } = await supabase.auth.admin.createUser({
      email: testStudent.email,
      password: testStudent.password,
      email_confirm: true
    });

    if (studentAuthError && !studentAuthError.message.includes('already registered')) {
      throw studentAuthError;
    }

    const studentId = studentAuth?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === testStudent.email)?.id;
    
    if (!studentId) {
      throw new Error('Não foi possível criar ou encontrar o aluno');
    }

    // Criar perfil do aluno
    const { error: studentProfileError } = await supabase
      .from('profiles')
      .upsert({
        id: studentId,
        user_type: 'student',
        name: testStudent.name,
        phone: testStudent.phone,
        photo_url: testStudent.photo,
        profile_complete: true
      });

    if (studentProfileError) throw studentProfileError;
    console.log('✅ Aluno criado com sucesso!\n');

    // Criar instrutores
    const instructorIds = {};
    
    for (const instructor of instructors) {
      console.log(`📝 Criando instrutor: ${instructor.name}...`);
      
      // Criar usuário auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: instructor.email,
        password: instructor.password,
        email_confirm: true
      });

      if (authError && !authError.message.includes('already registered')) {
        console.error(`❌ Erro ao criar usuário: ${authError.message}`);
        continue;
      }

      const userId = authData?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === instructor.email)?.id;
      
      if (!userId) {
        console.error(`❌ Não foi possível criar ou encontrar usuário para ${instructor.name}`);
        continue;
      }

      instructorIds[instructor.id] = userId;

      // Criar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          user_type: 'instructor',
          name: instructor.name,
          phone: instructor.phone,
          photo_url: instructor.photo,
          profile_complete: true,
          cnh: instructor.cnh,
          vehicle: instructor.vehicle,
          premium: instructor.premium,
          response_time: instructor.responseTime,
          home_service: instructor.homeService,
          car_types: instructor.carTypes,
          specialties: instructor.specialties,
          class_types: instructor.classTypes,
          women_only: instructor.womenOnly || false
        });

      if (profileError) {
        console.error(`❌ Erro ao criar perfil: ${profileError.message}`);
        continue;
      }

      // Criar registro na tabela instructors
      const { error: instructorError } = await supabase
        .from('instructors')
        .upsert({
          id: userId,
          rating: instructor.rating,
          total_reviews: instructor.totalReviews,
          total_classes: instructor.totalClasses,
          price_per_class: instructor.pricePerClass,
          price_own_vehicle: instructor.priceOwnVehicle || null,
          home_service_price: instructor.homeServicePrice || null,
          location: instructor.location,
          availability: instructor.availability,
          description: instructor.description,
          available: true
        });

      if (instructorError) {
        console.error(`❌ Erro ao criar registro de instrutor: ${instructorError.message}`);
        continue;
      }

      // Criar disponibilidade
      for (const [day, schedule] of Object.entries(instructor.availability.weeklySchedule)) {
        const { error: availabilityError } = await supabase
          .from('instructor_availability')
          .upsert({
            instructor_id: userId,
            day_of_week: parseInt(day),
            start_time: schedule.start,
            end_time: schedule.end,
            blocked_dates: [],
            custom_schedule: {}
          });

        if (availabilityError) {
          console.error(`❌ Erro ao criar disponibilidade: ${availabilityError.message}`);
        }
      }

      console.log(`✅ ${instructor.name} criado com sucesso!`);
    }

    console.log('\n📚 Criando classes de exemplo...');
    
    // Criar classes de exemplo
    for (const classData of testClasses) {
      const instructorId = instructorIds[classData.instructorId];
      if (!instructorId) {
        console.error(`❌ Instrutor ID ${classData.instructorId} não encontrado`);
        continue;
      }

      const { error: classError } = await supabase
        .from('classes')
        .insert({
          student_id: studentId,
          instructor_id: instructorId,
          date: classData.date,
          time: classData.time,
          duration: classData.duration,
          status: classData.status,
          price: classData.price,
          class_types: classData.classTypes,
          car: classData.car,
          location: classData.location,
          pickup_type: classData.pickupType,
          payment_status: classData.paymentStatus,
          created_at: classData.createdAt
        });

      if (classError) {
        console.error(`❌ Erro ao criar classe: ${classError.message}`);
      } else {
        console.log(`✅ Classe criada: ${classData.date} ${classData.time}`);
      }
    }

    console.log('\n🎉 Dados mock inseridos com sucesso!');
    console.log('\n📋 Credenciais de teste:');
    console.log('Aluno:');
    console.log(`  Email: ${testStudent.email}`);
    console.log(`  Senha: ${testStudent.password}`);
    console.log('\nInstrutores:');
    instructors.forEach(i => {
      console.log(`  ${i.name}: ${i.email} / ${i.password}`);
    });

  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error);
    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  if (supabaseServiceKey === 'YOUR_SERVICE_ROLE_KEY') {
    console.error('❌ Por favor, configure SUPABASE_SERVICE_ROLE_KEY no arquivo .env ou edite o script');
    console.error('   Você pode encontrar a Service Role Key em:');
    console.error('   Supabase Dashboard > Settings > API > service_role key');
    process.exit(1);
  }
  
  insertMockData();
}

module.exports = { insertMockData };
