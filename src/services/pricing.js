import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  DIGITAL_EXTRAS,
  DIGITAL_PACKS,
  DIGITAL_SECTIONS,
} from "../data/digital/orderAddons";

export const PRICING_COLLECTION = "pricing";
export const DIGITAL_PRICING_DOC = "digital";

function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
}

function money(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.round(n * 1000) / 1000;
}

/** Fallback when Firestore pricing doc is missing — same as orderAddons.js */
export function defaultDigitalPricing() {
  const packs = {};
  Object.values(DIGITAL_PACKS).forEach((p) => {
    packs[p.id] = { label: p.label, price: p.price };
  });
  const extras = {};
  DIGITAL_EXTRAS.forEach((e) => {
    extras[e.id] = { label: e.label, price: e.price };
  });
  const sections = {};
  DIGITAL_SECTIONS.forEach((s) => {
    sections[s.id] = { label: s.label, price: s.price };
  });
  return { packs, extras, sections };
}

function mergeDigitalPricing(data) {
  const defaults = defaultDigitalPricing();
  const packs = { ...defaults.packs };
  const extras = { ...defaults.extras };
  const sections = { ...defaults.sections };

  Object.entries(data?.packs || {}).forEach(([id, raw]) => {
    if (!packs[id]) return;
    packs[id] = {
      label: String(raw?.label || packs[id].label),
      price: money(raw?.price ?? raw, packs[id].price),
    };
  });
  Object.entries(data?.extras || {}).forEach(([id, raw]) => {
    if (!extras[id]) return;
    extras[id] = {
      label: String(raw?.label || extras[id].label),
      price: money(raw?.price ?? raw, extras[id].price),
    };
  });
  Object.entries(data?.sections || {}).forEach(([id, raw]) => {
    if (!sections[id]) return;
    sections[id] = {
      label: String(raw?.label || sections[id].label),
      price: money(raw?.price ?? raw, sections[id].price),
    };
  });

  return { packs, extras, sections };
}

export async function getDigitalPricing() {
  assertFirestoreReady();
  const snap = await getDoc(doc(db, PRICING_COLLECTION, DIGITAL_PRICING_DOC));
  if (!snap.exists()) return defaultDigitalPricing();
  return mergeDigitalPricing(snap.data());
}

export async function saveDigitalPricing(pricing) {
  assertFirestoreReady();
  const next = mergeDigitalPricing(pricing);
  await setDoc(
    doc(db, PRICING_COLLECTION, DIGITAL_PRICING_DOC),
    {
      packs: next.packs,
      extras: next.extras,
      sections: next.sections,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return next;
}

/** Seed defaults if missing. Returns { created, pricing }. */
export async function ensureDigitalPricing() {
  assertFirestoreReady();
  const ref = doc(db, PRICING_COLLECTION, DIGITAL_PRICING_DOC);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { created: false, pricing: mergeDigitalPricing(snap.data()) };
  }
  const pricing = defaultDigitalPricing();
  await setDoc(ref, {
    ...pricing,
    updatedAt: serverTimestamp(),
  });
  return { created: true, pricing };
}
