import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { isFirebaseConfigured, storage } from "../lib/firebase";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/mp4", "audio/x-m4a"];

/** Firestore doc ~1 Mo — garder une marge pour le reste de l'invitation */
const MAX_EMBEDDED_DATA_URL_CHARS = 700_000;

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
 * Compress a local image into a data URL that can be saved in Firestore
 * (visible after publish without Firebase Storage).
 */
export function compressImageToDataUrl(file, { maxEdge = 1200, quality = 0.72 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Fichier manquant."));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Compression image impossible."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        let q = quality;
        let dataUrl = canvas.toDataURL("image/jpeg", q);
        while (dataUrl.length > MAX_EMBEDDED_DATA_URL_CHARS && q > 0.4) {
          q -= 0.08;
          dataUrl = canvas.toDataURL("image/jpeg", q);
        }
        if (dataUrl.length > MAX_EMBEDDED_DATA_URL_CHARS) {
          reject(
            new Error(
              "Image trop lourde même compressée. Choisis une photo plus légère ou un lien URL."
            )
          );
          return;
        }
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Impossible de lire cette image."));
    };
    img.src = objectUrl;
  });
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
