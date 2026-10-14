import type { ComponentType } from 'react';
import {
  ArrowLeft, ArrowLeftRight, ArrowRight, Bell, Calendar, CarFront, ChartColumn, Check, ChevronDown, ChevronLeft,
  ChevronRight, CircleAlert, CircleCheck, Clock, Cog, CreditCard, Download, Eye, FileText, Fuel, Gauge, Gavel,
  Heart, House, Info, KeyRound, LayoutDashboard, Lock, LogOut, Mail, MapPin, Menu, Minus, Moon, Package, Pencil,
  Phone, Plus, Route, Search, Settings, Share2, ShieldCheck, SlidersHorizontal, Star, Sun, Tag, Trash2,
  TriangleAlert, User, Users, Wallet, X, Zap,
} from 'lucide-react-native';
import type { IconName } from '@rwm/icons';
import { useColors } from './ThemeProvider';

type LucideLike = ComponentType<{ size?: number; color?: string; strokeWidth?: number; fill?: string }>;

const map: Record<IconName, LucideLike> = {
  home: House, search: Search, heart: Heart, bell: Bell, user: User, filter: SlidersHorizontal, pin: MapPin,
  calendar: Calendar, menu: Menu, chevronRight: ChevronRight, chevronLeft: ChevronLeft, chevronDown: ChevronDown,
  arrowRight: ArrowRight, arrowLeft: ArrowLeft, close: X, plus: Plus, minus: Minus, check: Check, car: CarFront,
  key: KeyRound, lease: FileText, auction: Gavel, payment: CreditCard, wallet: Wallet, shield: ShieldCheck,
  gauge: Gauge, fuel: Fuel, zap: Zap, route: Route, compare: ArrowLeftRight, gear: Cog, dashboard: LayoutDashboard,
  chart: ChartColumn, users: Users, settings: Settings, tag: Tag, package: Package, clock: Clock, mail: Mail,
  phone: Phone, edit: Pencil, trash: Trash2, download: Download, share: Share2, lock: Lock, logout: LogOut,
  info: Info, alert: TriangleAlert, errorCircle: CircleAlert, checkCircle: CircleCheck, star: Star, sun: Sun,
  moon: Moon, eye: Eye,
};

export function Icon({ name, size = 24, color, fill = 'none', strokeWidth = 1.75 }: { name: IconName; size?: number; color?: string; fill?: string; strokeWidth?: number }) {
  const colors = useColors();
  const Cmp = map[name];
  return <Cmp size={size} color={color ?? colors.text} strokeWidth={strokeWidth} fill={fill} />;
}
