import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const mountedRef = useRef(true);
  const isLoggingInRef = useRef(false);

  // Helper function to transform Supabase user to app user format
  const transformUser = (supabaseUser, profile) => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: profile?.name || '',
      phone: profile?.phone || '',
      photo: profile?.photo_url || '/imgs/users/image.png',
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
    const hasPhoto = userData.photo && userData.photo !== '/imgs/users/image.png';
    
    if (userData.type === 'instructor') {
      const hasCNH = userData.cnh && userData.cnh.trim().length > 0;
      const hasVehicle = userData.vehicle && userData.vehicle.trim().length > 0;
      return hasFullName && hasPhone && hasPhoto && hasCNH && hasVehicle;
    }
    
    return hasFullName && hasPhone && hasPhoto;
  };

  // Load user profile from database
  const loadUserProfile = useCallback(async (supabaseUser) => {
    if (!supabaseUser) {
      if (mountedRef.current) {
        setUser(null);
        setUserType(null);
        setLoading(false);
      }
      return null;
    }

    try {
      console.log('Loading profile for user:', supabaseUser.id);
      
      // Tentar buscar perfil, mas não travar se demorar
      let profile = null;
      let error = null;
      
      try {
        // Usar Promise.race com timeout
        const queryPromise = supabase
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
          console.warn('Profile query timed out - using basic user');
        }
      } catch (err) {
        console.warn('Profile query exception:', err);
        error = err;
      }

      if (!mountedRef.current) return null;

      if (error && error.code !== 'PGRST116' && error.code !== 'TIMEOUT') {
        console.error('Error loading profile:', error);
      }

      const transformedUser = transformUser(supabaseUser, profile);
      console.log('User loaded:', transformedUser?.email, transformedUser?.type);
      
      if (mountedRef.current) {
        setUser(transformedUser);
        setUserType(transformedUser?.type || null);
        setLoading(false);
      }
      
      return transformedUser;
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      if (mountedRef.current) {
        const basicUser = transformUser(supabaseUser, null);
        setUser(basicUser);
        setUserType(basicUser?.type || null);
        setLoading(false);
        return basicUser;
      }
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    mountedRef.current = true;
    let initialized = false;

    // Timeout de segurança - garante que loading seja false após 5 segundos
    const safetyTimeout = setTimeout(() => {
      if (mountedRef.current && !initialized) {
        console.warn('Safety timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 5000);

    // Verificação inicial da sessão
    const checkInitialSession = async () => {
      try {
        console.log('Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('getSession error:', error);
          throw error;
        }
        
        if (!mountedRef.current) return;
        
        initialized = true;
        
        if (session?.user) {
          console.log('Initial session found:', session.user.email);
          await loadUserProfile(session.user);
        } else {
          console.log('No initial session found');
          setUser(null);
          setUserType(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking initial session:', error);
        if (mountedRef.current) {
          initialized = true;
          setUser(null);
          setUserType(null);
          setLoading(false);
        }
      }
    };

    // Verificar sessão inicial imediatamente
    checkInitialSession();

    // Escutar mudanças de autenticação do Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email || 'no user');
        
        if (!mountedRef.current) return;
        
        initialized = true;

        if (session?.user) {
          // Se estamos no meio de um login, não fazer nada - o login vai setar o estado
          if (isLoggingInRef.current) {
            console.log('Skipping loadUserProfile - login in progress');
            return;
          }
          // Carregar perfil em background sem bloquear
          // Não usar await - deixar rodar em background
          loadUserProfile(session.user).catch(err => {
            console.warn('Background profile load failed:', err);
            // Não fazer nada - já temos o usuário básico do login
          });
        } else {
          setUser(null);
          setUserType(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mountedRef.current = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const login = async (email, password, type) => {
    console.log('Login called:', email, type);
    isLoggingInRef.current = true;
    
    try {
      console.log('Step 1: Calling signInWithPassword...');
      
      // Usar Promise.race com timeout para evitar travamento
      const signInPromise = supabase.auth.signInWithPassword({
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
        console.log('Step 2: signInWithPassword completed', { hasData: !!data, hasError: !!error });
      } catch (timeoutError) {
        if (timeoutError.message === 'SIGNIN_TIMEOUT') {
          console.warn('signInWithPassword timed out, checking if session exists...');
          // Verificar se o login aconteceu mesmo assim (via onAuthStateChange)
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            console.log('Session found after timeout, continuing...');
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
        console.error('Login error:', error);
        throw error;
      }

      console.log('Step 3: Setting user immediately with basic data');
      // Definir usuário imediatamente para que isAuthenticated seja true
      const basicUser = transformUser(data.user, { user_type: type });
      
      console.log('Step 4: Updating state...');
      // Atualizar estado imediatamente para permitir redirecionamento
      setUser(basicUser);
      setUserType(type);
      setLoading(false);
      
      console.log('Step 5: User state updated, returning basic user', basicUser?.email);
      console.log('Step 6: Login function completed, should redirect now');
      
      isLoggingInRef.current = false;
      return basicUser;
    } catch (err) {
      isLoggingInRef.current = false;
      throw err;
    }
  };

  const register = async (userData, type) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;

    await supabase.from('profiles').insert({
      id: data.user.id,
      user_type: type,
      name: '',
      phone: '',
      photo_url: '/imgs/users/image.png',
      profile_complete: false,
    });

    if (type === 'instructor') {
      await supabase.from('instructors').insert({
        id: data.user.id,
        price_per_class: 0,
        location: {},
        availability: {},
        available: false,
      });
    }

    await loadUserProfile(data.user);
    return transformUser(data.user, { user_type: type, profile_complete: false });
  };

  const loginWithGoogle = async (type) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
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

    const updateData = {
      name: profileData.name,
      phone: profileData.phone,
      photo_url: profileData.photo || user.photo,
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

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) throw error;

    const { data: supabaseUser } = await supabase.auth.getUser();
    if (supabaseUser?.user) {
      await loadUserProfile(supabaseUser.user);
    }

    return user;
  };

  const logout = async () => {
    console.log('Logout called');
    // Limpar estado local primeiro
    setUser(null);
    setUserType(null);
    // Fazer logout no Supabase (vai disparar SIGNED_OUT)
    await supabase.auth.signOut();
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return { success: true };
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
