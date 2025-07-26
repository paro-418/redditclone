import { supabase } from '../lib/supabase';

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, group:groups(*), user:users!posts_user_id_fkey(*)');

  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};

export const fetchPostById = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, group:groups(*), user:users!posts_user_id_fkey(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};
