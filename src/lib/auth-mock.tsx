'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

type Role = 'ADMIN' | 'PM' | 'OPERAIO';

interface AuthContextType {
  role: Role;
  user: any;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  canAccess: (requiredRole: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  const role = (session?.user as any)?.role as Role || 'OPERAIO';

  const canAccess = (requiredRoles: Role[]) => {
    return requiredRoles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ 
      role, 
      user: session?.user, 
      status,
      canAccess 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider (inside Providers)');
  }
  return context;
}
