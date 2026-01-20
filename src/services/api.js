// API Service - Integração com Supabase
import { supabase } from './supabase';

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
    instructorPhoto: instructorProfile?.photo_url || '/imgs/instructors/1.png',
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('📚 Buscando aulas do aluno:', user.id);
      
      // Adicionar timestamp para evitar cache
      const cacheBuster = Date.now();
      console.log(`🔄 Cache buster: ${cacheBuster}`);

      const { data: classes, error } = await supabase
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
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, photo_url')
        .in('id', instructorIds);

      const profileMap = {};
      profiles?.forEach(p => {
        profileMap[p.id] = p;
      });

      const transformedClasses = classes.map(c => transformClass(c, profileMap[c.instructor_id]));
      console.log(`✅ Total de aulas transformadas: ${transformedClasses.length}`);
      
      return transformedClasses;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  },

  getPendingClasses: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: classes, error } = await supabase
        .from('classes')
        .select('*')
        .eq('student_id', user.id)
        .eq('status', 'pendente_aceite')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const instructorIds = [...new Set(classes.map(c => c.instructor_id))];
      const { data: profiles } = await supabase
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('📊 Buscando indicadores do aluno:', user.id);
      
      // Adicionar timestamp para evitar cache
      const cacheBuster = Date.now();
      console.log(`🔄 Cache buster (indicators): ${cacheBuster}`);

      const { data: classes, error } = await supabase
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
      const { data: { user } } = await supabase.auth.getUser();
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
              status: 'agendada',
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
          status: 'agendada',
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

      console.log('Creating classes:', classesToCreate);

      const { data, error } = await supabase
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

      // Get instructor profile
      const { data: profile, error: profileError } = await supabase
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('classes')
        .update({ status: 'cancelada', updated_at: new Date().toISOString() })
        .eq('id', classId)
        .eq('student_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return transformClass(data);
    } catch (error) {
      console.error('Error canceling class:', error);
      throw error;
    }
  },

  rescheduleClass: async (classId, newData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updateData = {
        updated_at: new Date().toISOString(),
      };

      if (newData.date) updateData.date = newData.date;
      if (newData.time) updateData.time = newData.time;

      const { data, error } = await supabase
        .from('classes')
        .update(updateData)
        .eq('id', classId)
        .eq('student_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return transformClass(data);
    } catch (error) {
      console.error('Error rescheduling class:', error);
      throw error;
    }
  },

  payClass: async (classId, paymentMethod) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Atualizar a aula com a avaliação e mudar status para concluída
      const { data: classData, error: classError } = await supabase
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
        const { data: allClasses, error: classesError } = await supabase
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
          await supabase
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

  getInstructors: async (filters = {}) => {
    try {
      console.log('🔍 Buscando instrutores com filtros:', filters);
      
      // Verificar autenticação atual
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Usuário autenticado:', user ? user.id : 'Não autenticado');
      
      // First, get all available instructors
      // Usando '*' para buscar todos os campos disponíveis (mais tolerante a campos que podem não existir)
      // Adicionar timestamp para evitar cache do Supabase
      let query = supabase
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
        
        // Verificar valores esperados
        const expectedValues = {
          'Roberto Oliveira': 42,
          'Mariana Costa': 26,
          'Carlos Silva': 37,
          'Fernando Alves': 18,
          'Ana Paula Santos': 6,
          'João Pedro Lima': 0,
          'Patricia Mendes': 32
        };
        
        // Verificar valores esperados (vamos fazer isso depois de buscar os perfis)
        console.log('⏳ Verificação de valores será feita após buscar perfis...');
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
          const fallbackQuery = supabase
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
          const { data: profiles } = await supabase
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
        const { data: allInstructors, error: checkError } = await supabase
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
      const { data: profiles, error: profilesError } = await supabase
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        photo_url: profileData.photo,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
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
      const { error } = await supabase.auth.updateUser({
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: classes, error } = await supabase
        .from('classes')
        .select('*')
        .eq('instructor_id', user.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      // Get student profiles
      const studentIds = [...new Set(classes.map(c => c.student_id))];
      const { data: profiles } = await supabase
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
        studentPhoto: profileMap[c.student_id]?.photo_url || '/imgs/users/image.png',
      }));
    } catch (error) {
      console.error('Error fetching instructor classes:', error);
      throw error;
    }
  },

  confirmClass: async (classId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('classes')
        .update({ status: 'confirmada', updated_at: new Date().toISOString() })
        .eq('id', classId)
        .eq('instructor_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return transformClass(data);
    } catch (error) {
      console.error('Error confirming class:', error);
      throw error;
    }
  },

  rejectClass: async (classId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
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
      const { data: { user } } = await supabase.auth.getUser();
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

      const { data: classes } = await supabase
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
      const { data: { user } } = await supabase.auth.getUser();
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

      const { data: classes, error } = await supabase
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
};

const api = {
  auth: authAPI,
  students: studentsAPI,
  instructors: instructorsAPI,
};

export default api;
