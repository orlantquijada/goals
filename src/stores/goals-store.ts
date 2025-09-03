import { goalColorKeys } from '@/constants/colors';
import { goalIconKeys } from '@/constants/icons';
import type { Goal } from '@/lib/goal';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as Crypto from 'expo-crypto';
import { z } from 'zod/mini';

type GoalState = {
  goals: Goal[];
};

const initialState: GoalState = {
  goals: [],
};

export const addGoalSchema = z.object({
  title: z.string().check(z.minLength(3), z.trim()),
  color: z.enum(goalColorKeys),
  icon: z.enum(goalIconKeys),
  dueDate: z.iso.date(),
});

export type AddGoalValues = z.infer<typeof addGoalSchema>;

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<AddGoalValues>) => {
      const parseAttempt = addGoalSchema.safeParse(action.payload);
      if (!parseAttempt.success) {
        return;
      }

      const { title, color, icon, dueDate } = parseAttempt.data;

      state.goals.push({
        title,
        color,
        icon,
        dueDate,
        createdAt: new Date().toISOString(),
        id: Crypto.randomUUID(),
      });
    },
    completeGoal: (
      state,
      action: PayloadAction<Required<Pick<Goal, 'proof' | 'id'>>>
    ) => {
      const goal = state.goals.find((t) => t.id === action.payload.id);
      if (goal && action.payload) {
        goal.completedAt = new Date().toISOString();
        goal.proof = action.payload.proof;
      }
    },
    removeGoal: (state, action: PayloadAction<Goal['id']>) => {
      state.goals = state.goals.filter((t) => t.id !== action.payload);
    },
  },
  selectors: {
    selectGoalCount: (state) => state.goals.length,
    selectUncompletedGoals: (state) =>
      state.goals.filter((t) => !t.completedAt),
    selectCompletedGoals: (state) => state.goals.filter((t) => t.completedAt),
  },
});

export const { addGoal, removeGoal, completeGoal } = goalsSlice.actions;
export const { selectGoalCount, selectUncompletedGoals, selectCompletedGoals } =
  goalsSlice.selectors;
export default goalsSlice.reducer;

const mockData: Goal[] = [
  {
    id: '1',
    title: 'Finish TypeScript Project',
    createdAt: '2025-08-01T10:00:00Z',
    dueDate: '2025-08-15T23:59:59Z',
    completedAt: undefined,
    icon: 'work',
    color: 'blue',
  },
  {
    id: '2',
    title: 'Read 5 Books',
    createdAt: '2025-07-20T08:30:00Z',
    dueDate: '2025-08-15T23:59:59Z',
    completedAt: undefined,
    icon: 'book',
    color: 'green',
  },
  {
    id: '3',
    title: 'Run a Half Marathon',
    createdAt: '2025-06-10T14:15:00Z',
    dueDate: '2025-08-01T07:00:00Z',
    completedAt: undefined,
    icon: 'exercise',
    color: 'red',
  },
  {
    id: '4',
    title: 'Plan Family Vacation',
    createdAt: '2025-05-05T09:00:00Z',
    dueDate: '2025-08-16T12:00:00Z',
    completedAt: '2025-08-25T18:00:00Z',
    icon: 'travel',
    color: 'orange',
  },
  {
    id: '5',
    title: 'Daily Meditation Habit',
    createdAt: '2025-01-01T06:00:00Z',
    dueDate: '2025-08-29T23:59:59Z',
    completedAt: undefined,
    icon: 'heart',
    color: 'purple',
  },
  {
    id: '6',
    title: 'Organize Weekly Schedule',
    createdAt: '2025-08-15T11:45:00Z',
    dueDate: '2025-08-05T23:59:59Z',
    completedAt: '2025-08-30T20:00:00Z',
    icon: 'calendar',
    color: 'blue',
  },
  {
    id: '7',
    title: 'Hit Monthly Sales Target',
    createdAt: '2025-08-01T09:00:00Z',
    dueDate: '2025-08-08T23:59:59Z',
    completedAt: undefined,
    icon: 'target',
    color: 'blue',
  },
];
