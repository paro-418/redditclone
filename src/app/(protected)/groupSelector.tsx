import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectedGroupAtom } from '../../atoms';
import { useSetAtom } from 'jotai';
// import { Group } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '../../services/groupService';
import { Tables } from '../../types/database.types';

type Group = Tables<'groups'>;
export default function GroupSelector() {
  const [searchValue, setSearchValue] = useState<string>('');
  const setGroup = useSetAtom(selectedGroupAtom);

  const {
    data: groups,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['groups', { searchValue }],
    queryFn: () => fetchGroups(searchValue),
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={{ marginHorizontal: 8, flex: 1 }}>
        <ActivityIndicator />{' '}
      </SafeAreaView>
    );
  }

  if (error || !groups) {
    return (
      <SafeAreaView style={{ marginHorizontal: 8, flex: 1 }}>
        <Text>Error fetching groups</Text>
      </SafeAreaView>
    );
  }

  const onGroupSelected = (group: Group) => {
    setGroup(group);
    router.back();
  };
  return (
    <SafeAreaView style={{ marginHorizontal: 8, flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={10}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <AntDesign
            name='close'
            size={30}
            color='black'
            onPress={() => router.back()}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              textAlign: 'center',
              flex: 1,
              paddingRight: 30,
            }}
          >
            Post to
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'lightgray',
            borderRadius: 5,
            gap: 5,
            marginVertical: 10,
            alignItems: 'center',
            paddingHorizontal: 5,
          }}
        >
          <AntDesign name='search1' size={16} color='gray' />
          <TextInput
            placeholder='Search for a community'
            placeholderTextColor='gray'
            style={{ paddingVertical: 10, flex: 1 }}
            value={searchValue}
            onChangeText={setSearchValue}
          />
          {searchValue && (
            <AntDesign
              name='closecircle'
              size={15}
              color='#e4e4e4'
              onPress={() => setSearchValue('')}
            />
          )}
        </View>

        <FlatList
          data={groups}
          renderItem={({ item: group }) => (
            <Pressable
              onPress={() => onGroupSelected(group)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginBottom: 20,
              }}
            >
              <Image
                source={{ uri: group.image || '' }}
                style={{ width: 40, aspectRatio: 1, borderRadius: 100 }}
              />
              <Text>{group.name}</Text>
            </Pressable>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
