import React, { useCallback, useEffect, useState } from "react";
import { FiRefreshCw, FiSave } from "react-icons/fi";
import { isAbortError } from "../../lib/firebase";
import {
  defaultDigitalPricing,
  ensureDigitalPricing,
  getDigitalPricing,
  saveDigitalPricing,
} from "../../services/pricing";

function AdminDigitalPricingPage() {
  const [pricing, setPricing] = useState(defaultDigitalPricing());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      setPricing(await getDigitalPricing());
    } catch (err) {
      if (!isAbortError(err)) setError("Impossible de charger les tarifs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setPrice = (group, id, value) => {
    setPricing((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [id]: {
          ...prev[group][id],
          price: value,
        },
      },
    }));
    setSaved(false);
  };

  const handleSeed = async () => {
    setBusy(true);
    setError("");
    try {
      const { created, pricing: next } = await ensureDigitalPricing();
      setPricing(next);
      setSaved(true);
      if (!created) setError("Document déjà présent — valeurs rechargées.");
    } catch (err) {
      setError(err.message || "Impossible d'initialiser les tarifs.");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const next = await saveDigitalPricing(pricing);
      setPricing(next);
      setSaved(true);
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer.");
    } finally {
      setBusy(false);
    }
  };

  const renderGroup = (title, groupKey) => (
    <section className="rounded-[8px] border border-[#E8E0D8] bg-white p-5">
      <h3 className="font-lora text-[18px] font-medium text-[#4B4242]">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {Object.entries(pricing[groupKey] || {}).map(([id, row]) => (
          <label key={id} className="text-sm">
            <span className="mb-1 block font-semibold text-[#7D6E66]">
              {row.label}{" "}
              <span className="font-normal text-[#A97C72]">({id})</span>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.001"
                value={row.price}
                onChange={(e) => setPrice(groupKey, id, e.target.value)}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2"
              />
              <span className="shrink-0 text-xs font-semibold text-[#7D6E66]">DT</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">
            Tarifs digitaux
          </h2>
          <p className="mt-1 text-sm text-[#7D6E66]">
            Packs, extras et sections — source de vérité pour le serveur.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-[5px] border border-[#E8E0D8] bg-white px-4 py-3 text-sm font-semibold"
          >
            <FiRefreshCw aria-hidden /> Actualiser
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleSeed}
            className="rounded-[5px] border border-[#A97C72] px-4 py-3 text-sm font-semibold text-[#A97C72] disabled:opacity-50"
          >
            Initialiser si vide
          </button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="mb-4 rounded-[5px] border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          Tarifs enregistrés.
        </p>
      ) : null}

      {loading ? (
        <p className="px-5 py-12 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#7D6E66]">
          Chargement
        </p>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {renderGroup("Packs", "packs")}
          {renderGroup("Extras", "extras")}
          {renderGroup("Sections", "sections")}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-[5px] bg-[#A97C72] px-5 py-3 text-sm font-bold uppercase text-white disabled:opacity-50"
          >
            <FiSave aria-hidden /> Enregistrer
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminDigitalPricingPage;
