import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

/**
 * Formulaire « Écrire un avis » — bottom sheet / modal.
 */
function WriteReviewModal({ open, onClose, onSubmit, productName = "" }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    setName("");
    setRating(5);
    setText("");
    setSent(false);
    setError("");
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName) {
      setError("Indiquez votre nom.");
      return;
    }
    if (!trimmedText) {
      setError("Écrivez votre avis.");
      return;
    }
    const now = new Date();
    const dateLabel = `Posté le ${now.getDate()} ${now.toLocaleDateString("fr-FR", {
      month: "long",
    })} ${now.getFullYear()}`;
    onSubmit?.({
      name: trimmedName,
      meta: productName ? `Avis client • ${productName}` : "Avis client",
      text: `“${trimmedText}”`,
      date: dateLabel,
      rating,
    });
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#C4A69C]/50 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-[428px] overflow-hidden rounded-t-[16px] bg-white shadow-[0_-8px_32px_rgba(75,66,66,0.18)] sm:rounded-[16px]"
      >
        <div className="flex items-center justify-between px-5 pb-1 pt-5">
          <h2
            id="write-review-title"
            className="font-glacial text-[20px] font-semibold leading-7 text-lw-text"
          >
            Écrire un avis
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-8 items-center justify-center text-lw-text"
          >
            <FiX className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 pb-6 pt-2">
          {sent ? (
            <div className="py-8 text-center">
              <p className="font-lora text-[20px] text-lw-text">Merci pour votre avis !</p>
              <p className="mt-2 font-glacial text-[14px] text-[#78716C]">
                Il apparaîtra sous peu sur la fiche produit.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#A97C72] px-8 font-glacial text-[14px] font-bold text-white"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="block">
                <span className="font-glacial text-[13px] text-[#78716C]">Votre nom</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-[8px] border border-[#E8E0D8] bg-[#F7F2EC] px-3 font-glacial text-[14px] text-lw-text outline-none focus:border-[#A97C72]"
                  placeholder="Ex. Lilia & Rayen"
                  autoComplete="name"
                />
              </label>

              <fieldset>
                <legend className="font-glacial text-[13px] text-[#78716C]">Note</legend>
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                      aria-pressed={rating === n}
                      onClick={() => setRating(n)}
                      className={`text-[22px] leading-none ${
                        n <= rating ? "text-[#FFD220]" : "text-[#E8E0D8]"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className="font-glacial text-[13px] text-[#78716C]">Votre avis</span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="mt-1.5 w-full resize-none rounded-[8px] border border-[#E8E0D8] bg-[#F7F2EC] px-3 py-2.5 font-glacial text-[14px] text-lw-text outline-none focus:border-[#A97C72]"
                  placeholder="Partagez votre expérience…"
                />
              </label>

              {error ? (
                <p className="font-glacial text-[13px] text-[#A97C72]" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-1 flex h-12 w-full items-center justify-center rounded-full bg-[#A97C72] font-glacial text-[14px] font-bold text-white"
              >
                Publier mon avis
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default WriteReviewModal;
