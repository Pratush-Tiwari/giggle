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
  Query, // Import Query type for the helper function
  DocumentData, // Import DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Note, COLLECTIONS } from '../types/models';

/**
 * Validates if the given data conforms to the expected Note structure.
 * This is crucial for runtime type safety when fetching data from Firestore.
 */
const isValidNoteData = (data: DocumentData): data is Omit<Note, 'noteId'> => {
  // Perform basic type checks for all required fields
  return (
    typeof data['userId'] === 'string' &&
    typeof data['folderId'] === 'string' &&
    typeof data['title'] === 'string' &&
    (typeof data['content'] === 'string' ||
      data['content'] === null ||
      data['content'] === undefined) && // content can be optional/nullable
    typeof data['isPinned'] === 'boolean' &&
    typeof data['isArchived'] === 'boolean' &&
    data['createdAt'] instanceof Timestamp &&
    data['updatedAt'] instanceof Timestamp &&
    data['lastAccessedAt'] instanceof Timestamp &&
    (Array.isArray(data['tags'])
      ? data['tags'].every((tag: string) => typeof tag === 'string')
      : true) && // Check if tags is array of strings or missing
    (typeof data['url'] === 'string' || data['url'] === undefined) // URL is optional
  );
};

export const noteService = {
  /**
   * Private helper function to execute a Firestore query and map results to Note objects
   * with runtime validation.
   */
  async _getNotesFromQuery(q: Query): Promise<Note[]> {
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => {
        const data = doc.data();
        if (!isValidNoteData(data)) {
          // Log a warning for malformed documents. You might want to send this to an error tracking service.
          console.warn(`Malformed note document retrieved (ID: ${doc.id}). Skipping.`, data);
          return null; // Return null for invalid documents
        }
        return { noteId: doc.id, ...data } as Note; // Assert after validation
      })
      .filter(Boolean) as Note[]; // Filter out any nulls resulting from invalid data
  },

  // Get all notes for a user
  async getUserNotes(userId: string): Promise<Note[]> {
    const notesQuery = query(
      collection(db, COLLECTIONS.NOTES),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
    );
    return this._getNotesFromQuery(notesQuery);
  },

  // Get notes in a specific folder
  async getFolderNotes(folderId: string, userId: string): Promise<Note[]> {
    const notesQuery = query(
      collection(db, COLLECTIONS.NOTES),
      where('userId', '==', userId),
      where('folderId', '==', folderId),
      orderBy('updatedAt', 'desc'),
    );
    return this._getNotesFromQuery(notesQuery);
  },

  // Get a single note
  async getNote(noteId: string): Promise<Note | null> {
    const docRef = doc(db, COLLECTIONS.NOTES, noteId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    if (!isValidNoteData(data)) {
      console.warn(`Malformed note document retrieved for ID: ${noteId}. Returning null.`, data);
      return null; // Return null if the data is invalid
    }

    return { noteId: docSnap.id, ...data } as Note; // Assert after validation
  },

  // Create a new note
  async createNote(
    note: Omit<Note, 'noteId' | 'createdAt' | 'updatedAt' | 'lastAccessedAt'>,
  ): Promise<Note> {
    const now = Timestamp.now();
    const noteData = {
      ...note, // Spread input 'note' first
      content: note.content ?? '', // Default content if not provided
      tags: note.tags ?? [], // Default empty array for tags if not provided
      isPinned: note.isPinned ?? false, // Default if not explicitly set
      isArchived: note.isArchived ?? false, // Default if not explicitly set
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
      updatedAt: Timestamp.now(), // Always update 'updatedAt' on any note update
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
    return this._getNotesFromQuery(notesQuery);
  },

  // Get archived notes for a user
  async getArchivedNotes(userId: string): Promise<Note[]> {
    const notesQuery = query(
      collection(db, COLLECTIONS.NOTES),
      where('userId', '==', userId),
      where('isArchived', '==', true),
      orderBy('updatedAt', 'desc'),
    );
    return this._getNotesFromQuery(notesQuery);
  },
};
