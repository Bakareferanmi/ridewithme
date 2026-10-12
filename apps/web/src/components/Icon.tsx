import { icons, iconStrokeWidth, iconViewBox, type IconName } from '@rwm/icons';
import type { SVGProps } from 'react';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'color'> {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Decorative by default. Wrap in a labelled button when the icon is the only content. */
export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = iconStrokeWidth, fill = 'none', ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={iconViewBox}
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {icons[name].map((n, i) => {
        if (n.tag === 'path') return <path key={i} d={n.d} />;
        if (n.tag === 'circle') return <circle key={i} cx={n.cx} cy={n.cy} r={n.r} />;
        return <rect key={i} x={n.x} y={n.y} width={n.width} height={n.height} rx={n.rx} />;
      })}
    </svg>
  );
}
