import Svg, { Circle } from 'react-native-svg';
import type { IconProps } from '.';

export default function Donut({
  size = 24,
  strokeWidth = 2,
  color,
}: IconProps & {
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  return (
    <Svg height={size} width={size}>
      <Circle
        cx={center}
        cy={center}
        fill="none"
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}
