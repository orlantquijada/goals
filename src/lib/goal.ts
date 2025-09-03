import type { DateID } from './utils';

export type GoalIcon =
  | 'target'
  | 'calendar'
  | 'book'
  | 'exercise'
  | 'work'
  | 'heart'
  | 'travel';

export type GoalColor = 'blue' | 'green' | 'orange' | 'purple' | 'red';

export type Goal = {
  id: string;
  title: string;
  createdAt: string;
  dueDate: DateID;
  completedAt?: string;
  icon: GoalIcon;
  color: GoalColor;
  proof?: string;
};
