import { useTheme } from './theme-context';
import { colors, type ColorPalette } from './theme';

export function useThemeColors(): ColorPalette[keyof ColorPalette] {
  const { theme } = useTheme();
  return colors[theme];
}
