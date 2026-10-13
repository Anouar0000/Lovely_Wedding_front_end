/**
 * Médias éditables par template (images + son).
 * getInviteMedia(invite, key, fallback) → media[key] || top-level || fallback.
 * Champ vide = asset d'origine (les vraies invitations ne changent pas).
 */

export const TEMPLATE_MEDIA_FIELDS = {
  "club-capri": [
    { key: "musicUrl", label: "Musique (URL ou fichier)", kind: "audio" },
    { key: "heroImage", label: "Hero — photo mer", kind: "image" },
    { key: "celebrationPhoto1", label: "Postcard Wedding — photo", kind: "image" },
    { key: "celebrationPhoto2", label: "Postcard Henna — photo", kind: "image" },
    { key: "dressCodePhoto", label: "Dress code — photo", kind: "image" },
  ],
  "sakura-koi": [
    { key: "musicUrl", label: "Musique (URL ou fichier)", kind: "audio" },
    { key: "storyPhotoLeft", label: "Our story — photo gauche", kind: "image" },
    { key: "storyPhotoRight", label: "Our story — photo droite", kind: "image" },
    { key: "venuePhoto", label: "Lieu — photo", kind: "image" },
  ],
  "dolce-vita": [
    { key: "portraitPhoto", label: "Portrait", kind: "image" },
    { key: "venuePhoto", label: "Lieu — photo", kind: "image" },
  ],
  "sidi-bousaid": [
    { key: "storyPhoto", label: "Our story — photo couple", kind: "image" },
  ],
  bridgerton: [
    { key: "musicUrl", label: "Musique (URL ou fichier)", kind: "audio" },
    { key: "heroPhoto", label: "Hero — photo couple", kind: "image" },
    { key: "venuePhoto", label: "Lieu — photo", kind: "image" },
  ],
  "majestic-white": [
    { key: "musicUrl", label: "Musique (URL ou fichier)", kind: "audio" },
    { key: "storyPhoto", label: "Our story — photo", kind: "image" },
  ],
};

export function getTemplateMediaFields(templateId) {
  return TEMPLATE_MEDIA_FIELDS[templateId] || [];
}

export function getDefaultInviteMedia(templateId) {
  const fields = getTemplateMediaFields(templateId);
  const media = {};
  fields.forEach((field) => {
    media[field.key] = "";
  });
  return media;
}

/**
 * Retro-compat: invite.media[key] → invite[key] (ex. musicUrl, heroPhoto) → fallback.
 */
export function getInviteMedia(invite, key, fallback = "") {
  const fromMedia = invite?.media?.[key];
  if (typeof fromMedia === "string" && fromMedia.trim() !== "") return fromMedia;

  const fromTop = invite?.[key];
  if (typeof fromTop === "string" && fromTop.trim() !== "") return fromTop;

  return fallback || "";
}
