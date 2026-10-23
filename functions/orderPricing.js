/** Shared order pricing — used by createOrder. Defaults match src/data/digital/orderAddons.js */

const DEFAULT_DIGITAL_PRICING = {
  packs: {
    essentiel: { label: "Essentiel", price: 99 },
    signature: { label: "Signature", price: 175 },
    "sur-mesure": { label: "Sur Mesure", price: 275 },
  },
  extras: {
    "video-std": { label: "Vidéo save the date", price: 25 },
    express: { label: "Livraison express", price: 35 },
    domain: { label: "Domaine personnalisé", price: 50 },
    "guest-list": { label: "Guest list manager", price: 35 },
    language: { label: "ajouter une langue", price: 45 },
    gift: { label: "Gift manager", price: 35 },
  },
  sections: {
    menu: { label: "Section Menu", price: 25 },
    timeline: { label: "Section Agenda", price: 25 },
    gallery: { label: "Section Galerie", price: 30 },
    rsvp: { label: "Section RSVP+", price: 20 },
  },
};

const MAX_QTY = 1000;
const MAX_ITEMS = 50;

function asMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 1000) / 1000;
}

function asQty(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1 || n > MAX_QTY) return null;
  return n;
}

function normalizePricingDoc(data) {
  const packs = {};
  const extras = {};
  const sections = {};

  const srcPacks = data?.packs || {};
  for (const [id, def] of Object.entries(DEFAULT_DIGITAL_PRICING.packs)) {
    const raw = srcPacks[id];
    const price = asMoney(raw?.price ?? raw ?? def.price);
    packs[id] = {
      label: String(raw?.label || def.label),
      price: price == null ? def.price : price,
    };
  }

  const srcExtras = data?.extras || {};
  for (const [id, def] of Object.entries(DEFAULT_DIGITAL_PRICING.extras)) {
    const raw = srcExtras[id];
    const price = asMoney(raw?.price ?? raw ?? def.price);
    extras[id] = {
      label: String(raw?.label || def.label),
      price: price == null ? def.price : price,
    };
  }

  const srcSections = data?.sections || {};
  for (const [id, def] of Object.entries(DEFAULT_DIGITAL_PRICING.sections)) {
    const raw = srcSections[id];
    const price = asMoney(raw?.price ?? raw ?? def.price);
    sections[id] = {
      label: String(raw?.label || def.label),
      price: price == null ? def.price : price,
    };
  }

  return { packs, extras, sections };
}

async function loadDigitalPricing(db) {
  const snap = await db.collection("pricing").doc("digital").get();
  if (!snap.exists) return normalizePricingDoc(DEFAULT_DIGITAL_PRICING);
  return normalizePricingDoc(snap.data());
}

async function resolvePhysicalProduct(db, productId) {
  const id = String(productId || "").trim();
  if (!id) return null;

  const byId = await db.collection("catalogProducts").doc(id).get();
  if (byId.exists) {
    const data = byId.data();
    if (data.type === "physical" && data.active !== false) {
      return { id: byId.id, ...data };
    }
  }

  const bySlug = await db
    .collection("catalogProducts")
    .where("slug", "==", id)
    .limit(5)
    .get();
  for (const doc of bySlug.docs) {
    const data = doc.data();
    if (data.type === "physical" && data.active !== false) {
      return { id: doc.id, ...data };
    }
  }

  return null;
}

async function resolveDigitalProduct(db, productId) {
  const slug = String(productId || "")
    .trim()
    .toLowerCase()
    .replace(/-extra-.*$/, "")
    .replace(/-section-.*$/, "");
  if (!slug) return null;

  const bySlug = await db
    .collection("catalogProducts")
    .where("slug", "==", slug)
    .limit(5)
    .get();
  for (const doc of bySlug.docs) {
    const data = doc.data();
    if (data.type === "digital" && data.active !== false) {
      return { id: doc.id, slug, ...data };
    }
  }

  // Allow checkout even if catalog not seeded — slug is still stored on the order.
  return { id: null, slug, name: slug, active: true, type: "digital" };
}

