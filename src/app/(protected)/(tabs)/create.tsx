import {
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
import { AntDesign } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

const CreateScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [bodyText, setBodyText] = useState<string>('');

  const goBack = () => {
    setTitle('');
    setBodyText('');
    router.back();
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
        <Pressable onPress={() => {}}>
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
          <Link href='groupSelector'>
            <View style={styles.communityContainer}>
              <Text style={styles.rStyle}>r/</Text>
              <Text style={{ fontWeight: '600' }}>Select a Community</Text>
            </View>
          </Link>

          {/* INPUTS */}
          <TextInput
            placeholder='title'
            style={{ fontSize: 20, paddingVertical: 20 }}
            value={title}
            onChangeText={setTitle}
            multiline
          />
          <TextInput
            placeholder='body text (optional)'
            style={{ fontSize: 20, paddingVertical: 20 }}
            value={bodyText}
            onChangeText={setBodyText}
            multiline
          />
        </ScrollView>
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
