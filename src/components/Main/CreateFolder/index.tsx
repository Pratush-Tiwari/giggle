import { memo, useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FolderPlus } from 'lucide-react';
import { useFolders } from '@/hooks/useFolders';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  onSuccess?: () => void;
}

interface ColorOption {
  value: string;
  label: string;
  colorClass: string;
}

export const CreateFolder = memo(({ onSuccess }: Props) => {
  const colorOptions: ColorOption[] = [
    { value: 'blue', label: 'Blue', colorClass: 'bg-blue-600' },
    { value: 'green', label: 'Green', colorClass: 'bg-green-600' },
    { value: 'yellow', label: 'Yellow', colorClass: 'bg-yellow-500' },
    { value: 'orange', label: 'Orange', colorClass: 'bg-orange-500' },
    { value: 'rose', label: 'Rose', colorClass: 'bg-rose-500' },
  ];

  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>(colorOptions[0]?.value || 'blue');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createFolder } = useFolders();
  const { currentUser } = useAuth();

  const selectedColor = colorOptions.find(option => option.value === color) || colorOptions[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currentUser || isLoading) return;

    setIsLoading(true);
    try {
      await createFolder({
        name: name.trim(),
        color,
        userId: currentUser.uid,
        order: 0,
        isArchived: false,
        isSystemFolder: false,
      });
      setName('');
      setColor(colorOptions[0]?.value || 'blue');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create folder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FolderPlus className="h-5 w-5 mr-2 text-primary" />
          Create New Folder
        </CardTitle>
        <CardDescription>
          Organize your content by creating a new folder with a name and color.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Work Projects, Personal Ideas"
              className="w-full !my-input"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folderColor">Folder Color</Label>
            <Select value={color} onValueChange={setColor} disabled={isLoading}>
              <SelectTrigger id="folderColor" className="w-full !my-input">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${selectedColor?.colorClass}`} />
                    <span>{selectedColor?.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${option.colorClass}`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || !currentUser || isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Folder
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});
