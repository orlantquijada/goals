import GoalCard from '@/components/Goal/Card';
import { MAX_FREE_GOALS } from '@/constants/business';
import {
  ALPHA_TRANSPARENCY_15,
  ALPHA_TRANSPARENCY_30,
  colors,
  goalColorKeys,
  goalColors,
} from '@/constants/colors';
import { goalIconKeys, goalIcons } from '@/constants/icons';
import { topLeftToBottomRight } from '@/constants/linear-gradient';
import { transitions } from '@/constants/motion';
import { continuousCurve } from '@/constants/styles';
import { cn } from '@/lib/cn';
import type { GoalColor, GoalIcon } from '@/lib/goal';
import { toDateID } from '@/lib/utils';
import {
  type AddGoalValues,
  addGoal,
  selectGoalCount,
} from '@/stores/goals-store';
import { useAppDispatch, useAppSelector } from '@/stores/store';
import { selectIsSubscribed } from '@/stores/subscription-store';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { usePreventRemove } from '@react-navigation/native';
import { addDays, isSameDay } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INPUT_BAR_Y_PADDING = 12;
const INPUT_HEIGHT = 40;

export default function NewGoalPage() {
  const window = useWindowDimensions();
  const router = useRouter();
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const {
    isDirty,
    isValid,
    setDueDate,
    setIconColorName,
    setIconName,
    setTitle,
    values,
    reset,
  } = useForm();
  const { dueDate, iconColorName, iconName, title } = values;
  const dispatch = useAppDispatch();
  const isSubscribed = useAppSelector(selectIsSubscribed);
  const goalCount = useAppSelector(selectGoalCount);

  const { showActionSheetWithOptions } = useActionSheet();
  usePreventRemove(isDirty, ({ data }) => {
    showActionSheetWithOptions(
      {
        options: ['Cancel', 'Discard Changes'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
      },
      (selectedIndex) => {
        if (selectedIndex === 1) {
          navigation.dispatch(data.action);
        }
      }
    );
  });

  const handleSubmit = (formValues: AddGoalValues) => {
    if (!isSubscribed && goalCount >= MAX_FREE_GOALS) {
      Alert.alert(
        'Goal limit reached',
        `You can create up to ${MAX_FREE_GOALS} goals on the free plan.`,
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/subscribe') },
        ]
      );
      return;
    }

    dispatch(addGoal(formValues));
    reset();
    router.back();
  };

  const inputBarHeight = insets.bottom + INPUT_BAR_Y_PADDING + INPUT_HEIGHT;

  return (
    <View className="relative flex-1">
      <GradientBackground selectedColor={iconColorName} />

      <View className="h-14 flex-row items-center justify-between px-4">
        <Pressable
          className="transition-all active:scale-95 active:opacity-75"
          onPress={router.back}
        >
          <Text className="font-inter text-on-surface-2 text-sm">Cancel</Text>
        </Pressable>
        <Pressable
          className="transition-all active:scale-95 active:opacity-75 disabled:opacity-50"
          disabled={!isValid}
          onPress={() => {
            handleSubmit({
              color: iconColorName,
              dueDate: toDateID(dueDate),
              icon: iconName,
              title,
            });
          }}
        >
          <Text
            className={cn(
              'font-inter-semibold text-on-surface-2 text-sm transition-all',
              isValid && 'text-on-surface-1'
            )}
          >
            Create
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="relative flex-1"
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: inputBarHeight }}
      >
        <View
          className="w-full items-center justify-center"
          style={{ height: window.height * 0.4 }}
        >
          <View className="relative items-center justify-center">
            <View className="-top-2/3 absolute flex-row gap-2">
              <Pressable className="aspect-square h-8 items-center justify-center rounded-full bg-surface-3 transition-all active:scale-95">
                <Calendar color={colors['on-surface'][1]} size={16} />
              </Pressable>

              <Pressable
                className={cn(
                  'h-8 items-center justify-center rounded-full bg-surface-3 px-4 transition-all active:scale-95'
                )}
                onPress={() => {
                  setDueDate(TODAY);
                }}
                style={{
                  backgroundColor: isSameDay(TODAY, dueDate)
                    ? goalColors[iconColorName]
                    : colors.surface[3],
                }}
              >
                <Text className="font-inter-medium text-on-surface-1 text-xs">
                  Today
                </Text>
              </Pressable>

              <Pressable
                className="h-8 items-center justify-center rounded-full bg-surface-3 px-4 transition-all active:scale-95"
                onPress={() => {
                  setDueDate(TOMORROW);
                }}
                style={{
                  backgroundColor: isSameDay(TOMORROW, dueDate)
                    ? goalColors[iconColorName]
                    : colors.surface[3],
                }}
              >
                <Text className="font-inter-medium text-on-surface-1 text-xs">
                  Tomorrow
                </Text>
              </Pressable>
            </View>

            <GoalCard
              enabledIconAnimation
              goal={{ title, color: iconColorName, icon: iconName }}
              style={{
                minWidth: window.width * 0.5,
                maxWidth: window.width * 0.8,
              }}
            />
          </View>
        </View>

        <View className="items-center justify-center">
          <ColorsSection
            selectedColor={iconColorName}
            setIconColorName={setIconColorName}
          />

          <IconsSection
            selectedColor={iconColorName}
            setIconName={setIconName}
          />
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior="padding"
        className="mt-auto"
        keyboardVerticalOffset={inputBarHeight - INPUT_BAR_Y_PADDING * 2}
      >
        <View
          className="rounded-t-3xl border border-outline-1 bg-surface-3 px-5 pb-safe-offset-3"
          style={{ paddingTop: INPUT_BAR_Y_PADDING, height: inputBarHeight }}
        >
          <TextInput
            autoFocus
            className="items-center font-inter text-lg text-on-surface-1 selection:text-on-surface-1 placeholder:text-on-surface-3"
            onChangeText={setTitle}
            placeholder="Run a half marathon"
            style={{ lineHeight: undefined, height: INPUT_HEIGHT }}
            value={title}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const GradientBackground = memo(
  ({ selectedColor }: { selectedColor: GoalColor }) => {
    return (
      <LinearGradient
        colors={[
          colors.surface[1] + ALPHA_TRANSPARENCY_15,
          goalColors[selectedColor] + ALPHA_TRANSPARENCY_30,
        ]}
        end={topLeftToBottomRight.end}
        pointerEvents="none"
        start={topLeftToBottomRight.start}
        style={StyleSheet.absoluteFill}
      />
    );
  }
);

