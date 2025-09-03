/** biome-ignore-all lint/style/noMagicNumbers: going to be a lot of magic numbers here */

import {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

export const easing = {
  tailwindPing: Easing.bezier(0, 0, 0.2, 1),
};

export const transitions = {
  snappy: {
    stiffness: 300,
    damping: 30,
  },
};

export const layoutSpringify = LinearTransition.springify()
  .stiffness(transitions.snappy.stiffness)
  .damping(transitions.snappy.damping);
export const fadeOutSpringify = FadeOut.springify()
  .stiffness(transitions.snappy.stiffness)
  .damping(transitions.snappy.damping);
export const fadeInSpringify = FadeIn.springify()
  .stiffness(transitions.snappy.stiffness)
  .damping(transitions.snappy.damping);
