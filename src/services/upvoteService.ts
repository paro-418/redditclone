import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

export const createUpvote = async (
  supabaseNew: SupabaseClient<Database>,
  user_id: string,
  post_id: string,
  upvoteValue: 1 | -1
) => {
  console.log('vote function called');
  const { data, error } = await supabaseNew
    .from('upvotes')
    .upsert({
      post_id,
      upvoteValue,
      user_id,
    })
    .select()
    .single();

  if (error) throw error;
  else return data;
};

export const selectMyVote = async (
  supabaseNew: SupabaseClient<Database>,
  user_id: string,
  post_id: string
) => {
  const { data, error } = await supabaseNew
    .from('upvotes')
    .select('*')
    .eq('post_id', post_id)
    .eq('user_id', user_id)
    .single();

  // console.log('myVote', data);
  if (error) throw error;
  else return data;
};
