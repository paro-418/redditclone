import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SafeArea from '../components/safeArea';

export default function HomeScreen() {
  return (
    <SafeArea>
      <View>
        <Link href='about'>
          <Text>Hello</Text>
        </Link>
      </View>
    </SafeArea>
  );
}
