import { Timestamp } from 'firebase/firestore';

export interface User {
  userId: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
}

export interface Folder {
  folderId: string;
  userId: string;
  name: string;
  color?: string;
  createdAt: Timestamp;
  order: number;
  isArchived: boolean;
  isSystemFolder: boolean;
}

export interface Note {
  noteId: string;
  userId: string;
  folderId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isArchived: boolean;
  isPinned: boolean;
  lastAccessedAt: Timestamp;
  url?: string;
}

// Collection names as constants
export const COLLECTIONS = {
  USERS: 'users',
  FOLDERS: 'folders',
  NOTES: 'notes',
} as const;
