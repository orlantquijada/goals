import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { continuousCurve } from '@/constants/styles';
import { cn } from '@/lib/cn';

type FABProps = {
  className?: string;
};

export default function FAB({ className }: FABProps) {
  const router = useRouter();
  return (
    <Pressable
      className={cn(
        'items-center justify-center rounded-2xl border border-on-surface-4 bg-on-surface-1 px-6 py-2.5 transition-all active:scale-95 active:opacity-75',
        className
      )}
      onPress={() => {
        router.push('/new');
      }}
      style={continuousCurve}
    >
      <Plus color={colors.surface[1]} size={32} />
    </Pressable>
  );
}
