import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors, ThemeColors } from './colors';

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const isDark = mode === 'dark';
  const colors: ThemeColors = isDark ? darkColors : lightColors;

  return {
    mode,
    isDark,
    colors,
    toggleTheme: useThemeStore.getState().toggleTheme,
    setTheme: useThemeStore.getState().setTheme,
  };
}
