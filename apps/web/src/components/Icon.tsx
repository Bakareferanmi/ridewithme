import type { IconName } from '@rwm/icons';
import type { ComponentPropsWithoutRef } from 'react';
import type { IconType } from 'react-icons';
import {
  LuArrowLeft,
  LuArrowRight,
  LuBell,
  LuCalendar,
  LuCarFront,
  LuChartColumn,
  LuCheck,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuCog,
  LuCreditCard,
  LuDownload,
  LuEye,
  LuFileText,
  LuFuel,
  LuGauge,
  LuGavel,
  LuGitCompareArrows,
  LuHeart,
  LuHouse,
  LuInfo,
  LuKeyRound,
  LuLayoutDashboard,
  LuLock,
  LuLogOut,
  LuMail,
  LuMapPin,
  LuMenu,
  LuMinus,
  LuMoon,
  LuPackage,
  LuPencil,
  LuPhone,
  LuPlus,
  LuRoute,
  LuSearch,
  LuSettings,
  LuShare2,
  LuShieldCheck,
  LuSlidersHorizontal,
  LuStar,
  LuSun,
  LuTag,
  LuTrash2,
  LuTriangleAlert,
  LuUser,
  LuUsers,
  LuWallet,
  LuX,
  LuZap,
} from 'react-icons/lu';

/** Every name in the shared icon set maps to a Lucide glyph from react-icons. */
const glyphs: Record<IconName, IconType> = {
  // Navigation and discovery
  home: LuHouse,
  search: LuSearch,
  heart: LuHeart,
  bell: LuBell,
  user: LuUser,
  filter: LuSlidersHorizontal,
  pin: LuMapPin,
  calendar: LuCalendar,
  menu: LuMenu,
  chevronRight: LuChevronRight,
  chevronLeft: LuChevronLeft,
  chevronDown: LuChevronDown,
  arrowRight: LuArrowRight,
  arrowLeft: LuArrowLeft,
  close: LuX,
  plus: LuPlus,
  minus: LuMinus,
  check: LuCheck,
  // Vehicles and transactions
  car: LuCarFront,
  key: LuKeyRound,
  lease: LuFileText,
  auction: LuGavel,
  payment: LuCreditCard,
  wallet: LuWallet,
  shield: LuShieldCheck,
  gauge: LuGauge,
  fuel: LuFuel,
  zap: LuZap,
  route: LuRoute,
  compare: LuGitCompareArrows,
  gear: LuCog,
  // Admin and management
  dashboard: LuLayoutDashboard,
  chart: LuChartColumn,
  users: LuUsers,
  settings: LuSettings,
  tag: LuTag,
  package: LuPackage,
  clock: LuClock,
  mail: LuMail,
  phone: LuPhone,
  edit: LuPencil,
  trash: LuTrash2,
  download: LuDownload,
  share: LuShare2,
  lock: LuLock,
  logout: LuLogOut,
  // Status
  info: LuInfo,
  alert: LuTriangleAlert,
  errorCircle: LuCircleX,
  checkCircle: LuCircleCheck,
  star: LuStar,
  sun: LuSun,
  moon: LuMoon,
  eye: LuEye,
};

interface IconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'name' | 'color'> {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Decorative by default. Wrap in a labelled button when the icon is the only content. */
export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.9, fill = 'none', ...rest }: IconProps) {
  const Glyph = glyphs[name];
  return <Glyph size={size} color={color} strokeWidth={strokeWidth} fill={fill} aria-hidden="true" focusable="false" {...rest} />;
}
