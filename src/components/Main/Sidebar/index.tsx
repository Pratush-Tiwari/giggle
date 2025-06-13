/**
 *
 * Sidebar
 *
 */
import React from 'react';
import { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Folder, FolderOpen, FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '../../theme-toggle';
import { useFolders } from '@/hooks/useFolders';
import { useNotes } from '@/hooks/useNotes';
import { CreateFolder } from '../CreateFolder/loadable';
import { CreateNote } from '../CreateNote/loadable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export const Sidebar = memo(() => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { folders, loading: foldersLoading, deleteFolder } = useFolders();
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const { notes, loading: notesLoading, deleteNote } = useNotes();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [openNoteDialogFolderId, setOpenNoteDialogFolderId] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!foldersLoading && !notesLoading) {
      setIsInitialLoad(false);
    }
  }, [foldersLoading, notesLoading]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleFolderClick = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId],
    );
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // Get all notes in the folder
      const folderNotes = notes.filter(note => note.folderId === folderId);

      // Delete all notes in the folder
      await Promise.all(folderNotes.map(note => deleteNote(note.noteId)));

      // Delete the folder
      await deleteFolder(folderId);
      setFolderToDelete(null);
    } catch (error) {
      console.error('Failed to delete folder and its notes:', error);
    }
  };

  return (
    <div className="flex h-[100vh] w-[300px] flex-col border-r bg-[var(--surface-light)]">
      <div className="flex w-full h-14 items-center justify-between border-b px-4">
        <span className="text-xl text-sidebar-foreground font-semibold">Giggle</span>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2 space-y-1 w-[100%]">
        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogTrigger asChild>
            <Button className=" justify-start gap-2">
              <Plus className="h-4 w-4" />
              Add Folder
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-none">
            <CreateFolder onSuccess={() => setIsCreateFolderOpen(false)} />
          </DialogContent>
        </Dialog>
        <Separator className="my-2" />

        {/* Folders */}
        {isInitialLoad && foldersLoading ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">Loading folders...</div>
        ) : (
          [...folders]
            .sort((a, b) => {
              const dateA = a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000;
              const dateB = b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000;
              return dateB - dateA; // Sort in descending order (latest first)
            })
            .map(folder => {
              const isExpanded = expandedFolders.includes(folder.folderId);
              const folderNotes = notes.filter(note => note.folderId === folder.folderId);

              return (
                <React.Fragment key={folder.folderId}>
                  <div className="flex items-center w-[100%] overflow-hidden">
                    <Button
                      variant="ghost"
                      className="flex p-0 pl-2 items-center flex-1 overflow-hidden justify-start gap-2 hover:bg-[var(--button-hover)]"
                      onClick={() => handleFolderClick(folder.folderId)}
                    >
                      {isExpanded ? (
                        <FolderOpen
                          className="h-4 w-4 flex-shrink-0"
                          style={{ color: folder.color || 'currentColor' }}
                        />
                      ) : (
                        <Folder
                          className="h-4 w-4 flex-shrink-0"
                          style={{ color: folder.color || 'currentColor' }}
                        />
                      )}
                      <span className="w-[180px] text-left truncate overflow-hidden">
                        {folder.name}
                      </span>
                    </Button>
                    <Dialog
                      open={openNoteDialogFolderId === folder.folderId}
                      onOpenChange={open => !open && setOpenNoteDialogFolderId(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 hover:bg-[var(--button-hover)]"
                          onClick={() => setOpenNoteDialogFolderId(folder.folderId)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-0 border-none">
                        <DialogTitle className="sr-only">
                          Create New Note in {folder.name}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          Create a new note in the {folder.name} folder
                        </DialogDescription>
                        <CreateNote
                          folderId={folder.folderId}
                          onSuccess={() => setOpenNoteDialogFolderId(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <AlertDialog
                      open={folderToDelete === folder.folderId}
                      onOpenChange={open => !open && setFolderToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 hover:bg-[var(--button-hover)]"
                          onClick={() => setFolderToDelete(folder.folderId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this folder? This action cannot be
                            undone.
                            {folderNotes.length > 0 && (
                              <p className="mt-2 text-destructive">
                                Warning: This folder contains {folderNotes.length} note
                                {folderNotes.length === 1 ? '' : 's'} that will also be deleted.
                              </p>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteFolder(folder.folderId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Notes in folder */}
                  {isExpanded && (
                    <div className="pl-6 space-y-1 w-full">
                      {isInitialLoad && notesLoading ? (
                        <div className="px-4 py-1 text-sm text-muted-foreground">
                          Loading notes...
                        </div>
                      ) : folderNotes.length > 0 ? (
                        folderNotes.map(note => (
                          <Button
                            key={note.noteId}
                            variant="ghost"
                            className="w-full !overflow-hidden justify-start gap-2 hover:bg-[var(--button-hover)] text-sm"
                            onClick={() => navigate(`/note/${note.noteId}`)}
                          >
                            <FileText className="h-3 w-3" />
                            <span className="w-[200px] text-left truncate overflow-hidden">
                              {note.title}
                            </span>
                          </Button>
                        ))
                      ) : (
                        <div className="px-4 py-1 text-sm text-muted-foreground">No notes</div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 flex w-full h-14 items-center justify-between border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-[var(--button-hover)] text-red-500 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                This will end your current session and you'll need to login again to access your
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
});
