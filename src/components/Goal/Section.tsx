import { ALPHA_TRANSPARENCY_05, colors, goalColors } from '@/constants/colors';
import {
  fadeInSpringify,
  fadeOutSpringify,
  layoutSpringify,
  transitions,
} from '@/constants/motion';
import { continuousCurve } from '@/constants/styles';
import { useCamera } from '@/hooks/useCamera';
import { useLibrary } from '@/hooks/useLibrary';
import { cn } from '@/lib/cn';
import type { Goal, GoalColor } from '@/lib/goal';
import { weekdayFormatDate } from '@/lib/humanize';
import { completeGoal, removeGoal } from '@/stores/goals-store';
import { useAppDispatch } from '@/stores/store';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  type MenuAction,
  type MenuComponentRef,
  MenuView,
  type NativeActionEvent,
} from '@react-native-menu/menu';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { EllipsisVertical } from 'lucide-react-native';
import { type ReactNode, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutRight,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
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
              isCompleted={!!goal.completedAt}
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
  isCompleted,
}: {
  color: GoalColor;
  goalId: Goal['id'];
  isCompleted: boolean;
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
              return;
            }
            setIsConfirming(true);
          }}
          onPress={() => {
            if (isConfirming) {
              onConfirm();
            }

            setIsConfirming((prev) => (isCompleted ? !prev : true));
          }}
        >
          {children}
          {isConfirming && !isCompleted && (
            <MenuView
              actions={photoProofActions}
              onPressAction={handleMenuPress}
              ref={menuRef}
              shouldOpenOnLongPress={false}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <View
                className={cn(
                  'absolute inset-0 overflow-hidden rounded-2xl bg-transparent opacity-0 transition-all',
                  'opacity-100'
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
            </MenuView>
          )}
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
            actions={isCompleted ? completedActions : actions}
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
  PHOTO_PROOF: 'photo-proof',
  LIBRARY: 'library',
  CAMERA: 'camera',
  DELETE: 'delete',
  DETAIL: 'detail',
};

const photoProofActions: MenuAction[] = [
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
];

const actions: MenuAction[] = [
  {
    id: actionKeys.PHOTO_PROOF,
    title: 'Add Photo Proof',
    image: 'plus',
    subactions: photoProofActions,
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
    id: actionKeys.DELETE,
    title: 'Delete Goal',
    attributes: {
      destructive: true,
    },
    image: 'trash',
    imageColor: colors.destructive,
  },
];

const completedActions: MenuAction[] = [
  {
    id: actionKeys.DETAIL,
    title: 'Show Details',
    image: 'chevron.right',
    imageColor: colors['on-surface'][1],
  },
  ...actions.filter((a) => a.id !== actionKeys.PHOTO_PROOF),
];

function useMenuActions(goalId: Goal['id']) {
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCamera = useCamera((assets) => {
    dispatch(completeGoal({ id: goalId, proof: assets[0].uri }));
  });

  const handleLibrary = useLibrary((assets) => {
    dispatch(completeGoal({ id: goalId, proof: assets[0].uri }));
  });

  const handleMenuPress = ({ nativeEvent }: NativeActionEvent) => {
    if (nativeEvent.event === actionKeys.CAMERA) {
      handleCamera();
    } else if (nativeEvent.event === actionKeys.LIBRARY) {
      handleLibrary();
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
      router.push(`/${goalId}`);
    }
  };

  return handleMenuPress;
}
