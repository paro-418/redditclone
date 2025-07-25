import {
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
import { useLocalSearchParams } from 'expo-router';
import posts from '../../../../assets/data/posts.json';
import PostListItem from '../../../components/PostListItem';
import comments from '../../../../assets/data/comments.json';
import CommentListItem from '../../../components/CommentListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PostDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [comment, setComment] = useState<string>('');
  const detailedPosts = posts.find((post) => post.id === id);
  const postComments = comments.filter(
    (comment) => comment.post_id === 'post-1'
  );
  const [isInputFocused, setInputFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);
  const insets = useSafeAreaInsets();

  const handleReplyButtonPressed = useCallback((commentId: string) => {
    inputRef.current?.focus();
  }, []);

  if (!detailedPosts) {
    return <Text>Post not found!</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: 'white', flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top + 10}
    >
      <FlatList
        data={postComments}
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
