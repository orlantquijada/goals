import {
    ALPHA_TRANSPARENCY_10,
    ALPHA_TRANSPARENCY_20,
    ALPHA_TRANSPARENCY_30,
    colors,
    goalColors,
} from '@/constants/colors';
import { goalIcons } from '@/constants/icons';
import { topLeftToBottomRight } from '@/constants/linear-gradient';
import { transitions } from '@/constants/motion';
import { continuousCurve } from '@/constants/styles';
import type { Goal } from '@/lib/goal';
import { weekdayFormatDate } from '@/lib/humanize';
import { useAppSelector } from '@/stores/store';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, CheckCircle2, Clock } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const router = useRouter();

  const goals = useAppSelector((state) => state.goals.goals);
  const goal = goals.find((g: Goal) => g.id === goalId);

  if (!goal) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-1">
        <Text className="font-inter-medium text-lg text-on-surface-2">
          Goal not found
        </Text>
      </View>
    );
  }

  // Type assertion after null check
  const currentGoal = goal as Goal;
  const Icon = goalIcons[currentGoal.icon];
  const iconColor = goalColors[currentGoal.color];
  const isCompleted = !!goal.completedAt;
  const dueDate = new Date(goal.dueDate);
  const createdDate = new Date(goal.createdAt);

  return (
    <View className="flex-1 bg-surface-1">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Animated.View
        className="relative z-10 px-4 pt-safe pb-4"
        entering={FadeInUp.delay(100)
          .springify()
          .stiffness(transitions.snappy.stiffness)
          .damping(transitions.snappy.damping)}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full border border-outline-1 bg-surface-2 transition-all active:scale-95"
            onPress={() => router.back()}
          >
            <ArrowLeft color={colors['on-surface'][1]} size={20} />
          </Pressable>

          <View className="flex-1 items-center">
            <Text className="font-inter-medium text-on-surface-2 text-sm">
              Goal Details
            </Text>
          </View>

          <View className="w-10" />
        </View>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section with Goal Info */}
        <Animated.View
          className="px-4 pb-6"
          entering={FadeInUp.delay(200)
            .springify()
            .stiffness(transitions.snappy.stiffness)
            .damping(transitions.snappy.damping)}
        >
          <View
            className="relative overflow-hidden rounded-3xl border p-6"
            style={[
              { borderColor: iconColor + ALPHA_TRANSPARENCY_10 },
              continuousCurve,
            ]}
          >
            {/* Background Gradient */}
            <LinearGradient
              colors={[colors.surface[2], iconColor + ALPHA_TRANSPARENCY_20]}
              end={topLeftToBottomRight.end}
              start={topLeftToBottomRight.start}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            {/* Content */}
            <View className="relative z-10">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="mr-4 flex-1">
                  <Text className="mb-2 font-inter-semibold text-2xl text-on-surface-1 leading-8">
                    {goal.title}
                  </Text>

                  {isCompleted && (
                    <View className="flex-row items-center">
                      <CheckCircle2 color={goalColors.green} size={16} />
                      <Text
                        className="ml-2 font-inter-medium text-sm"
                        style={{ color: goalColors.green }}
                      >
                        Completed
                      </Text>
                    </View>
                  )}
                </View>

                {/* Icon */}
                <View
                  className="aspect-square w-16 items-center justify-center overflow-hidden rounded-xl border-2"
                  style={{ borderColor: iconColor }}
                >
                  <LinearGradient
                    colors={[
                      iconColor + ALPHA_TRANSPARENCY_20,
                      iconColor + ALPHA_TRANSPARENCY_30,
                    ]}
                    end={topLeftToBottomRight.end}
                    start={topLeftToBottomRight.start}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  <Icon color={iconColor} size={28} strokeWidth={2} />
                </View>
              </View>

              {/* Date Info */}
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Calendar color={colors['on-surface'][2]} size={16} />
                  <Text className="ml-3 font-inter-regular text-on-surface-2 text-sm">
                    Due {weekdayFormatDate(dueDate)}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Clock color={colors['on-surface'][2]} size={16} />
                  <Text className="ml-3 font-inter-regular text-on-surface-2 text-sm">
                    Created {weekdayFormatDate(createdDate)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Photo Proof Section */}
        {goal.proof && (
          <Animated.View
            className="px-4 pb-6"
            entering={FadeInDown.delay(400)
              .springify()
              .stiffness(transitions.snappy.stiffness)
              .damping(transitions.snappy.damping)}
          >
            <Text className="mb-4 font-inter-semibold text-on-surface-1 text-xl">
              Proof of Completion
            </Text>

            <View
              className="relative overflow-hidden rounded-2xl border border-outline-1"
              style={continuousCurve}
            >
              <Image
                resizeMode="cover"
                source={{ uri: goal.proof }}
                style={{
                  width: screenWidth - 32,
                  height: (screenWidth - 32) * 0.75, // 4:3 aspect ratio
                  backgroundColor: colors.surface[2],
                }}
              />

              {/* Overlay gradient for better text visibility if needed */}
              <LinearGradient
                colors={[
                  'transparent',
                  colors.surface[1] + ALPHA_TRANSPARENCY_10,
                ]}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 60,
                }}
              />

              {/* Completion timestamp */}
              {goal.completedAt && (
                <View className="absolute right-4 bottom-4 left-4">
                  <Text className="text-center font-inter-medium text-on-surface-1 text-sm">
                    Completed {weekdayFormatDate(new Date(goal.completedAt))}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* No Proof State - Show when goal is not completed or has no proof */}
        {!goal.proof && (
          <Animated.View
            className="px-4 pb-6"
            entering={FadeInDown.delay(400)
              .springify()
              .stiffness(transitions.snappy.stiffness)
              .damping(transitions.snappy.damping)}
          >
            <View
              className="items-center rounded-2xl border border-outline-1 bg-surface-2 px-6 py-12"
              style={continuousCurve}
            >
              <View
                className="mb-4 h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: iconColor + ALPHA_TRANSPARENCY_20 }}
              >
                <Icon color={iconColor} size={24} strokeWidth={2} />
              </View>

              <Text className="mb-2 text-center font-inter-semibold text-lg text-on-surface-1">
                {isCompleted ? 'Completed Goal' : 'Goal in Progress'}
              </Text>
              <Text className="text-center font-inter-regular text-on-surface-3 leading-5">
                {isCompleted
                  ? 'This goal was completed without photo proof'
                  : 'Complete this goal and add photo proof to mark it as done'}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Spacing for bottom */}
        <View className="h-safe-offset-8" />
      </ScrollView>
    </View>
  );
}
