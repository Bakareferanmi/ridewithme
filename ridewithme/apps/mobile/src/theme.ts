import { colors as darkColors, lightColors, radius, space, type ColorPalette } from '@rwm/tokens';

export { darkColors, lightColors, radius, space };
export type { ColorPalette };
export type ThemeMode = 'system' | 'light' | 'dark';

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
} as const;

/** Mobile type scale: each desktop size stepped down one level. */
export const VARIANTS = {
  h1: { size: 28, line: 36, font: fonts.semibold },
  h2: { size: 22, line: 30, font: fonts.semibold },
  h3: { size: 18, line: 26, font: fonts.semibold },
  title: { size: 16, line: 22, font: fonts.semibold },
  body: { size: 15, line: 22, font: fonts.regular },
  label: { size: 13, line: 18, font: fonts.medium },
  caption: { size: 11, line: 16, font: fonts.medium },
} as const;
export type Variant = keyof typeof VARIANTS;

export const EASE = { x1: 0.22, y1: 1, x2: 0.36, y2: 1 };
