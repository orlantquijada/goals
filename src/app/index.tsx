import type { AnimatedLinearGradientProps } from '@/components/AnimatedLinearGradient';
import AnimatedLinearGradient from '@/components/AnimatedLinearGradient';
import FAB from '@/components/FAB';
import GoalSection from '@/components/Goal/Section';
import PageTitle from '@/components/PageTitle';
import { ALPHA_TRANSPARENCY_00, colors } from '@/constants/colors';
import { topToBottom } from '@/constants/linear-gradient';
import type { Goal } from '@/lib/goal';
import { groupBy, toDateID } from '@/lib/utils';
import { useGetDailyQuoteQuery } from '@/stores/api/quoteApi';
import {
  selectCompletedGoals,
  selectUncompletedGoals,
} from '@/stores/goals-store';
import { useAppDispatch, useAppSelector } from '@/stores/store';
import {
  clearPaymentResult,
  selectIsSubscribed,
  selectPaymentResult,
} from '@/stores/subscription-store';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import React, { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  Animated as RNAnimated,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const groupGoalsData = (goals: Goal[]) => {
  return Object.entries(
    groupBy(goals, ({ dueDate }) => toDateID(new Date(dueDate)))
  ).sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
};

export default function Home() {
  const dispatch = useAppDispatch();
  const uncompletedGoals = useAppSelector(selectUncompletedGoals);
  const completedGoals = useAppSelector(selectCompletedGoals);
  const paymentResult = useAppSelector(selectPaymentResult);

  // Fetch daily quote for motivation
  const {
    data: dailyQuote,
    isLoading: quoteLoading,
    error: quoteError,
  } = useGetDailyQuoteQuery();

  const completedGroupedData = useMemo(
    () => groupGoalsData(completedGoals),
    [completedGoals]
  );
  const uncompletedGroupedData = useMemo(
    () => groupGoalsData(uncompletedGoals),
    [uncompletedGoals]
  );

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useState(new RNAnimated.Value(0))[0];

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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
    console.log('paymentResult:', paymentResult);
    if (paymentResult === 'success') {
      console.log('Showing success toast');
      showToastMessage('Subscription successful! Welcome to Goals Pro 🎉');
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
          backgroundColor: '#22C55E',
          opacity: toastOpacity,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <CheckCircle color="#FFFFFF" size={20} />
        <Text className="ml-3 flex-1 font-medium text-sm text-white">
          {toastMessage}
        </Text>
      </RNAnimated.View>
    );
  };

  const { scrollHandler, styles } = useFadeOnScroll();
  const [scrollRef, { titleAnimatedStyle }] = useTranslateGoals();

  return (
    <View className="relative flex-1 pt-safe">
      <Header titleStyle={titleAnimatedStyle} />
      {renderToast()}

      <FadeOnScroll endStyle={styles.endStyle} startStyle={styles.startStyle}>
        <Animated.ScrollView
          contentContainerClassName="gap-6 px-4 pb-safe-offset-32"
          contentContainerStyle={{ paddingTop: TITLE_SECTION_HEIGHT }}
          onScroll={scrollHandler}
          ref={scrollRef}
        >
          {/* Daily Quote - Small and Simple */}
          <View className="rounded-lg border border-outline-1 bg-surface-2 px-4 py-3">
            {quoteLoading && (
              <Text className="text-center font-inter-regular text-on-surface-3 text-xs italic leading-4">
                Loading inspiration...
              </Text>
            )}
            {quoteError && (
              <Text className="text-center font-inter-regular text-on-surface-3 text-xs italic leading-4">
                Failed to load quote
              </Text>
            )}
            {dailyQuote && !quoteLoading && (
              <Text
                className="text-center font-inter-regular text-on-surface-1 text-xs italic leading-4"
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                "{dailyQuote}"
              </Text>
            )}
            {!(dailyQuote || quoteLoading || quoteError) && (
              <Text className="text-center font-inter-regular text-on-surface-3 text-xs italic leading-4">
                No quote available
              </Text>
            )}
          </View>
          {uncompletedGoals.length === 0 ? (
            <EmptyState />
          ) : (
            uncompletedGroupedData.map(([dueDate, goals]) => (
              <GoalSection
                goalSection={{
                  date: new Date(dueDate),
                  goals: goals || [],
                }}
                key={dueDate}
              />
            ))
          )}
          <Text className="font-inter-semibold text-on-surface-1 text-sm">
            Completed
          </Text>
          {completedGroupedData.map(([dueDate, goals]) => (
            <GoalSection
              goalSection={{
                date: new Date(dueDate),
                goals: goals || [],
              }}
              key={dueDate}
            />
          ))}
        </Animated.ScrollView>
      </FadeOnScroll>

      <FAB className="absolute bottom-safe-offset-4 self-center" />
    </View>
  );
}

