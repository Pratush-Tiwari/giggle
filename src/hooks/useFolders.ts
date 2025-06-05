import { useCallback, useEffect } from 'react';
import { folderService } from '../services/folderService';
import { Folder } from '../types/models';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setFolders,
  addFolder as addFolderAction,
  updateFolder as updateFolderAction,
  deleteFolder as deleteFolderAction,
  setLoading,
  setError,
} from '@/store/slices/folderSlice';
import { RootState } from '@/store';
import { convertFolderTimestamps, SerializableTimestamp } from '@/utils/timestampUtils';

type SerializedFolder = Omit<Folder, 'createdAt'> & {
  createdAt: SerializableTimestamp;
};

interface FoldersState {
  folders: SerializedFolder[];
  loading: boolean;
  error: string | null;
  // eslint-disable-next-line no-unused-vars
  createFolder: (folderData: Omit<Folder, 'folderId' | 'createdAt'>) => Promise<Folder>;

  // eslint-disable-next-line no-unused-vars
  updateFolder: (folderId: string, updates: Partial<Folder>) => Promise<void>;

  // eslint-disable-next-line no-unused-vars
  deleteFolder: (folderId: string) => Promise<void>;
  refreshFolders: () => Promise<void>;
}

export const useFolders = (): FoldersState => {
  const dispatch = useAppDispatch();
  const { folders, loading, error } = useAppSelector((state: RootState) => state.folders);
  const { user } = useAuth();

  const fetchFolders = useCallback(async () => {
    if (!user) return;

    try {
      dispatch(setLoading(true));
      const userFolders = await folderService.getUserFolders(user.uid);
      const serializedFolders = userFolders.map(convertFolderTimestamps);
      dispatch(setFolders(serializedFolders));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch folders'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const createFolder = async (folderData: Omit<Folder, 'folderId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newFolder = await folderService.createFolder({
        ...folderData,
        userId: user.uid,
      });
      const serializedFolder = convertFolderTimestamps(newFolder);
      dispatch(addFolderAction(serializedFolder));
      return newFolder;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to create folder'));
      throw err;
    }
  };

  const updateFolder = async (folderId: string, updates: Partial<Folder>) => {
    try {
      await folderService.updateFolder(folderId, updates);
      const existingFolder = folders.find(folder => folder.folderId === folderId);
      if (!existingFolder) {
        throw new Error('Folder not found');
      }
      const updatedFolder = { ...existingFolder, ...updates } as Folder;
      const serializedFolder = convertFolderTimestamps(updatedFolder);
      dispatch(updateFolderAction(serializedFolder));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update folder'));
      throw err;
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      await folderService.deleteFolder(folderId);
      dispatch(deleteFolderAction(folderId));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete folder'));
      throw err;
    }
  };

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
