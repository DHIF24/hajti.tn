import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

let dbInstance;
try {
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  console.log("Firestore initialized with named database:", firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn("Failed to initialize named database, falling back to default:", e);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const storage = getStorage(app);
console.log("Firebase Storage initialized with bucket:", storage.app.options.storageBucket);
export const googleProvider = new GoogleAuthProvider();
