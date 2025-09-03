import { colors } from '@/constants/colors';
import '../global.css';

import Providers from '@/components/Providers';
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from '@expo-google-fonts/dm-serif-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';
import 'react-native-reanimated';

Appearance.setColorScheme('dark');

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface[1] },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="[goalId]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="subscribe"
          options={{
            presentation: 'modal',
            sheetCornerRadius: 32,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            sheetCornerRadius: 32,
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            presentation: 'modal',
            sheetCornerRadius: 32,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </Providers>
  );
}
