import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const DIGITAL_INVITES_COLLECTION = "digitalInvites";

export const DIGITAL_INVITE_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const DIGITAL_INVITE_TEMPLATES = {
  DOLCE_VITA: "dolce-vita",
  SIDI_BOUSAID: "sidi-bousaid",
  CLUB_CAPRI: "club-capri",
  SAKURA_KOI: "sakura-koi",
  BRIDGERTON: "bridgerton",
  MAJESTIC_WHITE: "majestic-white",
};

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured. Add REACT_APP_FIREBASE_* values to your env file.");
  }
}

export function createDigitalInviteDraft(overrides = {}) {
  return {
    slug: "",
    template: DIGITAL_INVITE_TEMPLATES.CLUB_CAPRI,
    status: DIGITAL_INVITE_STATUSES.DRAFT,
    title: "Club Capri",
    coupleNames: "",
    eventDate: "",
    venueName: "",
    city: "",
    locationLabel: "",
    time: "",
    mapUrl: "",
    rsvpEnabled: true,
    videoIntroEnabled: true,
    timeline: [],
    ownerId: "",
    clientUserId: "",
    clientEmail: "",
    ...overrides,
  };
}

export async function listDigitalInvites(ownerId) {
  assertFirestoreReady();

  if (!ownerId) {
    throw new Error("ownerId is required to list invitations.");
  }

  // Filter by owner only; sort client-side to avoid a composite index requirement.
  const invitesQuery = query(
    collection(db, DIGITAL_INVITES_COLLECTION),
    where("ownerId", "==", ownerId)
  );
  const snapshot = await getDocs(invitesQuery);

  return snapshot.docs
    .map((inviteDoc) => ({
      id: inviteDoc.id,
      ...inviteDoc.data(),
    }))
    .sort((a, b) => {
      const aTime = a.updatedAt?.toMillis?.() || 0;
      const bTime = b.updatedAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
}

export async function getDigitalInviteBySlug(slug, { publishedOnly = false } = {}) {
  assertFirestoreReady();

  const inviteDoc = await getDoc(doc(db, DIGITAL_INVITES_COLLECTION, slug));

  if (!inviteDoc.exists()) {
    return null;
  }

  const invite = inviteDoc.data();

  if (publishedOnly && invite.status !== DIGITAL_INVITE_STATUSES.PUBLISHED) {
    return null;
  }

  return {
    id: inviteDoc.id,
    ...invite,
  };
}

export async function getDigitalInviteById(id) {
  assertFirestoreReady();

  const inviteDoc = await getDoc(doc(db, DIGITAL_INVITES_COLLECTION, id));

  if (!inviteDoc.exists()) {
    return null;
  }

  return {
    id: inviteDoc.id,
    ...inviteDoc.data(),
  };
}

export async function saveDigitalInvite(id, invite) {
  assertFirestoreReady();

  if (!invite.ownerId) {
    throw new Error("ownerId is required to save an invitation.");
  }

  const now = serverTimestamp();
  const inviteRef = doc(db, DIGITAL_INVITES_COLLECTION, id);

  await setDoc(
    inviteRef,
    {
      ...invite,
      createdAt: invite.createdAt || now,
      updatedAt: now,
    },
    { merge: true }
  );

  return id;
}

export async function updateDigitalInvite(id, updates) {
  assertFirestoreReady();

  await updateDoc(doc(db, DIGITAL_INVITES_COLLECTION, id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  return id;
}

export async function deleteDigitalInvite(id) {
  assertFirestoreReady();

  await deleteDoc(doc(db, DIGITAL_INVITES_COLLECTION, id));
}

export async function listDigitalInvitesForClient(user) {
  assertFirestoreReady();

  if (!user?.uid) {
    throw new Error("User is required.");
  }

  const byUidQuery = query(
    collection(db, DIGITAL_INVITES_COLLECTION),
    where("clientUserId", "==", user.uid)
  );
  const byUidSnap = await getDocs(byUidQuery);

  let byEmailDocs = [];
  if (user.email) {
    const byEmailQuery = query(
      collection(db, DIGITAL_INVITES_COLLECTION),
      where("clientEmail", "==", String(user.email).trim().toLowerCase())
    );
    const byEmailSnap = await getDocs(byEmailQuery);
    byEmailDocs = byEmailSnap.docs;
  }

  const merged = new Map();
  [...byUidSnap.docs, ...byEmailDocs].forEach((inviteDoc) => {
    merged.set(inviteDoc.id, {
      id: inviteDoc.id,
      ...inviteDoc.data(),
    });
  });

  return Array.from(merged.values()).sort((a, b) => {
    const aTime = a.updatedAt?.toMillis?.() || 0;
    const bTime = b.updatedAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
}
