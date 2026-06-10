/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Vite sử dụng import.meta.env thay vì process.env. Cung cấp URL dự phòng để không sập UI.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
