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
import { Folder, COLLECTIONS } from '../types/models';

export const folderService = {
  // Get all folders for a user
  async getUserFolders(userId: string): Promise<Folder[]> {
    const foldersQuery = query(
      collection(db, COLLECTIONS.FOLDERS),
      where('userId', '==', userId),
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(foldersQuery);
    return snapshot.docs.map(doc => ({ folderId: doc.id, ...doc.data() }) as Folder);
  },

  // Get a single folder
  async getFolder(folderId: string): Promise<Folder | null> {
    const docRef = doc(db, COLLECTIONS.FOLDERS, folderId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return { folderId: docSnap.id, ...docSnap.data() } as Folder;
  },

  // Create a new folder
  async createFolder(folder: Omit<Folder, 'folderId' | 'createdAt'>): Promise<Folder> {
    const folderData = {
      ...folder,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.FOLDERS), folderData);
    return { folderId: docRef.id, ...folderData } as Folder;
  },

  // Update a folder
  async updateFolder(folderId: string, updates: Partial<Folder>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FOLDERS, folderId);
    await updateDoc(docRef, updates);
  },

  // Delete a folder (only if it's not a system folder)
  async deleteFolder(folderId: string): Promise<void> {
    const folder = await this.getFolder(folderId);
    if (folder?.isSystemFolder) {
      throw new Error('Cannot delete system folders');
    }

    const docRef = doc(db, COLLECTIONS.FOLDERS, folderId);
    await deleteDoc(docRef);
  },

  // Create default system folders for a new user
  async createDefaultFolders(userId: string): Promise<void> {
    const defaultFolders = [
      {
        userId,
        name: 'Private',
        color: 'grey',
        order: 0,
        isArchived: false,
        isSystemFolder: true,
      },
      {
        userId,
        name: 'Important',
        color: 'orange',
        order: 1,
        isArchived: false,
        isSystemFolder: true,
      },
    ];

    for (const folder of defaultFolders) {
      await this.createFolder(folder);
    }
  },
};
