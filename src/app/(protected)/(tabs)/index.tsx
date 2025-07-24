import { StyleSheet, View, FlatList } from 'react-native';
import React from 'react';
import PostListItem from '../../../components/PostListItem';
import posts from '../../../../assets/data/posts.json';
const HomeScreen = () => {
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
