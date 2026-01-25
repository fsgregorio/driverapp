// API Service - Integração com Supabase
import { supabase, supabaseStudent, supabaseInstructor, supabaseAdmin, getSupabaseClient } from './supabase';

// Helper function to transform class data from DB to app format
const transformClass = (dbClass, instructorProfile = null) => {
  // Garantir que rating seja um número válido ou null
  let rating = null;
  if (dbClass.rating !== null && dbClass.rating !== undefined && dbClass.rating !== '') {
    const parsedRating = parseFloat(dbClass.rating);
    if (!isNaN(parsedRating) && parsedRating > 0) {
      rating = parsedRating;
    }
  }
  
  // Garantir que review seja uma string válida ou null
  const review = dbClass.review && dbClass.review.trim() !== '' ? dbClass.review.trim() : null;
  
  return {
    id: dbClass.id,
    instructorId: dbClass.instructor_id,
    instructorName: instructorProfile?.name || '',
    instructorPhoto: instructorProfile?.photo_url || null,
    date: dbClass.date,
    time: dbClass.time,
    duration: dbClass.duration,
    status: dbClass.status,
    price: parseFloat(dbClass.price),
    type: Array.isArray(dbClass.class_types) ? dbClass.class_types : [dbClass.class_types],
    car: dbClass.car || '',
    location: dbClass.location || {},
    pickupType: dbClass.pickup_type,
    paymentStatus: dbClass.payment_status,
    rating: rating,
    review: review,
    createdAt: dbClass.created_at,
  };
};

// Helper function to transform instructor data from DB to app format
const transformInstructor = (instructor, profile) => {
  // Garantir que total_classes seja sempre um número válido do banco
  // Converter null/undefined para 0, mas preservar valores numéricos
  const totalClasses = (instructor.total_classes !== null && instructor.total_classes !== undefined) 
    ? Number(instructor.total_classes) 
    : 0;
  
  return {
    id: instructor.id,
    name: profile?.name || '',
    photo: profile?.photo_url || '/imgs/instructors/1.png',
    rating: parseFloat(instructor.rating || 0),
    totalReviews: instructor.total_reviews || 0,
    totalClasses: totalClasses,
    premium: profile?.premium || false,
    pricePerClass: parseFloat(instructor.price_per_class || 0),
    priceOwnVehicle: (instructor.price_own_vehicle !== null && instructor.price_own_vehicle !== undefined) ? parseFloat(instructor.price_own_vehicle) : null,
    homeServicePrice: (instructor.home_service_price !== null && instructor.home_service_price !== undefined) ? parseFloat(instructor.home_service_price) : null,
    offersOwnVehicle: instructor.price_own_vehicle !== null && instructor.price_own_vehicle !== undefined && instructor.price_own_vehicle !== '',
    specialties: profile?.specialties || [],
    classTypes: profile?.class_types || [],
    location: instructor.location || {},
    available: instructor.available !== false,
    description: instructor.description || '',
    cnh: profile?.cnh || '',
    vehicle: profile?.vehicle || '',
    responseTime: profile?.response_time || '',
    homeService: profile?.home_service || false,
    carTypes: profile?.car_types || [],
    availability: instructor.availability || {},
    womenOnly: profile?.women_only || false,
  };
};

// Helper function to get the active Supabase client based on current session
// If userType is provided, use that specific client. Otherwise, detect from active sessions.
const getActiveSupabaseClient = async (userType = null) => {
  // If a specific user type is requested, use that client directly
  if (userType) {
    return getSupabaseClient(userType);
  }
  
  // Try to get session from each client, return the one with an active session
  // Priority: admin > instructor > student (for backwards compatibility)
  const [studentSession, instructorSession, adminSession] = await Promise.all([
    supabaseStudent.auth.getSession(),
    supabaseInstructor.auth.getSession(),
    supabaseAdmin.auth.getSession()
  ]);

  if (adminSession.data?.session?.user) {
    return supabaseAdmin;
  }
  if (instructorSession.data?.session?.user) {
    return supabaseInstructor;
  }
  if (studentSession.data?.session?.user) {
    return supabaseStudent;
  }
  
  // Fallback to default client
  return supabase;
};

// Auth API (now handled by AuthContext, but keeping for compatibility)
export const authAPI = {
  login: async (email, password, userType) => {
    // Handled by AuthContext
    throw new Error('Use AuthContext.login() instead');
  },

  register: async (userData, userType) => {
    // Handled by AuthContext
    throw new Error('Use AuthContext.register() instead');
  },

  loginWithGoogle: async (userType) => {
    // Handled by AuthContext
    throw new Error('Use AuthContext.loginWithGoogle() instead');
  },

  logout: async () => {
    // Handled by AuthContext
    throw new Error('Use AuthContext.logout() instead');
  },
};

