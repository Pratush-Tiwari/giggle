import { useState } from 'react';
import { useFolders } from '../hooks/useFolders';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderPlus } from 'lucide-react';

export const CreateFolder = (): JSX.Element => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('gray');
  const { createFolder } = useFolders();
  const { currentUser } = useAuth();
  const colorOptions = [
    { value: 'gray', label: 'Gray', colorClass: 'bg-gray-500' },
    { value: 'blue', label: 'Blue', colorClass: 'bg-blue-500' },
    { value: 'green', label: 'Green', colorClass: 'bg-green-500' },
    { value: 'red', label: 'Red', colorClass: 'bg-red-500' },
    { value: 'yellow', label: 'Yellow', colorClass: 'bg-yellow-500' },
    { value: 'purple', label: 'Purple', colorClass: 'bg-purple-500' },
  ];

  const selectedColor = colorOptions.find(option => option.value === color);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currentUser) return;

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
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-blue-600" />
          Create Folder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Folder name"
            className="w-full"
          />
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${selectedColor?.colorClass}`} />
                  {selectedColor?.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${option.colorClass}`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} className="w-full">
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Folder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
