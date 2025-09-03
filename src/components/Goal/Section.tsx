import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  type MenuAction,
  type MenuComponentRef,
  MenuView,
  type NativeActionEvent,
} from '@react-native-menu/menu';
import { BlurView } from 'expo-blur';
import { EllipsisVertical } from 'lucide-react-native';
import { type ReactNode, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutRight,
  LinearTransition,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ALPHA_TRANSPARENCY_05, colors, goalColors } from '@/constants/colors';
import {
  fadeInSpringify,
  fadeOutSpringify,
  layoutSpringify,
  transitions,
} from '@/constants/motion';
import { continuousCurve } from '@/constants/styles';
import { cn } from '@/lib/cn';
import type { Goal, GoalColor } from '@/lib/goal';
import { weekdayFormatDate } from '@/lib/humanize';
import { removeGoal } from '@/stores/goals-store';
import { useAppDispatch } from '@/stores/store';
import GoalCard, { CARD_HEIGHT } from './Card';

type Props = {
  goalSection: {
    date: Date;
    goals: Goal[];
  };
};

export default function GoalSection({ goalSection }: Props) {
  return (
    <Animated.View
      className="flex-row gap-6 pb-3"
      entering={fadeInSpringify}
      exiting={fadeOutSpringify}
      layout={layoutSpringify}
    >
      <View
        className="w-14 items-center justify-center self-start px-2"
        style={{ height: CARD_HEIGHT }}
      >
        <Text className="font-inter-semibold text-3xl text-on-surface-1">
          {goalSection.date.getDate()}
        </Text>
        <Text className="font-inter-semibold text-on-surface-1 text-sm uppercase tracking-widest">
          {weekdayFormatDate(goalSection.date)}
        </Text>
      </View>

      <Animated.View className="flex-1 gap-3" layout={layoutSpringify}>
        {goalSection.goals.map((goal) => (
          <Animated.View
            entering={fadeInSpringify}
            exiting={fadeOutSpringify}
            key={goal.id}
            layout={layoutSpringify}
          >
            <FocusGoalCardWrapper
              color={goal.color}
              goalId={goal.id}
              onConfirm={() => {
                console.log(goal);
              }}
            >
              <GoalCard goal={goal} />
            </FocusGoalCardWrapper>
          </Animated.View>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

function FocusGoalCardWrapper({
  onConfirm,
  children,
  color,
  goalId,
}: {
  color: GoalColor;
  goalId: Goal['id'];
  onConfirm: () => void;
  children: ReactNode;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const iconColor = goalColors[color];
  const menuRef = useRef<MenuComponentRef>(null);
  const handleMenuPress = useMenuActions(goalId);

  return (
    <View className="flex-row items-center gap-2 overflow-hidden">
      <Animated.View
        className="relative overflow-hidden"
        style={useAnimatedStyle(() => ({
          transformOrigin: 'left center',
          width: withSpring(isConfirming ? '90%' : '100%', transitions.snappy),
        }))}
      >
        <Pressable
          className="relative flex-1 overflow-hidden"
          onLongPress={() => {
            if (isConfirming) {
              setIsConfirming(false);
            }
          }}
          onPress={() => {
            if (isConfirming) {
              onConfirm();
            }

            setIsConfirming((prev) => !prev);
          }}
        >
          {children}

          <View
            className={cn(
              'absolute inset-0 overflow-hidden rounded-2xl bg-transparent opacity-0 transition-all',
              isConfirming && 'opacity-100'
            )}
            style={continuousCurve}
          >
            <BlurView
              className="flex-1 flex-row items-center justify-center gap-2"
              intensity={15}
              style={{
                backgroundColor: `${iconColor}${ALPHA_TRANSPARENCY_05}`,
              }}
              tint="systemThickMaterialDark"
            >
              <Text
                className="font-inter-semibold text-sm"
                style={{ color: iconColor }}
              >
                Mark as Completed
              </Text>
            </BlurView>
          </View>
        </Pressable>
      </Animated.View>

      {isConfirming && (
        <Animated.View
          className="absolute right-0"
          entering={FadeInRight.springify()
            .stiffness(transitions.snappy.stiffness)
            .damping(transitions.snappy.damping)}
          exiting={FadeOutRight.springify()
            .stiffness(transitions.snappy.stiffness)
            .damping(transitions.snappy.damping)}
          style={{ transformOrigin: 'right center' }}
        >
          <MenuView
            actions={actions}
            onPressAction={handleMenuPress}
            ref={menuRef}
            shouldOpenOnLongPress={false}
          >
            <Pressable
              className="items-center justify-center transition-all active:scale-95 active:opacity-75"
              hitSlop={8}
            >
              <EllipsisVertical color={colors['on-surface'][4]} size={24} />
            </Pressable>
          </MenuView>
        </Animated.View>
      )}
    </View>
  );
}

const actionKeys = {
  LIBRARY: 'library',
  CAMERA: 'camera',
  DELETE: 'delete',
  DETAIL: 'detail',
};

const actions: MenuAction[] = [
  {
    title: 'Add Photo Proof',
    image: 'plus',
    subactions: [
      {
        id: actionKeys.LIBRARY,
        title: 'Choose from Library',
        image: 'photo.on.rectangle',
        imageColor: colors['on-surface'][1],
      },
      {
        id: actionKeys.CAMERA,
        title: 'Take Photo',
        image: 'camera',
        imageColor: colors['on-surface'][1],
      },
    ],
  },
  {
    id: actionKeys.DELETE,
    title: 'Delete Goal',
    attributes: {
      destructive: true,
    },
    image: 'trash',
    imageColor: colors.destructive,
  },
  {
    id: actionKeys.DETAIL,
    title: 'Show Details',
    image: 'chevron.right',
    imageColor: colors['on-surface'][1],
  },
  {
    id: actionKeys.DELETE,
    title: 'Delete Goal',
    attributes: {
      destructive: true,
    },
    image: 'trash',
    imageColor: colors.destructive,
  },
];

function useMenuActions(goalId: Goal['id']) {
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useAppDispatch();

  const handleMenuPress = ({ nativeEvent }: NativeActionEvent) => {
    if (nativeEvent.event === actionKeys.CAMERA) {
    } else if (nativeEvent.event === actionKeys.LIBRARY) {
    } else if (nativeEvent.event === actionKeys.DELETE) {
      showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete Goal'],
          title: 'Are you sure you want to delete this goal?',
          cancelButtonIndex: 0,
          destructiveButtonIndex: 1,
        },
        (selectedIndex) => {
          if (selectedIndex === 1) {
            dispatch(removeGoal(goalId));
          }
        }
      );
    } else if (nativeEvent.event === actionKeys.DETAIL) {
    }
  };

  return handleMenuPress;
}
