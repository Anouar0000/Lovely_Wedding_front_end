import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { canonicalEmail } from "../lib/authSecurity";

export const USERS_COLLECTION = "users";
export const EMAIL_INDEX_COLLECTION = "emailIndex";
export const EMAIL_TAKEN_CODE = "lw/email-taken";
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

/**
 * Reserve the canonical mailbox for this uid (one account per email).
 * Rules reject the write when another uid already holds it.
 */
export async function claimEmail(user) {
  assertFirestoreReady();
  if (!user?.uid || !user.email) return;
  const key = canonicalEmail(user.email);
  try {
    await setDoc(doc(db, EMAIL_INDEX_COLLECTION, key), {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    if (error?.code === "permission-denied") {
      const taken = new Error("Cet email est déjà utilisé par un autre compte.");
      taken.code = EMAIL_TAKEN_CODE;
      throw taken;
    }
    throw error;
  }
}

export async function ensureUserProfile(user, extras = {}) {
  assertFirestoreReady();
  if (!user?.uid) {
    return null;
  }

  const ref = doc(db, USERS_COLLECTION, user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await claimEmail(user);
  } else {
    // Accounts created before the email index: never lock them out.
    claimEmail(user).catch(() => {});
  }
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

export async function listAllUsers() {
  assertFirestoreReady();
  const snap = await getDocs(collection(db, USERS_COLLECTION));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => String(a.email || "").localeCompare(String(b.email || "")));
}

export async function updateUserProfile(uid, patch) {
  assertFirestoreReady();
  if (!uid) throw new Error("Utilisateur requis.");
  const next = { updatedAt: serverTimestamp() };
  if (patch.fullName !== undefined) {
    next.fullName = String(patch.fullName || "").trim().slice(0, 120);
  }
  if (patch.phone !== undefined) {
    next.phone = String(patch.phone || "").trim().slice(0, 40);
  }
  if (patch.notes !== undefined) {
    next.notes = String(patch.notes || "").trim().slice(0, 500);
  }
  if (patch.role !== undefined) {
    next.role = patch.role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.CLIENT;
  }
  await updateDoc(doc(db, USERS_COLLECTION, uid), next);
}

export async function deleteUserDoc(uid) {
  assertFirestoreReady();
  if (!uid) throw new Error("Utilisateur requis.");
  await deleteDoc(doc(db, USERS_COLLECTION, uid));
}
