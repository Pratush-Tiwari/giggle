import { useTheme } from './theme-context';
import { colors } from './theme';

export function useThemeColors() {
  const { theme } = useTheme();
  return colors[theme];
}
