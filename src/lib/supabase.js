import { createClient } from '@supabase/supabase-js'

// Same Supabase project used by the Admin Console (index.html)
const SB_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ywqxavamlhgdwzfhlreo.supabase.co'
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3cXhhdmFtbGhnZHd6ZmhscmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTE2MzUsImV4cCI6MjA5MTEyNzYzNX0.FypHLEqFVMKMLSdDOZiJaeijgbqaHmiVlZ3aTa091XY'

export const supabase = createClient(SB_URL, SB_KEY)
