'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';
import { getProfile, registerUser } from '@/lib/api';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'farmer' | 'corporate' | 'admin';
  phone?: string;
  region?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: string, phone?: string, region?: string) => Promise<void>;
  signInWithGoogle: (role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (): Promise<UserProfile | null> => {
    try {
      const response = await getProfile();
      const data = response.data.data;
      setProfile(data);
      return data;
    } catch {
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
    await fetchProfile();
  };

  const signUp = async (email: string, password: string, displayName: string, role: string, phone?: string, region?: string) => {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    // Register in backend
    await registerUser({ displayName, role, phone, region });
    await fetchProfile();
  };

  const signInWithGoogle = async (role: string = 'farmer') => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(firebaseAuth, provider);
    // Try to get profile — if not found, register
    const existingProfile = await fetchProfile();
    if (!existingProfile) {
      await registerUser({
        displayName: cred.user.displayName || 'User',
        role,
      });
      await fetchProfile();
    }
  };

  const logout = async () => {
    await signOut(firebaseAuth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signInWithGoogle, logout, refreshProfile }}
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
