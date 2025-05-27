import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';
import { Note } from '../types/models';
import { useAuth } from './useAuth'; // Assuming you have an auth hook

interface NotesState {
  notes: Note[];
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
  // eslint-disable-next-line no-unused-vars
  togglePin: (noteId: string, isPinned: boolean) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  toggleArchive: (noteId: string, isArchived: boolean) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

export const useNotes = (folderId?: string): NotesState => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userNotes = folderId
        ? await noteService.getFolderNotes(folderId, user.uid)
        : await noteService.getUserNotes(user.uid);
      setNotes(userNotes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [user, folderId]);

  const createNote = async (
    noteData: Omit<Note, 'noteId' | 'createdAt' | 'updatedAt' | 'lastAccessedAt'>,
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newNote = await noteService.createNote({
        ...noteData,
        userId: user.uid,
      });
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      await noteService.updateNote(noteId, updates);
      setNotes(prev => prev.map(note => (note.noteId === noteId ? { ...note, ...updates } : note)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await noteService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.noteId !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    }
  };

  const togglePin = async (noteId: string, isPinned: boolean) => {
    try {
      await noteService.updateNote(noteId, { isPinned });
      setNotes(prev => prev.map(note => (note.noteId === noteId ? { ...note, isPinned } : note)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle pin');
      throw err;
    }
  };

  const toggleArchive = async (noteId: string, isArchived: boolean) => {
    try {
      await noteService.updateNote(noteId, { isArchived });
      setNotes(prev => prev.map(note => (note.noteId === noteId ? { ...note, isArchived } : note)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle archive');
      throw err;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    refreshNotes: fetchNotes,
  };
};
