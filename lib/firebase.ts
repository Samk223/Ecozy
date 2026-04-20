import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Retrieves a Firebase configuration value from Environment Variables.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? {
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  } : {}),
};

const databaseId = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || "";

// Validation: Log warning if config is incomplete instead of crashing
const isConfigIncomplete = !firebaseConfig.apiKey || !firebaseConfig.projectId;

if (isConfigIncomplete) {
  console.warn(
    "Firebase configuration is missing. " +
    "Please run 'Firebase Setup' or add NEXT_PUBLIC_FIREBASE_* keys to your Secrets settings."
  );
}

// Initialize Firebase (or reuse existing instance)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const auth = getAuth(app);
