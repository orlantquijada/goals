import {
  BookOpen,
  Briefcase,
  Calendar,
  Dumbbell,
  Earth,
  Heart,
  type LucideIcon,
  Target,
} from 'lucide-react-native';
import type { GoalIcon } from '@/lib/goal';

export const goalIcons: Record<GoalIcon, LucideIcon> = {
  target: Target,
  calendar: Calendar,
  book: BookOpen,
  exercise: Dumbbell,
  work: Briefcase,
  heart: Heart,
  travel: Earth,
};

export const goalIconKeys = Object.keys(goalIcons) as GoalIcon[];
