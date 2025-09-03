/** biome-ignore-all lint/style/noMagicNumbers: going to be a lot of magic numbers here */

import type { GoalColor } from '@/lib/goal';

export const goalColors: Record<GoalColor, string> = {
  blue: '#3B82F6',
  green: '#22c55e',
  orange: '#f97316',
  purple: '#8b5cf6',
  red: '#ec4899',
};

export const colors = {
  surface: {
    1: '#010318',
    2: '#0f1224',
    3: '#1b1d31',
    4: '#272a3f',
    5: '#f0f1f4',
  },
  'on-surface': {
    1: '#f0f1f4',
    2: '#b5b7ca',
    3: '#7a7e9f',
    4: '#4b4e68',
    5: '#010318',
  },
  outline: {
    1: '#272a3f',
    2: '#33364d',
  },
  primary: {
    DEFAULT: '#6F53F9',
    on: '#F9FAFB',
  },
  secondary: {
    DEFAULT: '#272A3F',
    on: '#F0F1F4',
  },
  goals: goalColors,
  destructive: '#FF3B30',
};

function getAlphaTransparencyHex(percentage: number): string {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const decimalAlpha = Math.round((clampedPercentage / 100) * 255);
  return decimalAlpha.toString(16).padStart(2, '0');
}

export const ALPHA_TRANSPARENCY_00 = getAlphaTransparencyHex(0);
export const ALPHA_TRANSPARENCY_05 = getAlphaTransparencyHex(5);
export const ALPHA_TRANSPARENCY_10 = getAlphaTransparencyHex(10);
export const ALPHA_TRANSPARENCY_15 = getAlphaTransparencyHex(15);
export const ALPHA_TRANSPARENCY_20 = getAlphaTransparencyHex(20);
export const ALPHA_TRANSPARENCY_25 = getAlphaTransparencyHex(25);
export const ALPHA_TRANSPARENCY_30 = getAlphaTransparencyHex(30);
export const ALPHA_TRANSPARENCY_50 = getAlphaTransparencyHex(50);
export const ALPHA_TRANSPARENCY_75 = getAlphaTransparencyHex(75);

export const goalColorValues = Object.values(goalColors);
export const goalColorKeys = Object.keys(goalColors) as GoalColor[];
