import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import { isAbortError } from "../../lib/firebase";
import {
  deleteProductReview,
  ensureDefaultProductReviews,
  listProductReviews,
} from "../../services/productReviews";

function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const items = await ensureDefaultProductReviews();
      setReviews(items.length ? items : await listProductReviews());
    } catch (err) {
      if (!isAbortError(err)) setError("Impossible de charger les avis.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reviews;
    return reviews.filter((r) =>
      [r.name, r.meta, r.text, r.date, r.productSlug, r.productType]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [reviews, searchTerm]);

  const handleDelete = async (review) => {
    if (!window.confirm(`Supprimer l'avis de « ${review.name || "Anonyme"} » ?`)) {
      return;
    }
    setBusyId(review.id);
    setError("");
    try {
      await deleteProductReview(review.id);
      setReviews((current) => current.filter((item) => item.id !== review.id));
    } catch {
      setError("Impossible de supprimer cet avis.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">Avis</h2>
          <p className="mt-1 text-sm text-[#7D6E66]">
            Avis catalogue affichés sur les fiches produit ({reviews.length}). Suppression depuis le
            dashboard uniquement.
          </p>
        </div>
        <button
          type="button"
          onClick={loadReviews}
          className="inline-flex items-center gap-2 rounded-[5px] border border-[#E8E0D8] bg-white px-4 py-3 text-sm font-semibold"
        >
          <FiRefreshCw aria-hidden /> Actualiser
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <label className="relative mb-4 block max-w-xl">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7D6E66]" aria-hidden />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un avis…"
          className="w-full rounded-[5px] border border-[#E8E0D8] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#A97C72]"
        />
      </label>

      {loading ? (
        <p className="text-sm text-[#7D6E66]">Chargement des avis…</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-[5px] border border-dashed border-[#E8E0D8] bg-white px-4 py-8 text-center text-sm text-[#7D6E66]">
          Aucun avis pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((review) => (
            <li
              key={review.id}
              className="rounded-[8px] border border-[#E8E0D8] bg-white px-4 py-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-lora text-[18px] text-[#4B4242]">{review.name || "Anonyme"}</p>
                    <span className="inline-flex items-center gap-1 text-[12px] text-[#FFD220]">
                      <FiStar aria-hidden /> {review.rating || 5}/5
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-[#78716C]">{review.meta}</p>
                  <p className="mt-2 text-sm leading-6 text-[#1C1917]">{review.text}</p>
                  <p className="mt-2 text-[12px] text-[#A89F91]">
                    {review.date}
                    {review.productSlug ? ` · ${review.productSlug}` : ""}
                    {review.productType ? ` · ${review.productType}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busyId === review.id}
                  onClick={() => handleDelete(review)}
                  className="inline-flex items-center gap-2 rounded-[5px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  <FiTrash2 aria-hidden />
                  {busyId === review.id ? "…" : "Supprimer"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminReviewsPage;
