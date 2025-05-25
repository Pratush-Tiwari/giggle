import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from '../hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  if (error?.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  return error?.message || 'An unexpected error occurred.';
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        setCurrentUser(user);
        setLoading(false);
      },
      error => {
        console.error('Auth state change error:', error);
        toast({
          title: 'Authentication Error',
          description: getErrorMessage(error),
          variant: 'destructive',
        });
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account Created',
        description: 'Your account has been created successfully!',
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Welcome Back',
        description: 'You have been logged in successfully!',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: getErrorMessage(error),
        variant: 'default',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: 'Welcome',
        description: 'You have been signed in successfully with Google!',
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Google Sign-in Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
