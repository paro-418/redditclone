import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TablesInsert } from '../types/database.types';

export const fetchComments = async (
  supabaseNew: SupabaseClient<Database>,
  postId: string
) => {
  const { data, error } = await supabaseNew
    .from('comments')
    .select('*,replies:comments(*)')
    .eq('post_id', postId)
    .is('parent_id', null);

  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};
export const fetchCommentReplies = async (
  supabaseNew: SupabaseClient<Database>,
  parentId: string
) => {
  const { data, error } = await supabaseNew
    .from('comments')
    .select('*,replies:comments(*)')
    .eq('parent_id', parentId);

  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};

export const insertComment = async (
  supabaseNew: SupabaseClient<Database>,
  newComment: TablesInsert<'comments'>
) => {
  const { data, error } = await supabaseNew
    .from('comments')
    .insert(newComment)
    .select()
    .single();
  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};

export const deleteComment = async (
  supabaseNew: SupabaseClient<Database>,
  id: string
) => {
  // console.log('delete comment', id);
  const { data, error } = await supabaseNew
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};
