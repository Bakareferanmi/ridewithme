/**
 * RideWithMe design tokens. Single source of truth for web, admin and mobile.
 * Dark first. Orange is the only accent: use it for action, never decoration.
 */

export const colors = {
  bg: '#0A0A0A',
  bgElevated: '#0F0F0F',
  surface1: '#121212',
  surface2: '#1A1A1A',
  surface3: '#232323',
  border: '#2C2C2C',
  borderStrong: '#3A3A3A',
  text: '#F5F5F5',
  text2: '#A8A8A8',
  text3: '#8A8A8A',
  disabled: '#5C5C5C',
  orange400: '#FF7A2B',
  orange500: '#F4650D',
  orange600: '#D9540A',
  orangeTint: 'rgba(244,101,13,0.16)',
  orangeGlow: 'rgba(244,101,13,0.28)',
  onPrimary: '#0A0A0A',
  success: '#3DD68C',
  successTint: 'rgba(61,214,140,0.14)',
  warning: '#FFC247',
  warningTint: 'rgba(255,194,71,0.14)',
  danger: '#FF5C5C',
  dangerTint: 'rgba(255,92,92,0.14)',
  info: '#5AA9FF',
  infoTint: 'rgba(90,169,255,0.14)',
  overlay: 'rgba(10,10,10,0.8)',
  glass: 'rgba(10,10,10,0.82)',
  scrim: 'rgba(0,0,0,0.7)',
  artA: '#202020',
  artB: '#121212',
  artIcon: '#4A4A4A',
  shine: 'rgba(255,255,255,0.06)',
  ring: 'rgba(255,255,255,0.14)',
  ring2: 'rgba(255,255,255,0.06)',
} as const;

export type ColorPalette = { [K in keyof typeof colors]: string };

/** Light theme. Same keys as `colors`. Orange text is darkened for contrast on white. */
export const lightColors: ColorPalette = {
  bg: '#FAFAFA',
  bgElevated: '#FFFFFF',
  surface1: '#FFFFFF',
  surface2: '#F3F3F3',
  surface3: '#EBEBEB',
  border: '#E4E4E4',
  borderStrong: '#D0D0D0',
  text: '#141414',
  text2: '#525252',
  text3: '#6B6B6B',
  disabled: '#A8A8A8',
  orange400: '#D9540A',
  orange500: '#F4650D',
  orange600: '#B8470A',
  orangeTint: 'rgba(244,101,13,0.12)',
  orangeGlow: 'rgba(244,101,13,0.22)',
  onPrimary: '#0A0A0A',
  success: '#1B8F59',
  successTint: 'rgba(27,143,89,0.12)',
  warning: '#A86A00',
  warningTint: 'rgba(255,194,71,0.26)',
  danger: '#D03232',
  dangerTint: 'rgba(208,50,50,0.1)',
  info: '#1F6FC9',
  infoTint: 'rgba(31,111,201,0.1)',
  overlay: 'rgba(255,255,255,0.88)',
  glass: 'rgba(250,250,250,0.85)',
  scrim: 'rgba(10,10,10,0.45)',
  artA: '#ECECEC',
  artB: '#DCDCDC',
  artIcon: '#B5B5B5',
  shine: 'rgba(255,255,255,0.5)',
  ring: 'rgba(0,0,0,0.14)',
  ring2: 'rgba(0,0,0,0.07)',
};

export type ColorToken = keyof typeof colors;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

/** Desktop type scale (px). Mobile steps each size down one level in apps/mobile/src/theme.ts. */
export const typeScale = {
  display: { size: 48, line: 56, weight: 600 },
  h1: { size: 36, line: 44, weight: 600 },
  h2: { size: 28, line: 36, weight: 600 },
  h3: { size: 22, line: 30, weight: 600 },
  title: { size: 17, line: 24, weight: 600 },
  bodyL: { size: 18, line: 28, weight: 400 },
  body: { size: 16, line: 24, weight: 400 },
  label: { size: 14, line: 20, weight: 500 },
  caption: { size: 12, line: 16, weight: 500 },
} as const;

export type TypeToken = keyof typeof typeScale;

/** 4 px base grid. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const shadows = {
  raised: '0 8px 24px rgba(0,0,0,0.5)',
  overlay: '0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(244,101,13,0.25)',
  glow: '0 0 0 4px rgba(244,101,13,0.2)',
} as const;

export const lightShadows = {
  raised: '0 8px 24px rgba(20,20,20,0.10)',
  overlay: '0 16px 48px rgba(20,20,20,0.18), 0 0 0 1px rgba(244,101,13,0.25)',
  glow: '0 0 0 4px rgba(244,101,13,0.2)',
} as const;

export const motionTokens = {
  /** seconds, for CSS and framer-motion */
  duration: { fast: 0.15, base: 0.25, slow: 0.45 },
  /** milliseconds, for react-native-reanimated */
  durationMs: { fast: 150, base: 250, slow: 450 },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: { type: 'spring' as const, stiffness: 380, damping: 30 },
} as const;

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1100,
} as const;
