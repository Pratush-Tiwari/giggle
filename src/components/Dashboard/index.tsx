/**
 *
 * Dashboard
 *
 */
import { memo, useState } from 'react';
import { FolderList } from '../FolderList';
import { CreateNote } from '../CreateNote';
import { CreateFolder } from '../CreateFolder';
import { NoteList } from '../NoteList/index';

export const Dashboard = memo(() => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  return (
    <div className="flex h-[100vh]">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Folders</h2>
          <CreateFolder />
        </div>
        <div className="mt-4">
          <FolderList onSelectFolder={handleFolderSelect} selectedFolderId={selectedFolderId} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Notes</h2>
            {selectedFolderId && <CreateNote folderId={selectedFolderId} />}
          </div>
          <NoteList folderId={selectedFolderId} />
        </div>
      </div>
    </div>
  );
});
