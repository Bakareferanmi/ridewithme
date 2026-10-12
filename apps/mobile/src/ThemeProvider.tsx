import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useStore } from './store';
import { darkColors, lightColors, type ColorPalette, type ThemeMode } from './theme';

interface ThemeValue { colors: ColorPalette; scheme: 'light' | 'dark'; mode: ThemeMode; setMode: (m: ThemeMode) => void }
const Ctx = createContext<ThemeValue | null>(null);

/** Follows the phone's appearance until the user picks Light or Dark in Profile. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const { themeMode, setThemeMode } = useStore();
  const scheme: 'light' | 'dark' = themeMode === 'system' ? (system === 'light' ? 'light' : 'dark') : themeMode;
  const value = useMemo<ThemeValue>(() => ({ colors: scheme === 'light' ? lightColors : darkColors, scheme, mode: themeMode, setMode: setThemeMode }), [scheme, themeMode, setThemeMode]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme outside ThemeProvider');
  return v;
}

export const useColors = () => useTheme().colors;

/** Build a StyleSheet from the current palette, rebuilt only when the theme changes. */
export function useThemedStyles<T>(make: (c: ColorPalette) => T): T {
  const colors = useColors();
  return useMemo(() => make(colors), [colors, make]);
}
