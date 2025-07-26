import { StyleSheet, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostListItem from '../../../components/PostListItem';
// import posts from '../../../../assets/data/posts.json';

import { supabase } from '../../../lib/supabase';
import { Tables } from '../../../types/database.types';

export type PostWithGroupAndUsers = Tables<'posts'> & {
  user: Tables<'users'>;
  group: Tables<'groups'>;
};

const HomeScreen = () => {
  const [posts, setPosts] = useState<PostWithGroupAndUsers[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, group:groups(*), user:users!posts_user_id_fkey(*)');
    console.log('error', error);
    console.log('data', JSON.stringify(data));

    if (error) {
      console.log('error', error);
    } else setPosts(data);
  };
  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({ item: post }) => <PostListItem post={post} />}
        keyExtractor={({ id }) => id}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
