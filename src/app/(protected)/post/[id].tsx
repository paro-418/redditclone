import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import posts from '../../../../assets/data/posts.json';
import PostListItem from '../../../components/PostListItem';

const PostDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const detailedPosts = posts.find((post) => post.id === id);

  if (!detailedPosts) {
    return <Text>Post not found!</Text>;
  }

  return (
    <View>
      <PostListItem post={detailedPosts} isDetailedPost />
    </View>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({});