const TITLE_SECTION_HEIGHT = 64;

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="items-center">
        <Text className="mb-2 text-center font-inter-bold text-2xl text-on-surface-1">
          No goals yet
        </Text>
        <Text className="text-center font-inter-regular text-base text-on-surface-3 leading-6">
          Create your first goal to get started on your journey
        </Text>
      </View>
    </View>
  );
}

function useTranslateGoals() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.get(),
            [0, TITLE_SECTION_HEIGHT],
            [48, 0],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollOffset.get(),
            [0, TITLE_SECTION_HEIGHT],
            [2, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return [scrollRef, { titleAnimatedStyle }] as const;
}

function Header({ titleStyle }: { titleStyle: ViewStyle }) {
  const router = useRouter();
  const { data: quote } = useGetDailyQuoteQuery();
  const isSubscribed = useAppSelector(selectIsSubscribed);

  return (
    <View className="relative h-14 flex-row items-center justify-between px-4">
      <Animated.View
        className="z-10 flex-row items-center"
        style={[{ transformOrigin: 'left center' }, titleStyle]}
      >
        <PageTitle>Goals</PageTitle>
        {isSubscribed && <ProChip />}
      </Animated.View>
      <Pressable
        className="transition-all active:scale-95"
        onPress={() => {
          router.push('/settings');
        }}
      >
        <Avatar />
      </Pressable>
    </View>
  );
}

// Pro chip component - superscript style
function ProChip() {
  return (
    <View
      className="ml-1 self-start rounded-full px-1"
      style={{
        backgroundColor: colors.primary.DEFAULT, // Solid fill
        transform: [{ translateY: 4 }], // Align top with Goals text
        paddingVertical: 1,
        paddingHorizontal: 4,
      }}
    >
      <Text
        className="font-inter-semibold"
        style={{
          color: 'white',
          fontSize: 7,
          lineHeight: 8,
        }}
      >
        PRO
      </Text>
    </View>
  );
}

// placeholder
function Avatar() {
  return (
    <View className="h-8 w-8 items-center justify-center rounded-full border border-outline-1 bg-on-surface-1">
      <Text className="font-inter-semibold text-base text-surface-1 capitalize">
        U
      </Text>
    </View>
  );
}

function FadeOnScroll({
  children,
  endStyle,
  startStyle,
}: {
  children: ReactNode;
  startStyle: AnimatedLinearGradientProps['style'];
  endStyle: AnimatedLinearGradientProps['style'];
}) {
  return (
    <View className="relative flex-1">
      {children}

      <AnimatedLinearGradient
        colors={[colors.surface[1], colors.surface[1] + ALPHA_TRANSPARENCY_00]}
        end={topToBottom.end}
        pointerEvents="none"
        start={topToBottom.start}
        style={[
          {
            position: 'absolute',
            height: 40,
            left: 0,
            right: 0,
            top: 0,
          },
          startStyle,
        ]}
      />

      <AnimatedLinearGradient
        colors={[colors.surface[1] + ALPHA_TRANSPARENCY_00, colors.surface[1]]}
        end={topToBottom.end}
        pointerEvents="none"
        start={topToBottom.start}
        style={[
          {
            position: 'absolute',
            height: 40,
            left: 0,
            right: 0,
            bottom: 0,
          },
          endStyle,
        ]}
      />
    </View>
  );
}

const END_FADE_OFFSET = 50;
const START_FADE_OFFSET = 0;

function useFadeOnScroll() {
  const isStartReached = useSharedValue(true);
  const isEndReached = useSharedValue(false);

  const startOpacity = useSharedValue(0);
  const endOpacity = useSharedValue(1);

  const animateOpacity = (opacity: number) => {
    'worklet';

    return withTiming(opacity, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  };

  const scrollHandler = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const isCloseToEnd =
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - END_FADE_OFFSET;
    const isCloseToStart = nativeEvent.contentOffset.y <= START_FADE_OFFSET;

    if (!isEndReached.get() && isCloseToEnd) {
      isEndReached.set(true);
      endOpacity.set(animateOpacity(1));
    } else if (isEndReached.get() && !isCloseToEnd) {
      isEndReached.set(false);
      endOpacity.set(animateOpacity(1));
    }

    if (!isStartReached.get() && isCloseToStart) {
      isStartReached.set(true);
      startOpacity.set(animateOpacity(0));
    } else if (isStartReached.get() && !isCloseToStart) {
      isStartReached.set(false);
      startOpacity.set(animateOpacity(1));
    }
  };

  return {
    scrollHandler,
    styles: {
      startStyle: { opacity: startOpacity },
      endStyle: { opacity: endOpacity },
    },
  };
}
