import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
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
import groups from '../../../assets/data/groups.json';

export default function GroupSelector() {
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchValue.toLowerCase())
  );
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
          data={filteredGroups}
          renderItem={({ item: group }) => (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginBottom: 20,
              }}
            >
              <Image
                source={{ uri: group.image }}
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
