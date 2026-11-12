import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

/**
 * Bottom sheet — choisir une catégorie catalogue (Filtrer).
 */
function CatalogFilterSheet({ open, options, value, onApply, onClose, title = "Filtrer" }) {
  const [draft, setDraft] = useState(value ?? null);

  useEffect(() => {
    if (open) setDraft(value ?? null);
  }, [open, value]);

  useEffect(() => {
    if (!open) return undefined;
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#C4A69C]/50 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-filter-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-[428px] overflow-hidden rounded-t-[16px] bg-white shadow-[0_-8px_32px_rgba(75,66,66,0.18)] sm:rounded-[16px]"
      >
        <div className="flex items-center justify-between px-5 pb-1 pt-5">
          <h2
            id="catalog-filter-title"
            className="font-glacial text-[20px] font-semibold leading-7 text-lw-text"
          >
            {title}
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

        <div className="max-h-[60vh] overflow-y-auto px-5 pb-4">
          <button
            type="button"
            onClick={() => setDraft(null)}
            className={`mb-2 flex w-full px-4 py-4 text-left font-glacial text-[14px] text-lw-text transition-colors ${
              draft == null
                ? "border border-[#C4A69C] bg-white font-medium"
                : "border-b border-[#E8E0D8] border-x-0 border-t-0 hover:bg-[#F7F2EC]/40"
            }`}
          >
            Tous
          </button>
          {options.map((option) => {
            const active = draft === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setDraft(option)}
                className={`mb-2 flex w-full px-4 py-4 text-left font-glacial text-[14px] text-lw-text transition-colors ${
                  active
                    ? "border border-[#C4A69C] bg-white font-medium"
                    : "border-b border-[#E8E0D8] border-x-0 border-t-0 hover:bg-[#F7F2EC]/40"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="border-t border-[#E8E0D8] px-5 py-4">
          <button
            type="button"
            onClick={() => {
              onApply?.(draft);
              onClose?.();
            }}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#A97C72] font-glacial text-[14px] font-bold text-white"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

export default CatalogFilterSheet;
