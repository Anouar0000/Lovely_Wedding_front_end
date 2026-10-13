/**
 * Textes éditables par template.
 * Les pages utilisent getInviteText(invite, key, fallback) — si vide, le design d'origine reste intact.
 */

export const TEMPLATE_TEXT_FIELDS = {
  "club-capri": [
    { key: "inviteText", label: "Texte d'invitation", multiline: true },
    { key: "rsvpDeadline", label: "Deadline RSVP", multiline: true },
    { key: "dressCode", label: "Dress code (titre)" },
    { key: "celebrationAddress1", label: "Postcard Wedding — adresse", multiline: true },
    { key: "celebrationAddress2", label: "Postcard Henna — adresse", multiline: true },
  ],
  "sakura-koi": [
    { key: "heroEyebrow", label: "Hero — accroche" },
    { key: "countdown", label: "Titre countdown" },
    { key: "formalInvite", label: "Titre formal invite" },
    { key: "ourStory", label: "Titre our story" },
    { key: "storyText", label: "Texte our story", multiline: true },
    { key: "venue", label: "Titre lieu" },
    { key: "openMaps", label: "Bouton maps" },
    { key: "rsvp", label: "Titre RSVP" },
    { key: "seeYou", label: "Footer — à bientôt" },
  ],
  "dolce-vita": [
    { key: "introLabel", label: "Hero — accroche" },
    { key: "introText", label: "Texte countdown", multiline: true },
    { key: "locationIntro", label: "Intro lieu", multiline: true },
    { key: "closingText", label: "Texte de clôture", multiline: true },
  ],
  "sidi-bousaid": [
    { key: "dressCodeText", label: "Dress code", multiline: true },
  ],
  bridgerton: [
    { key: "heroQuote", label: "Citation hero", multiline: true },
    { key: "bannerQuote", label: "Bannière milieu", multiline: true },
    { key: "venueDetails", label: "Détails du lieu", multiline: true },
    { key: "dressCodeText", label: "Dress code", multiline: true },
    { key: "transportText", label: "Transport", multiline: true },
    { key: "messagePrompt", label: "Invite message", multiline: true },
    { key: "rsvpDeadline", label: "Deadline RSVP", multiline: true },
  ],
  "majestic-white": [
    { key: "storyTitle", label: "Titre our story" },
    { key: "storyText", label: "Texte our story", multiline: true },
    { key: "countdownTitle", label: "Titre countdown" },
    { key: "formalInviteTitle", label: "Titre formal invite" },
    { key: "celebrationsTitle", label: "Titre celebrations" },
    { key: "celebrationsSubtitle", label: "Sous-titre celebrations", multiline: true },
    { key: "celebration1Title", label: "Célébration 1 — titre" },
    { key: "celebration1Address", label: "Célébration 1 — adresse", multiline: true },
    { key: "celebration2Title", label: "Célébration 2 — titre" },
    { key: "celebration2Address", label: "Célébration 2 — adresse", multiline: true },
    { key: "celebration2Subtitle", label: "Célébration 2 — sous-titre", multiline: true },
    { key: "timelineTitle", label: "Titre timeline" },
    { key: "timelineSubtitle", label: "Sous-titre timeline", multiline: true },
    { key: "messageTitle", label: "Titre leave a message" },
    { key: "messageSubtitle", label: "Sous-titre message", multiline: true },
    { key: "rsvpTitle", label: "Titre RSVP" },
  ],
};

const DEFAULTS_FROM_FIXED = {
  "club-capri": {
    inviteText: "We warmly invite you to celebrate our wedding day with us.",
    rsvpDeadline: "The favour of a reply is kindly requested by the fifteenth of June, 2027",
    dressCode: "casual chic",
    celebrationAddress1: "Dar Bouraoui Carthage\nMalaga\n18h",
    celebrationAddress2: "Dar Bouraoui Carthage\nMalaga\n18h",
  },
  "sakura-koi": {
    heroEyebrow: "Celebrate with us",
    countdown: "Countdown",
    formalInvite: "Formal Invite",
    ourStory: "Our Story",
    storyText: "We warmly invite you to celebrate our wedding day with us.",
    venue: "Venue",
    rsvp: "RSVP",
    seeYou: "See you there",
    openMaps: "Open in maps",
  },
  "dolce-vita": {
    introLabel: "We are getting married",
    introText: "We would like to invite you to celebrate with us the most special day of our lives",
    locationIntro: "The ceremony will take place at",
    closingText: "We hope you can make it",
  },
  "sidi-bousaid": {
    dressCodeText: "We Request Attending The Outeya\nWith A Traditional Attire",
  },
  bridgerton: {
    heroQuote: "Love is love",
    bannerQuote: "Join Us For The \nBest Day Ever",
    venueDetails: "Dar Bouraoui \nCarthage\nSalle Malaga\n18H - 20H",
    dressCodeText: "We'd love for guests to embrace a formal look for our celebration.",
    transportText: "",
    messagePrompt: "Leave a heartfelt message to the brides",
    rsvpDeadline: "Kindly reply by the fifteenth",
  },
  "majestic-white": {
    storyTitle: "Our Story",
    storyText: "",
    countdownTitle: "Countdown",
    formalInviteTitle: "Formal Invite",
    celebrationsTitle: "Celebrations",
    celebrationsSubtitle: "",
    celebration1Title: "Club Nautique",
    celebration1Address: "Les Berges Du Lac 1\nÀ 18h",
    celebration2Title: "Club Nautique",
    celebration2Address: "Les Berges Du Lac 1\nÀ 18h",
    celebration2Subtitle: "",
    timelineTitle: "Timeline",
    timelineSubtitle: "",
    messageTitle: "Leave a message",
    messageSubtitle: "Leave A Heartfelt Message To The Brides",
    rsvpTitle: "RSVP",
  },
};

export function getTemplateTextFields(templateId) {
  return TEMPLATE_TEXT_FIELDS[templateId] || [];
}

export function getDefaultInviteTexts(templateId) {
  const fields = getTemplateTextFields(templateId);
  const defaults = DEFAULTS_FROM_FIXED[templateId] || {};
  const texts = {};
  fields.forEach((field) => {
    texts[field.key] = defaults[field.key] ?? "";
  });
  return texts;
}

/**
 * Retro-compat: invite.texts[key] → sinon invite[key] → sinon fallback.
 * Chaîne vide = garder le fallback (ne casse pas les vraies invitations).
 */
export function getInviteText(invite, key, fallback = "") {
  const fromBag = invite?.texts?.[key];
  if (typeof fromBag === "string" && fromBag.trim() !== "") return fromBag;

  const fromTop = invite?.[key];
  if (typeof fromTop === "string" && fromTop.trim() !== "") return fromTop;

  return fallback ?? "";
}
