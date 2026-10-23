import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export const SECURITY_EVENTS_COLLECTION = "securityEvents";

const ALLOWED = new Set([
  "admin_login",
  "admin_mfa_missing",
  "admin_mfa_ok",
  "order_create_client",
  "auth_email_taken",
  "auth_lockout",
]);

/**
 * Best-effort security audit log (never throws to UI).
 */
export async function logSecurityEvent(type, details = {}) {
  if (!db || !ALLOWED.has(type)) return;
  try {
    await addDoc(collection(db, SECURITY_EVENTS_COLLECTION), {
      type,
      details: {
        path: String(details.path || (typeof window !== "undefined" ? window.location.pathname : "")).slice(0, 200),
        email: String(details.email || "").slice(0, 200),
        uid: String(details.uid || "").slice(0, 128),
        note: String(details.note || "").slice(0, 300),
      },
      createdAt: serverTimestamp(),
      userAgent: typeof navigator !== "undefined" ? String(navigator.userAgent || "").slice(0, 300) : "",
    });
  } catch {
    /* ignore — logging must not break UX */
  }
}
