import PageTitle from '@/components/PageTitle';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Home() {
  return (
    <View className="pb-safe">
      <View className="border-b border-b-outline-1 bg-surface-2 pt-safe">
        <View className="h-16 w-full">
          <Header />
        </View>
      </View>
    </View>
  );
}

function Header() {
  const router = useRouter();
  return (
    <View className="relative h-full w-full flex-row items-center justify-center">
      <PageTitle className="absolute">Hello</PageTitle>

      <Pressable
        className="absolute right-4 transition-all active:scale-95"
        onPress={() => {
          router.push('/settings');
        }}
      >
        <View className="h-8 w-8 items-center justify-center rounded-full border border-outline-1 bg-on-surface-1">
          <Text className="font-inter-semibold text-base text-surface-1 capitalize">
            M
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
