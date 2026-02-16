
import { createClient } from '@supabase/supabase-js';

// Credenciais fornecidas para integração
const supabaseUrl = 'https://exlymmwemvhudgkbzwwv.supabase.co';
const supabaseAnonKey = 'sb_publishable_w56stOOmKTiEmXwm6SOHmA_IHncL-uA';

export const isConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
