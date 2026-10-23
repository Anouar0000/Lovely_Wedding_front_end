import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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

export async function getCatalogProductById(id) {
  assertFirestoreReady();
  if (!id) return null;
  const snap = await getDoc(doc(db, CATALOG_COLLECTION, id));
  if (!snap.exists()) return null;
  return mapDoc(snap);
}

/** Build canvas model shape used by PersonalizeInvitationPage */
export function catalogProductToCanvasModel(product) {
  if (!product) return null;
  const image = product.modelImage || product.imageUrl || "";
  const unitPrice =
    Number(product.unitPrice) ||
    Number(String(product.priceLabel || "").replace(/[^\d.]/g, "")) ||
    1.5;
  return {
    name: product.name || "Modèle",
    price: unitPrice,
    unitPrice,
    templateId: product.templateId || "m1",
    modelImage: image.startsWith("http") || image.startsWith("/") ? image : `/${image}`,
    modelImagep2: product.modelImagep2
      ? product.modelImagep2.startsWith("http") || product.modelImagep2.startsWith("/")
        ? product.modelImagep2
        : `/${product.modelImagep2}`
      : "",
    unsafeZones: Array.isArray(product.unsafeZones) ? product.unsafeZones : [],
    textBoxesFront: Array.isArray(product.textBoxesFront) ? product.textBoxesFront : null,
    textBoxesBack: Array.isArray(product.textBoxesBack) ? product.textBoxesBack : null,
  };
}

export async function createCatalogProduct(data) {
  assertFirestoreReady();
  const unitPrice = Number(data.unitPrice);
  const payload = {
    type: data.type === CATALOG_TYPES.PHYSICAL ? CATALOG_TYPES.PHYSICAL : CATALOG_TYPES.DIGITAL,
    name: String(data.name || "").trim().slice(0, 120),
    slug: String(data.slug || "").trim().slice(0, 120),
    category: String(data.category || "").trim().slice(0, 80),
    priceLabel: String(data.priceLabel || "").trim().slice(0, 80),
    unitPrice: Number.isFinite(unitPrice) && unitPrice >= 0 ? unitPrice : 0,
    imageUrl: String(data.imageUrl || "").trim().slice(0, 500),
    filled: Boolean(data.filled),
    active: data.active !== false,
    sortOrder: Number(data.sortOrder) || 0,
    templateId: String(data.templateId || "m1").trim().slice(0, 40),
    modelImage: String(data.modelImage || data.imageUrl || "").trim().slice(0, 500),
    modelImagep2: String(data.modelImagep2 || "").trim().slice(0, 500),
    unsafeZones: Array.isArray(data.unsafeZones) ? data.unsafeZones : [],
    textBoxesFront: Array.isArray(data.textBoxesFront) ? data.textBoxesFront : [],
    textBoxesBack: Array.isArray(data.textBoxesBack) ? data.textBoxesBack : [],
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
    "unitPrice",
    "imageUrl",
    "filled",
    "active",
    "sortOrder",
    "templateId",
    "modelImage",
    "modelImagep2",
    "unsafeZones",
    "textBoxesFront",
    "textBoxesBack",
  ].forEach((key) => {
    if (patch[key] !== undefined) next[key] = patch[key];
  });
  if (typeof next.name === "string") next.name = next.name.trim().slice(0, 120);
  if (typeof next.slug === "string") next.slug = next.slug.trim().slice(0, 120);
  if (typeof next.category === "string") next.category = next.category.trim().slice(0, 80);
  if (typeof next.priceLabel === "string") next.priceLabel = next.priceLabel.trim().slice(0, 80);
  if (typeof next.imageUrl === "string") next.imageUrl = next.imageUrl.trim().slice(0, 500);
  if (typeof next.modelImage === "string") next.modelImage = next.modelImage.trim().slice(0, 500);
  if (typeof next.modelImagep2 === "string") next.modelImagep2 = next.modelImagep2.trim().slice(0, 500);
  if (typeof next.templateId === "string") next.templateId = next.templateId.trim().slice(0, 40);
  if (next.sortOrder !== undefined) next.sortOrder = Number(next.sortOrder) || 0;
  if (next.unitPrice !== undefined) {
    const n = Number(next.unitPrice);
    next.unitPrice = Number.isFinite(n) && n >= 0 ? n : 0;
  }
  await updateDoc(doc(db, CATALOG_COLLECTION, id), next);
}

export async function deleteCatalogProduct(id) {
  assertFirestoreReady();
  await deleteDoc(doc(db, CATALOG_COLLECTION, id));
}

const FIGMA_PHY = "/assets/home-physical/figma";
const FIGMA_DIG = "/assets/home-digital/figma";

