import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const DIGITAL_INVITES_COLLECTION = "digitalInvites";

export const DIGITAL_INVITE_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const DIGITAL_INVITE_TEMPLATES = {
  DOLCE_VITA: "dolce-vita",
};

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured. Add REACT_APP_FIREBASE_* values to your env file.");
  }
}

export function createDigitalInviteDraft(overrides = {}) {
  return {
    slug: "",
    template: DIGITAL_INVITE_TEMPLATES.DOLCE_VITA,
    status: DIGITAL_INVITE_STATUSES.DRAFT,
    title: "La Dolce Vita",
    coupleNames: "",
    introLabel: "We are getting married",
    introText: "",
    eventDate: "",
    dateLabel: "",
    venueName: "",
    city: "",
    locationLabel: "",
    time: "",
    mapUrl: "",
    rsvpEnabled: true,
    closingText: "",
    timeline: [],
    ...overrides,
  };
}

export async function listDigitalInvites() {
  assertFirestoreReady();

  const invitesQuery = query(
    collection(db, DIGITAL_INVITES_COLLECTION),
    orderBy("updatedAt", "desc")
  );
  const snapshot = await getDocs(invitesQuery);

  return snapshot.docs.map((inviteDoc) => ({
    id: inviteDoc.id,
    ...inviteDoc.data(),
  }));
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
