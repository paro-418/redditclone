import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TablesInsert } from '../types/database.types';

type InsertPost = TablesInsert<'posts'>;

export const fetchPosts = async (supabaseNew: SupabaseClient<Database>) => {
  const { data, error } = await supabaseNew
    .from('posts')
    .select('*, group:groups(*),upvotes(count)')
    // .select('*, group:groups(*), user:users!posts_user_id_fkey(*)')
    .order('created_at', { ascending: false });
  // console.log('ALL POSTS', data);
  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};

export const fetchPostById = async (
  supabaseNew: SupabaseClient<Database>,
  id: string
) => {
  const { data, error } = await supabaseNew
    .from('posts')
    .select('*, group:groups(*), upvotes(count)')
    .eq('id', id)
    .single();

  console.log('FOUND POST:', data);
  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};

// FETCH POST UPVOTES COUNT FOR SPECIFIC POST USING DATABASE FUNCTION
// export const fetchPostUpvotes = async (
//   supabaseNew: SupabaseClient<Database>,
//   id: string
// ) => {
//   const { data, error } = await supabaseNew.rpc('get_post_upvotes_sum', {
//     post_id_param: id,
//   });

//   // console.log('FOUND POST UPVOTES:', data, id);
//   if (error) {
//     console.log('error', error);
//     throw error;
//   } else return data;
// };

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

export const deletePostById = async (
  supabaseNew: SupabaseClient<Database>,
  id: string
) => {
  const { data, error } = await supabaseNew.from('posts').delete().eq('id', id);
  if (error) {
    console.log('deleting error -> ', error);
  } else return data;
};
