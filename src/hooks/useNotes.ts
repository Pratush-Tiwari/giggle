import { useCallback, useEffect } from 'react';
import { noteService } from '../services/noteService';
import { Note } from '../types/models';
import { useAuth } from './useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setNotes,
  addNote as addNoteAction,
  updateNote as updateNoteAction,
  deleteNote as deleteNoteAction,
  setLoading,
  setError,
} from '@/store/slices/noteSlice';
import { RootState } from '@/store';
import { convertNoteTimestamps, SerializableTimestamp } from '@/utils/timestampUtils';

type SerializedNote = Omit<Note, 'createdAt' | 'updatedAt' | 'lastAccessedAt'> & {
  createdAt: SerializableTimestamp;
  updatedAt: SerializableTimestamp;
  lastAccessedAt: SerializableTimestamp;
};

interface NotesState {
  notes: SerializedNote[];
  loading: boolean;
  error: string | null;
  createNote: (
    // eslint-disable-next-line no-unused-vars
    noteData: Omit<Note, 'noteId' | 'createdAt' | 'updatedAt' | 'lastAccessedAt'>,
  ) => Promise<Note>;
  // eslint-disable-next-line no-unused-vars
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  deleteNote: (noteId: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

export const useNotes = (folderId?: string): NotesState => {
  const dispatch = useAppDispatch();
  const { notes, loading, error } = useAppSelector((state: RootState) => state.notes);
  const { user } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!user) return;

    try {
      dispatch(setLoading(true));
      const userNotes = folderId
        ? await noteService.getFolderNotes(folderId, user.uid)
        : await noteService.getUserNotes(user.uid);
      const serializedNotes = userNotes.map(convertNoteTimestamps);
      dispatch(setNotes(serializedNotes));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch notes'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [user, folderId, dispatch]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (
    noteData: Omit<Note, 'noteId' | 'createdAt' | 'updatedAt' | 'lastAccessedAt'>,
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newNote = await noteService.createNote({
        ...noteData,
        userId: user.uid,
      });
      const serializedNote = convertNoteTimestamps(newNote);
      dispatch(addNoteAction(serializedNote));
      return newNote;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to create note'));
      throw err;
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      await noteService.updateNote(noteId, updates);
      const existingNote = notes.find(note => note.noteId === noteId);
      if (!existingNote) {
        throw new Error('Note not found');
      }
      const updatedNote = { ...existingNote, ...updates } as Note;
      const serializedNote = convertNoteTimestamps(updatedNote);
      dispatch(updateNoteAction(serializedNote));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update note'));
      throw err;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await noteService.deleteNote(noteId);
      dispatch(deleteNoteAction(noteId));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete note'));
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes,
  };
};
