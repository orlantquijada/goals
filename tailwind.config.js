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
      },
      colors: {
        surface: colors.surface,
        'on-surface': colors['on-surface'],
        outline: colors.outline,
      },
    },
  },
  plugins: [],
};
