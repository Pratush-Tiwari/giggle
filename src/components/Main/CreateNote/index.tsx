import { memo, useState, FormEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, X, FileText } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  folderId: string;
  onSuccess?: () => void;
}

export const CreateNote = memo(({ folderId, onSuccess }: Props) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createNote } = useNotes(folderId);
  const { currentUser } = useAuth();

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUser || isLoading) return;

    setIsLoading(true);
    try {
      await createNote({
        folderId,
        userId: currentUser.uid,
        title: title.trim(),
        content: content.trim(),
        tags,
        isArchived: false,
        isPinned: false,
      });
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Create New Note
        </CardTitle>
        <CardDescription>
          Capture your thoughts, ideas, or tasks in a new note. Add a title, content, and relevant
          tags.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="noteTitle">Title</Label>
            <Input
              id="noteTitle"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="w-full !my-input"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noteContent">Content</Label>
            <Textarea
              id="noteContent"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="w-full min-h-[120px] resize-none !my-input"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="noteTags">Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="noteTags"
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add a tag and press Enter"
                className="flex-1 !my-input"
                disabled={isLoading}
              />
              <Button
                className="!my-input"
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="icon"
                disabled={isLoading || !tagInput.trim()}
                aria-label="Add tag"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map(tag => (
                  <Badge key={tag} className="flex items-center p-2 px-3 ">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 p-0.5 rounded-full disabled:opacity-50"
                      aria-label={`Remove tag ${tag}`}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!title.trim() || !content.trim() || !currentUser || isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Note...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});
