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
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Folder, COLLECTIONS } from '../types/models';

function isValidFolderData(data: Record<string, unknown>): data is Omit<Folder, 'folderId'> {
  return (
    typeof data['userId'] === 'string' &&
    typeof data['name'] === 'string' &&
    typeof data['color'] === 'string' &&
    typeof data['order'] === 'number' &&
    typeof data['isArchived'] === 'boolean' &&
    typeof data['isSystemFolder'] === 'boolean' &&
    (data['createdAt'] instanceof Timestamp ||
      typeof (data['createdAt'] as { toDate?: () => Date })?.toDate === 'function')
  );
}

export const folderService = {
  async getUserFolders(userId: string): Promise<Folder[]> {
    const foldersQuery = query(
      collection(db, COLLECTIONS.FOLDERS),
      where('userId', '==', userId),
      orderBy('order', 'asc'),
    );

    const snapshot = await getDocs(foldersQuery);
    return snapshot.docs
      .map(doc => {
        const data = doc.data();
        if (!isValidFolderData(data)) {
          console.warn(`Malformed folder document received: ${doc.id}`, data);
          // Depending on your error handling strategy, you might:
          // 1. Skip this document (as done here by returning null and filtering)
          // 2. Throw an error
          // 3. Log to an error tracking service
          return null;
        }
        return { folderId: doc.id, ...data } as Folder; // Now this assertion is safer
      })
      .filter(Boolean) as Folder[]; // Filter out any nulls if validation failed
  },

  // Get a single folder
  async getFolder(folderId: string): Promise<Folder | null> {
    const docRef = doc(db, COLLECTIONS.FOLDERS, folderId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    if (!isValidFolderData(data)) {
      console.warn(`Malformed folder document received for ID: ${folderId}`, data);
      // Decide how to handle: null, throw an error, etc.
      return null;
    }

    return { folderId: docSnap.id, ...data } as Folder; // Now this assertion is safer
  },

  // Create a new folder
  async createFolder(folder: Omit<Folder, 'folderId' | 'createdAt'>): Promise<Folder> {
    const folderData = {
      ...folder,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.FOLDERS), folderData);
    // The data returned from addDoc is often the *sent* data, not necessarily with server-generated IDs.
    // So, constructing it from folderData and docRef.id is correct.
    return { folderId: docRef.id, ...folderData } as Folder;
  },

  // Update a folder
  async updateFolder(folderId: string, updates: Partial<Folder>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FOLDERS, folderId);
    await updateDoc(docRef, updates);
  },

  // Delete a folder (only if it's not a system folder)
  async deleteFolder(folderId: string): Promise<void> {
    const folder = await this.getFolder(folderId); // Fetches folder to check if it's system
    if (!folder) {
      throw new Error('Folder not found.'); // Added explicit error for non-existent folder
    }
    if (folder.isSystemFolder) {
      throw new Error('Cannot delete system folders');
    }

    const docRef = doc(db, COLLECTIONS.FOLDERS, folderId);
    await deleteDoc(docRef);
  },

  // Create default system folders for a new user using batch writes
  async createDefaultFolders(userId: string): Promise<void> {
    const batch = writeBatch(db); // Get a new write batch instance

    const defaultFolders = [
      {
        userId,
        name: 'Default',
        color: 'blue',
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
      const newDocRef = doc(collection(db, COLLECTIONS.FOLDERS)); // Create a new document reference with a generated ID
      batch.set(newDocRef, {
        // Add the set operation to the batch
        ...folder,
        createdAt: Timestamp.now(), // Add createdAt field
      });
    }

    await batch.commit(); // Commit all operations in the batch
  },

  // Archive a folder
  async archiveFolder(folderId: string): Promise<void> {
    await this.updateFolder(folderId, { isArchived: true });
  },

  // Unarchive a folder
  async unarchiveFolder(folderId: string): Promise<void> {
    await this.updateFolder(folderId, { isArchived: false });
  },
};
