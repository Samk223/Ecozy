import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfigJson from "../firebase-applet-config.json";

/**
 * Retrieves a Firebase configuration value with priority:
 * 1. Environment Variable (NEXT_PUBLIC_*)
 * 2. Fallback JSON (firebase-applet-config.json)
 */
const getConfigValue = (envKey: string, jsonKey: keyof typeof firebaseConfigJson): string => {
  const value = process.env[envKey] || firebaseConfigJson[jsonKey];
  return value as string;
};

const firebaseConfig = {
  apiKey: getConfigValue("NEXT_PUBLIC_FIREBASE_API_KEY", "apiKey"),
  authDomain: getConfigValue("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "authDomain"),
  projectId: getConfigValue("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "projectId"),
  storageBucket: getConfigValue("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "storageBucket"),
  messagingSenderId: getConfigValue("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "messagingSenderId"),
  appId: getConfigValue("NEXT_PUBLIC_FIREBASE_APP_ID", "appId"),
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId ? {
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId,
  } : {}),
};

const databaseId = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId;

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
