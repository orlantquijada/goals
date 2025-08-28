import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView>
      <Text className="text-lg text-yellow-500">Hello</Text>
    </SafeAreaView>
  );
}
