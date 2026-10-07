import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const ORDERS_COLLECTION = "orders";

export const ORDER_STATUSES = {
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  CANCELLED: "cancelled",
};

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
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

  return {
    id: snap.id,
    ...snap.data(),
  };
}
