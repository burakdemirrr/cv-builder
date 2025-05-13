import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CV = {
  id: string;
  user_id: string;
  title: string;
  content: CVContent;
  template: string;
  created_at: string;
  updated_at: string;
};

export type CVContent = {
  sections: CVSection[];
};

export type CVSection = {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'summary' | 'contact';
  title: string;
  content: any;
}; 