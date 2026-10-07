const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
setGlobalOptions({ region: "europe-west1" });

const db = getFirestore();
const flouciPublicKey = defineSecret("FLOUCI_PUBLIC_KEY");
const flouciPrivateKey = defineSecret("FLOUCI_PRIVATE_KEY");

const ALLOWED_REDIRECT_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "lovely-wedding-website.web.app",
  "lovely-wedding-website.firebaseapp.com",
  "lovely-wedding-v2.web.app",
  "lovely-wedding-v2.firebaseapp.com",
]);

function assertOrderAccess(order, auth) {
  const ownerId = order?.userId || null;
  if (!ownerId) {
    // Guest order: callable may be invoked without auth (ID acts as capability).
    return;
  }
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Sign in required for this order.");
  }
  if (auth.uid !== ownerId) {
    throw new HttpsError("permission-denied", "Not allowed for this order.");
  }
}

function getFlouciKeys() {
  const publicKey = flouciPublicKey.value() || process.env.FLOUCI_PUBLIC_KEY || "";
  const privateKey = flouciPrivateKey.value() || process.env.FLOUCI_PRIVATE_KEY || "";

  if (!publicKey || !privateKey) {
    throw new HttpsError(
      "failed-precondition",
      "Flouci keys missing. Set FLOUCI_PUBLIC_KEY and FLOUCI_PRIVATE_KEY secrets."
    );
  }

  return { publicKey, privateKey };
}

function toMillimes(amountDt) {
  const value = Number(amountDt);
  if (!Number.isFinite(value) || value <= 0) {
    throw new HttpsError("invalid-argument", "Invalid order amount.");
  }
  return String(Math.round(value * 1000));
}

function assertSafeRedirect(url, fieldName) {
  let parsed;
  try {
    parsed = new URL(String(url || ""));
  } catch {
    throw new HttpsError("invalid-argument", `Invalid ${fieldName}.`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new HttpsError("invalid-argument", `Invalid ${fieldName} protocol.`);
  }

  const host = parsed.hostname.toLowerCase();
  const allowed =
    ALLOWED_REDIRECT_HOSTS.has(host) ||
    host.endsWith(".lovely-wedding-website.web.app");

  if (!allowed) {
    throw new HttpsError("invalid-argument", `Untrusted ${fieldName} host.`);
  }

  if (parsed.protocol === "http:" && host !== "localhost" && host !== "127.0.0.1") {
    throw new HttpsError("invalid-argument", `HTTP only allowed on localhost.`);
  }
}

exports.createFlouciPayment = onCall(
  { secrets: [flouciPublicKey, flouciPrivateKey] },
  async (request) => {
    const orderId = request.data?.orderId;
    const successLink = request.data?.successLink;
    const failLink = request.data?.failLink;

    if (!orderId || !successLink || !failLink) {
      throw new HttpsError(
        "invalid-argument",
        "orderId, successLink and failLink are required."
      );
    }

    assertSafeRedirect(successLink, "successLink");
    assertSafeRedirect(failLink, "failLink");

    const orderRef = db.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      throw new HttpsError("not-found", "Order not found.");
    }

    const order = orderSnap.data();
    assertOrderAccess(order, request.auth);

    if (order?.status === "paid") {
      throw new HttpsError("failed-precondition", "Order already paid.");
    }

    const amount = toMillimes(order?.totals?.subtotal);
    const { publicKey, privateKey } = getFlouciKeys();

    const response = await fetch("https://developers.flouci.com/api/v2/generate_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicKey}:${privateKey}`,
      },
      body: JSON.stringify({
        amount,
        accept_card: true,
        session_timeout_secs: 1200,
        success_link: successLink,
        fail_link: failLink,
        developer_tracking_id: orderId,
      }),
    });

    const payload = await response.json();
    const result = payload?.result;

    if (!response.ok || !result?.success || !result?.link || !result?.payment_id) {
      throw new HttpsError(
        "internal",
        result?.message || "Flouci generate_payment failed."
      );
    }

    await orderRef.update({
      status: "pending_payment",
      paymentProvider: "flouci",
      flouciPaymentId: result.payment_id,
      flouciTrackingId: orderId,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      paymentId: result.payment_id,
      link: result.link,
      orderId,
    };
  }
);

exports.verifyFlouciPayment = onCall(
  { secrets: [flouciPublicKey, flouciPrivateKey] },
  async (request) => {
    const orderId = request.data?.orderId;
    const paymentId = request.data?.paymentId;

    if (!orderId || !paymentId) {
      throw new HttpsError("invalid-argument", "orderId and paymentId are required.");
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      throw new HttpsError("not-found", "Order not found.");
    }

    const order = orderSnap.data();
    assertOrderAccess(order, request.auth);

    if (!order?.flouciPaymentId) {
      throw new HttpsError(
        "failed-precondition",
        "Order has no Flouci payment yet. Create payment first."
      );
    }

    if (order.flouciPaymentId !== paymentId) {
      throw new HttpsError("permission-denied", "Payment does not match order.");
    }

    if (order?.status === "paid") {
      return { orderId, paid: true, status: order.flouciStatus || "SUCCESS" };
    }

    const { publicKey, privateKey } = getFlouciKeys();

    const response = await fetch(
      `https://developers.flouci.com/api/v2/verify_payment/${encodeURIComponent(paymentId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${publicKey}:${privateKey}`,
        },
      }
    );

    const payload = await response.json();
    const ok = payload?.success === true;
    const status = payload?.result?.status;
    const paidAmountRaw =
      payload?.result?.amount ?? payload?.result?.amount_in_millimes ?? null;

    if (!ok) {
      throw new HttpsError("internal", "Flouci verify_payment failed.");
    }

    const expectedMillimes = Number(toMillimes(order?.totals?.subtotal));
    if (paidAmountRaw != null && Number.isFinite(Number(paidAmountRaw))) {
      const paidMillimes = Number(paidAmountRaw);
      // Flouci may return DT or millimes — accept either scale match.
      const matches =
        paidMillimes === expectedMillimes ||
        Math.round(paidMillimes * 1000) === expectedMillimes ||
        Math.round(paidMillimes) === Math.round(expectedMillimes / 1000);
      if (!matches) {
        throw new HttpsError(
          "failed-precondition",
          "Paid amount does not match order total."
        );
      }
    }

    const paid = status === "SUCCESS";

    await orderRef.update({
      status: paid ? "paid" : "pending_payment",
      flouciPaymentId: paymentId,
      flouciStatus: status || "UNKNOWN",
      paymentVerifiedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      orderId,
      paid,
      status: status || "UNKNOWN",
    };
  }
);
