import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const CATALOG_COLLECTION = "catalogProducts";

export const CATALOG_TYPES = {
  DIGITAL: "digital",
  PHYSICAL: "physical",
};

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
}

function mapDoc(snap) {
  return { id: snap.id, ...snap.data() };
}

export async function listAllCatalogProducts() {
  assertFirestoreReady();
  const snap = await getDocs(collection(db, CATALOG_COLLECTION));
  return snap.docs
    .map(mapDoc)
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
}

export async function listActiveCatalogProducts(type) {
  assertFirestoreReady();
  const q = query(
    collection(db, CATALOG_COLLECTION),
    where("active", "==", true),
    where("type", "==", type)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(mapDoc)
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
}

export async function createCatalogProduct(data) {
  assertFirestoreReady();
  const payload = {
    type: data.type === CATALOG_TYPES.PHYSICAL ? CATALOG_TYPES.PHYSICAL : CATALOG_TYPES.DIGITAL,
    name: String(data.name || "").trim().slice(0, 120),
    slug: String(data.slug || "").trim().slice(0, 120),
    category: String(data.category || "").trim().slice(0, 80),
    priceLabel: String(data.priceLabel || "").trim().slice(0, 80),
    imageUrl: String(data.imageUrl || "").trim().slice(0, 500),
    filled: Boolean(data.filled),
    active: data.active !== false,
    sortOrder: Number(data.sortOrder) || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (!payload.name) throw new Error("Nom requis.");
  const ref = await addDoc(collection(db, CATALOG_COLLECTION), payload);
  return ref.id;
}

export async function updateCatalogProduct(id, patch) {
  assertFirestoreReady();
  const next = { updatedAt: serverTimestamp() };
  [
    "type",
    "name",
    "slug",
    "category",
    "priceLabel",
    "imageUrl",
    "filled",
    "active",
    "sortOrder",
  ].forEach((key) => {
    if (patch[key] !== undefined) next[key] = patch[key];
  });
  if (typeof next.name === "string") next.name = next.name.trim().slice(0, 120);
  if (typeof next.slug === "string") next.slug = next.slug.trim().slice(0, 120);
  if (typeof next.category === "string") next.category = next.category.trim().slice(0, 80);
  if (typeof next.priceLabel === "string") next.priceLabel = next.priceLabel.trim().slice(0, 80);
  if (typeof next.imageUrl === "string") next.imageUrl = next.imageUrl.trim().slice(0, 500);
  if (next.sortOrder !== undefined) next.sortOrder = Number(next.sortOrder) || 0;
  await updateDoc(doc(db, CATALOG_COLLECTION, id), next);
}

export async function deleteCatalogProduct(id) {
  assertFirestoreReady();
  await deleteDoc(doc(db, CATALOG_COLLECTION, id));
}
