import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { noteService } from '@/services/noteService';
import { useNotes } from '@/hooks/useNotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Tag,
  Pin,
  Archive,
  CalendarDays,
  History,
  Edit3Icon as Edit3,
  Save,
} from 'lucide-react';

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
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
}

const formatDate = (timestamp: Timestamp): string => {
  if (!timestamp) {
    return 'N/A';
  }

  const date =
    typeof timestamp.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${day} ${month} ${year}, ${time}`;
};

export const NoteView = memo(() => {
  const { noteId } = useParams<{ noteId: string }>();
  const { notes, updateNote } = useNotes();
  const note = notes.find(n => n.noteId === noteId);
  const [editedContent, setEditedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (noteId) {
      noteService.updateLastAccessed(noteId);
    }
  }, [noteId]);

  useEffect(() => {
    if (note) {
      setEditedContent(note.content);
    }
  }, [note]);

  const handleUpdate = async () => {
    if (!noteId) return;
    try {
      await updateNote(noteId, { content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a note to view its content</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <FileText className="h-6 w-6 text-blue-600" />
            {note.title}
          </CardTitle>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Note
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(note.content);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
            <TooltipProvider>
              <div className="flex items-center gap-3">
                {note.isPinned && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Pin className="h-5 w-5 text-yellow-500 cursor-default" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pinned</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {note.isArchived && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Archive className="h-5 w-5 text-slate-500 cursor-default" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Archived</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-4 overflow-y-auto flex-1 flex flex-col">
        <Textarea
          disabled={!isEditing}
          value={editedContent}
          onChange={e => setEditedContent(e.target.value)}
          className="min-h-[200px] w-full !my-input"
          placeholder="Write your note here..."
        />

        {note.tags && note.tags.length > 0 && (
          <>
            <Separator className="my-0" />
            <div className="p-2 w-full">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2 m-0">
                {note.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-0" />
        <div className="p-2 w-full">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Details</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Created At: </span>
            </div>
            <span>{formatDate(note.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Edit3 className="h-4 w-4 mr-2" />
              <span>Updated At: </span>
            </div>
            <span>{formatDate(note.updatedAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              <span>Last Accessed At: </span>
            </div>
            <span>{formatDate(note.lastAccessedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

NoteView.displayName = 'NoteView';
