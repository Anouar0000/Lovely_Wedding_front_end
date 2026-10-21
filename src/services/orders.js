import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

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

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
}

function mapOrder(snap) {
  return { id: snap.id, ...snap.data() };
}

export async function createOrder({
  items,
  customer,
  shipping,
  userId = null,
}) {
  assertFirestoreReady();

  if (!items?.length) {
    throw new Error("Le panier est vide.");
  }

  const normalizedItems = items.map((item) => ({
    productType: item.productType,
    productId: item.productId,
    title: item.title,
    qty: Number(item.qty) || 1,
    unitPrice: Number(item.unitPrice) || 0,
    format: item.format || "",
    motif: item.motif || "",
    meta: item.meta || {},
  }));

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );

  const payload = {
    userId: userId || null,
    status: ORDER_STATUSES.PENDING_PAYMENT,
    items: normalizedItems,
    totals: {
      subtotal,
      currency: "DT",
    },
    customer: {
      fullName: customer.fullName?.trim() || "",
      email: customer.email?.trim() || "",
      phone: customer.phone?.trim() || "",
    },
    shipping: shipping
      ? {
          address: shipping.address?.trim() || "",
          city: shipping.city?.trim() || "",
          notes: shipping.notes?.trim() || "",
        }
      : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, ORDERS_COLLECTION), payload);
  return ref.id;
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
