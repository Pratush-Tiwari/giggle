import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Folder } from '@/types/models';
import { SerializableTimestamp } from '@/utils/timestampUtils';

// Create a type for the serialized folder that will be stored in Redux
type SerializedFolder = Omit<Folder, 'createdAt'> & {
  createdAt: SerializableTimestamp;
};

interface FolderState {
  folders: SerializedFolder[];
  loading: boolean;
  error: string | null;
}

const initialState: FolderState = {
  folders: [],
  loading: false,
  error: null,
};

const folderSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setFolders: (state, action: PayloadAction<SerializedFolder[]>) => {
      state.folders = action.payload;
    },
    addFolder: (state, action: PayloadAction<SerializedFolder>) => {
      state.folders.push(action.payload);
    },
    updateFolder: (state, action: PayloadAction<SerializedFolder>) => {
      const index = state.folders.findIndex(folder => folder.folderId === action.payload.folderId);
      if (index !== -1) {
        state.folders[index] = action.payload;
      }
    },
    deleteFolder: (state, action: PayloadAction<string>) => {
      state.folders = state.folders.filter(folder => folder.folderId !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setFolders, addFolder, updateFolder, deleteFolder, setLoading, setError } =
  folderSlice.actions;

export default folderSlice.reducer;
