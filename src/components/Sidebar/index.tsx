/**
 *
 * Sidebar
 *
 */
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Users, MessageSquare, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '../theme-toggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface Props {}

export const Sidebar = memo((props: Props) => {
  console.log(props);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-[var(--surface-light)]">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl text-sidebar-foreground">Giggle</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-[var(--button-hover)]"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-[var(--button-hover)]"
            onClick={() => navigate('/option1')}
          >
            <MessageSquare className="h-4 w-4" />
            Option 1
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-[var(--button-hover)]"
            onClick={() => navigate('/option2')}
          >
            <Users className="h-4 w-4" />
            Option 2
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-[var(--button-hover)]"
            onClick={() => navigate('/option3')}
          >
            <Settings className="h-4 w-4" />
            Option 3
          </Button>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-auto p-4">
        <Separator className="mb-4" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-[var(--button-hover)]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                This will end your current session and you'll need to login again to access your
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
});
