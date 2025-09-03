import { useRouter } from 'expo-router';
import { type ReactNode, useMemo } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
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
import type { AnimatedLinearGradientProps } from '@/components/AnimatedLinearGradient';
import AnimatedLinearGradient from '@/components/AnimatedLinearGradient';
import FAB from '@/components/FAB';
import GoalSection from '@/components/Goal/Section';
import PageTitle from '@/components/PageTitle';
import { ALPHA_TRANSPARENCY_00, colors } from '@/constants/colors';
import { topToBottom } from '@/constants/linear-gradient';
import { groupBy, toDateID } from '@/lib/utils';
import { useAppSelector } from '@/stores/store';

export default function Home() {
  // const groupedData = useMemo(
  //   () =>
  //     Object.entries(
  //       groupBy(mockData, ({ dueDate }) => toDateID(new Date(dueDate)))
  //     ).sort(([dateA], [dateB]) => dateA.localeCompare(dateB)),
  //   []
  // );

  const goals = useAppSelector((state) => state.goals.goals);

  const groupedData = useMemo(
    () =>
      Object.entries(
        groupBy(goals, ({ dueDate }) => toDateID(new Date(dueDate)))
      ).sort(([dateA], [dateB]) => dateA.localeCompare(dateB)),
    [goals]
  );

  const { scrollHandler, styles } = useFadeOnScroll();
  const [scrollRef, { titleAnimatedStyle }] = useTranslateGoals();

  return (
    <View className="relative flex-1 pt-safe">
      <Header titleStyle={titleAnimatedStyle} />

      <FadeOnScroll endStyle={styles.endStyle} startStyle={styles.startStyle}>
        <Animated.ScrollView
          contentContainerClassName="gap-6 px-4 pb-safe-offset-32"
          contentContainerStyle={{ paddingTop: TITLE_SECTION_HEIGHT }}
          onScroll={scrollHandler}
          ref={scrollRef}
        >
          {/* {groupedData.map(([dueDate, goals]) => ( */}
          {/*   <GoalSection */}
          {/*     goalSection={{ */}
          {/*       date: new Date(dueDate), */}
          {/*       goals: goals || [], */}
          {/*     }} */}
          {/*     key={dueDate} */}
          {/*   /> */}
          {/* ))} */}
          {groupedData.map(([dueDate, goals]) => (
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

  return (
    <View className="relative h-14 flex-row items-center justify-between px-4">
      <Animated.View
        className="z-10"
        style={[{ transformOrigin: 'left center' }, titleStyle]}
      >
        <PageTitle>Goals</PageTitle>
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

// placeholder
function Avatar() {
  return (
    <View className="h-8 w-8 items-center justify-center rounded-full border border-outline-1 bg-on-surface-1">
      <Text className="font-inter-semibold text-base text-surface-1 capitalize">
        M
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