/** Default digital products (same as shop static catalogue) */
export const SEED_DIGITAL_PRODUCTS = [
  {
    type: CATALOG_TYPES.DIGITAL,
    name: "Club Capri",
    slug: "club-capri",
    category: "Moderne",
    priceLabel: "à partir de 99dt",
    imageUrl: `${FIGMA_DIG}/phone-capri.png`,
    filled: true,
    sortOrder: 1,
  },
  {
    type: CATALOG_TYPES.DIGITAL,
    name: "Sakura Koi",
    slug: "sakura-koi",
    category: "Romantique",
    priceLabel: "à partir de 99dt",
    imageUrl: `${FIGMA_DIG}/phone-sakura.png`,
    filled: false,
    sortOrder: 2,
  },
  {
    type: CATALOG_TYPES.DIGITAL,
    name: "Sidi Bou Said",
    slug: "sidi-bousaid",
    category: "Arabesque",
    priceLabel: "à partir de 99dt",
    imageUrl: `${FIGMA_DIG}/phone-sidi.png`,
    filled: false,
    sortOrder: 3,
  },
  {
    type: CATALOG_TYPES.DIGITAL,
    name: "La Dolce Vita",
    slug: "dolce-vita",
    category: "Romantique",
    priceLabel: "à partir de 99dt",
    imageUrl: `${FIGMA_DIG}/phone-dolce.png`,
    filled: true,
    sortOrder: 4,
  },
  {
    type: CATALOG_TYPES.DIGITAL,
    name: "Bridgerton",
    slug: "bridgerton",
    category: "Moderne",
    priceLabel: "à partir de 99dt",
    imageUrl: `${FIGMA_DIG}/phone-bridgeton.png`,
    filled: false,
    sortOrder: 5,
  },
  {
    type: CATALOG_TYPES.DIGITAL,
    name: "Majestic White",
    slug: "majestic-white",
    category: "Romantique",
    priceLabel: "à partir de 99dt",
    imageUrl: `${FIGMA_DIG}/phone-majestic.png`,
    filled: true,
    sortOrder: 6,
  },
];

/** Default physical products (same as shop static catalogue) */
export const SEED_PHYSICAL_PRODUCTS = [
  {
    type: CATALOG_TYPES.PHYSICAL,
    name: "Versailles",
    slug: "versailles",
    category: "Rustique",
    priceLabel: "1,5 DT / unité",
    unitPrice: 1.5,
    imageUrl: `${FIGMA_PHY}/catalog-4.png`,
    modelImage: `${FIGMA_PHY}/catalog-4.png`,
    templateId: "m1",
    sortOrder: 1,
  },
  {
    type: CATALOG_TYPES.PHYSICAL,
    name: "Sacré cœur",
    slug: "sacre-coeur",
    category: "Outeya",
    priceLabel: "1,5 DT / unité",
    unitPrice: 1.5,
    imageUrl: `${FIGMA_PHY}/catalog-1.png`,
    modelImage: `${FIGMA_PHY}/catalog-1.png`,
    templateId: "m1",
    sortOrder: 2,
  },
  {
    type: CATALOG_TYPES.PHYSICAL,
    name: "Aimé",
    slug: "aime",
    category: "Cire",
    priceLabel: "1,5 DT / unité",
    unitPrice: 1.5,
    imageUrl: `${FIGMA_PHY}/catalog-5.png`,
    modelImage: `${FIGMA_PHY}/catalog-5.png`,
    templateId: "m1",
    sortOrder: 3,
  },
  {
    type: CATALOG_TYPES.PHYSICAL,
    name: "Passeport Rosé",
    slug: "passeport-rose",
    category: "Rustique",
    priceLabel: "1,5 DT / unité",
    unitPrice: 1.5,
    imageUrl: `${FIGMA_PHY}/catalog-2.png`,
    modelImage: `${FIGMA_PHY}/catalog-2.png`,
    templateId: "m1",
    sortOrder: 4,
  },
  {
    type: CATALOG_TYPES.PHYSICAL,
    name: "Rustique 3",
    slug: "rustique-3",
    category: "Rustique",
    priceLabel: "1,5 DT / unité",
    unitPrice: 1.5,
    imageUrl: `${FIGMA_PHY}/catalog-6.png`,
    modelImage: `${FIGMA_PHY}/catalog-6.png`,
    templateId: "m1",
    sortOrder: 5,
  },
  {
    type: CATALOG_TYPES.PHYSICAL,
    name: "Arabesque 1",
    slug: "arabesque-1",
    category: "Outeya",
    priceLabel: "1,5 DT / unité",
    unitPrice: 1.5,
    imageUrl: `${FIGMA_PHY}/catalog-3.png`,
    modelImage: `${FIGMA_PHY}/catalog-3.png`,
    templateId: "m1",
    sortOrder: 6,
  },
];

/** Import static catalogue into Firestore (skips if same slug already exists). */
export async function seedCatalogProducts(type = CATALOG_TYPES.PHYSICAL) {
  assertFirestoreReady();
  const seeds =
    type === CATALOG_TYPES.PHYSICAL
      ? SEED_PHYSICAL_PRODUCTS
      : type === CATALOG_TYPES.DIGITAL
        ? SEED_DIGITAL_PRODUCTS
        : [];
  if (!seeds.length) return { created: 0, skipped: 0 };

  const existing = await listAllCatalogProducts();
  const existingSlugs = new Set(
    existing
      .filter((p) => p.type === type)
      .map((p) => String(p.slug || "").toLowerCase())
  );

  let created = 0;
  let skipped = 0;
  for (const item of seeds) {
    const slug = String(item.slug || "").toLowerCase();
    if (slug && existingSlugs.has(slug)) {
      skipped += 1;
      continue;
    }
    await createCatalogProduct({
      ...item,
      active: true,
      filled: Boolean(item.filled),
    });
    created += 1;
  }
  return { created, skipped };
}