// Students API
export const studentsAPI = {
  getClasses: async () => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('📚 Buscando aulas do aluno:', user.id);
      
      // Adicionar timestamp para evitar cache
      const cacheBuster = Date.now();
      console.log(`🔄 Cache buster: ${cacheBuster}`);

      const { data: classes, error } = await client
        .from('classes')
        .select('*')
        .eq('student_id', user.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar aulas:', error);
        throw error;
      }

      console.log(`✅ Total de aulas encontradas no banco: ${classes?.length || 0}`);
      
      // Log detalhado das aulas por status
      if (classes && classes.length > 0) {
        const statusCount = {};
        classes.forEach(c => {
          statusCount[c.status] = (statusCount[c.status] || 0) + 1;
        });
        console.log('📊 Aulas por status:', statusCount);
        console.log('📋 IDs das aulas:', classes.map(c => ({ id: c.id, status: c.status, date: c.date })));
      } else {
        console.warn('⚠️ Nenhuma aula encontrada no banco para este aluno');
      }

      // Get instructor profiles for each class
      const instructorIds = [...new Set(classes.map(c => c.instructor_id))];
      const { data: profiles } = await client
        .from('profiles')
        .select('id, name, photo_url')
        .in('id', instructorIds);

      const profileMap = {};
      profiles?.forEach(p => {
        profileMap[p.id] = p;
      });

      const transformedClasses = classes.map(c => {
        const transformed = transformClass(c, profileMap[c.instructor_id]);
        // Verificar se o status foi preservado corretamente
        if (transformed.status !== c.status) {
          console.warn(`⚠️ Status alterado na transformação: ${c.status} -> ${transformed.status} (ID: ${c.id})`);
        }
        return transformed;
      });
      console.log(`✅ Total de aulas transformadas: ${transformedClasses.length}`);
      console.log('📊 Status das aulas transformadas:', transformedClasses.map(c => ({ id: c.id, status: c.status, date: c.date })));
      
      return transformedClasses;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  getPendingClasses: async () => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: classes, error } = await client
        .from('classes')
        .select('*')
        .eq('student_id', user.id)
        .eq('status', 'pendente_aceite')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const instructorIds = [...new Set(classes.map(c => c.instructor_id))];
      const { data: profiles } = await client
        .from('profiles')
        .select('id, name, photo_url')
        .in('id', instructorIds);

      const profileMap = {};
      profiles?.forEach(p => {
        profileMap[p.id] = p;
      });

      return classes.map(c => transformClass(c, profileMap[c.instructor_id]));
    } catch (error) {
      console.error('Error fetching pending classes:', error);
      throw error;
    }
  },

  getIndicators: async () => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('📊 Buscando indicadores do aluno:', user.id);
      
      // Adicionar timestamp para evitar cache
      const cacheBuster = Date.now();
      console.log(`🔄 Cache buster (indicators): ${cacheBuster}`);

      const { data: classes, error } = await client
        .from('classes')
        .select('status, payment_status')
        .eq('student_id', user.id);

      if (error) {
        console.error('❌ Erro ao buscar indicadores:', error);
        throw error;
      }

      console.log(`✅ Total de aulas no banco (para indicadores): ${classes?.length || 0}`);

      const indicators = {
        totalClasses: classes?.length || 0,
        pendingClasses: classes?.filter(c => c.status === 'pendente_aceite').length || 0,
        scheduledClasses: classes?.filter(c => c.status === 'agendada').length || 0,
        confirmedClasses: classes?.filter(c => c.status === 'confirmada').length || 0,
        completedClasses: classes?.filter(c => c.status === 'concluida').length || 0,
        pendingPayment: classes?.filter(c => c.payment_status === 'pendente').length || 0,
      };

      console.log('📊 Indicadores calculados:', indicators);

      return indicators;
    } catch (error) {
      console.error('Error fetching indicators:', error);
      throw error;
    }
  },

  scheduleClass: async (classData) => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!classData.instructorId) {
        throw new Error('Instructor ID is required');
      }

      // Handle multiple dates/times from ScheduleClassModal
      const classesToCreate = [];
      
      if (classData.dates && Array.isArray(classData.dates) && classData.dates.length > 0) {
        // Multiple dates/times
        for (const dateData of classData.dates) {
          if (!dateData.date) continue;
          const times = dateData.times || [];
          if (times.length === 0) continue;
          
          for (const time of times) {
            if (!time) continue;
            
            // Ensure class_types is an array
            let classTypesArray = [];
            if (Array.isArray(classData.classTypes) && classData.classTypes.length > 0) {
              classTypesArray = classData.classTypes;
            } else if (classData.classTypes) {
              classTypesArray = [classData.classTypes];
            }
            
            // Ensure location is a valid object (not null)
            const locationData = classData.location && typeof classData.location === 'object' 
              ? classData.location 
              : (classData.location || {});
            
            classesToCreate.push({
              student_id: user.id,
              instructor_id: classData.instructorId,
              date: dateData.date,
              time: time,
              duration: classData.duration || 60,
              status: 'pendente_aceite',
              price: parseFloat(classData.price) || 0,
              class_types: classTypesArray,
              car: classData.car || '',
              location: locationData,
              pickup_type: classData.homeService ? 'busca_casa' : 'vai_local',
              payment_status: 'pendente',
            });
          }
        }
      } else {
        // Single class
        if (!classData.date || !classData.time) {
          throw new Error('Date and time are required');
        }
        
        // Ensure class_types is an array
        let classTypesArray = [];
        if (Array.isArray(classData.classTypes) && classData.classTypes.length > 0) {
          classTypesArray = classData.classTypes;
        } else if (classData.classTypes) {
          classTypesArray = [classData.classTypes];
        }
        
        // Ensure location is a valid object (not null)
        const locationData = classData.location && typeof classData.location === 'object' 
          ? classData.location 
          : (classData.location || {});
        
        classesToCreate.push({
          student_id: user.id,
          instructor_id: classData.instructorId,
          date: classData.date,
          time: classData.time,
          duration: classData.duration || 60,
          status: 'pendente_aceite',
          price: parseFloat(classData.price) || 0,
          class_types: classTypesArray,
          car: classData.car || '',
          location: locationData,
          pickup_type: classData.homeService ? 'busca_casa' : 'vai_local',
          payment_status: 'pendente',
        });
      }

      if (classesToCreate.length === 0) {
        throw new Error('No valid classes to create. Please select at least one date and time.');
      }

      console.log('🔵 Creating classes:', classesToCreate.length, 'aulas');
      console.log('📝 Status das aulas a serem criadas:', classesToCreate.map(c => ({ date: c.date, time: c.time, status: c.status })));
      
      // Validar que todas as aulas têm status 'pendente_aceite'
      const invalidStatuses = classesToCreate.filter(c => c.status !== 'pendente_aceite');
      if (invalidStatuses.length > 0) {
        console.error('❌ ERRO CRÍTICO: Algumas aulas têm status incorreto ANTES da inserção:', invalidStatuses);
        console.error('❌ Status esperado: pendente_aceite');
        console.error('❌ Status encontrado:', invalidStatuses.map(c => c.status));
        throw new Error('Erro interno: status das aulas incorreto antes da inserção');
      }
      
      console.log('✅ Validação passou: Todas as aulas têm status pendente_aceite');

      const { data, error } = await client
        .from('classes')
        .insert(classesToCreate)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to create classes');
      }

      if (!data || data.length === 0) {
        throw new Error('No classes were created');
      }

      console.log('✅ Aulas criadas no banco:', data.length, 'aulas');
      console.log('📋 Detalhes das aulas criadas:', data.map(c => ({ id: c.id, date: c.date, time: c.time, status: c.status, payment_status: c.payment_status })));
      
      // Verificar se o status foi preservado após inserção
      const wrongStatuses = data.filter(c => c.status !== 'pendente_aceite');
      if (wrongStatuses.length > 0) {
        console.error('❌ ERRO CRÍTICO: Status foi alterado após inserção no banco!');
        console.error('❌ Total de aulas com status incorreto:', wrongStatuses.length);
        console.error('❌ Detalhes:', wrongStatuses.map(c => ({ 
          id: c.id, 
          status_atual: c.status, 
          status_esperado: 'pendente_aceite',
          payment_status: c.payment_status,
          created_at: c.created_at
        })));
        console.error('⚠️ Isso indica que há um TRIGGER ou CONSTRAINT no banco alterando o status!');
        alert('ATENÇÃO: O status da aula foi alterado após a criação. Verifique os logs no console.');
      } else {
        console.log('✅ Todas as aulas foram criadas com status pendente_aceite corretamente!');
      }

      // Get instructor profile
      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('id, name, photo_url')
        .eq('id', classData.instructorId)
        .single();

      if (profileError) {
        console.warn('Could not fetch instructor profile:', profileError);
      }

      // Return the first class (or all classes if multiple)
      if (Array.isArray(data) && data.length > 0) {
        return data.map(c => transformClass(c, profile));
      } else if (data) {
        return transformClass(data, profile);
      }
      
      throw new Error('No classes were created');
    } catch (error) {
      console.error('Error scheduling class:', error);
      // Re-throw with a more user-friendly message if it's a known error
      if (error.message) {
        throw error;
      }
      throw new Error('Erro ao agendar aula. Por favor, tente novamente.');
    }
  },

  cancelClass: async (classId) => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('🔄 Cancelando aula:', classId, 'do aluno:', user.id);

      const { data, error } = await client
        .from('classes')
        .update({ status: 'cancelada', updated_at: new Date().toISOString() })
        .eq('id', classId)
        .eq('student_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao cancelar aula no banco:', error);
        throw error;
      }

      console.log('✅ Aula cancelada no banco:', { id: data.id, status: data.status });
      return transformClass(data);
    } catch (error) {
      console.error('Error canceling class:', error);
      throw error;
    }
  },

  rescheduleClass: async (classId, newData) => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('🔄 Reagendando aula:', classId, 'com novos dados:', newData);

      const updateData = {
        updated_at: new Date().toISOString(),
      };

      if (newData.date) updateData.date = newData.date;
      if (newData.time) updateData.time = newData.time;

      const { data, error } = await client
        .from('classes')
        .update(updateData)
        .eq('id', classId)
        .eq('student_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao reagendar aula no banco:', error);
        throw error;
      }

      console.log('✅ Aula reagendada no banco:', { id: data.id, date: data.date, time: data.time });
      return transformClass(data);
    } catch (error) {
      console.error('Error rescheduling class:', error);
      throw error;
    }
  },

  payClass: async (classId, paymentMethod) => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await client
        .from('classes')
        .update({ 
          payment_status: 'pago',
          updated_at: new Date().toISOString()
        })
        .eq('id', classId)
        .eq('student_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return transformClass(data);
    } catch (error) {
      console.error('Error paying class:', error);
      throw error;
    }
  },

  evaluateClass: async (classId, rating, review) => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Atualizar a aula com a avaliação e mudar status para concluída
      const { data: classData, error: classError } = await client
        .from('classes')
        .update({ 
          rating: rating,
          review: review || null,
          status: 'concluida',
          updated_at: new Date().toISOString()
        })
        .eq('id', classId)
        .eq('student_id', user.id)
        .select('instructor_id')
        .single();

      if (classError) throw classError;

      // Atualizar a avaliação média do instrutor
      if (classData && classData.instructor_id) {
        // Buscar todas as avaliações do instrutor
        const { data: allClasses, error: classesError } = await client
          .from('classes')
          .select('rating')
          .eq('instructor_id', classData.instructor_id)
          .eq('status', 'concluida')
          .not('rating', 'is', null);

        if (!classesError && allClasses && allClasses.length > 0) {
          // Calcular média das avaliações
          const totalRating = allClasses.reduce((sum, c) => sum + (c.rating || 0), 0);
          const averageRating = totalRating / allClasses.length;
          const totalReviews = allClasses.length;

          // Atualizar avaliação do instrutor
          await client
            .from('instructors')
            .update({
              rating: parseFloat(averageRating.toFixed(1)),
              total_reviews: totalReviews,
              updated_at: new Date().toISOString()
            })
            .eq('id', classData.instructor_id);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error evaluating class:', error);
      throw error;
    }
  },

  getInstructorReviews: async (instructorId) => {
    try {
      const client = await getActiveSupabaseClient('student');
      
      // Buscar todas as aulas concluídas deste instrutor que têm avaliações
      const { data: classes, error } = await client
        .from('classes')
        .select('id, rating, review, date, student_id, status')
        .eq('instructor_id', instructorId)
        .eq('status', 'concluida')
        .not('rating', 'is', null)
        .order('date', { ascending: false })
        .limit(50); // Limitar a 50 avaliações mais recentes

      if (error) throw error;

      // Buscar informações dos alunos que fizeram as avaliações
      const studentIds = [...new Set(classes.map(c => c.student_id))];
      const { data: profiles } = await client
        .from('profiles')
        .select('id, name, photo_url')
        .in('id', studentIds);

      const profileMap = {};
      profiles?.forEach(p => {
        profileMap[p.id] = p;
      });

      // Transformar os dados para incluir informações do aluno
      const reviews = classes
        .filter(c => c.rating != null && c.rating > 0) // Apenas avaliações válidas
        .map(c => ({
          id: c.id,
          rating: parseInt(c.rating),
          review: c.review && c.review.trim() !== '' ? c.review.trim() : null,
          date: c.date,
          studentName: profileMap[c.student_id]?.name || 'Aluno',
          studentPhoto: profileMap[c.student_id]?.photo_url || null
        }));

      return reviews;
    } catch (error) {
      console.error('Error getting instructor reviews:', error);
      throw error;
    }
  },

  getInstructors: async (filters = {}) => {
    try {
      console.log('🔍 Buscando instrutores com filtros:', filters);
      
      // Para buscar instrutores, pode ser chamado por qualquer tipo de usuário
      // Mas vamos usar o cliente do aluno se ele estiver logado, senão tenta detectar
      const client = await getActiveSupabaseClient('student');
      // Verificar autenticação atual
      const { data: { user } } = await client.auth.getUser();
      console.log('👤 Usuário autenticado:', user ? user.id : 'Não autenticado');
      
      // First, get all available instructors
      // Usando '*' para buscar todos os campos disponíveis (mais tolerante a campos que podem não existir)
      // Adicionar timestamp para evitar cache do Supabase
      let query = client
        .from('instructors')
        .select('*')
        .eq('available', true)
        .order('updated_at', { ascending: false, nullsFirst: false }); // Ordenar por updated_at para forçar refresh

      // Apply filters
      if (filters.maxPrice) {
        query = query.lte('price_per_class', filters.maxPrice);
      }

      if (filters.minPrice) {
        query = query.gte('price_per_class', filters.minPrice);
      }

      console.log('📤 Executando query...');
      // Adicionar timestamp para evitar cache (forçar nova query)
      const cacheBuster = Date.now();
      console.log(`🔄 Cache buster: ${cacheBuster}`);
      
      // Ordenar: premium primeiro (available = true e premium = true), depois por rating
      // Nota: A ordenação final será feita no frontend para garantir que premium sempre aparece primeiro
      // Usar .maybeSingle() ou garantir que não há cache adicionando um filtro único
      const { data: instructors, error: instructorsError } = await query
        .order('rating', { ascending: false })
        .limit(1000); // Limite alto para garantir que pega todos
      
      // Log para debug: verificar valores de total_classes
      if (instructors && instructors.length > 0) {
        console.log('📊 Total classes dos instrutores (do banco RAW):', instructors.map(i => ({
          id: i.id,
          name: i.name || 'Sem nome',
          total_classes: i.total_classes,
          total_classes_type: typeof i.total_classes,
          total_classes_value: i.total_classes === null ? 'NULL' : i.total_classes === undefined ? 'UNDEFINED' : i.total_classes
        })));
      } else {
        console.warn('⚠️ Nenhum instrutor retornado da query');
      }

      if (instructorsError) {
        console.error('❌ Error fetching instructors from database:', instructorsError);
        console.error('Error code:', instructorsError.code);
        console.error('Error message:', instructorsError.message);
        console.error('Error details:', JSON.stringify(instructorsError, null, 2));
        
        // Se for erro de permissão RLS
        if (instructorsError.code === '42501' || instructorsError.message?.includes('permission') || instructorsError.message?.includes('policy')) {
          console.error('🚫 ERRO DE PERMISSÃO RLS! Execute o script fix_rls_policies.sql no Supabase SQL Editor');
        }
        // Se o erro for sobre campos que não existem, tentar sem os campos novos
        if (instructorsError.message && instructorsError.message.includes('column')) {
          console.warn('⚠️ Tentando buscar sem campos novos...');
          const fallbackQuery = client
            .from('instructors')
            .select('id, rating, total_reviews, total_classes, price_per_class, location, availability, description, available')
            .eq('available', true);
          const { data: fallbackData, error: fallbackError } = await fallbackQuery.order('rating', { ascending: false });
          if (fallbackError) {
            console.error('❌ Fallback query also failed:', fallbackError);
            throw fallbackError;
          }
          if (!fallbackData || fallbackData.length === 0) {
            console.warn('⚠️ No instructors found in database (fallback query)');
            return [];
          }
          // Continuar com fallbackData
          const instructorIds = fallbackData.map(i => i.id);
          const { data: profiles } = await client
            .from('profiles')
            .select('*')
            .in('id', instructorIds)
            .eq('user_type', 'instructor');
          const profileMap = {};
          if (profiles) {
            profiles.forEach(profile => {
              profileMap[profile.id] = profile;
            });
          }
          return fallbackData.map(instructor => {
            const profile = profileMap[instructor.id];
            return transformInstructor(instructor, profile);
          });
        }
        throw instructorsError;
      }

      console.log('✅ Instructors found:', instructors?.length || 0);
      if (instructors && instructors.length > 0) {
        console.log('📋 Primeiros instrutores:', instructors.slice(0, 3).map(i => ({ id: i.id, available: i.available, price: i.price_per_class })));
      }

      if (!instructors || instructors.length === 0) {
        console.warn('⚠️ No instructors found in database (available = true)');
        // Verificar se há instrutores mas não estão disponíveis
        console.log('🔍 Verificando se há instrutores no banco...');
        const { data: allInstructors, error: checkError } = await client
          .from('instructors')
          .select('id, available, price_per_class')
          .limit(10);
        
        if (checkError) {
          console.error('❌ Erro ao verificar instrutores:', checkError);
          if (checkError.code === '42501' || checkError.message?.includes('permission')) {
            console.error('🚫 ERRO DE PERMISSÃO RLS! Execute o script fix_rls_policies.sql no Supabase SQL Editor');
          }
        } else {
          console.log('📊 Total instructors in database (sample):', allInstructors);
          console.log('📊 Instrutores disponíveis:', allInstructors?.filter(i => i.available === true).length || 0);
        }
        return [];
      }

      // Get all instructor IDs
      const instructorIds = instructors.map(i => i.id);

      // Fetch profiles for these instructors
      // Usando '*' para buscar todos os campos disponíveis (mais tolerante a campos que podem não existir)
      console.log('🔍 Buscando perfis para', instructorIds.length, 'instrutores...');
      const { data: profiles, error: profilesError } = await client
        .from('profiles')
        .select('*')
        .in('id', instructorIds)
        .eq('user_type', 'instructor');

      if (profilesError) {
        console.warn('⚠️ Error fetching profiles:', profilesError);
        console.warn('Profile error code:', profilesError.code);
        console.warn('Profile error message:', profilesError.message);
        console.warn('Profile error details:', JSON.stringify(profilesError, null, 2));
        
        if (profilesError.code === '42501' || profilesError.message?.includes('permission')) {
          console.error('🚫 ERRO DE PERMISSÃO RLS nos perfis! Execute o script fix_rls_policies.sql no Supabase SQL Editor');
        }
      }
      
      console.log('✅ Profiles found:', profiles?.length || 0);
      if (profiles && profiles.length > 0) {
        console.log('📋 Primeiros perfis:', profiles.slice(0, 3).map(p => ({ 
          id: p.id, 
          name: p.name, 
          user_type: p.user_type,
          premium: p.premium 
        })));
      }

      // Create a map of profiles by ID
      const profileMap = {};
      if (profiles) {
        profiles.forEach(profile => {
          profileMap[profile.id] = profile;
        });
      }

      // Verificar valores esperados agora que temos os nomes
      const expectedValues = {
        'Roberto Oliveira': 42,
        'Mariana Costa': 26,
        'Carlos Silva': 37,
        'Fernando Alves': 18,
        'Ana Paula Santos': 6,
        'João Pedro Lima': 0,
        'Patricia Mendes': 32
      };
      
      console.log('🔍 Verificando valores do banco vs esperados:');
      instructors.forEach(instructor => {
        const profile = profileMap[instructor.id];
        const name = profile?.name || 'Sem nome';
        const expected = expectedValues[name];
        const actual = instructor.total_classes;
        if (expected !== undefined) {
          if (actual !== expected) {
            console.error(`❌ VALOR INCORRETO NO BANCO: ${name} - Esperado: ${expected}, Atual no banco: ${actual} (tipo: ${typeof actual})`);
          } else {
            console.log(`✅ ${name}: ${actual} (correto no banco)`);
          }
        }
      });

      // Combine instructors with their profiles
      console.log('🔄 Combinando instrutores com perfis...');
      const transformed = instructors.map(instructor => {
        const profile = profileMap[instructor.id];
        if (!profile) {
          console.warn('⚠️ Perfil não encontrado para instrutor:', instructor.id);
        }
        const transformedInstructor = transformInstructor(instructor, profile);
        
        // FORÇAR uso do valor do banco diretamente (garantia extra)
        const dbTotalClasses = (instructor.total_classes !== null && instructor.total_classes !== undefined) 
          ? Number(instructor.total_classes) 
          : 0;
        transformedInstructor.totalClasses = dbTotalClasses;
        
        // Log para debug: verificar valor final de totalClasses
        if (transformedInstructor.totalClasses !== dbTotalClasses) {
          console.error(`❌ ERRO CRÍTICO: ${transformedInstructor.name} - totalClasses não corresponde ao banco!`);
          console.error(`   Transformado: ${transformedInstructor.totalClasses}, Banco: ${dbTotalClasses}`);
        }
        console.log(`📋 Instrutor ${transformedInstructor.name}: totalClasses = ${transformedInstructor.totalClasses} (do banco: ${instructor.total_classes})`);
        return transformedInstructor;
      });

      console.log('✅ Total transformed instructors:', transformed.length);
      if (transformed.length > 0) {
        console.log('📋 Primeiro instrutor transformado:', {
          id: transformed[0].id,
          name: transformed[0].name,
          price: transformed[0].pricePerClass,
          rating: transformed[0].rating,
          premium: transformed[0].premium
        });
      }
      return transformed;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const client = await getActiveSupabaseClient('student');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        photo_url: profileData.photo,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  updateAccountSettings: async (settings) => {
    // TODO: Implement account settings (might need a separate settings table)
    throw new Error('Not implemented yet');
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      // Para mudança de senha, detecta o tipo do usuário atual
      const client = await getActiveSupabaseClient();
      const { error } = await client.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
};

// Instructors API
export const instructorsAPI = {
  getClasses: async () => {
    try {
      const client = await getActiveSupabaseClient('instructor');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: classes, error } = await client
        .from('classes')
        .select('*')
        .eq('instructor_id', user.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      // Get student profiles
      const studentIds = [...new Set(classes.map(c => c.student_id))];
      const { data: profiles } = await client
        .from('profiles')
        .select('id, name, photo_url')
        .in('id', studentIds);

      const profileMap = {};
      profiles?.forEach(p => {
        profileMap[p.id] = p;
      });

      return classes.map(c => ({
        ...transformClass(c),
        studentName: profileMap[c.student_id]?.name || '',
        studentPhoto: profileMap[c.student_id]?.photo_url || null,
      }));
    } catch (error) {
      console.error('Error fetching instructor classes:', error);
      throw error;
    }
  },

  confirmClass: async (classId) => {
    try {
      const client = await getActiveSupabaseClient('instructor');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('🔄 Instrutor aceitando aula:', classId);

      const { data, error } = await client
        .from('classes')
        .update({ 
          status: 'pendente_pagamento', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', classId)
        .eq('instructor_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao aceitar aula no banco:', error);
        throw error;
      }

      console.log('✅ Aula aceita pelo instrutor, status alterado para pendente_pagamento:', { id: data.id, status: data.status });
      return transformClass(data);
    } catch (error) {
      console.error('Error confirming class:', error);
      throw error;
    }
  },

  rejectClass: async (classId) => {
    try {
      const client = await getActiveSupabaseClient('instructor');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await client
        .from('classes')
        .update({ status: 'cancelada', updated_at: new Date().toISOString() })
        .eq('id', classId)
        .eq('instructor_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return transformClass(data);
    } catch (error) {
      console.error('Error rejecting class:', error);
      throw error;
    }
  },

  getIndicators: async (period = 'month') => {
    try {
      const client = await getActiveSupabaseClient('instructor');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate date range based on period
      const now = new Date();
      let startDate;
      if (period === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        startDate = new Date(now.getFullYear(), 0, 1); // Year
      }

      const { data: classes } = await client
        .from('classes')
        .select('status, price, payment_status, date')
        .eq('instructor_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0]);

      const totalRevenue = classes
        ?.filter(c => c.payment_status === 'pago')
        .reduce((sum, c) => sum + parseFloat(c.price || 0), 0) || 0;

      const indicators = {
        totalClasses: classes?.length || 0,
        pendingClasses: classes?.filter(c => c.status === 'pendente_aceite').length || 0,
        confirmedClasses: classes?.filter(c => c.status === 'confirmada').length || 0,
        completedClasses: classes?.filter(c => c.status === 'concluida').length || 0,
        totalRevenue: totalRevenue,
        pendingPayment: classes?.filter(c => c.payment_status === 'pendente').length || 0,
      };

      return indicators;
    } catch (error) {
      console.error('Error fetching instructor indicators:', error);
      throw error;
    }
  },

  getTransactions: async (period = 'month') => {
    try {
      const client = await getActiveSupabaseClient('instructor');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate date range
      const now = new Date();
      let startDate;
      if (period === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        startDate = new Date(now.getFullYear(), 0, 1);
      }

      const { data: classes, error } = await client
        .from('classes')
        .select('id, date, price, payment_status, status')
        .eq('instructor_id', user.id)
        .eq('payment_status', 'pago')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;

      return classes.map(c => ({
        id: c.id,
        date: c.date,
        amount: parseFloat(c.price || 0),
        status: c.payment_status,
        type: 'class_payment',
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  requestWithdraw: async (amount, accountId) => {
    // TODO: Implement withdrawal system (would need a withdrawals table)
    throw new Error('Not implemented yet');
  },

  updateAvailability: async (availability) => {
    try {
      const client = await getActiveSupabaseClient('instructor');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Importar função de validação
      const { validateWeeklyAvailability } = await import('../utils/availabilityUtils');
      
      // Validar disponibilidade
      const validation = validateWeeklyAvailability(availability);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      console.log('🔄 Atualizando disponibilidade do instrutor:', user.id);
      console.log('✅ Validação passou:', validation.totalHours, 'horas semanais');

      const { data, error } = await client
        .from('instructors')
        .update({ 
          availability: availability,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar disponibilidade:', error);
        throw error;
      }

      console.log('✅ Disponibilidade atualizada com sucesso');
      return data;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  },
};

// Admin API
export const adminAPI = {
  /**
   * Indicadores globais para o dashboard de admin
   * period: 'all' | '7d' | '30d' | 'month'
   */
  getIndicators: async (period = 'all') => {
    try {
      const client = await getActiveSupabaseClient('admin');
      // Garantir que o usuário está autenticado (e em RLS você pode proteger por user_type = 'admin')
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Filtro de data opcional para classes (atividade e pagamentos)
      const now = new Date();
      let startDateFilter = null;

      if (period === '7d') {
        startDateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === '30d') {
        startDateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (period === 'month') {
        startDateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // 1) Total de alunos
      const { count: totalStudents, error: studentsCountError } = await client
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'student');

      if (studentsCountError) {
        console.error('❌ Erro ao contar alunos:', studentsCountError);
        throw studentsCountError;
      }

      // 2) Total de instrutores
      const { count: totalInstructors, error: instructorsCountError } = await client
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'instructor');

      if (instructorsCountError) {
        console.error('❌ Erro ao contar instrutores:', instructorsCountError);
        throw instructorsCountError;
      }

      // 3) Buscar aulas para calcular alunos/instrutores ativos e total pago
      let classesQuery = client
        .from('classes')
        .select('student_id, instructor_id, status, payment_status, price, date');

      if (startDateFilter) {
        const isoDate = startDateFilter.toISOString().split('T')[0];
        classesQuery = classesQuery.gte('date', isoDate);
      }

      const { data: classes, error: classesError } = await classesQuery;

      if (classesError) {
        console.error('❌ Erro ao buscar aulas para indicadores de admin:', classesError);
        throw classesError;
      }

      const activeStudentsSet = new Set();
      const activeInstructorsSet = new Set();
      let totalPaid = 0;

      (classes || []).forEach((c) => {
        // Alunos ativos: agendou/confirmou/concluiu pelo menos uma aula
        if (['agendada', 'confirmada', 'concluida'].includes(c.status) && c.student_id) {
          activeStudentsSet.add(c.student_id);
        }

        // Instrutores ativos: aceitou/concluiu pelo menos uma aula
        if (['confirmada', 'concluida'].includes(c.status) && c.instructor_id) {
          activeInstructorsSet.add(c.instructor_id);
        }

        // Valor total pago
        if (c.payment_status === 'pago') {
          totalPaid += parseFloat(c.price || 0);
        }
      });

      return {
        totalStudents: totalStudents || 0,
        activeStudents: activeStudentsSet.size,
        totalInstructors: totalInstructors || 0,
        activeInstructors: activeInstructorsSet.size,
        totalPaid,
      };
    } catch (error) {
      console.error('Error fetching admin indicators:', error);
      throw error;
    }
  },

  /**
   * Métricas de funil baseadas na tabela de eventos
   * period: 'all' | '7d' | '30d' | 'month'
   */
  getFunnelMetrics: async (period = 'all') => {
    try {
      const client = await getActiveSupabaseClient('admin');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      let startTimestamp = null;

      if (period === '7d') {
        startTimestamp = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === '30d') {
        startTimestamp = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (period === 'month') {
        startTimestamp = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      let eventsQuery = client
        .from('events')
        .select('user_id, event_name, user_type, timestamp')
        .eq('user_type', 'student');

      if (startTimestamp) {
        eventsQuery = eventsQuery.gte('timestamp', startTimestamp.toISOString());
      }

      const { data: events, error: eventsError } = await eventsQuery;

      if (eventsError) {
        console.error('❌ Erro ao buscar eventos para funil de admin:', eventsError);
        throw eventsError;
      }

      const byEvent = (name) => {
        const set = new Set();
        (events || []).forEach((e) => {
          if (e.event_name === name && e.user_id) {
            set.add(e.user_id);
          }
        });
        return set.size;
      };

      return {
        clickedStartNow: byEvent('landing_aluno_cta_hero'),
        createdAccount: byEvent('auth_register_success'),
        clickedSchedule: byEvent('dashboard_aluno_schedule_new_class'),
        scheduledClass: byEvent('dashboard_aluno_class_scheduled'),
        clickedPay: byEvent('payment_initiated'),
        clickedCoupon: byEvent('coupon_requested'),
      };
    } catch (error) {
      console.error('Error fetching admin funnel metrics:', error);
      throw error;
    }
  },

  /**
   * Aceita uma aula (muda status de pendente_aceite para pendente_pagamento)
   * @param {string} classId - ID da aula a ser aceita
   * @returns {Promise<Object>} Aula atualizada
   */
  acceptClass: async (classId) => {
    try {
      const client = await getActiveSupabaseClient('admin');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('🔄 Admin aceitando aula:', classId);

      const { data, error } = await client
        .from('classes')
        .update({ 
          status: 'pendente_pagamento', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', classId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao aceitar aula no banco (admin):', error);
        throw error;
      }

      console.log('✅ Aula aceita pelo admin, status alterado para pendente_pagamento:', { id: data.id, status: data.status });
      
      // Transformar a aula para o formato esperado
      const { data: instructorProfile } = await client
        .from('profiles')
        .select('id, name, photo_url')
        .eq('id', data.instructor_id)
        .single();

      return transformClass(data, instructorProfile);
    } catch (error) {
      console.error('Error accepting class (admin):', error);
      throw error;
    }
  },

  /**
   * Busca eventos da plataforma com paginação e filtros
   * @param {Object} options - Opções de busca
   * @param {string} options.period - Período: 'all' | '7d' | '30d' | 'month'
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite de resultados por página
   * @param {string} options.eventName - Filtrar por nome do evento
   * @param {string} options.userType - Filtrar por tipo de usuário
   * @returns {Promise<Object>} { events: Array, total: number }
   */
  getEvents: async ({ period = 'all', page = 1, limit = 50, eventName, userType } = {}) => {
    try {
      const client = await getActiveSupabaseClient('admin');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      let startTimestamp = null;

      if (period === '7d') {
        startTimestamp = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === '30d') {
        startTimestamp = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (period === 'month') {
        startTimestamp = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Query base
      let eventsQuery = client
        .from('events')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (startTimestamp) {
        eventsQuery = eventsQuery.gte('timestamp', startTimestamp.toISOString());
      }

      if (eventName) {
        eventsQuery = eventsQuery.ilike('event_name', `%${eventName}%`);
      }

      if (userType) {
        eventsQuery = eventsQuery.eq('user_type', userType);
      }

      // Ordenar por timestamp descendente (mais recentes primeiro)
      eventsQuery = eventsQuery.order('timestamp', { ascending: false });

      // Paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      eventsQuery = eventsQuery.range(from, to);

      const { data: events, error, count } = await eventsQuery;

      if (error) {
        console.error('❌ Erro ao buscar eventos:', error);
        throw error;
      }

      return {
        events: events || [],
        total: count || 0,
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  /**
   * Busca todas as aulas da plataforma com paginação e filtros
   * @param {Object} options - Opções de busca
   * @param {string} options.period - Período: 'all' | '7d' | '30d' | 'month'
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite de resultados por página
   * @param {string} options.status - Filtrar por status
   * @returns {Promise<Object>} { classes: Array, total: number }
   */
  getAllClasses: async ({ period = 'all', page = 1, limit = 20, status, sortBy = 'statusDate', sortOrder = 'desc' } = {}) => {
    try {
      const client = await getActiveSupabaseClient('admin');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('📚 Admin buscando todas as aulas:', { period, page, limit, status });

      const now = new Date();
      let startDateFilter = null;

      if (period === '7d') {
        startDateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === '30d') {
        startDateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (period === 'month') {
        startDateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Query base - buscar TODAS as aulas
      // IMPORTANTE: Não aplicar nenhum filtro de student_id ou instructor_id para admin ver todas
      // Tentar primeiro com JOIN, se falhar, buscar separadamente
      let classesQuery = client
        .from('classes')
        .select('*', { count: 'exact' });

      // Aplicar filtros apenas se não for 'all'
      if (period !== 'all' && startDateFilter) {
        const isoDate = startDateFilter.toISOString().split('T')[0];
        classesQuery = classesQuery.gte('date', isoDate);
        console.log('📅 Aplicando filtro de data:', isoDate);
      } else {
        console.log('📅 Sem filtro de data - buscando TODAS as aulas');
      }

      if (status) {
        classesQuery = classesQuery.eq('status', status);
        console.log('🔍 Aplicando filtro de status:', status);
      } else {
        console.log('🔍 Sem filtro de status - buscando todos os status');
      }

      // Ordenar por padrão por updated_at/created_at (statusDate) em ordem descendente
      // A ordenação detalhada será feita no frontend para maior flexibilidade
      
      // Ordenação base para garantir ordem consistente na paginação
      // Por padrão, ordenar por updated_at desc, depois created_at desc
      classesQuery = classesQuery.order('updated_at', { ascending: false, nullsFirst: false });
      classesQuery = classesQuery.order('created_at', { ascending: false });
      classesQuery = classesQuery.order('date', { ascending: false });
      classesQuery = classesQuery.order('time', { ascending: false });

      // Paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      classesQuery = classesQuery.range(from, to);

      console.log('🔍 Executando query de aulas...', { from, to, limit });
      console.log('👤 Usuário admin autenticado:', user.id);
      
      const { data: classes, error, count } = await classesQuery;

      if (error) {
        console.error('❌ Erro ao buscar aulas:', error);
        throw error;
      }

      console.log(`✅ Total de aulas encontradas: ${count || 0}, retornando ${classes?.length || 0} para esta página`);
      
      if (classes && classes.length > 0) {
        // Verificar se os perfis vieram no JOIN
        const firstClass = classes[0];
        console.log('📋 Estrutura da primeira aula:', {
          hasStudentProfile: !!firstClass.student_profile,
          hasInstructorProfile: !!firstClass.instructor_profile,
          studentProfile: firstClass.student_profile,
          instructorProfile: firstClass.instructor_profile
        });
      } else {
        console.warn('⚠️ Nenhuma aula retornada pela query!');
      }

      // Buscar perfis de alunos e instrutores separadamente
      // Coletar todos os IDs únicos primeiro
      const studentIds = [...new Set((classes || []).map(c => c.student_id).filter(Boolean))];
      const instructorIds = [...new Set((classes || []).map(c => c.instructor_id).filter(Boolean))];
      const allUserIds = [...studentIds, ...instructorIds];

      console.log('👥 Buscando perfis:', { 
        studentIds: studentIds.length, 
        instructorIds: instructorIds.length,
        total: allUserIds.length 
      });
      
      // Log dos IDs que estamos buscando
      if (studentIds.length > 0) {
        console.log('📋 Primeiros IDs dos alunos:', studentIds.slice(0, 3).map(id => id));
      }

      // Buscar perfis - incluir email se disponível na tabela profiles
      let profiles = [];
      let profileMap = {};
      
      if (allUserIds.length > 0) {
        console.log('🔍 Executando query de perfis...');
        const { data: profilesData, error: profilesError } = await client
          .from('profiles')
          .select('id, name, photo_url, user_type, email')
          .in('id', allUserIds);

        if (profilesError) {
          console.error('❌ Erro ao buscar perfis:', profilesError);
          console.error('   Código:', profilesError.code);
          console.error('   Mensagem:', profilesError.message);
          console.error('   Detalhes:', profilesError.details);
          console.error('   Hint:', profilesError.hint);
        } else {
          profiles = profilesData || [];
          console.log(`✅ Perfis retornados: ${profiles.length} de ${allUserIds.length} solicitados`);
          
          // Criar map de perfis usando o ID completo como chave
          profiles.forEach(p => {
            if (p && p.id) {
              profileMap[p.id] = p;
              console.log(`📝 Perfil mapeado: ${p.id} -> "${p.name || 'SEM NOME'}" (tipo: ${p.user_type || 'N/A'})`);
            }
          });
          
          // Verificar correspondência
          console.log('🔍 Verificando correspondência de IDs...');
          const sampleClasses = classes?.slice(0, 3) || [];
          sampleClasses.forEach(c => {
            const studentFound = !!profileMap[c.student_id];
            const instructorFound = !!profileMap[c.instructor_id];
            console.log(`   Aula ${c.id?.substring(0, 8)}:`, {
              student_id: c.student_id,
              studentFound,
              studentName: profileMap[c.student_id]?.name || 'NÃO ENCONTRADO',
              instructor_id: c.instructor_id,
              instructorFound,
              instructorName: profileMap[c.instructor_id]?.name || 'NÃO ENCONTRADO'
            });
          });
        }
      }

      // Criar map de emails a partir dos perfis (se email estiver na tabela profiles)
      const emailMap = {};
      profiles.forEach(p => {
        if (p.email) {
          emailMap[p.id] = p.email;
        }
      });
      
      // Se ainda faltarem emails, buscar através da função SQL get_user_emails
      const missingEmailIds = studentIds.filter(id => !emailMap[id]);
      
      if (missingEmailIds.length > 0) {
        console.log(`📧 Buscando emails de ${missingEmailIds.length} alunos que não têm email no perfil...`);
        
        try {
          // Chamar a função SQL get_user_emails apenas para os que faltam
          const { data: emails, error: emailsError } = await client
            .rpc('get_user_emails', { user_ids: missingEmailIds });
          
          if (emailsError) {
            console.warn('⚠️ Erro ao buscar emails via função:', emailsError);
            console.warn('   Código:', emailsError.code);
            console.warn('   Mensagem:', emailsError.message);
            console.warn('   Detalhes:', emailsError.details);
            console.warn('   Dica: Execute o script create_user_emails_view.sql no Supabase');
          } else if (emails) {
            emails.forEach(e => {
              if (e && e.id) {
                emailMap[e.id] = e.email;
              }
            });
            console.log(`✅ Emails encontrados via função: ${emails.length}`);
          }
        } catch (emailError) {
          console.warn('⚠️ Não foi possível buscar emails:', emailError);
        }
      } else {
        console.log('✅ Todos os emails já estão nos perfis!');
      }
      
      console.log(`📧 Total de emails no map: ${Object.keys(emailMap).length}`);

      // Transformar aulas
      const transformedClasses = (classes || []).map(c => {
        // Buscar perfil do aluno - tentar múltiplas formas de busca
        let studentProfile = profileMap[c.student_id];
        
        // Se não encontrou, tentar buscar por string (caso haja diferença de tipo)
        if (!studentProfile && c.student_id) {
          const studentIdStr = String(c.student_id);
          studentProfile = Object.values(profileMap).find(p => 
            String(p.id) === studentIdStr || 
            p.id === c.student_id ||
            (p.id && c.student_id && p.id.toString() === c.student_id.toString())
          );
        }
        
        // Buscar perfil do instrutor
        let instructorProfile = profileMap[c.instructor_id];
        if (!instructorProfile && c.instructor_id) {
          const instructorIdStr = String(c.instructor_id);
          instructorProfile = Object.values(profileMap).find(p => 
            String(p.id) === instructorIdStr || 
            p.id === c.instructor_id ||
            (p.id && c.instructor_id && p.id.toString() === c.instructor_id.toString())
          );
        }
        
        const studentName = studentProfile?.name || '';
        const studentEmail = emailMap[c.student_id] || emailMap[String(c.student_id)] || '';
        
        // Log detalhado para debug se ainda não encontrar
        if (!studentName && c.student_id) {
          console.warn(`⚠️ Nome do aluno não encontrado para student_id: ${c.student_id}`);
          console.warn(`   Tipo do student_id:`, typeof c.student_id);
          console.warn(`   Perfil encontrado no map direto:`, !!profileMap[c.student_id]);
          console.warn(`   Perfil encontrado por busca:`, !!studentProfile);
          console.warn(`   Total de perfis no map:`, Object.keys(profileMap).length);
          console.warn(`   Primeiros IDs no map:`, Object.keys(profileMap).slice(0, 3));
          console.warn(`   Primeiros IDs das aulas:`, classes?.slice(0, 3).map(c => c.student_id));
        }
        
        const transformed = transformClass(c, instructorProfile);
        
        return {
          ...transformed,
          studentName: studentName,
          studentEmail: studentEmail,
          studentPhoto: studentProfile?.photo_url || null,
          // Datas importantes da aula
          createdAt: c.created_at || transformed.createdAt, // Data de criação/solicitação
          updatedAt: c.updated_at, // Última atualização
        };
      });

      console.log('✅ Aulas transformadas:', transformedClasses.length);

      return {
        classes: transformedClasses,
        total: count || 0,
      };
    } catch (error) {
      console.error('Error fetching all classes:', error);
      throw error;
    }
  },

  /**
   * Atualiza o status de uma aula
   * @param {string} classId - ID da aula
   * @param {string} newStatus - Novo status
   * @returns {Promise<Object>} Aula atualizada
   */
  updateClassStatus: async (classId, newStatus) => {
    try {
      const client = await getActiveSupabaseClient('admin');
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('🔄 Admin atualizando status da aula:', classId, 'para', newStatus);

      const { data, error } = await client
        .from('classes')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', classId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar status da aula:', error);
        throw error;
      }

      console.log('✅ Status da aula atualizado:', { id: data.id, status: data.status });
      
      // Buscar perfil do instrutor
      const { data: instructorProfile } = await client
        .from('profiles')
        .select('id, name, photo_url')
        .eq('id', data.instructor_id)
        .single();

      // Buscar perfil do aluno
      const { data: studentProfile } = await client
        .from('profiles')
        .select('id, name, photo_url')
        .eq('id', data.student_id)
        .single();

      return {
        ...transformClass(data, instructorProfile),
        studentName: studentProfile?.name || '',
        studentPhoto: studentProfile?.photo_url || null,
      };
    } catch (error) {
      console.error('Error updating class status:', error);
      throw error;
    }
  },
};

const api = {
  auth: authAPI,
  students: studentsAPI,
  instructors: instructorsAPI,
  admin: adminAPI,
};

export default api;
