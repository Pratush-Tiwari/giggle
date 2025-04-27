import React, { useState } from 'react';
import { Button } from './@/components/ui/button';
import { ThemeProvider } from './lib/theme-context';
import { ThemeToggle } from './components/theme-toggle';
import { Switch } from './@/components/ui/switch';

const App: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-w-[300px] min-h-[400px] p-4 bg-neutral-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Giggle Extension</h1>
          <ThemeToggle />
        </div>
        <p>Welcome to your Chrome extension!</p>
        <div className="mt-4 space-x-2">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <Switch
          checked={isChecked}
          onCheckedChange={() => setIsChecked(!isChecked)}
          className="mt-2"
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
