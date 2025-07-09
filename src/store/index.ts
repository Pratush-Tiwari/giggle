import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Folder, Note } from '@/types/models';
import { SerializableTimestamp } from '@/utils/timestampUtils';

// Types for serialized data
type SerializedFolder = Omit<Folder, 'createdAt'> & {
  createdAt: SerializableTimestamp;
};

type SerializedNote = Omit<Note, 'createdAt' | 'updatedAt' | 'lastAccessedAt'> & {
  createdAt: SerializableTimestamp;
  updatedAt: SerializableTimestamp;
  lastAccessedAt: SerializableTimestamp;
};

// Combined app state
interface AppState {
  folders: SerializedFolder[];
  notes: SerializedNote[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  folders: [],
  notes: [],
  loading: false,
  error: null,
};

// Combined app slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Folder actions
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
    // Note actions
    setNotes: (state, action: PayloadAction<SerializedNote[]>) => {
      state.notes = action.payload;
    },
    addNote: (state, action: PayloadAction<SerializedNote>) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<SerializedNote>) => {
      const index = state.notes.findIndex(note => note.noteId === action.payload.noteId);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.noteId !== action.payload);
    },
    // Common actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFolders,
  addFolder,
  updateFolder,
  deleteFolder,
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  setLoading,
  setError,
} = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
