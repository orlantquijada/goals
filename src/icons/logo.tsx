import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';
import type { IconProps } from '.';

export function Logo({ size = 24 }: IconProps) {
  return (
    <Svg
      fill="none"
      height={size}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      <Defs>
        <LinearGradient id="goalGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor="#6f53f9" />
          <Stop offset="100%" stopColor="#6f53f9" />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 13V2l8 4-8 4"
        fill="url(#goalGradient)"
        stroke="url(#goalGradient)"
      />
      <Path
        d="M20.561 10.222a9 9 0 1 1-12.55-5.29"
        stroke="url(#goalGradient)"
      />
      <Path d="M8.002 9.997a5 5 0 1 0 8.9 2.02" stroke="url(#goalGradient)" />
    </Svg>
  );
}
