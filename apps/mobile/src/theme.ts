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
  h1: { size: 26, line: 34, font: fonts.semibold },
  h2: { size: 22, line: 30, font: fonts.semibold },
  h3: { size: 17, line: 24, font: fonts.semibold },
  title: { size: 15, line: 21, font: fonts.semibold },
  body: { size: 14, line: 21, font: fonts.regular },
  label: { size: 12.5, line: 17, font: fonts.medium },
  caption: { size: 11, line: 16, font: fonts.medium },
} as const;
export type Variant = keyof typeof VARIANTS;

export const EASE = { x1: 0.22, y1: 1, x2: 0.36, y2: 1 };

/** One spacing scale for every page: side gutter, space below the status bar, gap between sections, room for the tab bar. */
export const layout = { gutter: 24, top: 24, section: 32, item: 20, tabBar: 132 } as const;
