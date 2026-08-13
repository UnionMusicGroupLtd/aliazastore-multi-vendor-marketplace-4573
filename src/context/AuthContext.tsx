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
  authLoading: boolean; // Alias for loading to maintain compatibility
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with true to prevent premature checks
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
    console.log("🔄 AUTH SIMPLIFIED - Admin detection with localStorage fallback");
    
    // Additional localStorage check as backup
    const localAdmin = localStorage.getItem('ifudda_admin_access');
    if (localAdmin === 'true' && !isAdmin && user) {
      console.log("🛡️ LOCALSTORAGE BACKUP: Setting admin status from localStorage");
      setIsAdmin(true);
    }
  }, []);

  // Additional effect to handle admin status updates after login
  useEffect(() => {
    if (user && !loading) {
      const adminCheck = user.role === 'admin' || user.metadata?.role === 'admin';
      console.log("🔄 AuthContext: Re-checking admin status for user:", user.email, "isAdmin:", adminCheck);
      setIsAdmin(adminCheck);
    }
  }, [user, loading]);

  const checkAuth = async () => {
    try {
      console.log("🔍 AuthContext: Starting auth check...");
      const currentUser = await auth.getUser();
      console.log("🔍 AuthContext: Current user from auth", currentUser);
      
      if (currentUser) {
        const userData: User = {
          userUuid: currentUser.userUuid || '',
          email: currentUser.email || '',
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          role: currentUser.metadata?.role as string,
          metadata: currentUser.metadata
        };
        
        console.log("🔍 AuthContext: Setting user data:", userData);
        setUser(userData);
        
        // Enhanced admin detection with multiple fallbacks and localStorage backup
        const adminCheck = 
          userData.role === 'admin' ||
          userData.metadata?.role === 'admin' ||
          (currentUser as any).role === 'admin' ||
          (currentUser as any).metadata?.role === 'admin';
        
        // Store admin status in localStorage as backup
        if (adminCheck) {
          localStorage.setItem('ifudda_admin_access', 'true');
          console.log("🛡️ ADMIN ACCESS STORED IN LOCALSTORAGE");
        }
        
        console.log("🔍 AuthContext: Setting isAdmin to:", adminCheck);
        setIsAdmin(adminCheck);
        
        if (adminCheck) {
          console.log("🛡️ ADMIN USER DETECTED!");
        }
      } else {
        console.log("🔍 AuthContext: No user found");
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("❌ AuthContext: Auth check failed:", error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
      console.log("🔍 AuthContext: Auth check complete. Loading set to false.");
    }
  };

  const signIn = async (email: string, password: string) => {
    const signedUser = await auth.signIn(email, password);
    console.log("🔍 AuthContext: User signed in:", signedUser);
    
    if (signedUser.status === 'totp_required') {
      throw new Error('Two-factor authentication required');
    }
    
    // Enhanced admin detection - check multiple sources
    const userRole = signedUser.user.metadata?.role as string || 
                     (signedUser.user as any).role;
                     
    console.log("🔍 AuthContext: Detected user roles:", {
      metadataRole: signedUser.user.metadata?.role,
      directRole: (signedUser.user as any).role,
      finalRole: userRole
    });
    
    const userData: User = {
      userUuid: signedUser.user.userUuid || '',
      email: signedUser.user.email || '',
      firstName: signedUser.user.firstName,
      lastName: signedUser.user.lastName,
      role: userRole,
      metadata: signedUser.user.metadata
    };
    
    console.log("🔍 AuthContext: Setting user data", userData);
    console.log("🔍 AuthContext: Final user role", userRole);
    
    // Set user data FIRST
    setUser(userData);
    
    // Enhanced admin check with multiple fallbacks
    const adminCheck = 
      userRole === 'admin' ||
      userData.role === 'admin' ||
      userData.metadata?.role === 'admin' ||
      (signedUser.user as any).role === 'admin';
    
    console.log("🔍 AuthContext: Admin check after login:", adminCheck);
    console.log("🛡️ AuthContext: Setting isAdmin IMMEDIATELY to prevent loops!");
    setIsAdmin(adminCheck);
    
    // Force synchronous update for admin status
    if (adminCheck) {
      console.log("🛡️ ADMIN STATUS SET - Protected pages should work now!");
    }
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
    setIsAdmin(false);
    console.log("🔍 AuthContext: User signed out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, authLoading: loading, signIn, signOut, isAdmin }}>
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
