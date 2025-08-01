import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { selectedGroupAtom } from '../../../atoms';
import { useAtom } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertPost } from '../../../services/postService';
import { useUser } from '@clerk/clerk-expo';
import { useClerkSupabase } from '../../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../../utils/imageStorage';

const CreateScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [bodyText, setBodyText] = useState<string>('');
  const [group, setGroup] = useAtom(selectedGroupAtom);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const supabaseNew = useClerkSupabase();
  const [image, setImage] = useState<string | null>(null);

  const { isPending, mutate, data, error } = useMutation({
    mutationFn: (imagePath: string | undefined) => {
      if (!group) {
        throw new Error('Please select a group');
      }
      if (!title) {
        throw new Error('Title is required');
      }

      if (!user?.id) {
        throw new Error('User is required');
      }
      return insertPost(supabaseNew!, {
        title,
        group_id: group?.id,
        user_id: user?.id,
        description: bodyText,
        image: imagePath,
      });
    },
    onSuccess: (data) => {
      // console.log(data);
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      goBack();
    },
    onError: (error) => {
      console.log('error', error);
      Alert.alert('Failed to post', error.message);
    },
  });

  const goBack = () => {
    setTitle('');
    setBodyText('');
    setGroup(null);
    router.back();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onPostClick = async () => {
    let imagePath = image ? await uploadImage(supabaseNew, image) : undefined;

    mutate(imagePath);
  };
  return (
    <SafeAreaView
      style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 10 }}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          paddingVertical: 4,
        }}
      >
        <AntDesign name='close' size={30} color='black' onPress={goBack} />
        <Pressable disabled={isPending} onPress={() => onPostClick()}>
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>

      {/* COMMUNITY SELECTOR */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: 10 }}
        >
          <Link href='groupSelector' asChild>
            <Pressable style={styles.communityContainer}>
              {group ? (
                <>
                  <Image
                    source={{ uri: group.image || '' }}
                    style={{ width: 20, height: 20, borderRadius: 10 }}
                  />
                  <Text style={{ fontWeight: '600' }}>{group.name}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.rStyle}>r/</Text>
                  <Text style={{ fontWeight: '600' }}>Select a Community</Text>
                </>
              )}
            </Pressable>
          </Link>

          {/* INPUTS */}
          <TextInput
            placeholder='title'
            style={{ fontSize: 20, paddingVertical: 20 }}
            value={title}
            onChangeText={setTitle}
            multiline
          />
          {image && (
            <View style={{ paddingBottom: 20 }}>
              <AntDesign
                name='close'
                size={25}
                color='white'
                onPress={() => setImage(null)}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 10,
                  top: 10,
                  padding: 5,
                  backgroundColor: '#00000090',
                  borderRadius: 20,
                }}
              />
              <Image
                source={{ uri: image }}
                style={{ width: '100%', aspectRatio: 1 }}
              />
            </View>
          )}
          <TextInput
            placeholder='body text (optional)'
            style={{ fontSize: 20, paddingVertical: 20 }}
            value={bodyText}
            onChangeText={setBodyText}
            multiline
          />
        </ScrollView>
        {/* FOOTER */}
        <View style={{ flexDirection: 'row', gap: 20, padding: 10 }}>
          <Feather name='link' size={20} color='black' />
          <Feather name='image' size={20} color='black' onPress={pickImage} />
          <Feather name='youtube' size={20} color='black' />
          <Feather name='list' size={20} color='black' />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  postText: {
    color: 'white',
    backgroundColor: '#115bca',
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
  },
  rStyle: {
    backgroundColor: 'black',
    color: 'white',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  communityContainer: {
    flexDirection: 'row',
    backgroundColor: '#ededed',
    padding: 10,
    borderRadius: 20,
    gap: 5,
    alignSelf: 'flex-start',
  },
});
