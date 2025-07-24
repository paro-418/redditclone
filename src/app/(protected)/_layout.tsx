import { useAuth } from '@clerk/clerk-expo';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { View } from 'react-native';

export default function AppLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href='/signIn' />;
  }
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='post/[id]'
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#ff5700',
          },
          headerBackButtonDisplayMode: 'minimal',
          headerLeft: () => (
            <AntDesign
              name='close'
              size={24}
              color={'white'}
              onPress={() => router.back()}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 12, marginRight: 10 }}>
              <AntDesign name='search1' size={24} color={'white'} />
              <MaterialIcons name='sort' size={24} color={'white'} />
              <Entypo name='dots-three-horizontal' size={24} color={'white'} />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
