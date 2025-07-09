import { useCallback, useEffect } from 'react';
import { noteService } from '../services/noteService';
import { Note } from '../types/models';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setNotes,
  addNote as addNoteAction,
  updateNote as updateNoteAction,
  deleteNote as deleteNoteAction,
  setLoading,
  setError,
} from '@/store';
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
    noteData: Omit<Note, 'noteId' | 'createdAt' | 'updatedAt' | 'lastAccessedAt'>,
  ) => Promise<Note>;
  updateNote: (noteId: string, noteData: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  archiveNote: (noteId: string) => Promise<void>;
  unarchiveNote: (noteId: string) => Promise<void>;
  pinNote: (noteId: string) => Promise<void>;
  unpinNote: (noteId: string) => Promise<void>;
}

export const useNotes = (folderId?: string): NotesState => {
  const dispatch = useAppDispatch();
  const { notes, loading, error } = useAppSelector(state => state.app);
  const { currentUser: user } = useAuth();

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

  const updateNote = async (noteId: string, noteData: Partial<Note>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await noteService.updateNote(noteId, noteData);
      // Fetch the updated note to get the latest data
      const updatedNote = await noteService.getNote(noteId);
      if (updatedNote) {
        const serializedNote = convertNoteTimestamps(updatedNote);
        dispatch(updateNoteAction(serializedNote));
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to update note'));
      throw err;
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await noteService.deleteNote(noteId);
      dispatch(deleteNoteAction(noteId));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to delete note'));
      throw err;
    }
  };

  const archiveNote = async (noteId: string) => {
    await updateNote(noteId, { isArchived: true });
  };

  const unarchiveNote = async (noteId: string) => {
    await updateNote(noteId, { isArchived: false });
  };

  const pinNote = async (noteId: string) => {
    await updateNote(noteId, { isPinned: true });
  };

  const unpinNote = async (noteId: string) => {
    await updateNote(noteId, { isPinned: false });
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
    pinNote,
    unpinNote,
  };
};
