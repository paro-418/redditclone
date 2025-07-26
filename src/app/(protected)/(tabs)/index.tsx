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

const HomeScreen = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => await fetchPosts(),
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
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
