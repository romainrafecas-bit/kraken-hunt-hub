import { createClient } from '@supabase/supabase-js';

const EXTERNAL_SUPABASE_URL = "https://yfzpohbfliyfibuajkwr.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmenBvaGJmbGl5ZmlidWFqa3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjI4OTMsImV4cCI6MjA4OTMzODg5M30.e1Y8930-GFgrHBEdMYmgX112a8k2VpY79JfJhTYNS5I";

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
