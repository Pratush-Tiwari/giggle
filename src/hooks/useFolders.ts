import { useCallback, useEffect } from 'react';
import { folderService } from '../services/folderService';
import { Folder } from '../types/models';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setFolders,
  addFolder as addFolderAction,
  updateFolder as updateFolderAction,
  deleteFolder as deleteFolderAction,
  setLoading,
  setError,
} from '@/store';
import { convertFolderTimestamps, SerializableTimestamp } from '@/utils/timestampUtils';

type SerializedFolder = Omit<Folder, 'createdAt'> & {
  createdAt: SerializableTimestamp;
};

interface FoldersState {
  folders: SerializedFolder[];
  loading: boolean;
  error: string | null;
  createFolder: (folderData: Omit<Folder, 'folderId' | 'createdAt'>) => Promise<Folder>;
  updateFolder: (folderId: string, folderData: Partial<Folder>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  archiveFolder: (folderId: string) => Promise<void>;
  unarchiveFolder: (folderId: string) => Promise<void>;
  activeFolders: SerializedFolder[];
  archivedFolders: SerializedFolder[];
}

export const useFolders = (): FoldersState => {
  const dispatch = useAppDispatch();
  const { folders, loading, error } = useAppSelector(state => state.app);
  const { currentUser: user } = useAuth();

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

  const updateFolder = async (folderId: string, folderData: Partial<Folder>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await folderService.updateFolder(folderId, folderData);
      // Fetch the updated folder to get the latest data
      const updatedFolder = await folderService.getFolder(folderId);
      if (updatedFolder) {
        const serializedFolder = convertFolderTimestamps(updatedFolder);
        dispatch(updateFolderAction(serializedFolder));
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update folder'));
      throw err;
    }
  };

  const deleteFolder = async (folderId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await folderService.deleteFolder(folderId);
      dispatch(deleteFolderAction(folderId));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete folder'));
      throw err;
    }
  };

  const archiveFolder = async (folderId: string) => {
    await updateFolder(folderId, { isArchived: true });
  };

  const unarchiveFolder = async (folderId: string) => {
    await updateFolder(folderId, { isArchived: false });
  };

  const activeFolders = folders.filter(folder => !folder.isArchived);
  const archivedFolders = folders.filter(folder => folder.isArchived);

  return {
    folders,
    loading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    archiveFolder,
    unarchiveFolder,
    activeFolders,
    archivedFolders,
  };
};
