/* biome-ignore-all lint/style/useSortedClasses: custom-tailored order for readability */

import { MAX_FREE_GOALS } from '@/constants/business';
import {
  ALPHA_TRANSPARENCY_05,
  ALPHA_TRANSPARENCY_30,
  colors,
} from '@/constants/colors';
import { leftToRight } from '@/constants/linear-gradient';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

function CTABackground({ children }: { children: ReactNode }) {
  return (
    <View className="relative flex-1">
      <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark" />

      <LinearGradient
        colors={[
          colors.primary.DEFAULT + ALPHA_TRANSPARENCY_05,
          colors.primary.DEFAULT + ALPHA_TRANSPARENCY_30,
        ]}
        end={leftToRight.end}
        pointerEvents="none"
        start={leftToRight.start}
        style={StyleSheet.absoluteFill}
      />

      {children}
    </View>
  );
}

export default function Subscribe() {
  const router = useRouter();

  const handleSubscribe = () => {
    router.push('/paypal-payment');
  };

  return (
    <CTABackground>
      <ScrollView className="flex-1">
        <View className="px-4">
          <View className="relative h-14 w-full items-center justify-center">
            <Pressable
              className="absolute right-4 aspect-square h-8 items-center justify-center rounded-full border border-outline-1 bg-surface-3 transition-all active:scale-95"
              onPress={() => {
                router.dismiss();
              }}
            >
              <X color={colors['on-surface'][3]} size={20} />
            </Pressable>
          </View>

          <View className="mb-6">
            <Text className="font-inter-semibold text-3xl text-on-surface-1 leading-tight">
              Goals Pro
            </Text>
            <Text className="font-inter text-base text-on-surface-2">
              Unlock unlimited goals, photo proof, and early access
            </Text>
          </View>

          <Text className="mb-3 font-inter-medium text-base text-on-surface-1/80">
            New Level Unlocked
          </Text>

          <View className="relative mb-8 overflow-hidden rounded-3xl border border-outline-1 p-2">
            <BlurView
              className="flex-row items-center justify-center gap-1.5 self-center p-2"
              intensity={10}
              tint="prominent"
            />
            {[
              {
                title: 'Unlimited goals',
                subtitle: `Create beyond the free ${MAX_FREE_GOALS} goal limit.`,
                icon: '🎯',
              },
              {
                title: 'Add photo proof',
                subtitle:
                  'Capture and attach photo proof to your completed goals.',
                icon: '📸',
              },
              {
                title: 'Early access',
                subtitle: 'Get new Pro features first as we ship them.',
                icon: '🚀',
              },
            ].map((item) => (
              <View
                className="flex-row items-start gap-3 rounded-2xl p-3"
                key={item.title}
              >
                <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-xl bg-black/80">
                  <Text className="text-lg">{item.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-inter-medium text-base text-on-surface-1">
                    {item.title}
                  </Text>
                  {item.subtitle ? (
                    <Text className="mt-1 text-on-surface-2 text-sm">
                      {item.subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <View className="mb-6 flex-row gap-3">
            {[{ name: 'Pro', price: '₱ $49.99', selected: true }].map(
              (plan) => (
                <View
                  className="flex-1 rounded-3xl border border-primary bg-primary/10 p-4"
                  key={plan.name}
                >
                  <View className="mr-1 mb-3 flex-row items-center">
                    <Text className="mr-2 font-inter-medium text-base text-on-surface-1">
                      {plan.name}
                    </Text>
                    <View className="mr-auto rounded-full bg-surface-1 px-4 py-2">
                      <Text className="font-inter-medium text-on-surface-1 text-sm">
                        Monthly
                      </Text>
                    </View>
                    <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Text className="text-primary-on text-xs">✓</Text>
                    </View>
                  </View>
                  <Text className="mb-1 font-inter-semibold text-on-surface-1 text-xl">
                    {plan.price}
                  </Text>
                  <Text className="text-on-surface-2 text-xs">Subscribe</Text>
                </View>
              )
            )}
          </View>

          <Pressable
            className="mb-4 rounded-full bg-primary py-4 transition-all active:scale-95"
            onPress={handleSubscribe}
          >
            <Text className="text-center font-inter-semibold text-base text-primary-on">
              Subscribe for $49.99
            </Text>
          </Pressable>

          <Text className="mb-3 text-center text-on-surface-2 text-xs">
            ₱ 499.00 per month. Auto-renews monthly until cancelled.
          </Text>

          <View className="mb-12 flex-row items-center justify-center gap-6">
            <Pressable className="py-2">
              <Text className="text-center text-on-surface-2 text-xs underline">
                Terms of Service
              </Text>
            </Pressable>
            <Pressable className="py-2">
              <Text className="text-center text-on-surface-2 text-xs underline">
                Privacy Policy
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </CTABackground>
  );
}
