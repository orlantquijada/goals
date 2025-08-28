import PageTitle from '@/components/PageTitle';
import { colors } from '@/constants/colors';
import { Logo } from '@/icons/logo';
import { useRouter } from 'expo-router';
import { Gift, X } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function SettingsPage() {
  const router = useRouter();
  return (
    <ScrollView className="relative flex-1 bg-surface-1 px-3">
      <View className="absolute inset-x-0 top-0 h-14 flex-row items-center justify-center bg-surface-2">
        <PageTitle className="absolute">Settings</PageTitle>

        <Pressable className="absolute right-3 aspect-square h-8 items-center justify-center rounded-full bg-surface-3">
          <X color={colors['on-surface'][3]} size={20} />
        </Pressable>
      </View>

      <View className="aspect-square items-center justify-center">
        <Logo size={48} />
      </View>

      <Pressable
        className="w-full flex-row justify-between rounded-2xl bg-surface-3 p-3"
        onPress={() => {
          router.push('/subscribe');
        }}
        style={{ borderCurve: 'continuous' }}
      >
        <View className="gap-1">
          <Text className="font-inter-semibold text-lg text-on-surface-1">
            Goals Pro
          </Text>
          <Text className="font-inter text-on-surface-1 text-sm">
            Unlock more goals, sync & more
          </Text>
        </View>

        <View className="flex-row items-center justify-center gap-1.5 rounded-full border border-outline-1 px-3 py-2">
          <Gift color={colors['on-surface'][1]} size={20} />
          <Text className="font-inter-semibold text-base text-on-surface-1">
            Try Free
          </Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}
