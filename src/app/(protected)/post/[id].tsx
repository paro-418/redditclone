import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useRef, useState, useCallback } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import PostListItem from '../../../components/PostListItem';
import CommentListItem from '../../../components/CommentListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deletePostById,
  fetchComments,
  fetchPostById,
} from '../../../services/postService';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useClerkSupabase } from '../../../lib/supabase';

const PostDetailsScreen = () => {
  const supabaseNew = useClerkSupabase();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: detailedPosts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['posts', id],
    queryFn: async () => await fetchPostById(supabaseNew, id),
    staleTime: 3000,
  });

  const {
    data: comments,
    error: errorComments,
    isLoading: isCommentLoading,
  } = useQuery({
    queryKey: ['comments', { post_id: id }],
    queryFn: async () => await fetchComments(supabaseNew, id),
    staleTime: 3000,
  });

  // console.log('comments', JSON.stringify(comments, null, 2));
  const {
    mutate: deletePost,
    data,
    error: deleteError,
  } = useMutation({
    mutationFn: () => deletePostById(supabaseNew, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      router.back();
    },
    onError: (error) => {
      console.log('error', error);
      Alert.alert('Failed to delete', error.message);
    },
  });

  const [comment, setComment] = useState<string>('');

  const [isInputFocused, setInputFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);
  const insets = useSafeAreaInsets();

  const handleReplyButtonPressed = useCallback((commentId: string) => {
    inputRef.current?.focus();
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error || !detailedPosts) {
    return <Text>Post not found!</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: 'white', flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top + 10}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 12, marginRight: 10 }}>
              <Entypo
                name='trash'
                size={24}
                color={'white'}
                onPress={() => deletePost()}
              />
              <AntDesign name='search1' size={24} color={'white'} />
              <MaterialIcons name='sort' size={24} color={'white'} />
              <Entypo name='dots-three-horizontal' size={24} color={'white'} />
            </View>
          ),
        }}
      />
      <FlatList
        data={comments}
        renderItem={({ item: comment }) => (
          <CommentListItem
            comment={comment}
            depth={0}
            handleReplyButtonPressed={handleReplyButtonPressed}
          />
        )}
        ListHeaderComponent={
          <PostListItem post={detailedPosts} isDetailedPost />
        }
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ paddingBottom: 64 }}
      />

      {/* Input Container */}
      <View
        style={{
          paddingBottom: insets.bottom + 10,
          borderTopWidth: 1,
          borderTopColor: 'lightgray',
          padding: 10,
          backgroundColor: 'white',
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder='Join the conversation'
          style={{
            backgroundColor: '#e4e4e4',
            padding: 12,
            borderRadius: 3,
            minHeight: 40,
          }}
          value={comment}
          onChangeText={setComment}
          multiline
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
        {isInputFocused && (
          <Pressable
            style={{
              backgroundColor: '#0d469b',
              borderRadius: 20,
              marginLeft: 'auto',
              marginTop: 10,
              opacity: isInputFocused || comment.length > 0 ? 1 : 0,
              transform: [
                { scale: isInputFocused || comment.length > 0 ? 1 : 0.95 },
              ],
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              Reply
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({});
