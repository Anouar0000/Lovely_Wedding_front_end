import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";

export const PRODUCT_REVIEWS_COLLECTION = "productReviews";

/** Avis catalogue par défaut (affichés / seed Firestore). */
export const DEFAULT_PRODUCT_REVIEWS = [
  {
    name: "Lilia & Rayen",
    meta: "Achat vérifié • Formule Signature",
    text: "“Très professionnel ! Les invités ont particulièrement apprécié les invitations bilingues (français/arabe). On recommande à 100%.”",
    date: "Posté le 12 Septembre 2024",
    rating: 5,
    seedKey: "lilia-rayen-1",
  },
  {
    name: "Lilia & Rayen",
    meta: "Achat vérifié • Formule Signature",
    text: "“Très professionnel ! Les invités ont particulièrement apprécié les invitations bilingues (français/arabe). On recommande à 100%.”",
    date: "Posté le 12 Septembre 2024",
    rating: 5,
    seedKey: "lilia-rayen-2",
  },
];

function assertFirestoreReady() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }
}

function mapReviewDoc(snap) {
  const data = snap.data() || {};
  return {
    id: snap.id,
    name: String(data.name || "").trim(),
    meta: String(data.meta || "").trim(),
    text: String(data.text || "").trim(),
    date: String(data.date || "").trim(),
    rating: Number(data.rating) || 5,
    productSlug: String(data.productSlug || "").trim(),
    productType: String(data.productType || "").trim(),
    seedKey: data.seedKey ? String(data.seedKey) : "",
    createdAt: data.createdAt || null,
  };
}

export async function listProductReviews() {
  assertFirestoreReady();
  const snapshot = await getDocs(
    query(collection(db, PRODUCT_REVIEWS_COLLECTION), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map(mapReviewDoc);
}

/** Seed une fois les avis par défaut s’il n’y en a aucun. */
export async function ensureDefaultProductReviews() {
  assertFirestoreReady();
  const existing = await listProductReviews();
  if (existing.length > 0) return existing;

  const created = [];
  for (const review of DEFAULT_PRODUCT_REVIEWS) {
    const ref = await addDoc(collection(db, PRODUCT_REVIEWS_COLLECTION), {
      name: review.name,
      meta: review.meta,
      text: review.text,
      date: review.date,
      rating: review.rating,
      seedKey: review.seedKey,
      productSlug: "",
      productType: "",
      createdAt: serverTimestamp(),
    });
    created.push({ id: ref.id, ...review, productSlug: "", productType: "", createdAt: null });
  }
  return created;
}

export async function createProductReview(review) {
  assertFirestoreReady();
  const name = String(review.name || "").trim().slice(0, 120);
  const text = String(review.text || "").trim().slice(0, 2000);
  if (!name || !text) {
    throw new Error("Nom et avis requis.");
  }
  const payload = {
    name,
    meta: String(review.meta || "Avis client").trim().slice(0, 200),
    text,
    date: String(review.date || "").trim().slice(0, 120),
    rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
    productSlug: String(review.productSlug || "").trim().slice(0, 120),
    productType: String(review.productType || "").trim().slice(0, 40),
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, PRODUCT_REVIEWS_COLLECTION), payload);
  return { id: ref.id, ...payload, createdAt: null };
}

export async function deleteProductReview(id) {
  assertFirestoreReady();
  if (!id) throw new Error("Review id required.");
  await deleteDoc(doc(db, PRODUCT_REVIEWS_COLLECTION, id));
  return id;
}
