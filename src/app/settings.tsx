import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Gift, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import PageTitle from '@/components/PageTitle';
import { MAX_FREE_GOALS } from '@/constants/business';
import {
  ALPHA_TRANSPARENCY_00,
  ALPHA_TRANSPARENCY_05,
  ALPHA_TRANSPARENCY_25,
  ALPHA_TRANSPARENCY_30,
  ALPHA_TRANSPARENCY_75,
  colors,
} from '@/constants/colors';
import {
  leftToRight,
  topLeftToBottomRight,
  topToBottom,
} from '@/constants/linear-gradient';
import { continuousCurve } from '@/constants/styles';
import { Logo as LogoIcon } from '@/icons/logo';

const SCROLL_OFFSET_HEIGHT = 250;
const BLUR_SCROLL_OFFSET = 20;

const placeholderProgressValue = Math.ceil(Math.random() * MAX_FREE_GOALS);

export default function SettingsPage() {
  const [scrollRef, { blurAnimatedStyle, headerAnimatedStyle }] =
    useScrollAnimations();

  const { height: screenHeight } = useWindowDimensions();

  return (
    <View className="relative flex-1">
      <Header blurAnimatedStyle={blurAnimatedStyle} />

      <Animated.ScrollView
        className="relative flex-1 bg-surface-1 px-3"
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.View
          className="aspect-square items-center justify-center"
          style={headerAnimatedStyle}
        >
          <Logo />
        </Animated.View>

        <View
          className="relative bg-surface-1"
          style={{ height: screenHeight * 0.8 }}
        >
          <View className="-top-10 absolute inset-x-0 h-10">
            <LinearGradient
              colors={[
                colors.surface[1] + ALPHA_TRANSPARENCY_00,
                colors.surface[1],
              ]}
              end={topToBottom.end}
              pointerEvents="none"
              start={topToBottom.start}
              style={StyleSheet.absoluteFill}
            />
          </View>

          <View className="gap-4">
            <CTA />

            <View
              className="flex-row items-center gap-2 rounded-[20] border border-outline-1 bg-surface-3 p-4"
              style={continuousCurve}
            >
              {/* progress bar */}
              <View className="h-2 flex-1 rounded-full bg-surface-4">
                <View
                  className="h-full rounded-full bg-on-surface-1"
                  style={{
                    width: `${(placeholderProgressValue / MAX_FREE_GOALS) * 100}%`,
                  }}
                />
              </View>

              <Text className="font-inter text-on-surface-1 text-sm">
                {MAX_FREE_GOALS - placeholderProgressValue} Goals Left
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

function Logo() {
  return (
    <View
      className="relative overflow-hidden rounded-3xl border-2 border-primary p-6"
      style={continuousCurve}
    >
      <LinearGradient
        colors={[
          colors.primary.DEFAULT + ALPHA_TRANSPARENCY_25,
          colors.primary.DEFAULT + ALPHA_TRANSPARENCY_75,
        ]}
        end={topLeftToBottomRight.end}
        start={topLeftToBottomRight.start}
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
      />

      <LogoIcon size={96} />
    </View>
  );
}

function CTABackground({ children }: { children: ReactNode }) {
  return (
    <View className="relative">
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

function CTA() {
  const router = useRouter();

  return (
    <Pressable
      className="overflow-hidden rounded-2xl transition-all active:scale-[.98]"
      onPress={() => {
        router.push('/subscribe');
      }}
      style={continuousCurve}
    >
      <CTABackground>
        <View className="w-full flex-row items-center justify-between p-4">
          <View className="gap-1">
            <Text className="font-inter-semibold text-base text-on-surface-1">
              Goals Pro
            </Text>
            <Text className="font-inter text-on-surface-1 text-xs">
              Unlock more goals, sync & more
            </Text>
          </View>

          <View
            className="overflow-hidden rounded-full border border-outline-1"
            style={continuousCurve}
          >
            <BlurView
              className="flex-row items-center justify-center gap-1.5 self-center px-3 py-2"
              intensity={10}
              tint="prominent"
            >
              <Gift color={colors['on-surface'][1]} size={20} />
              <Text className="font-inter-semibold text-on-surface-1 text-sm">
                Try Free
              </Text>
            </BlurView>
          </View>
        </View>
      </CTABackground>
    </Pressable>
  );
}

function Header({
  blurAnimatedStyle,
}: {
  blurAnimatedStyle: ViewProps['style'];
}) {
  const router = useRouter();
  return (
    <View className="absolute inset-x-0 top-0 z-10">
      <Animated.View
        className="absolute inset-0 border-outline-1 border-b"
        style={blurAnimatedStyle}
      >
        <BlurView className="h-full w-full" intensity={80} tint="dark" />
      </Animated.View>

      <View className="relative h-14 w-full items-center justify-center">
        <PageTitle className="absolute">Settings</PageTitle>

        <Pressable
          className="absolute right-4 aspect-square h-8 items-center justify-center rounded-full border border-outline-1 bg-surface-3 transition-all active:scale-95"
          onPress={() => {
            router.dismiss();
          }}
        >
          <X color={colors['on-surface'][3]} size={20} />
        </Pressable>
      </View>
    </View>
  );
}

function useScrollAnimations() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.get(),
            [-SCROLL_OFFSET_HEIGHT, 0, SCROLL_OFFSET_HEIGHT],
            [-SCROLL_OFFSET_HEIGHT / 2, 0, SCROLL_OFFSET_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.get(),
            [-SCROLL_OFFSET_HEIGHT, 0, SCROLL_OFFSET_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
      opacity: interpolate(
        scrollOffset.get(),
        [0, SCROLL_OFFSET_HEIGHT * 1.5],
        [1, 0]
      ),
    };
  });

  const blurAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrollOffset.get() >= BLUR_SCROLL_OFFSET ? 1 : 0,
  }));

  return [scrollRef, { headerAnimatedStyle, blurAnimatedStyle }] as const;
}
