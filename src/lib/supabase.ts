import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { useAuth } from '@clerk/clerk-expo';
import { useMemo } from 'react';

const supabaseURL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseURL, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const useClerkSupabase = () => {
  const { getToken, isSignedIn } = useAuth();

  const supabaseClient = useMemo(() => {
    if (!isSignedIn) throw Error('User not signed in');

    return createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      {
        accessToken: async () => {
          const token = await getToken();
          // console.log('GOT TOKEN', token);
          return token;
        },
      }
    );
  }, [getToken, isSignedIn]);

  return supabaseClient;
};

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else supabase.auth.stopAutoRefresh();
});
