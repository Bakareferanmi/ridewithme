/**
 * RideWithMe icon set. One 24px grid, 1.75 stroke, round caps and joins, no fills.
 * Pure data so web (svg) and mobile (react-native-svg) render the same glyphs.
 */

export type IconNode =
  | { tag: 'path'; d: string }
  | { tag: 'circle'; cx: number; cy: number; r: number }
  | { tag: 'rect'; x: number; y: number; width: number; height: number; rx?: number };

const p = (d: string): IconNode => ({ tag: 'path', d });
const c = (cx: number, cy: number, r: number): IconNode => ({ tag: 'circle', cx, cy, r });
const r = (x: number, y: number, width: number, height: number, rx?: number): IconNode => ({
  tag: 'rect',
  x,
  y,
  width,
  height,
  rx,
});

export const iconViewBox = '0 0 24 24';
export const iconStrokeWidth = 1.75;

export const icons = {
  // Navigation and discovery
  home: [p('M3 11l9-8 9 8'), p('M5 10v10h14V10'), p('M10 20v-6h4v6')],
  search: [c(11, 11, 7), p('M20 20l-3.5-3.5')],
  heart: [p('M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z')],
  bell: [p('M6 9a6 6 0 0 1 12 0c0 6 2 7 2 8H4c0-1 2-2 2-8z'), p('M10 21h4')],
  user: [c(12, 8, 4), p('M4 21c0-4 4-6 8-6s8 2 8 6')],
  filter: [p('M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0'), c(15, 6, 2.5), c(9, 12, 2.5), c(17, 18, 2.5)],
  pin: [p('M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z'), c(12, 10, 2.5)],
  calendar: [r(4, 5, 16, 16, 2), p('M4 10h16M9 3v4M15 3v4')],
  menu: [p('M4 7h16M4 12h16M4 17h16')],
  chevronRight: [p('M9 6l6 6-6 6')],
  chevronLeft: [p('M15 6l-6 6 6 6')],
  chevronDown: [p('M6 9l6 6 6-6')],
  arrowRight: [p('M5 12h14M13 6l6 6-6 6')],
  arrowLeft: [p('M19 12H5M11 6l-6 6 6 6')],
  close: [p('M6 6l12 12M18 6L6 18')],
  plus: [p('M12 5v14M5 12h14')],
  minus: [p('M5 12h14')],
  check: [p('M5 12l5 5 9-10')],
  // Vehicles and transactions
  car: [p('M3 13l2-6a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 6'), r(3, 13, 18, 5, 2), p('M5 18v2M19 18v2M7 15.5h1M16 15.5h1')],
  key: [c(8, 15, 4), p('M11 12l9-9M16 7l3 3')],
  lease: [p('M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z'), p('M14 3v5h5M9 13h6M9 17h6')],
  auction: [p('M14.5 4.5l5 5-3 3-5-5z'), p('M12 10L4 18'), p('M3 21h9')],
  payment: [r(3, 5, 18, 14, 2), p('M3 10h18M7 15h4')],
  wallet: [p('M3 7a2 2 0 0 1 2-2h13v4'), r(3, 7, 18, 13, 2), p('M16 14h2')],
  shield: [p('M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z'), p('M9 12l2 2 4-4')],
  gauge: [p('M4 17a8 8 0 1 1 16 0'), p('M12 17l4-5')],
  fuel: [p('M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14'), p('M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3')],
  zap: [p('M13 3L5 14h6l-1 7 8-11h-6z')],
  route: [c(6, 19, 2), c(18, 5, 2), p('M8 19h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8')],
  compare: [p('M7 4v16M17 4v16M3 8l4-4 4 4M13 16l4 4 4-4')],
  gear: [c(12, 12, 3), p('M12 3v3M12 18v3M3 12h3M18 12h3')],
  // Admin and management
  dashboard: [r(3, 3, 7, 9, 1.5), r(14, 3, 7, 5, 1.5), r(14, 12, 7, 9, 1.5), r(3, 16, 7, 5, 1.5)],
  chart: [p('M4 20V4M4 20h16'), p('M8 16v-5M12 16V8M16 16v-8')],
  users: [c(9, 8, 3.5), p('M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5'), p('M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2.5.6 4 2.2 4 5')],
  settings: [c(12, 12, 3), p('M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1')],
  tag: [p('M3 12V4h8l10 10-8 8z'), c(7.5, 8.5, 1.2)],
  package: [p('M3 8l9-5 9 5v8l-9 5-9-5z'), p('M3 8l9 5 9-5M12 13v8')],
  clock: [c(12, 12, 9), p('M12 7v5l3 2')],
  mail: [r(3, 5, 18, 14, 2), p('M3 7l9 6 9-6')],
  phone: [p('M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z')],
  edit: [p('M4 20l1-5L16 4l4 4L9 19z'), p('M14 6l4 4')],
  trash: [p('M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3')],
  download: [p('M12 4v11M7 11l5 5 5-5M4 20h16')],
  share: [p('M12 4v11M7 9l5-5 5 5M4 20h16')],
  lock: [r(5, 11, 14, 10, 2), p('M8 11V8a4 4 0 0 1 8 0v3')],
  logout: [p('M9 21H5V3h4M16 17l5-5-5-5M21 12H9')],
  // Status
  info: [c(12, 12, 9), p('M12 11v5M12 8h0')],
  alert: [p('M12 3l10 18H2z'), p('M12 10v5M12 18h0')],
  errorCircle: [c(12, 12, 9), p('M9 9l6 6M15 9l-6 6')],
  checkCircle: [c(12, 12, 9), p('M8 12l3 3 5-6')],
  star: [p('M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9z')],
  sun: [c(12, 12, 4), p('M12 2v2'), p('M12 20v2'), p('M4.9 4.9l1.4 1.4'), p('M17.7 17.7l1.4 1.4'), p('M2 12h2'), p('M20 12h2'), p('M4.9 19.1l1.4-1.4'), p('M17.7 6.3l1.4-1.4')],
  moon: [p('M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z')],
  eye: [p('M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z'), c(12, 12, 3)],
} satisfies Record<string, IconNode[]>;

export type IconName = keyof typeof icons;
