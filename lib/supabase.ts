
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

/**
 * Verifica se o Supabase está configurado corretamente.
 */
export const isSupabaseConfigured = () => {
  return supabaseUrl.trim().length > 0 && supabaseAnonKey.trim().length > 0;
};

/**
 * Inicializa o cliente apenas se os parâmetros forem válidos.
 * Caso contrário, exporta null para evitar o erro "supabaseUrl is required".
 */
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
