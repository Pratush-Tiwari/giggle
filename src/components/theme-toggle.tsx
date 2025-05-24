import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { Switch } from './ui/switch';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-neutral-900" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 [&>span]:bg-white"
      />

      <Moon className="h-4 w-4 text-neutral-900" />
    </div>
  );
}