/**
 * Recompute line items from trusted Firestore prices.
 * @returns {{ items: object[], subtotal: number }}
 */
async function computeTrustedOrderItems(db, rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    const err = new Error("Le panier est vide.");
    err.code = "invalid-argument";
    throw err;
  }
  if (rawItems.length > MAX_ITEMS) {
    const err = new Error("Trop d'articles.");
    err.code = "invalid-argument";
    throw err;
  }

  const digitalPricing = await loadDigitalPricing(db);
  const items = [];

  for (const raw of rawItems) {
    const productType = String(raw?.productType || "").trim();
    const qty = asQty(raw?.qty ?? 1);
    if (!qty) {
      const err = new Error("Quantité invalide.");
      err.code = "invalid-argument";
      throw err;
    }

    const meta = raw?.meta && typeof raw.meta === "object" ? raw.meta : {};
    const format = String(raw?.format || "").slice(0, 80);
    const motif = String(raw?.motif || "").slice(0, 80);

    if (productType === "physical") {
      const product = await resolvePhysicalProduct(db, raw.productId);
      if (!product) {
        const err = new Error("Produit physique introuvable.");
        err.code = "not-found";
        throw err;
      }
      const unitPrice = asMoney(product.unitPrice);
      if (unitPrice == null || unitPrice <= 0) {
        const err = new Error(`Prix manquant pour « ${product.name || product.id} ».`);
        err.code = "failed-precondition";
        throw err;
      }
      items.push({
        productType: "physical",
        productId: product.id,
        title: String(product.name || "Invitation physique").slice(0, 200),
        qty,
        unitPrice,
        format,
        motif,
        meta: { category: product.category || meta.category || "" },
      });
      continue;
    }

    if (productType === "digital") {
      const product = await resolveDigitalProduct(db, raw.productId);
      const kind = String(meta.kind || "").trim();
      const productName = String(product.name || product.slug || "Invitation digitale");

      if (kind === "extra") {
        const extraId = String(meta.extraId || "").trim();
        const extra = digitalPricing.extras[extraId];
        if (!extra) {
          const err = new Error("Extra digital inconnu.");
          err.code = "invalid-argument";
          throw err;
        }
        items.push({
          productType: "digital",
          productId: `${product.slug}-extra-${extraId}`,
          title: String(extra.label).slice(0, 200),
          qty: 1,
          unitPrice: extra.price,
          format: "",
          motif: "",
          meta: { kind: "extra", extraId, slug: product.slug },
        });
        continue;
      }

      if (kind === "section") {
        const sectionId = String(meta.sectionId || "").trim();
        const section = digitalPricing.sections[sectionId];
        if (!section) {
          const err = new Error("Section digitale inconnue.");
          err.code = "invalid-argument";
          throw err;
        }
        items.push({
          productType: "digital",
          productId: `${product.slug}-section-${sectionId}`,
          title: String(section.label).slice(0, 200),
          qty: 1,
          unitPrice: section.price,
          format: "",
          motif: "",
          meta: { kind: "section", sectionId, slug: product.slug },
        });
        continue;
      }

      const packId = String(meta.pack || raw.pack || "essentiel").trim();
      const pack = digitalPricing.packs[packId];
      if (!pack) {
        const err = new Error("Pack digital inconnu.");
        err.code = "invalid-argument";
        throw err;
      }
      items.push({
        productType: "digital",
        productId: product.slug,
        title: `${productName} digitale · ${pack.label}`.slice(0, 200),
        qty: 1,
        unitPrice: pack.price,
        format: "",
        motif: "",
        meta: { pack: packId, slug: product.slug },
      });
      continue;
    }

    const err = new Error("Type de produit invalide.");
    err.code = "invalid-argument";
    throw err;
  }

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  if (!(subtotal > 0)) {
    const err = new Error("Montant invalide.");
    err.code = "invalid-argument";
    throw err;
  }

  return { items, subtotal: asMoney(subtotal) };
}

module.exports = {
  DEFAULT_DIGITAL_PRICING,
  normalizePricingDoc,
  computeTrustedOrderItems,
};
