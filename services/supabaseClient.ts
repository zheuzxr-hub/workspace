
import { createClient } from '@supabase/supabase-js';

// Verificação de segurança para evitar erro de inicialização caso as variáveis não estejam no ambiente
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
