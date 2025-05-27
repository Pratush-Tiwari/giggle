import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, FileText } from 'lucide-react';
interface CreateNoteProps {
  folderId: string;
}

export const CreateNote = ({ folderId }: CreateNoteProps): JSX.Element => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const { createNote } = useNotes(folderId);
  const { currentUser } = useAuth();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUser) return;

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
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Create New Note
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full"
          />
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Note content"
            className="w-full h-32 resize-none"
          />
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="icon"
                className="px-4"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <Button type="button" onClick={handleSubmit} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
