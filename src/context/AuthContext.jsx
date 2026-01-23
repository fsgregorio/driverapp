import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { supabaseStudent, supabaseInstructor, supabaseAdmin, getSupabaseClient } from '../services/supabase';
import { normalizePhoto } from '../utils/photoUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Estado para múltiplas sessões - cada tipo de usuário tem sua própria sessão
  const [sessions, setSessions] = useState({
    student: null,
    instructor: null,
    admin: null
  });
  
  // Estado para o usuário ativo no contexto atual (para compatibilidade)
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const isLoggingInRef = useRef({ student: false, instructor: false, admin: false });
  const sessionsRef = useRef({ student: null, instructor: null, admin: null });

  // Helper function to transform Supabase user to app user format
  const transformUser = (supabaseUser, profile) => {
    if (!supabaseUser) return null;
    
    // Normalizar foto usando função helper
    const photo = normalizePhoto(profile?.photo_url);
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: profile?.name || '',
      phone: profile?.phone || '',
      photo: photo,
      type: profile?.user_type || 'student',
      profileComplete: profile?.profile_complete || false,
      isGoogleUser: supabaseUser.app_metadata?.provider === 'google',
      cnh: profile?.cnh || '',
      vehicle: profile?.vehicle || '',
      premium: profile?.premium || false,
      responseTime: profile?.response_time || '',
      homeService: profile?.home_service || false,
      carTypes: profile?.car_types || [],
      specialties: profile?.specialties || [],
      classTypes: profile?.class_types || []
    };
  };

  // Verifica se o perfil está completo
  const isProfileComplete = (userData) => {
    if (!userData) return false;
    const hasFullName = userData.name && userData.name.trim().split(' ').length >= 2;
    const hasPhone = userData.phone && userData.phone.length >= 10;
    const hasPhoto = !!userData.photo; // Verifica se existe foto (não null/undefined)
    
    if (userData.type === 'instructor') {
      const hasCNH = userData.cnh && userData.cnh.trim().length > 0;
      const hasVehicle = userData.vehicle && userData.vehicle.trim().length > 0;
      return hasFullName && hasPhone && hasPhoto && hasCNH && hasVehicle;
    }
    
    return hasFullName && hasPhone && hasPhoto;
  };

  // Load user profile from database usando o cliente correto
  const loadUserProfile = useCallback(async (supabaseUser, type) => {
    if (!supabaseUser || !type) {
      return null;
    }

    const client = getSupabaseClient(type);

    try {
      console.log(`Loading profile for ${type}:`, supabaseUser.id);
      
      let profile = null;
      let error = null;
      
      try {
        const queryPromise = client
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve({ data: null, error: { code: 'TIMEOUT' } }), 2000)
        );
        
        const result = await Promise.race([queryPromise, timeoutPromise]);
        profile = result.data;
        error = result.error;
        
        if (error?.code === 'TIMEOUT') {
          console.warn(`Profile query timed out for ${type} - using basic user`);
        }
      } catch (err) {
        console.warn(`Profile query exception for ${type}:`, err);
        error = err;
      }

      if (!mountedRef.current) return null;

      if (error && error.code !== 'PGRST116' && error.code !== 'TIMEOUT') {
        console.error(`Error loading profile for ${type}:`, error);
      }

      const transformedUser = transformUser(supabaseUser, profile);
      
      // IMPORTANTE: Se o tipo de login é admin, garantir que o userType seja sempre 'admin'
      // independente do que está no perfil do banco
      if (type === 'admin') {
        transformedUser.type = 'admin';
      }
      
      console.log(`User loaded for ${type}:`, transformedUser?.email, transformedUser?.type);
      
      return transformedUser;
    } catch (error) {
      console.error(`Error in loadUserProfile for ${type}:`, error);
      return transformUser(supabaseUser, null);
    }
  }, []);

  // Verificar sessões iniciais para todos os tipos
  useEffect(() => {
    mountedRef.current = true;
    let initialized = false;

    const safetyTimeout = setTimeout(() => {
      if (mountedRef.current && !initialized) {
        console.warn('Safety timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 5000);

    const checkInitialSessions = async () => {
      try {
        console.log('Checking initial sessions for all user types...');
        
        const [studentSession, instructorSession, adminSession] = await Promise.all([
          supabaseStudent.auth.getSession(),
          supabaseInstructor.auth.getSession(),
          supabaseAdmin.auth.getSession()
        ]);

        if (!mountedRef.current) return;

        const newSessions = {
          student: studentSession.data?.session?.user ? await loadUserProfile(studentSession.data.session.user, 'student') : null,
          instructor: instructorSession.data?.session?.user ? await loadUserProfile(instructorSession.data.session.user, 'instructor') : null,
          admin: adminSession.data?.session?.user ? await loadUserProfile(adminSession.data.session.user, 'admin') : null
        };

        setSessions(newSessions);
        sessionsRef.current = newSessions;
        
        // Determinar usuário ativo (prioridade: admin > instructor > student)
        const activeUser = newSessions.admin || newSessions.instructor || newSessions.student;
        setUser(activeUser);
        setUserType(activeUser?.type || null);
        
        initialized = true;
        setLoading(false);
      } catch (error) {
        console.error('Error checking initial sessions:', error);
        if (mountedRef.current) {
          initialized = true;
          setSessions({ student: null, instructor: null, admin: null });
          setUser(null);
          setUserType(null);
          setLoading(false);
        }
      }
    };

    checkInitialSessions();

    // Escutar mudanças de autenticação para cada tipo
    const subscriptions = {
      student: supabaseStudent.auth.onAuthStateChange(async (event, session) => {
        if (!mountedRef.current) return;
        console.log('Student auth event:', event, session?.user?.email || 'no user');
        
        if (isLoggingInRef.current.student && event === 'SIGNED_IN') {
          console.log('Skipping loadUserProfile - student login in progress');
          return;
        }

        if (session?.user) {
          const userData = await loadUserProfile(session.user, 'student');
          setSessions(prev => {
            const updated = { ...prev, student: userData };
            sessionsRef.current = updated;
            return updated;
          });
          // Atualizar usuário ativo se necessário
          setUser(prev => {
            const newActive = userData || prev;
            setUserType(newActive?.type || null);
            return newActive;
          });
        } else {
          setSessions(prev => {
            const updated = { ...prev, student: null };
            sessionsRef.current = updated;
            return updated;
          });
          // Se o usuário ativo era student, atualizar
          setUser(prev => {
            if (prev?.type === 'student') {
              const currentSessions = sessionsRef.current;
              const newActive = currentSessions.instructor || currentSessions.admin || null;
              setUserType(newActive?.type || null);
              return newActive;
            }
            return prev;
          });
        }
      }),
      instructor: supabaseInstructor.auth.onAuthStateChange(async (event, session) => {
        if (!mountedRef.current) return;
        console.log('Instructor auth event:', event, session?.user?.email || 'no user');
        
        if (isLoggingInRef.current.instructor && event === 'SIGNED_IN') {
          console.log('Skipping loadUserProfile - instructor login in progress');
          return;
        }

        if (session?.user) {
          const userData = await loadUserProfile(session.user, 'instructor');
          setSessions(prev => {
            const updated = { ...prev, instructor: userData };
            sessionsRef.current = updated;
            return updated;
          });
          setUser(prev => {
            const newActive = userData || prev;
            setUserType(newActive?.type || null);
            return newActive;
          });
        } else {
          setSessions(prev => {
            const updated = { ...prev, instructor: null };
            sessionsRef.current = updated;
            return updated;
          });
          setUser(prev => {
            if (prev?.type === 'instructor') {
              const currentSessions = sessionsRef.current;
              const newActive = currentSessions.student || currentSessions.admin || null;
              setUserType(newActive?.type || null);
              return newActive;
            }
            return prev;
          });
        }
      }),
      admin: supabaseAdmin.auth.onAuthStateChange(async (event, session) => {
        if (!mountedRef.current) return;
        console.log('Admin auth event:', event, session?.user?.email || 'no user');
        
        if (isLoggingInRef.current.admin && event === 'SIGNED_IN') {
          console.log('Skipping loadUserProfile - admin login in progress');
          return;
        }

        if (session?.user) {
          const userData = await loadUserProfile(session.user, 'admin');
          setSessions(prev => {
            const updated = { ...prev, admin: userData };
            sessionsRef.current = updated;
            return updated;
          });
          // Admin tem prioridade como usuário ativo
          // Garantir que quando é admin, o userType seja sempre 'admin'
          setUser(userData);
          setUserType('admin');
        } else {
          setSessions(prev => {
            const updated = { ...prev, admin: null };
            sessionsRef.current = updated;
            return updated;
          });
          setUser(prev => {
            if (prev?.type === 'admin') {
              const currentSessions = sessionsRef.current;
              const newActive = currentSessions.instructor || currentSessions.student || null;
              setUserType(newActive?.type || null);
              return newActive;
            }
            return prev;
          });
        }
      })
    };

    return () => {
      mountedRef.current = false;
      clearTimeout(safetyTimeout);
      subscriptions.student.data.subscription.unsubscribe();
      subscriptions.instructor.data.subscription.unsubscribe();
      subscriptions.admin.data.subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  // Função de login que não desloga outras sessões
  const login = async (email, password, type) => {
    console.log('Login called:', email, type);
    isLoggingInRef.current[type] = true;
    
    const client = getSupabaseClient(type);
    
    try {
      console.log(`Step 1: Calling signInWithPassword for ${type}...`);
      
      const signInPromise = client.auth.signInWithPassword({
        email,
        password,
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SIGNIN_TIMEOUT')), 10000)
      );
      
      let data, error;
      try {
        const result = await Promise.race([signInPromise, timeoutPromise]);
        data = result.data;
        error = result.error;
        console.log(`Step 2: signInWithPassword completed for ${type}`, { hasData: !!data, hasError: !!error });
      } catch (timeoutError) {
        if (timeoutError.message === 'SIGNIN_TIMEOUT') {
          console.warn(`signInWithPassword timed out for ${type}, checking if session exists...`);
          const { data: sessionData } = await client.auth.getSession();
          if (sessionData?.session?.user) {
            console.log(`Session found after timeout for ${type}, continuing...`);
            data = { user: sessionData.session.user, session: sessionData.session };
            error = null;
          } else {
            throw new Error('Login falhou. Tente novamente.');
          }
        } else {
          throw timeoutError;
        }
      }

      if (error) {
        console.error(`Login error for ${type}:`, error);
        throw error;
      }

      console.log(`Step 3: Setting user immediately with basic data for ${type}`);
      const basicUser = transformUser(data.user, { user_type: type });
      
      console.log(`Step 4: Updating state for ${type}...`);
      // Atualizar sessão específica sem afetar outras
      setSessions(prev => {
        const updated = { ...prev, [type]: basicUser };
        sessionsRef.current = updated;
        return updated;
      });
      
      // Atualizar usuário ativo (admin tem prioridade)
      if (type === 'admin' || !user) {
        setUser(basicUser);
        setUserType(type);
      }
      
      setLoading(false);
      
      console.log(`Step 5: Loading profile from database for ${type}...`);
      loadUserProfile(data.user, type).then(userData => {
        if (userData) {
          setSessions(prev => {
            const updated = { ...prev, [type]: userData };
            sessionsRef.current = updated;
            return updated;
          });
          if (type === 'admin' || !user) {
            setUser(userData);
            setUserType(userData?.type || null);
          }
        }
      }).catch(err => {
        console.warn(`Background profile load failed for ${type}:`, err);
      });
      
      console.log(`Step 6: User state updated for ${type}, returning basic user`, basicUser?.email);
      
      isLoggingInRef.current[type] = false;
      return basicUser;
    } catch (err) {
      isLoggingInRef.current[type] = false;
      throw err;
    }
  };

  const register = async (userData, type) => {
    console.log(`[Register] Starting registration for ${type} with email:`, userData.email);
    const client = getSupabaseClient(type);
    
    try {
      console.log(`[Register] Step 1: Calling signUp for ${type}...`);
      const { data, error } = await client.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) {
        console.error(`[Register] Error in signUp for ${type}:`, error);
        throw error;
      }

      if (!data || !data.user) {
        console.error(`[Register] No user data returned from signUp for ${type}`);
        throw new Error('Falha ao criar usuário. Tente novamente.');
      }

      console.log(`[Register] Step 2: User created successfully for ${type}, ID:`, data.user.id);
      
      // Verificar se o usuário precisa confirmar email
      if (!data.session && data.user) {
        console.warn(`[Register] User created but no session - email confirmation may be required`);
        // Se não há sessão, o usuário precisa confirmar o email antes de fazer login
        // Continuamos criando o perfil mesmo assim (pode ser criado pelo trigger)
      }
      console.log(`[Register] Step 3: Inserting profile for ${type}...`);

      const { error: profileError } = await client.from('profiles').insert({
        id: data.user.id,
        user_type: type,
        name: '',
        phone: '',
        photo_url: null,
        profile_complete: false,
      });

      if (profileError) {
        console.error(`[Register] Error inserting profile for ${type}:`, profileError);
        
        // Se o perfil já existe (unique violation), continuar normalmente
        if (profileError.code === '23505') {
          console.warn(`[Register] Profile already exists for ${type}, continuing...`);
        }
        // Se for erro RLS (42501), pode ser que o trigger já criou o perfil
        else if (profileError.code === '42501') {
          console.warn(`[Register] RLS error - checking if profile was created by trigger...`);
          // Aguardar um pouco para dar tempo do trigger processar
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Tentar buscar o perfil que pode ter sido criado pelo trigger
          const { data: existingProfile, error: fetchError } = await client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (existingProfile && !fetchError) {
            console.log(`[Register] Profile found (likely created by trigger), continuing...`);
          } else {
            // Se não encontrou o perfil, o problema é realmente RLS
            throw new Error(`Erro ao criar perfil: Política de segurança bloqueou a criação. Verifique as políticas RLS no Supabase.`);
          }
        }
        // Outros erros
        else {
          throw new Error(`Erro ao criar perfil: ${profileError.message || 'Erro desconhecido'}`);
        }
      } else {
        console.log(`[Register] Profile inserted successfully for ${type}`);
      }

      if (type === 'instructor') {
        console.log(`[Register] Step 4: Inserting instructor record for ${type}...`);
        const { error: instructorError } = await client.from('instructors').insert({
          id: data.user.id,
          price_per_class: 0,
          location: {},
          availability: {},
          available: false,
        });

        if (instructorError) {
          console.error(`[Register] Error inserting instructor for ${type}:`, instructorError);
          // Se o registro já existe, continuar
          if (instructorError.code !== '23505') { // 23505 = unique_violation
            throw new Error(`Erro ao criar registro de instrutor: ${instructorError.message || 'Erro desconhecido'}`);
          } else {
            console.warn(`[Register] Instructor record already exists for ${type}, continuing...`);
          }
        } else {
          console.log(`[Register] Instructor record inserted successfully for ${type}`);
        }
      }

      console.log(`[Register] Step 5: Loading user profile for ${type}...`);
      const userProfile = await loadUserProfile(data.user, type);
      
      if (!userProfile) {
        console.error(`[Register] Failed to load user profile for ${type}`);
        throw new Error('Erro ao carregar perfil do usuário. Tente fazer login novamente.');
      }

      console.log(`[Register] Step 6: Updating sessions for ${type}...`);
      setSessions(prev => {
        const updated = { ...prev, [type]: userProfile };
        sessionsRef.current = updated;
        return updated;
      });
      
      if (type === 'admin' || !user) {
        setUser(userProfile);
        setUserType(type);
      }
      
      console.log(`[Register] Registration completed successfully for ${type}`);
      return userProfile;
    } catch (error) {
      console.error(`[Register] Registration failed for ${type}:`, error);
      // Re-throw com mensagem mais amigável se necessário
      if (error.message) {
        throw error;
      }
      throw new Error(`Erro ao criar conta: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const loginWithGoogle = async (type) => {
    const client = getSupabaseClient(type);
    
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard/${type === 'student' ? 'aluno' : 'instrutor'}`,
      },
    });

    if (error) {
      if (error.message?.includes('not enabled') || error.message?.includes('Unsupported provider')) {
        throw new Error('O login com Google não está habilitado.');
      }
      throw error;
    }

    return data;
  };

  const completeProfile = async (profileData) => {
    if (!user) throw new Error('No user logged in');

    const client = getSupabaseClient(user.type);

    const updateData = {
      name: profileData.name,
      phone: profileData.phone,
      photo_url: profileData.photo_url || null, // null se não houver foto
      profile_complete: true,
      updated_at: new Date().toISOString(),
    };

    if (user.type === 'instructor') {
      updateData.cnh = profileData.cnh || '';
      updateData.vehicle = profileData.vehicle || '';
      updateData.premium = profileData.premium || false;
      updateData.response_time = profileData.responseTime || '';
      updateData.home_service = profileData.homeService || false;
      updateData.car_types = profileData.carTypes || [];
      updateData.specialties = profileData.specialties || [];
      updateData.class_types = profileData.classTypes || [];
    }

    const { error } = await client
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) throw error;

    const { data: supabaseUser } = await client.auth.getUser();
    if (supabaseUser?.user) {
      const updatedUser = await loadUserProfile(supabaseUser.user, user.type);
      setSessions(prev => {
        const updated = { ...prev, [user.type]: updatedUser };
        sessionsRef.current = updated;
        return updated;
      });
      setUser(updatedUser);
    }

    return user;
  };

  // Logout apenas do tipo específico, sem afetar outras sessões
  const logout = async (type = null) => {
    console.log('Logout called for type:', type || 'all');
    
    if (type) {
      // Logout apenas do tipo específico
      const client = getSupabaseClient(type);
      await client.auth.signOut();
      setSessions(prev => ({ ...prev, [type]: null }));
      
      // Se o usuário ativo era desse tipo, atualizar
      setUser(prev => {
        if (prev?.type === type) {
          const currentSessions = sessionsRef.current;
          const remainingSessions = { ...currentSessions, [type]: null };
          const newActive = remainingSessions.admin || remainingSessions.instructor || remainingSessions.student || null;
          setUserType(newActive?.type || null);
          return newActive;
        }
        return prev;
      });
    } else {
      // Logout de todos os tipos
      await Promise.all([
        supabaseStudent.auth.signOut(),
        supabaseInstructor.auth.signOut(),
        supabaseAdmin.auth.signOut()
      ]);
      setSessions({ student: null, instructor: null, admin: null });
      setUser(null);
      setUserType(null);
    }
  };

  const resetPassword = async (email) => {
    // Usar cliente padrão para reset de senha
    const { error } = await supabaseStudent.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return { success: true };
  };

  // Função helper para verificar se um tipo específico está autenticado
  const isAuthenticatedAs = (type) => {
    return !!sessions[type];
  };

  // Função helper para obter usuário de um tipo específico
  const getUserByType = (type) => {
    return sessions[type] || null;
  };

  const profileComplete = isProfileComplete(user);

  const value = {
    user,
    userType,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    completeProfile,
    isAuthenticated: !!user,
    isProfileComplete: profileComplete,
    // Novas funções para múltiplas sessões
    sessions,
    isAuthenticatedAs,
    getUserByType,
    // Função para mudar o usuário ativo no contexto
    setActiveUser: (type) => {
      const activeUser = sessions[type];
      if (activeUser) {
        setUser(activeUser);
        setUserType(activeUser.type);
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
