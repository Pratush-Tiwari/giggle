import { Timestamp } from 'firebase/firestore';
import { Note, Folder } from '@/types/models';

export interface SerializableTimestamp {
  seconds: number;
  nanoseconds: number;
}

export const convertTimestampToSerializable = (timestamp: Timestamp): SerializableTimestamp => ({
  seconds: timestamp.seconds,
  nanoseconds: timestamp.nanoseconds,
});

export const convertSerializableToTimestamp = (serializable: SerializableTimestamp): Timestamp => {
  return Timestamp.fromMillis(serializable.seconds * 1000 + serializable.nanoseconds / 1000000);
};

export const convertNoteTimestamps = (
  note: Note,
): Omit<Note, 'createdAt' | 'updatedAt' | 'lastAccessedAt'> & {
  createdAt: SerializableTimestamp;
  updatedAt: SerializableTimestamp;
  lastAccessedAt: SerializableTimestamp;
} => ({
  ...note,
  createdAt:
    note.createdAt instanceof Timestamp
      ? convertTimestampToSerializable(note.createdAt)
      : note.createdAt,
  updatedAt:
    note.updatedAt instanceof Timestamp
      ? convertTimestampToSerializable(note.updatedAt)
      : note.updatedAt,
  lastAccessedAt:
    note.lastAccessedAt instanceof Timestamp
      ? convertTimestampToSerializable(note.lastAccessedAt)
      : note.lastAccessedAt,
});

export const convertFolderTimestamps = (
  folder: Folder,
): Omit<Folder, 'createdAt'> & {
  createdAt: SerializableTimestamp;
} => ({
  ...folder,
  createdAt:
    folder.createdAt instanceof Timestamp
      ? convertTimestampToSerializable(folder.createdAt)
      : folder.createdAt,
});