const ColorsSection = memo(
  ({
    selectedColor,
    setIconColorName,
  }: {
    setIconColorName: (color: GoalColor) => void;
    selectedColor: GoalColor;
  }) => {
    return (
      <View
        className="min-w-4/5 flex-row items-center justify-evenly gap-4 self-center rounded-[20] p-4"
        style={continuousCurve}
      >
        {goalColorKeys.map((color) => (
          <Pressable
            className="aspect-square h-8 items-center justify-center transition-all active:scale-95"
            key={color}
            onPress={() => {
              setIconColorName(color);
            }}
          >
            <View
              className="aspect-square h-7 items-center justify-center rounded-full"
              style={{ backgroundColor: goalColors[color] }}
            >
              {color === selectedColor && (
                <Animated.View
                  className="aspect-square h-4 rounded-full bg-on-surface-1"
                  entering={FadeIn.springify()
                    .stiffness(transitions.snappy.stiffness)
                    .damping(transitions.snappy.damping)}
                />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    );
  }
);

const IconsSection = memo(
  ({
    setIconName,
    selectedColor,
  }: {
    setIconName: (icon: GoalIcon) => void;
    selectedColor: GoalColor;
  }) => {
    return (
      <View
        className="items-center gap-6 p-4"
        style={[continuousCurve, { minWidth: '80%' }]}
      >
        <IconsRow
          icons={goalIconKeys.slice(0, 4)}
          selectedColor={selectedColor}
          setIconName={setIconName}
        />

        <IconsRow
          icons={goalIconKeys.slice(4)}
          selectedColor={selectedColor}
          setIconName={setIconName}
        />
      </View>
    );
  }
);

function IconsRow({
  icons,
  selectedColor,
  setIconName,
}: {
  icons: GoalIcon[];
  selectedColor: GoalColor;
  setIconName: (icon: GoalIcon) => void;
}) {
  return (
    <View className="flex-row items-center gap-6">
      {icons.map((icon) => {
        const Icon = goalIcons[icon];
        return (
          <Pressable
            className="aspect-square items-center justify-center transition-all active:scale-95"
            key={icon}
            onPress={() => {
              setIconName(icon);
            }}
          >
            <Icon color={goalColors[selectedColor]} size={28} strokeWidth={2} />
          </Pressable>
        );
      })}
    </View>
  );
}

const TODAY = new Date();
const TOMORROW = addDays(TODAY, 1);

type Fn = (...args: any[]) => void;

const initialValues: {
  title: string;
  iconName: GoalIcon;
  iconColorName: GoalColor;
  dueDate: Date;
} = {
  title: '',
  dueDate: TODAY,
  iconColorName: 'blue',
  iconName: 'target',
};

function useForm() {
  const [isDirty, setIsDirty] = useState(false);
  const [title, setTitle] = useState(initialValues.title);
  const [iconName, setIconName] = useState(initialValues.iconName);
  const [iconColorName, setIconColorName] = useState(
    initialValues.iconColorName
  );
  const [dueDate, setDueDate] = useState(initialValues.dueDate);

  const isValid = useMemo(() => !!title, [title]);

  const values = { title, iconName, iconColorName, dueDate };

  const withIsDirty = useCallback(<T extends Fn>(fn: T) => {
    return (...args: Parameters<T>) => {
      setIsDirty(true);
      fn(...args);
    };
  }, []);

  const _setTitle = withIsDirty(setTitle);
  const _setIconName = withIsDirty(setIconName);
  const _setIconColorName = withIsDirty(setIconColorName);
  const _setDueDate = withIsDirty(setDueDate);

  const reset = () => {
    setTitle(initialValues.title);
    setIconName(initialValues.iconName);
    setIconColorName(initialValues.iconColorName);
    setDueDate(initialValues.dueDate);
    setIsDirty(false);
  };

  return {
    values,
    isDirty,
    isValid,
    setTitle: _setTitle,
    setIconName: _setIconName,
    setIconColorName: _setIconColorName,
    setDueDate: _setDueDate,
    reset,
  };
}
