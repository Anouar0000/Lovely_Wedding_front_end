import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import app, { db, isFirebaseConfigured } from "../lib/firebase";
import { logSecurityEvent } from "./securityEvents";

export const ORDERS_COLLECTION = "orders";

export const ORDER_STATUSES = {
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  FULFILLED: "fulfilled",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABELS = {
  pending_payment: "Paiement en attente",
  paid: "Payée",
  fulfilled: "Livrée / traitée",
  cancelled: "Annulée",
};

const ALLOWED_ADMIN_STATUSES = new Set(Object.values(ORDER_STATUSES));

const functions =
  isFirebaseConfigured && app ? getFunctions(app, "europe-west1") : null;

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
}

function mapOrder(snap) {
  return { id: snap.id, ...snap.data() };
}

/**
 * Create order via Cloud Function — server recomputes all prices.
 * Do not send unitPrice / totals from the client.
 */
export async function createOrder({ items, customer, shipping }) {
  if (!functions) {
    throw new Error("Firebase Functions non configure.");
  }
  if (!items?.length) {
    throw new Error("Le panier est vide.");
  }

  const callable = httpsCallable(functions, "createOrder");
  const response = await callable({
    items: items.map((item) => ({
      productType: item.productType,
      productId: item.productId,
      qty: Number(item.qty) || 1,
      format: item.format || "",
      motif: item.motif || "",
      meta: item.meta || {},
      pack: item.meta?.pack || item.pack,
    })),
    customer: {
      fullName: customer?.fullName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    },
    shipping: shipping || null,
  });

  const orderId = response?.data?.orderId;
  if (!orderId) {
    throw new Error("Impossible de créer la commande.");
  }
  logSecurityEvent("order_create_client", {
    email: customer?.email || "",
    note: orderId,
  });
  return orderId;
}

export async function getOrderById(orderId) {
  assertFirestoreReady();

  const snap = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
  if (!snap.exists()) {
    return null;
  }

  return mapOrder(snap);
}

export async function listAllOrders() {
  assertFirestoreReady();
  const snap = await getDocs(collection(db, ORDERS_COLLECTION));
  const items = snap.docs.map(mapOrder);
  return items.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
    const tb = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
    return tb - ta;
  });
}

export async function updateOrderStatus(orderId, status) {
  assertFirestoreReady();
  if (!ALLOWED_ADMIN_STATUSES.has(status)) {
    throw new Error("Statut invalide.");
  }
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOrder(orderId) {
  assertFirestoreReady();
  await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
}
