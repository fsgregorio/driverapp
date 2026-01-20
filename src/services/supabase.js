import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://odmwardaafuvbusmrseq.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kbXdhcmRhYWZ1dmJ1c21yc2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1Njg5NDYsImV4cCI6MjA4NDE0NDk0Nn0.XTOHO5I5jIXXWD0n5g9w7FGUWUspHwZ-_UK43G8Qx0I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;
