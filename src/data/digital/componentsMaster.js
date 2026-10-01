// Master components definition based on Figma "Composants" (node 1637:18)
// Central registry for all 14 standard modular sections across digital e-invitations.

export const MASTER_COMPONENTS = [
  {
    id: "reveal",
    figmaName: "Reveal",
    label: "Dévoilement (Reveal)",
    description: "Animation d'ouverture ou de révélation immersive (portes, rideau, etc.)",
    iconName: "FiEye",
    supportedTemplates: ["sidi-bousaid", "celestial"],
  },
  {
    id: "location",
    figmaName: "Venue / location",
    label: "Lieu & Localisation",
    description: "Adresse du lieu, salle de réception, plan d'accès et lien Google Maps",
    iconName: "FiMapPin",
    aliasIds: ["join-us"],
    supportedTemplates: [
      "dolce-vita",
      "brezza-marina",
      "bridgerton",
      "celestial",
      "majestic-white",
      "sidi-bousaid",
      "club-capri",
    ],
  },
  {
    id: "rsvp",
    figmaName: "RSVP",
    label: "Confirmation (RSVP)",
    description: "Formulaire de réponse et confirmation de présence des invités",
    iconName: "FiCheckSquare",
    supportedTemplates: [
      "dolce-vita",
      "brezza-marina",
      "bridgerton",
      "celestial",
      "majestic-white",
      "sidi-bousaid",
      "club-capri",
    ],
  },
  {
    id: "our-story",
    figmaName: "Our story",
    label: "Notre Histoire",
    description: "Photos du couple et récit de leur rencontre",
    iconName: "FiHeart",
    supportedTemplates: [
      "brezza-marina",
      "bridgerton",
      "celestial",
      "majestic-white",
      "sidi-bousaid",
    ],
  },
  {
    id: "celebrations",
    figmaName: "Celebrations",
    label: "Célébrations & Fêtes",
    description: "Programme des différentes cérémonies (Outia, Henné, Dîner, Soirée)",
    iconName: "FiGift",
    aliasIds: ["the-day"],
    supportedTemplates: [
      "bridgerton",
      "celestial",
      "club-capri",
      "majestic-white",
      "sidi-bousaid",
    ],
  },
  {
    id: "transport",
    figmaName: "Transport",
    label: "Transport & Parking",
    description: "Informations de transport, navettes, parkings et taxis recommandés",
    iconName: "FiNavigation",
    supportedTemplates: ["bridgerton", "majestic-white"],
  },
  {
    id: "formal-invite",
    figmaName: "Formal invite",
    label: "Faire-part formel",
    description: "Formule traditionnelle, Bismillah, verset et noms des familles",
    iconName: "FiFileText",
    supportedTemplates: ["majestic-white", "sidi-bousaid"],
  },
  {
    id: "countdown",
    figmaName: "Countdown",
    label: "Compte à rebours",
    description: "Horloge interactive comptant les jours jusqu'au mariage",
    iconName: "FiClock",
    supportedTemplates: [
      "dolce-vita",
      "brezza-marina",
      "bridgerton",
      "majestic-white",
      "sidi-bousaid",
    ],
  },
  {
    id: "timeline",
    figmaName: "Timeline /\nprogramme",
    label: "Programme (Timeline)",
    description: "Déroulé chronologique de la soirée (Accueil, Arrivée, Contrat, Soirée)",
    iconName: "FiCalendar",
    aliasIds: ["programme"],
    supportedTemplates: [
      "dolce-vita",
      "brezza-marina",
      "celestial",
      "majestic-white",
      "sidi-bousaid",
    ],
  },
  {
    id: "menu",
    figmaName: "Menu",
    label: "Menu du Mariage",
    description: "Présentation des mets et plats (Entrée, Plat chaud, Dessert)",
    iconName: "FiBookOpen",
    supportedTemplates: ["dolce-vita"],
  },
  {
    id: "dress-code",
    figmaName: "Dress Code",
    label: "Dress Code",
    description: "Tenue vestimentaire conseillée et palette de couleurs",
    iconName: "FiTag",
    supportedTemplates: [
      "brezza-marina",
      "bridgerton",
      "club-capri",
      "sidi-bousaid",
    ],
  },
  {
    id: "leave-a-message",
    figmaName: "Leave a message",
    label: "Livre d'or (Messages)",
    description: "Espace où les invités peuvent déposer un mot doux aux mariés",
    iconName: "FiMessageSquare",
    supportedTemplates: ["bridgerton", "majestic-white"],
  },
  {
    id: "principles",
    figmaName: "Principles",
    label: "Consignes & Principes",
    description: "Règles de bienséance (pas de photos, adultes seulement, etc.)",
    iconName: "FiInfo",
    supportedTemplates: ["majestic-white", "sidi-bousaid", "bridgerton"],
  },
  {
    id: "accommodation",
    figmaName: "Accomodation",
    label: "Hébergements (Hôtels)",
    description: "Sélection d'hôtels et recommandations de logements à proximité",
    iconName: "FiHome",
    supportedTemplates: ["bridgerton", "brezza-marina"],
  },
];

// Helper to get all components supported by a specific template
export function getComponentsForTemplate(templateId) {
  if (!templateId) return MASTER_COMPONENTS;
  return MASTER_COMPONENTS.map((comp) => ({
    ...comp,
    isSupported: comp.supportedTemplates.includes(templateId),
  }));
}

// Helper to check if a section ID matches any master component (or its aliases)
export function findMasterComponent(sectionId) {
  return MASTER_COMPONENTS.find(
    (c) => c.id === sectionId || (c.aliasIds && c.aliasIds.includes(sectionId))
  );
}
