'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { useSession } from 'next-auth/react';

type Role = 'ADMIN' | 'PM' | 'OPERAIO';

interface AuthContextType {
  role: Role;
  user: any;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  canAccess: (requiredRole: Role[]) => boolean;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  const [localRole, setLocalRole] = useState<Role | null>(null);
  
  const role = localRole || (session?.user as any)?.role as Role || 'OPERAIO';

  const canAccess = (requiredRoles: Role[]) => {
    return requiredRoles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ 
      role, 
      user: session?.user, 
      status,
      canAccess,
      setRole: setLocalRole
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
