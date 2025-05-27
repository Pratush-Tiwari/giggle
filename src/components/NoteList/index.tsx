import { memo } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/models';

interface NoteListProps {
  folderId: string | undefined;
}

export const NoteList = memo(({ folderId }: NoteListProps) => {
  const { notes, loading, error } = useNotes(folderId);

  if (loading) return <div>Loading notes...</div>;
  if (error) return <div>Error loading notes: {error}</div>;
  if (!folderId) return <div>Select a folder to view notes</div>;

  return (
    <div className="space-y-4">
      {notes.map((note: Note) => (
        <div key={note.noteId} className="p-4 border rounded">
          <h3 className="font-semibold">{note.title}</h3>
          <p className="text-gray-600">{note.content}</p>
        </div>
      ))}
    </div>
  );
});
