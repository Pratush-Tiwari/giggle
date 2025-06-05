import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '@/types/models';
import { SerializableTimestamp } from '@/utils/timestampUtils';

// Create a type for the serialized note that will be stored in Redux
type SerializedNote = Omit<Note, 'createdAt' | 'updatedAt' | 'lastAccessedAt'> & {
  createdAt: SerializableTimestamp;
  updatedAt: SerializableTimestamp;
  lastAccessedAt: SerializableTimestamp;
};

interface NoteState {
  notes: SerializedNote[];
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  loading: false,
  error: null,
};

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setNotes, addNote, updateNote, deleteNote, setLoading, setError } =
  noteSlice.actions;

export default noteSlice.reducer;
