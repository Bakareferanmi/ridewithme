import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useColors } from './ThemeProvider';
import { icons, iconStrokeWidth, iconViewBox, type IconName } from '@rwm/icons';

export function Icon({ name, size = 24, color, fill = 'none' }: { name: IconName; size?: number; color?: string; fill?: string }) {
  const colors = useColors();
  const stroke = color ?? colors.text;
  return (
    <Svg width={size} height={size} viewBox={iconViewBox} fill={fill} stroke={stroke} strokeWidth={iconStrokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {icons[name].map((n, i) => {
        if (n.tag === 'path') return <Path key={i} d={n.d} />;
        if (n.tag === 'circle') return <Circle key={i} cx={n.cx} cy={n.cy} r={n.r} />;
        return <Rect key={i} x={n.x} y={n.y} width={n.width} height={n.height} rx={n.rx} />;
      })}
    </Svg>
  );
}
