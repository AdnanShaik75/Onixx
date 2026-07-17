"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp() {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp(firebaseConfig);
}

interface FirebaseAuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: string | null }>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return { user: credential.user, error: null };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      switch (code) {
        case "auth/user-not-found":
          return { user: null, error: "No account found with this email" };
        case "auth/wrong-password":
          return { user: null, error: "Incorrect password" };
        case "auth/invalid-credential":
          return { user: null, error: "Invalid email or password" };
        case "auth/too-many-requests":
          return { user: null, error: "Too many attempts. Please try again later" };
        case "auth/user-disabled":
          return { user: null, error: "This account has been disabled" };
        default:
          return { user: null, error: "Sign in failed. Please try again" };
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      await signOut(auth);
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* silent */
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found") {
        return { error: "No account found with this email" };
      }
      return { error: "Failed to send reset email" };
    }
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ user, loading, signIn, logout, sendPasswordReset }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth(): FirebaseAuthContextValue {
  const ctx = useContext(FirebaseAuthContext);
  if (!ctx) throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
  return ctx;
}
