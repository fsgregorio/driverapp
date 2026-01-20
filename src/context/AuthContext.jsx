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
  const [userType, setUserType] = useState(null); // 'student' or 'instructor'
  const mountedRef = useRef(true);
  const loadingProfileRef = useRef(false);

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
      // Instructor-specific fields
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
    // Verifica se tem nome completo (não apenas nome simples), telefone e foto
    const hasFullName = userData.name && userData.name.trim().split(' ').length >= 2;
    const hasPhone = userData.phone && userData.phone.length >= 10;
    const hasPhoto = userData.photo && userData.photo !== '/imgs/users/image.png';
    
    // Para instrutor, também verificar campos específicos
    if (userData.type === 'instructor') {
      const hasCNH = userData.cnh && userData.cnh.trim().length > 0;
      const hasVehicle = userData.vehicle && userData.vehicle.trim().length > 0;
      return hasFullName && hasPhone && hasPhoto && hasCNH && hasVehicle;
    }
    
    return hasFullName && hasPhone && hasPhoto;
  };

  // Load user profile from database
  const loadUserProfile = useCallback(async (supabaseUser) => {
    // Prevent multiple simultaneous calls
    if (loadingProfileRef.current) {
      return;
    }

    if (!supabaseUser) {
      if (!mountedRef.current) return;
      setUser(null);
      setUserType(null);
      setLoading(false);
      return;
    }

    loadingProfileRef.current = true;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (!mountedRef.current) return;

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
      }

      const transformedUser = transformUser(supabaseUser, profile);
      console.log('Transformed user:', {
        id: transformedUser?.id,
        email: transformedUser?.email,
        type: transformedUser?.type,
        profileComplete: transformedUser?.profileComplete,
        name: transformedUser?.name
      });
      
      if (mountedRef.current) {
        setUser(transformedUser);
        setUserType(transformedUser?.type || null);
        console.log('User state updated in AuthContext');
      }
    } catch (error) {
      // Ignore abort errors (common in React Strict Mode)
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        return;
      }
      if (mountedRef.current) {
        console.error('Error in loadUserProfile:', error);
        setUser(null);
        setUserType(null);
      }
    } finally {
      loadingProfileRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isInitialized = false;
    mountedRef.current = true;
    loadingProfileRef.current = false;

    // Prevent double execution in React Strict Mode
    const initAuth = async () => {
      if (isInitialized) return;
      isInitialized = true;

      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;
        
        if (error) {
          // Ignore abort errors silently
          if (error.name === 'AbortError' || error.message?.includes('aborted')) {
            return;
          }
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        // Ignore abort errors silently
        if (error.name === 'AbortError' || error.message?.includes('aborted')) {
          return;
        }
        if (mountedRef.current) {
          console.error('Error getting session:', error);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event, { hasSession: !!session, hasUser: !!session?.user });
      if (!mountedRef.current) return;
      try {
        if (session?.user) {
          console.log('Loading user profile from auth state change...');
          await loadUserProfile(session.user);
          console.log('User profile loaded from auth state change');
        } else {
          console.log('No session, clearing user state');
          setUser(null);
          setUserType(null);
          setLoading(false);
        }
      } catch (error) {
        // Ignore abort errors silently
        if (error.name === 'AbortError' || error.message?.includes('aborted')) {
          return;
        }
        console.error('Error in auth state change:', error);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const login = async (email, password, type) => {
    console.log('AuthContext.login called', { email, type });
    try {
      console.log('Calling supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase response', { data: data ? 'has data' : 'no data', error });

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }

      if (!mountedRef.current) {
        throw new Error('Component unmounted');
      }

      // Check if profile exists and matches user_type
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!mountedRef.current) {
        throw new Error('Component unmounted');
      }

      if (profile && profile.user_type !== type) {
        await supabase.auth.signOut();
        throw new Error(`Este email está cadastrado como ${profile.user_type === 'student' ? 'aluno' : 'instrutor'}`);
      }

      // If no profile exists, create one
      let finalProfile = profile;
      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            user_type: type,
            profile_complete: false,
          });

        if (insertError) throw insertError;
        
        // Reload profile after creation
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        finalProfile = newProfile;
      }

      if (!mountedRef.current) {
        throw new Error('Component unmounted');
      }

      console.log('Loading user profile...', { userId: data.user.id });
      await loadUserProfile(data.user);
      console.log('User profile loaded');
      
      // Wait a bit to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return transformUser(data.user, finalProfile);
    } catch (error) {
      // Ignore abort errors (common in React Strict Mode)
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Operação cancelada. Por favor, tente novamente.');
      }
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData, type) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw error;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          user_type: type,
          name: '',
          phone: '',
          photo_url: '/imgs/users/image.png',
          profile_complete: false,
        });

      if (profileError) throw profileError;

      // If instructor, create instructor record
      if (type === 'instructor') {
        const { error: instructorError } = await supabase
          .from('instructors')
          .insert({
            id: data.user.id,
            price_per_class: 0,
            location: {},
            availability: {},
            available: false,
          });

        if (instructorError) console.error('Error creating instructor record:', instructorError);
      }

      await loadUserProfile(data.user);
      return transformUser(data.user, { user_type: type, profile_complete: false });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (type) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard/${type === 'student' ? 'aluno' : 'instrutor'}`,
        },
      });

      if (error) {
        // Tratamento específico para erro de provedor não habilitado
        if (error.error_code === 'validation_failed' || 
            error.message?.includes('not enabled') || 
            error.message?.includes('Unsupported provider') ||
            error.msg?.includes('not enabled')) {
          const customError = new Error('O login com Google não está habilitado. Por favor, configure o provedor Google no painel do Supabase. Consulte o arquivo docs/CONFIGURAR_GOOGLE_OAUTH.md para instruções detalhadas.');
          customError.code = 'PROVIDER_NOT_ENABLED';
          customError.originalError = error;
          throw customError;
        }
        throw error;
      }

      // Note: OAuth redirect will happen, so we'll handle the profile creation
      // in the auth state change listener when user returns
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const completeProfile = async (profileData) => {
    if (!user) throw new Error('No user logged in');

    try {
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        photo_url: profileData.photo || user.photo,
        profile_complete: true,
        updated_at: new Date().toISOString(),
      };

      // Add instructor-specific fields if user is instructor
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

      // Reload user profile
      const { data: supabaseUser } = await supabase.auth.getUser();
      if (supabaseUser?.user) {
        await loadUserProfile(supabaseUser.user);
      }

      return user;
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear local state first to prevent any race conditions
      setUser(null);
      setUserType(null);
      setLoading(false);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        // Even if there's an error, state is already cleared
      }
      
      // Return a resolved promise to ensure logout completes
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear local state
      setUser(null);
      setUserType(null);
      setLoading(false);
      // Don't throw error, just resolve to allow navigation
      return Promise.resolve();
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const profileComplete = isProfileComplete(user);
  console.log('AuthContext value calculation', {
    hasUser: !!user,
    isAuthenticated: !!user,
    isProfileComplete: profileComplete,
    userProfileComplete: user?.profileComplete,
    userName: user?.name,
    userPhone: user?.phone,
    userPhoto: user?.photo
  });

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
