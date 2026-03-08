import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "~/firebaseConfig.client";
import type { User as FirebaseUser } from "firebase/auth";

// Define the User interface, now including phoneNumber and creationTime
interface User {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  creationTime: string | null;
  // It's better to manage the token securely and not expose it directly in the context
}

// Define the AuthContext interface
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  // Expose the raw firebase user if needed for specific operations
  firebaseUser: FirebaseUser | null;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  firebaseUser: null,
});

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is signed in, let's build our custom user object
        const appUser: User = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          phoneNumber: fbUser.phoneNumber,
          creationTime: fbUser.metadata.creationTime 
            ? new Date(fbUser.metadata.creationTime).toLocaleDateString()
            : null,
        };
        setUser(appUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, firebaseUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create the useAuth hook
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
