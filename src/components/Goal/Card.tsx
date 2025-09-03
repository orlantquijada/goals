import {
  ALPHA_TRANSPARENCY_00,
  ALPHA_TRANSPARENCY_10,
  ALPHA_TRANSPARENCY_25,
  ALPHA_TRANSPARENCY_30,
  ALPHA_TRANSPARENCY_75,
  colors,
  goalColors,
} from '@/constants/colors';
import { goalIcons } from '@/constants/icons';
import { topLeftToBottomRight } from '@/constants/linear-gradient';
import { transitions } from '@/constants/motion';
import { continuousCurve } from '@/constants/styles';
import { cn } from '@/lib/cn';
import type { Goal } from '@/lib/goal';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export const CARD_HEIGHT = 66;

type Props = {
  goal: Pick<Goal, 'icon' | 'color' | 'title'>;
  className?: string;
  style?: ViewStyle;
  enabledIconAnimation?: boolean;
};

// TODO: completed styling
export default function GoalCard({
  goal,
  className,
  style,
  enabledIconAnimation,
  ...props
}: Props & ComponentProps<typeof Animated.View>) {
  const Icon = goalIcons[goal.icon];
  const iconColor = goalColors[goal.color];

  return (
    <Animated.View
      className={cn(
        'flex-row items-center justify-between gap-4 overflow-hidden rounded-2xl border bg-surface-2 p-3 pr-4',
        className
      )}
      style={[
        { height: CARD_HEIGHT, borderColor: iconColor + ALPHA_TRANSPARENCY_10 },
        continuousCurve,
        style,
      ]}
      {...props}
    >
      <Text
        className={cn(
          'shrink font-inter-semibold text-on-surface-1 text-sm',
          !goal.title && 'text-on-surface-2'
        )}
        numberOfLines={1}
      >
        {goal.title || 'Untitled'}
      </Text>

      <View className="absolute inset-0">
        <LinearGradient
          colors={[
            colors.surface[2] + ALPHA_TRANSPARENCY_00,
            iconColor + ALPHA_TRANSPARENCY_30,
          ]}
          end={topLeftToBottomRight.end}
          pointerEvents="none"
          start={topLeftToBottomRight.start}
          style={[StyleSheet.absoluteFill]}
        />
      </View>

      <View
        className="relative aspect-square w-10 items-center justify-center overflow-hidden rounded-lg border"
        style={{ borderColor: iconColor }}
      >
        <LinearGradient
          colors={[
            iconColor + ALPHA_TRANSPARENCY_25,
            iconColor + ALPHA_TRANSPARENCY_75,
          ]}
          end={topLeftToBottomRight.end}
          pointerEvents="none"
          start={topLeftToBottomRight.start}
          style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
        />

        <Animated.View
          {...(enabledIconAnimation
            ? {
                entering: FadeInUp.springify()
                  .stiffness(transitions.snappy.stiffness)
                  .damping(transitions.snappy.damping),
              }
            : {})}
          key={goal.icon}
        >
          <Icon color={iconColor} size={20} strokeWidth={2} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}
