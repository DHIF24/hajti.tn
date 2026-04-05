import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user profile
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            name: currentUser.displayName || 'User',
            email: currentUser.email || '',
            role: currentUser.email === 'dhifamine18@gmail.com' ? 'admin' : 'customer'
          };
          await setDoc(userRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      
      // Update profile immediately to avoid race condition with onAuthStateChanged
      const userRef = doc(db, 'users', userCred.user.uid);
      const newProfile: UserProfile = {
        uid: userCred.user.uid,
        name: name,
        email: email,
        role: email === 'dhifamine18@gmail.com' ? 'admin' : 'customer'
      };
      await setDoc(userRef, newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error("Error registering with email", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in with email", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, registerWithEmail, loginWithEmail, logout }}>
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
