import { memo } from 'react';
import { useFolders } from '@/hooks/useFolders';
// import { Folder } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderOpen, Folders } from 'lucide-react';

interface FolderListProps {
  // eslint-disable-next-line no-unused-vars
  onSelectFolder: (folderId: string) => void;
  selectedFolderId: string | undefined;
}
interface FolderType {
  folderId: string;
  name: string;
  color?: string;
  noteCount?: number;
}

const getColorClasses = (color?: string) => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  };
  return colorMap[color || 'gray'] || colorMap['gray'];
};

export const FolderList = memo(({ onSelectFolder, selectedFolderId }: FolderListProps) => {
  const { folders, loading, error } = useFolders();

  if (loading) return <div>Loading folders...</div>;
  if (error) return <div>Error loading folders: {error}</div>;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Folders className="h-5 w-5 text-blue-600" />
          Folders
          <Badge variant="secondary" className="ml-auto">
            {folders.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {folders.map((folder: FolderType) => {
            const isSelected = selectedFolderId === folder.folderId;
            const colorClasses = getColorClasses(folder.color);

            return (
              <div
                key={folder.folderId}
                className={`
                  group relative p-3 rounded-lg cursor-pointer transition-all duration-200 border
                  ${
                    isSelected
                      ? `${colorClasses?.bg} ${colorClasses?.border} shadow-sm`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => onSelectFolder(folder.folderId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <FolderOpen className={`h-5 w-5 ${colorClasses?.text}`} />
                    ) : (
                      <Folder className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    )}
                    <span
                      className={`font-medium ${
                        isSelected ? colorClasses?.text : 'text-gray-700 group-hover:text-gray-900'
                      }`}
                    >
                      {folder.name}
                    </span>
                  </div>

                  {folder.noteCount !== undefined && (
                    <Badge variant={isSelected ? 'default' : 'secondary'} className="text-xs">
                      {folder.noteCount} {folder.noteCount === 1 ? 'note' : 'notes'}
                    </Badge>
                  )}
                </div>

                {/* Optional: Color indicator */}
                {folder.color && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                      folder.color === 'gray'
                        ? 'bg-gray-400'
                        : folder.color === 'blue'
                          ? 'bg-blue-500'
                          : folder.color === 'green'
                            ? 'bg-green-500'
                            : folder.color === 'red'
                              ? 'bg-red-500'
                              : folder.color === 'yellow'
                                ? 'bg-yellow-500'
                                : folder.color === 'purple'
                                  ? 'bg-purple-500'
                                  : 'bg-gray-400'
                    } ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
