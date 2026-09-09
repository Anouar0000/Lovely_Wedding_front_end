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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";

export const DIGITAL_INVITES_COLLECTION = "digitalInvites";

export const DIGITAL_INVITE_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const DIGITAL_INVITE_TEMPLATES = {
  DOLCE_VITA: "dolce-vita",
};

function getLocalInvitesList() {
  try {
    const raw = localStorage.getItem("digital_invites_list");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalInvitesList(list) {
  try {
    localStorage.setItem("digital_invites_list", JSON.stringify(list));
  } catch (e) {}
}

function getLocalInvite(id) {
  try {
    const raw = localStorage.getItem("digital_invite_" + id);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveLocalInvite(id, invite) {
  try {
    const existing = getLocalInvite(id) || {};
    const now = new Date().toISOString();
    const merged = {
      ...existing,
      ...invite,
      id,
      createdAt: existing.createdAt || invite.createdAt || now,
      updatedAt: now,
    };
    localStorage.setItem("digital_invite_" + id, JSON.stringify(merged));
    const list = getLocalInvitesList();
    if (!list.includes(id)) {
      list.push(id);
      saveLocalInvitesList(list);
    }
    return merged;
  } catch (e) {
    return invite;
  }
}

function deleteLocalInvite(id) {
  try {
    localStorage.removeItem("digital_invite_" + id);
    const list = getLocalInvitesList().filter((item) => item !== id);
    saveLocalInvitesList(list);
  } catch (e) {}
}

export function createDigitalInviteDraft(overrides = {}) {
  return {
    slug: "",
    template: DIGITAL_INVITE_TEMPLATES.DOLCE_VITA,
    status: DIGITAL_INVITE_STATUSES.DRAFT,
    title: "La Dolce Vita",
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
    ...overrides,
  };
}

export async function listDigitalInvites() {
  if (!db) {
    const ids = getLocalInvitesList();
    return ids.map((id) => getLocalInvite(id)).filter(Boolean);
  }

  try {
    const invitesQuery = query(
      collection(db, DIGITAL_INVITES_COLLECTION),
      orderBy("updatedAt", "desc")
    );
    const snapshot = await getDocs(invitesQuery);

    return snapshot.docs.map((inviteDoc) => ({
      id: inviteDoc.id,
      ...inviteDoc.data(),
    }));
  } catch (fsErr) {
    console.warn("Firestore list error, falling back to localStorage:", fsErr);
    const ids = getLocalInvitesList();
    return ids.map((id) => getLocalInvite(id)).filter(Boolean);
  }
}

export async function getDigitalInviteBySlug(slug, { publishedOnly = false } = {}) {
  if (!db) {
    const invite = getLocalInvite(slug);
    if (!invite) return null;
    if (publishedOnly && invite.status !== DIGITAL_INVITE_STATUSES.PUBLISHED) return null;
    return invite;
  }

  try {
    const inviteDoc = await getDoc(doc(db, DIGITAL_INVITES_COLLECTION, slug));
    if (!inviteDoc.exists()) {
      const fallback = getLocalInvite(slug);
      if (fallback && (!publishedOnly || fallback.status === DIGITAL_INVITE_STATUSES.PUBLISHED)) {
        return fallback;
      }
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
  } catch (fsErr) {
    console.warn("Firestore get error, falling back to localStorage:", fsErr);
    const invite = getLocalInvite(slug);
    if (!invite) return null;
    if (publishedOnly && invite.status !== DIGITAL_INVITE_STATUSES.PUBLISHED) return null;
    return invite;
  }
}

export async function getDigitalInviteById(id) {
  if (!db) {
    return getLocalInvite(id);
  }

  try {
    const inviteDoc = await getDoc(doc(db, DIGITAL_INVITES_COLLECTION, id));
    if (!inviteDoc.exists()) {
      return getLocalInvite(id);
    }

    return {
      id: inviteDoc.id,
      ...inviteDoc.data(),
    };
  } catch (fsErr) {
    console.warn("Firestore getById error, falling back to localStorage:", fsErr);
    return getLocalInvite(id);
  }
}

export async function saveDigitalInvite(id, invite) {
  saveLocalInvite(id, invite);

  if (!db) {
    return id;
  }

  try {
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
  } catch (fsErr) {
    console.warn("Firestore save error, persisted locally:", fsErr);
  }

  return id;
}

export async function updateDigitalInvite(id, updates) {
  saveLocalInvite(id, updates);

  if (!db) {
    return id;
  }

  try {
    await updateDoc(doc(db, DIGITAL_INVITES_COLLECTION, id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (fsErr) {
    console.warn("Firestore update error, persisted locally:", fsErr);
  }

  return id;
}

export async function deleteDigitalInvite(id) {
  deleteLocalInvite(id);

  if (db) {
    try {
      await deleteDoc(doc(db, DIGITAL_INVITES_COLLECTION, id));
    } catch (fsErr) {
      console.warn("Firestore delete error:", fsErr);
    }
  }
}

export async function uploadInviteAsset(inviteId, file, type) {
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }

  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${type}_${timestamp}.${fileExtension}`;
  const storagePath = `${DIGITAL_INVITES_COLLECTION}/${inviteId}/${fileName}`;

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
