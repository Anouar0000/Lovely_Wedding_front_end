import { getFunctions, httpsCallable } from "firebase/functions";
import app, { isFirebaseConfigured } from "../lib/firebase";

const functions = isFirebaseConfigured && app ? getFunctions(app, "europe-west1") : null;

/**
 * Create a Flouci payment session for an existing order.
 * Requires deployed Cloud Functions + FLOUCI_* secrets.
 */
export async function createFlouciPaymentSession({ orderId, successLink, failLink }) {
  if (!functions) {
    throw new Error("Firebase Functions non configure.");
  }

  const callable = httpsCallable(functions, "createFlouciPayment");
  const response = await callable({ orderId, successLink, failLink });
  return response.data;
}

/**
 * Verify Flouci payment and mark order paid when SUCCESS.
 */
export async function verifyFlouciPaymentSession({ orderId, paymentId }) {
  if (!functions) {
    throw new Error("Firebase Functions non configure.");
  }

  const callable = httpsCallable(functions, "verifyFlouciPayment");
  const response = await callable({ orderId, paymentId });
  return response.data;
}

export function isFlouciLiveMode() {
  return process.env.REACT_APP_FLOUCI_LIVE === "true";
}
