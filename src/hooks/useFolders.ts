import { useState, useEffect, useCallback } from 'react';
import { folderService } from '../services/folderService';
import { Folder } from '../types/models';
import { useAuth } from './useAuth';

interface FoldersState {
  folders: Folder[];
  loading: boolean;
  error: string | null;

  createFolder: (folderData: Omit<Folder, 'folderId' | 'createdAt'>) => Promise<Folder>;

  updateFolder: (folderId: string, updates: Partial<Folder>) => Promise<void>;

  deleteFolder: (folderId: string) => Promise<void>;
  refreshFolders: () => Promise<void>;
}

export const useFolders = (): FoldersState => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFolders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userFolders = await folderService.getUserFolders(user.uid);
      setFolders(userFolders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createFolder = async (folderData: Omit<Folder, 'folderId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newFolder = await folderService.createFolder({
        ...folderData,
        userId: user.uid,
      });
      setFolders(prev => [...prev, newFolder]);
      return newFolder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create folder');
      throw err;
    }
  };

  const updateFolder = async (folderId: string, updates: Partial<Folder>) => {
    try {
      await folderService.updateFolder(folderId, updates);
      setFolders(prev =>
        prev.map(folder => (folder.folderId === folderId ? { ...folder, ...updates } : folder)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update folder');
      throw err;
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      await folderService.deleteFolder(folderId);
      setFolders(prev => prev.filter(folder => folder.folderId !== folderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete folder');
      throw err;
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders, user]);

  return {
    folders,
    loading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    refreshFolders: fetchFolders,
  };
};
