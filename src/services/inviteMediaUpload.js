import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { isFirebaseConfigured, storage } from "../lib/firebase";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/mp4", "audio/x-m4a"];

function extensionFor(file) {
  const name = file?.name || "";
  const fromName = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
  if (fromName) return fromName;
  if (file?.type === "image/png") return "png";
  if (file?.type === "image/webp") return "webp";
  if (file?.type === "audio/wav") return "wav";
  if (file?.type === "audio/ogg") return "ogg";
  return file?.type?.startsWith("audio/") ? "mp3" : "jpg";
}

/**
 * Upload an image or audio file to Firebase Storage for a digital invite.
 * @returns {Promise<string>} download URL
 */
export async function uploadInviteMediaFile({
  file,
  ownerId,
  inviteId,
  fieldKey,
  kind = "image",
}) {
  if (!isFirebaseConfigured || !storage) {
    throw new Error("Firebase Storage non configuré.");
  }
  if (!file) throw new Error("Fichier manquant.");
  if (!ownerId) throw new Error("Connexion requise pour uploader.");

  const allowed = kind === "audio" ? AUDIO_TYPES : IMAGE_TYPES;
  if (file.type && !allowed.some((type) => file.type === type || file.type.startsWith(type.split("/")[0] + "/"))) {
    // Soft check: still allow if browser omits type
    if (file.type && kind === "image" && !file.type.startsWith("image/")) {
      throw new Error("Format image non supporté (JPG, PNG, WebP).");
    }
    if (file.type && kind === "audio" && !file.type.startsWith("audio/")) {
      throw new Error("Format audio non supporté (MP3, WAV, OGG).");
    }
  }

  const maxBytes = kind === "audio" ? 12 * 1024 * 1024 : 6 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(kind === "audio" ? "Audio trop lourd (max 12 Mo)." : "Image trop lourde (max 6 Mo).");
  }

  const safeInvite = String(inviteId || "draft").replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeKey = String(fieldKey || "file").replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext = extensionFor(file);
  const path = `digital-invites/${ownerId}/${safeInvite}/${safeKey}-${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, {
    contentType: file.type || (kind === "audio" ? "audio/mpeg" : "image/jpeg"),
  });

  return getDownloadURL(storageRef);
}
