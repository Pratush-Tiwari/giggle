import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Note, COLLECTIONS } from '../types/models';

export const noteService = {
  // Get all notes for a user
  async getUserNotes(userId: string): Promise<Note[]> {
    const notesQuery = query(
      collection(db, COLLECTIONS.NOTES),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
    );

    const snapshot = await getDocs(notesQuery);
    return snapshot.docs.map(doc => ({ noteId: doc.id, ...doc.data() }) as Note);
  },

  // Get notes in a specific folder
  async getFolderNotes(folderId: string, userId: string): Promise<Note[]> {
    const notesQuery = query(
      collection(db, COLLECTIONS.NOTES),
      where('userId', '==', userId),
      where('folderId', '==', folderId),
      orderBy('updatedAt', 'desc'),
    );

    const snapshot = await getDocs(notesQuery);
    return snapshot.docs.map(doc => ({ noteId: doc.id, ...doc.data() }) as Note);
  },

  // Get a single note
  async getNote(noteId: string): Promise<Note | null> {
    const docRef = doc(db, COLLECTIONS.NOTES, noteId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return { noteId: docSnap.id, ...docSnap.data() } as Note;
  },

  // Create a new note
  async createNote(
    note: Omit<Note, 'noteId' | 'createdAt' | 'updatedAt' | 'lastAccessedAt'>,
  ): Promise<Note> {
    const now = Timestamp.now();
    const noteData = {
      ...note,
      createdAt: now,
      updatedAt: now,
      lastAccessedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.NOTES), noteData);
    return { noteId: docRef.id, ...noteData } as Note;
  },

  // Update a note
  async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NOTES, noteId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, updateData);
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NOTES, noteId);
    await deleteDoc(docRef);
  },

  // Update last accessed timestamp
  async updateLastAccessed(noteId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NOTES, noteId);
    await updateDoc(docRef, {
      lastAccessedAt: Timestamp.now(),
    });
  },

  // Get pinned notes for a user
  async getPinnedNotes(userId: string): Promise<Note[]> {
    const notesQuery = query(
      collection(db, COLLECTIONS.NOTES),
      where('userId', '==', userId),
      where('isPinned', '==', true),
      orderBy('updatedAt', 'desc'),
    );

    const snapshot = await getDocs(notesQuery);
    return snapshot.docs.map(doc => ({ noteId: doc.id, ...doc.data() }) as Note);
  },

  // Get archived notes for a user
  async getArchivedNotes(userId: string): Promise<Note[]> {
    const notesQuery = query(
      collection(db, COLLECTIONS.NOTES),
      where('userId', '==', userId),
      where('isArchived', '==', true),
      orderBy('updatedAt', 'desc'),
    );

    const snapshot = await getDocs(notesQuery);
    return snapshot.docs.map(doc => ({ noteId: doc.id, ...doc.data() }) as Note);
  },
};
