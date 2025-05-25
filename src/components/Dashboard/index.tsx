/**
 *
 * Dashboard
 *
 */
import { memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '../ui/card';

interface Props {}

export const Dashboard = memo((props: Props) => {
  console.log(props);
  const { currentUser } = useAuth();

  return (
    <div className="flex h-[100vh] justify-center items-center">
      <Card className="p-4">
        <p>Welcome, {currentUser?.email}!</p>
        <div className="mt-4 space-x-2">This is the dashboard page</div>
      </Card>
    </div>
  );
});
