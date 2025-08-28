import { Path, Svg } from 'react-native-svg';
import type { IconProps } from '.';

export function Logo2({ size = 24 }: IconProps) {
  return (
    <Svg
      fill="none"
      height={size}
      stroke="#6F53F9"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width={size}
    >
      <Path d="M12 13V2l8 4-8 4" fill="#6F53F9" />
      <Path d="M20.561 10.222a9 9 0 1 1-12.55-5.29" />
      <Path d="M8.002 9.997a5 5 0 1 0 8.9 2.02" />
    </Svg>
  );
}
