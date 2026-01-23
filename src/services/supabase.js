import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://odmwardaafuvbusmrseq.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kbXdhcmRhYWZ1dmJ1c21yc2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1Njg5NDYsImV4cCI6MjA4NDE0NDk0Nn0.XTOHO5I5jIXXWD0n5g9w7FGUWUspHwZ-_UK43G8Qx0I';

// Função para criar uma instância do Supabase com storage key específico
const createSupabaseClient = (storageKey) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: storageKey, // Cada tipo de usuário terá seu próprio storage
      storage: window.localStorage
    }
  });
};

// Instâncias separadas para cada tipo de usuário
export const supabase = createSupabaseClient('sb-auth-token'); // Instância padrão (compatibilidade)
export const supabaseStudent = createSupabaseClient('sb-auth-token-student');
export const supabaseInstructor = createSupabaseClient('sb-auth-token-instructor');
export const supabaseAdmin = createSupabaseClient('sb-auth-token-admin');

// Função helper para obter a instância correta baseada no tipo
export const getSupabaseClient = (userType) => {
  switch (userType) {
    case 'student':
      return supabaseStudent;
    case 'instructor':
      return supabaseInstructor;
    case 'admin':
      return supabaseAdmin;
    default:
      return supabase;
  }
};

export default supabase;
