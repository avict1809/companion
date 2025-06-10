import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const superbaseUrl = "https://ipbwlyykvjelunayqkzx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwYndseXlrdmplbHVuYXlxa3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTc4NDUsImV4cCI6MjA2NTA3Mzg0NX0.4MaH6s04usi46m0v-f0ddYNJuS_JOifMT3N8RjSZHAk"

export const supabase = createClient(superbaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    },
})