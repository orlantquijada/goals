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
import { selectGoalCount } from '@/stores/goals-store';
import { useAppDispatch, useAppSelector } from '@/stores/store';
import {
  clearPaymentResult,
  selectIsSubscribed,
  selectPaymentResult,
  unsubscribe,
} from '@/stores/subscription-store';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Gift, X, XCircle } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  Animated as RNAnimated,
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

const SCROLL_OFFSET_HEIGHT = 250;
const BLUR_SCROLL_OFFSET = 20;

export default function SettingsPage() {
  const [scrollRef, { blurAnimatedStyle, headerAnimatedStyle }] =
    useScrollAnimations();
  const dispatch = useAppDispatch();

  const { height: screenHeight } = useWindowDimensions();
  const goalCount = useAppSelector(selectGoalCount);
  const isSubscribed = useAppSelector(selectIsSubscribed);
  const paymentResult = useAppSelector(selectPaymentResult);

  // Error toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useState(new RNAnimated.Value(0))[0];

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Animate in
    RNAnimated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      RNAnimated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowToast(false);
      });
    }, 3000);
  };

  // Handle payment result from PayPal screen
  useEffect(() => {
    if (paymentResult === 'error') {
      showErrorToast(
        'Payment failed. Please check your details and try again.'
      );
      // Clear the payment result after showing the toast
      setTimeout(() => {
        dispatch(clearPaymentResult());
      }, 100);
    }
  }, [paymentResult, dispatch]);

  const renderToast = () => {
    if (!showToast) return null;

    return (
      <RNAnimated.View
        className="absolute top-16 right-4 left-4 z-50 flex-row items-center rounded-lg p-4"
        style={{
          backgroundColor: '#EF4444',
          opacity: toastOpacity,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <XCircle color="#FFFFFF" size={20} />
        <Text className="ml-3 flex-1 font-medium text-sm text-white">
          {toastMessage}
        </Text>
      </RNAnimated.View>
    );
  };

  return (
    <View className="relative flex-1">
      <Header blurAnimatedStyle={blurAnimatedStyle} />
      {renderToast()}

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
              className="flex-row items-center justify-center gap-2 rounded-[20] border border-outline-1 bg-surface-3 p-4"
              style={continuousCurve}
            >
              {/* progress bar */}
              {isSubscribed ? (
                <Text className="text-center font-inter-semibold text-on-surface-1 text-xs">
                  Access unlimited goals, photo proof, and early access.
                </Text>
              ) : (
                <>
                  <View className="h-2 flex-1 rounded-full bg-surface-4">
                    <View
                      className="h-full rounded-full bg-on-surface-1"
                      style={{
                        width: `${(goalCount / MAX_FREE_GOALS) * 100}%`,
                      }}
                    />
                  </View>

                  <Text className="font-inter text-on-surface-1 text-sm">
                    {MAX_FREE_GOALS - goalCount} Goals Left
                  </Text>
                </>
              )}
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
  const dispatch = useAppDispatch();
  const isSubscribed = useAppSelector(selectIsSubscribed);

  const handlePress = () => {
    if (isSubscribed) {
      Alert.alert(
        'Cancel subscription?',
        "We're sad to see you go, but you can always come back.",
        [
          { text: 'Keep Pro', style: 'cancel' },
          {
            text: 'Cancel',
            style: 'destructive',
            onPress: () => dispatch(unsubscribe()),
          },
        ]
      );
    } else {
      router.push('/subscribe');
    }
  };

  return (
    <Pressable
      className="overflow-hidden rounded-2xl transition-all active:scale-[.98]"
      onPress={handlePress}
      style={continuousCurve}
    >
      <CTABackground>
        <View className="w-full flex-row items-center justify-between p-4">
          <View className="gap-1">
            <Text className="font-inter-semibold text-base text-on-surface-1">
              Goals Pro
            </Text>
            <Text className="font-inter text-on-surface-1 text-xs">
              {isSubscribed
                ? 'Thanks for supporting us!'
                : 'Unlock more goals, sync & more'}
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
              {isSubscribed ? (
                <X color={colors['on-surface'][1]} size={20} />
              ) : (
                <Gift color={colors['on-surface'][1]} size={20} />
              )}
              <Text className="font-inter-semibold text-on-surface-1 text-sm">
                {isSubscribed ? 'Cancel' : 'Go Pro'}
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
