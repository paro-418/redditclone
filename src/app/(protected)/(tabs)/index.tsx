import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import React from 'react';
import PostListItem from '../../../components/PostListItem';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../../services/postService';
import { useClerkSupabase } from '../../../lib/supabase';

const HomeScreen = () => {
  const supabaseNew = useClerkSupabase();
  const {
    data: posts,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => await fetchPosts(supabaseNew),
    staleTime: 5000,
  });

  if (isLoading) {
    return <ActivityIndicator />;
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
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
