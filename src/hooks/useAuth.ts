import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      user => {
        setUser(user);
        setLoading(false);
      },
      error => {
        setError(error.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    error,
  };
};
