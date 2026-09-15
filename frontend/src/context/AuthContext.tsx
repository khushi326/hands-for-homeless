'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'citizen' | 'volunteer' | 'donor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Session {
  access_token: string;
  user: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error: any }>;
  signUp: (
    email: string,
    password: string,
    metadata: { full_name: string; phone_number?: string; role: UserRole }
  ) => Promise<{ data?: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedToken = localStorage.getItem('hf_access_token');
    const storedUser = localStorage.getItem('hf_user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setSession({ access_token: storedToken, user: parsedUser });
        setUser(parsedUser);
        setProfile(parsedUser);
      } catch (e) {
        localStorage.removeItem('hf_access_token');
        localStorage.removeItem('hf_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');
      
      localStorage.setItem('hf_access_token', data.access_token);
      localStorage.setItem('hf_user', JSON.stringify(data.user));
      
      setSession({ access_token: data.access_token, user: data.user });
      setUser(data.user);
      setProfile(data.user);
      return { data: { user: data.user, access_token: data.access_token }, error: null };
    } catch (e: any) {
      return { data: null, error: e };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: { full_name: string; phone_number?: string; role: UserRole }
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...metadata })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      
      // Auto login after successful signup
      return await signIn(email, password);
    } catch (e: any) {
      return { error: e };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('hf_access_token');
    localStorage.removeItem('hf_user');
    setUser(null);
    setProfile(null);
    setSession(null);
    return { error: null };
  };

  const refreshProfile = async () => {
    // In a fully built app, you'd fetch /api/auth/me to refresh. 
    // For this SQLite version, we rely on standard session updates.
  };

  const resetPassword = async (email: string) => {
    // Simulating API call for password reset since no SMTP is set up
    return new Promise<{ error: any }>((resolve) => {
      setTimeout(() => {
        resolve({ error: null });
      }, 1500);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
