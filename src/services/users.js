import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const USERS_COLLECTION = "users";
export const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
};

/** Fallback if env var missing in a build — keep in sync with firestore.rules */
const HARDCODED_ADMIN_EMAILS = [
  "mkadmiaziz0203@gmail.com",
  "benhamzaanouar000@gmail.com",
  "azza.setti@gmail.com",
  "houssemsetties@gmail.com",
];

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
}

export function getAdminEmails() {
  const fromEnv = (process.env.REACT_APP_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const merged = new Set([...HARDCODED_ADMIN_EMAILS, ...fromEnv]);
  return Array.from(merged);
}

export function isAdminEmail(email) {
  if (!email) return false;
  return getAdminEmails().includes(String(email).trim().toLowerCase());
}

export async function ensureUserProfile(user, extras = {}) {
  assertFirestoreReady();
  if (!user?.uid) {
    return null;
  }

  const ref = doc(db, USERS_COLLECTION, user.uid);
  const snap = await getDoc(ref);
  const admin = isAdminEmail(user.email);
  const fullName = String(extras.fullName || "").trim().slice(0, 120);
  const phone = String(extras.phone || "").trim().slice(0, 40);
  const hasContact = Boolean(fullName || phone);

  if (!snap.exists()) {
    const profile = {
      email: user.email || "",
      role: admin ? USER_ROLES.ADMIN : USER_ROLES.CLIENT,
      fullName,
      phone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return { id: user.uid, ...profile };
  }

  const existing = snap.data();
  const patch = {};
  if (admin && existing.role !== USER_ROLES.ADMIN) {
    patch.role = USER_ROLES.ADMIN;
    patch.email = user.email || existing.email || "";
  }
  if (hasContact) {
    if (fullName) patch.fullName = fullName;
    if (phone) patch.phone = phone;
  }
  if (Object.keys(patch).length) {
    patch.updatedAt = serverTimestamp();
    await setDoc(ref, patch, { merge: true });
    return { id: user.uid, ...existing, ...patch };
  }

  return { id: user.uid, ...existing };
}

/** Persist name/phone after signup (merge-safe vs AuthProvider race). */
export async function saveUserContactInfo(user, { fullName, phone }) {
  return ensureUserProfile(user, { fullName, phone });
}

export async function getUserProfile(uid) {
  assertFirestoreReady();
  if (!uid) return null;
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
