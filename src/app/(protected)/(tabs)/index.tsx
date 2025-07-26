import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import PostListItem from '../../../components/PostListItem';
// import posts from '../../../../assets/data/posts.json';

import { supabase } from '../../../lib/supabase';
import { Tables } from '../../../types/database.types';
import { useQuery } from '@tanstack/react-query';

 type PostWithGroupAndUsers = Tables<'posts'> & {
  user: Tables<'users'>;
  group: Tables<'groups'>;
};

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, group:groups(*), user:users!posts_user_id_fkey(*)');

  if (error) {
    console.log('error', error);
    throw error;
  } else return data;
};

const HomeScreen = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => await fetchPosts(),
  });

  if (isLoading) {
    <ActivityIndicator />;
  }
  if (error) {
    return <Text>Error fetching posts</Text>;
  }
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
