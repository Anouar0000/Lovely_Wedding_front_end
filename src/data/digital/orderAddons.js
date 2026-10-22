export const DIGITAL_PACKS = {
  essentiel: { id: "essentiel", label: "Essentiel", price: 99 },
  signature: { id: "signature", label: "Signature", price: 175 },
  "sur-mesure": { id: "sur-mesure", label: "Sur Mesure", price: 275 },
};

export const DIGITAL_EXTRAS = [
  { id: "video-std", label: "Vidéo save the date", price: 25 },
  { id: "express", label: "Livraison express", price: 35 },
  { id: "domain", label: "Domaine personnalisé", price: 50 },
  { id: "guest-list", label: "Guest list manager", price: 35 },
  { id: "language", label: "ajouter une langue", price: 45 },
  { id: "gift", label: "Gift manager", price: 35 },
];

export const DIGITAL_SECTIONS = [
  { id: "menu", label: "Section Menu", price: 25 },
  { id: "timeline", label: "Section Agenda", price: 25 },
  { id: "gallery", label: "Section Galerie", price: 30 },
  { id: "rsvp", label: "Section RSVP+", price: 20 },
];

export function resolveDigitalPack(packId) {
  return DIGITAL_PACKS[packId] || DIGITAL_PACKS.essentiel;
}

export function resolveDigitalExtra(extraId) {
  return DIGITAL_EXTRAS.find((e) => e.id === extraId) || null;
}

export function resolveDigitalSection(sectionId) {
  return DIGITAL_SECTIONS.find((s) => s.id === sectionId) || null;
}
