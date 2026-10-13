import type { IconName } from '@rwm/icons';
import type { ComponentPropsWithoutRef, ComponentType } from 'react';
import {
  LuArrowLeft, LuArrowLeftRight, LuArrowRight, LuBell, LuCalendar, LuCarFront, LuChartColumn, LuCheck,
  LuChevronDown, LuChevronLeft, LuChevronRight, LuCircleAlert, LuCircleCheck, LuClock, LuCog, LuCreditCard,
  LuDownload, LuEye, LuFileText, LuFuel, LuGauge, LuGavel, LuHeart, LuHouse, LuInfo, LuKeyRound,
  LuLayoutDashboard, LuLock, LuLogOut, LuMail, LuMapPin, LuMenu, LuMinus, LuMoon, LuPackage, LuPencil,
  LuPhone, LuPlus, LuRoute, LuSearch, LuSettings, LuShare2, LuShieldCheck, LuSlidersHorizontal, LuStar,
  LuSun, LuTag, LuTrash2, LuTriangleAlert, LuUser, LuUsers, LuWallet, LuX, LuZap,
} from 'react-icons/lu';

type LuProps = ComponentPropsWithoutRef<'svg'> & { size?: number | string; color?: string };

const map: Record<IconName, ComponentType<LuProps>> = {
  home: LuHouse, search: LuSearch, heart: LuHeart, bell: LuBell, user: LuUser, filter: LuSlidersHorizontal,
  pin: LuMapPin, calendar: LuCalendar, menu: LuMenu, chevronRight: LuChevronRight, chevronLeft: LuChevronLeft,
  chevronDown: LuChevronDown, arrowRight: LuArrowRight, arrowLeft: LuArrowLeft, close: LuX, plus: LuPlus,
  minus: LuMinus, check: LuCheck, car: LuCarFront, key: LuKeyRound, lease: LuFileText, auction: LuGavel,
  payment: LuCreditCard, wallet: LuWallet, shield: LuShieldCheck, gauge: LuGauge, fuel: LuFuel, zap: LuZap,
  route: LuRoute, compare: LuArrowLeftRight, gear: LuCog, dashboard: LuLayoutDashboard, chart: LuChartColumn,
  users: LuUsers, settings: LuSettings, tag: LuTag, package: LuPackage, clock: LuClock, mail: LuMail,
  phone: LuPhone, edit: LuPencil, trash: LuTrash2, download: LuDownload, share: LuShare2, lock: LuLock,
  logout: LuLogOut, info: LuInfo, alert: LuTriangleAlert, errorCircle: LuCircleAlert, checkCircle: LuCircleCheck,
  star: LuStar, sun: LuSun, moon: LuMoon, eye: LuEye,
};

interface IconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'name' | 'color'> {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Decorative by default. Wrap in a labelled button when the icon is the only content. */
export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.75, ...rest }: IconProps) {
  const Cmp = map[name];
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...rest} />;
}
