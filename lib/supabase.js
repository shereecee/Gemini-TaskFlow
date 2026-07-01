import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sdpuvcneuikkjdxrkxwr.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcHV2Y25ldWlra2pkeHJreHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDUwMzcsImV4cCI6MjA5NzY4MTAzN30.b761deMIHe51eYVjm1S9nq00kQAdIRV4ua9JE8rynHg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);