import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const RSVP_COLLECTION = "rsvpResponses";

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
}

export async function submitRsvpResponse({
  inviteId,
  ownerId,
  clientUserId = "",
  clientEmail = "",
  inviteSlug = "",
  fullName,
  email = "",
  phone = "",
  guestCount = 1,
  attending = true,
  lastName = "",
}) {
  assertFirestoreReady();

  if (!inviteId) {
    throw new Error("Invitation invalide pour le RSVP.");
  }

  if (!ownerId) {
    throw new Error("RSVP disponible uniquement sur une invitation publiee depuis le dashboard.");
  }

  const name = String(fullName || "").trim();
  if (!name) {
    throw new Error("Le nom est requis.");
  }

  const payload = {
    inviteId: String(inviteId),
    ownerId: String(ownerId),
    clientUserId: String(clientUserId || ""),
    clientEmail: String(clientEmail || "").trim().toLowerCase(),
    inviteSlug: String(inviteSlug || inviteId),
    fullName: name,
    lastName: String(lastName || "").trim(),
    email: String(email || "").trim(),
    phone: String(phone || "").trim(),
    guestCount: Math.max(1, Number(guestCount) || 1),
    attending: Boolean(attending),
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, RSVP_COLLECTION), payload);
  return ref.id;
}

export async function listRsvpByOwner(ownerId) {
  assertFirestoreReady();

  if (!ownerId) {
    return [];
  }

  const rsvpQuery = query(
    collection(db, RSVP_COLLECTION),
    where("ownerId", "==", ownerId)
  );

  const snapshot = await getDocs(rsvpQuery);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
}

export async function listRsvpByClient(clientUserId) {
  assertFirestoreReady();

  if (!clientUserId) {
    return [];
  }

  const rsvpQuery = query(
    collection(db, RSVP_COLLECTION),
    where("clientUserId", "==", clientUserId)
  );

  const snapshot = await getDocs(rsvpQuery);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
}

export async function listRsvpByClientEmail(clientEmail) {
  assertFirestoreReady();

  if (!clientEmail) {
    return [];
  }

  const rsvpQuery = query(
    collection(db, RSVP_COLLECTION),
    where("clientEmail", "==", String(clientEmail).trim().toLowerCase())
  );

  const snapshot = await getDocs(rsvpQuery);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
}

export async function listRsvpByInviteId(
  inviteId,
  { ownerId = "", clientUserId = "", clientEmail = "" } = {}
) {
  if (ownerId) {
    const all = await listRsvpByOwner(ownerId);
    return all.filter((item) => item.inviteId === inviteId);
  }

  if (clientUserId) {
    const all = await listRsvpByClient(clientUserId);
    return all.filter((item) => item.inviteId === inviteId);
  }

  if (clientEmail) {
    const all = await listRsvpByClientEmail(clientEmail);
    return all.filter((item) => item.inviteId === inviteId);
  }

  return [];
}
