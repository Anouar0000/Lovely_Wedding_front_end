import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/** Prefer env (CRA REACT_APP_*) — hardcoded fallback for existing prod builds only */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDGbBycga8dsWpECJPHwMOdZo0vBSF-CaM",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "lovely-wedding-website.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "lovely-wedding-website",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "lovely-wedding-website.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "763999800328",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID || "1:763999800328:web:e8088f811228e5726715bd",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export default app;
