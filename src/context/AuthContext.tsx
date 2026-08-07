import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import auth from '@/lib/shared/kliv-auth.js';

interface User {
  userUuid: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string;
  metadata?: Record<string, unknown> | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await auth.getUser();
      console.log("Current user:", currentUser);
      if (currentUser) {
        setUser({
          userUuid: currentUser.userUuid || '',
          email: currentUser.email || '',
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          role: currentUser.metadata?.role as string,
          metadata: currentUser.metadata
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const signedUser = await auth.signIn(email, password);
    console.log("User signed in:", signedUser);
    
    if (signedUser.status === 'totp_required') {
      throw new Error('Two-factor authentication required');
    }
    
    const userData: User = {
      userUuid: signedUser.user.userUuid || '',
      email: signedUser.user.email || '',
      firstName: signedUser.user.firstName,
      lastName: signedUser.user.lastName,
      role: signedUser.user.metadata?.role as string,
      metadata: signedUser.user.metadata
    };
    
    setUser(userData);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
    console.log("User signed out");
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
