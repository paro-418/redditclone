import { Image, Pressable, Text, View, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatDistanceToNowStrict } from 'date-fns';
import { Link } from 'expo-router';
import { Tables } from '../types/database.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUpvote, selectMyVote } from '../services/upvoteService';
import { useClerkSupabase } from '../lib/supabase';
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { downloadImage } from '../utils/imageStorage';
import SupabaseImage from './SupabaseImage';

type Post = Tables<'posts'> & {
  user: Tables<'users'>;
  group: Tables<'groups'>;
  upvotes: { sum: number }[];
  nr_of_comments: { count: number }[];
};

type PostListItemProps = {
  post: Post;
  isDetailedPost?: boolean;
};

export default function PostListItem({
  post,
  isDetailedPost,
}: PostListItemProps) {
  // console.log('post', post);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const supabaseNew = useClerkSupabase();
  const {
    mutate: upVote,
    data,
    error,
  } = useMutation({
    mutationFn: (value: 1 | -1) => {
      if (!user || !user?.id) Alert.alert('User must logged in to upvote');
      return createUpvote(supabaseNew, user?.id!, post.id, value);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });
  const { data: myUpvote, error: myUpvoteError } = useQuery({
    queryFn: () => {
      if (!user || !user?.id) Alert.alert('User must logged in to upvote');
      return selectMyVote(supabaseNew, user?.id!, post.id);
    },
    queryKey: ['posts', post.id, 'my-upvote'],
  });

  // console.log('myUpvote', myUpvote);
  const isUpVoted = myUpvote?.upvoteValue === 1;
  const isDownVoted = myUpvote?.upvoteValue === -1;
  const shouldShowImage = isDetailedPost || post.image;
  const shouldShowDescription = isDetailedPost || !post.image;
  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          gap: 7,
          borderBottomColor: 'lightgrey',
          borderBottomWidth: 0.5,
          backgroundColor: 'white',
        }}
      >
        {/* HEADER */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: post.group.image || '' }}
            style={{ width: 20, height: 20, borderRadius: 10, marginRight: 5 }}
          />
          <View>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Text
                style={{ fontWeight: 'bold', fontSize: 13, color: '#3A3B3C' }}
              >
                {post.group.name}
              </Text>
              <Text
                style={{ color: 'grey', fontSize: 13, alignSelf: 'flex-start' }}
              >
                {post.created_at &&
                  formatDistanceToNowStrict(new Date(post.created_at))}
              </Text>
            </View>
            {isDetailedPost && (
              <Text style={{ fontSize: 13, color: '#2E5DAA' }}>
                {post?.user?.name}
              </Text>
            )}
          </View>
          <Pressable
            onPress={() => console.error('Pressed')}
            style={{
              marginLeft: 'auto',
              backgroundColor: '#0d469b',
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingVertical: 2,
                paddingHorizontal: 7,
                fontWeight: 'bold',
                fontSize: 13,
              }}
            >
              Join
            </Text>
          </Pressable>
        </View>

        {/* CONTENT */}
        <Text style={{ fontWeight: 'bold', fontSize: 17, letterSpacing: 0.5 }}>
          {post.title}
        </Text>
        {shouldShowImage && post.image && (
          // <Image
          //   source={{ uri: postImage }}
          //   style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 15 }}
          // />
          <SupabaseImage
            path={post.image}
            bucket='images'
            style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 15 }}
          />
        )}

        {shouldShowDescription && post.description && (
          <Text numberOfLines={isDetailedPost ? undefined : 4}>
            {post.description}
          </Text>
        )}

        {/* FOOTER */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[{ flexDirection: 'row' }, styles.iconBox]}>
              <MaterialCommunityIcons
                name='arrow-up-bold-outline'
                size={19}
                color={isUpVoted ? 'crimson' : 'black'}
                onPress={() => upVote(1)}
              />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 5,
                  alignSelf: 'center',
                }}
              >
                {post?.upvotes[0]?.sum}
              </Text>
              <View
                style={{
                  width: 1,
                  backgroundColor: '#D4D4D4',
                  height: 14,
                  marginHorizontal: 7,
                  alignSelf: 'center',
                }}
              />
              <MaterialCommunityIcons
                name='arrow-down-bold-outline'
                size={19}
                color={isDownVoted ? 'crimson' : 'black'}
                onPress={() => upVote(-1)}
              />
            </View>
            <View style={[{ flexDirection: 'row' }, styles.iconBox]}>
              <MaterialCommunityIcons
                name='comment-outline'
                size={19}
                color='black'
              />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 5,
                  alignSelf: 'center',
                }}
              >
                {post.nr_of_comments[0]?.count}
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 10 }}>
            <MaterialCommunityIcons
              name='trophy-outline'
              size={19}
              color='black'
              style={styles.iconBox}
            />
            <MaterialCommunityIcons
              name='share-outline'
              size={19}
              color='black'
              style={styles.iconBox}
            />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    borderWidth: 0.5,
    borderColor: '#D4D4D4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
});
