import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

/**
 * Long-polling avoids WebChannel AbortError overlays in CRA Strict Mode / HMR.
 * Fall back to getFirestore after HMR already started Firestore.
 */
function createDb(firebaseApp) {
  try {
    return initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true,
    });
  } catch {
    return getFirestore(firebaseApp);
  }
}

export const db = app ? createDb(app) : null;

/** Storage may be unavailable until rules/bucket are configured — never crash the app. */
export const storage = (() => {
  if (!app) return null;
  try {
    return getStorage(app);
  } catch (error) {
    console.warn("[firebase] Storage init failed:", error?.message || error);
    return null;
  }
})();

/** Firestore/WebChannel aborts on remount — not an application failure. */
export function isAbortError(error) {
  if (!error) return false;
  if (error.name === "AbortError") return true;
  if (error.code === "aborted") return true;
  const message = String(error.message || error);
  return /signal is aborted|AbortError|aborted without reason/i.test(message);
}

export default app;
