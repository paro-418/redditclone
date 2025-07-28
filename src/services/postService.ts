import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database, TablesInsert } from '../types/database.types';
type InsertPost = TablesInsert<'posts'>;

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, group:groups(*)')
    // .select('*, group:groups(*), user:users!posts_user_id_fkey(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};

export const fetchPostById = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, group:groups(*)')
    // .select('*, group:groups(*), user:users!posts_user_id_fkey(*)')
    .eq('id', id)
    .single();

  console.log('FOUND POST:', data);
  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};

export const insertPost = async (
  supabaseNew: SupabaseClient<Database>,
  post: InsertPost
) => {
  const { data, error } = await supabaseNew
    .from('posts')
    .insert(post)
    .select()
    .single();
  if (error) {
    console.log('INSERT ERROR', error);
    throw error;
  } else return data;
};
