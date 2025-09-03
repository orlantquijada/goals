const { colors } = require('./src/constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        inter: 'Inter_400Regular',
        'inter-medium': 'Inter_500Medium',
        'inter-semibold': 'Inter_600SemiBold',
        'dm-serif': 'DMSerifDisplay_400Regular',
        'dm-serif-italic': 'DMSerifDisplay_400Regular_Italic',
      },
      colors: {
        surface: colors.surface,
        'on-surface': colors['on-surface'],
        outline: colors.outline,
        primary: colors.primary,
        secondary: colors.secondary,
        goals: colors.goals,
        destructive: colors.destructive,
      },
    },
  },
  plugins: [],
};
