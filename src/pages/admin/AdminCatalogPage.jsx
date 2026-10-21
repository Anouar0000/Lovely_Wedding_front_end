import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { isAbortError } from "../../lib/firebase";
import {
  CATALOG_TYPES,
  createCatalogProduct,
  deleteCatalogProduct,
  listAllCatalogProducts,
  seedCatalogProducts,
  updateCatalogProduct,
} from "../../services/catalogProducts";

const EMPTY_FORM = {
  type: CATALOG_TYPES.DIGITAL,
  name: "",
  slug: "",
  category: "",
  priceLabel: "",
  imageUrl: "",
  filled: false,
  active: true,
  sortOrder: 0,
};

function AdminCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFromUrl = searchParams.get("type");
  const typeFilter =
    typeFromUrl === CATALOG_TYPES.PHYSICAL || typeFromUrl === CATALOG_TYPES.DIGITAL
      ? typeFromUrl
      : "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const setTypeFilter = (value) => {
    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ type: value });
    }
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await listAllCatalogProducts());
    } catch (err) {
      if (!isAbortError(err)) setError("Impossible de charger le catalogue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = useMemo(() => {
    if (typeFilter === "all") return products;
    return products.filter((p) => p.type === typeFilter);
  }, [products, typeFilter]);

  const openCreate = (preferredType) => {
    const nextType =
      preferredType === CATALOG_TYPES.PHYSICAL || preferredType === CATALOG_TYPES.DIGITAL
        ? preferredType
        : typeFilter === "all"
          ? CATALOG_TYPES.DIGITAL
          : typeFilter;
    setEditingId("new");
    setForm({ ...EMPTY_FORM, type: nextType });
    if (nextType !== "all") setTypeFilter(nextType);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      type: product.type || CATALOG_TYPES.DIGITAL,
      name: product.name || "",
      slug: product.slug || "",
      category: product.category || "",
      priceLabel: product.priceLabel || "",
      imageUrl: product.imageUrl || "",
      filled: Boolean(product.filled),
      active: product.active !== false,
      sortOrder: Number(product.sortOrder) || 0,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editingId === "new") {
        await createCatalogProduct(form);
      } else {
        await updateCatalogProduct(editingId, form);
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer le produit.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer « ${product.name} » ?`)) return;
    setBusy(true);
    setError("");
    try {
      await deleteCatalogProduct(product.id);
      await loadProducts();
    } catch (err) {
      setError("Impossible de supprimer le produit.");
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (product) => {
    setBusy(true);
    try {
      await updateCatalogProduct(product.id, { active: !product.active });
      await loadProducts();
    } catch (err) {
      setError("Impossible de changer le statut.");
    } finally {
      setBusy(false);
    }
  };

  const handleSeed = async (type) => {
    setBusy(true);
    setError("");
    try {
      const { created, skipped } = await seedCatalogProducts(type);
      await loadProducts();
      if (created === 0 && skipped > 0) {
        setError("Produits déjà importés.");
      }
    } catch (err) {
      setError(err.message || "Impossible d'importer le catalogue.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">Catalogue</h2>
          <p className="mt-1 text-sm text-[#7D6E66]">
            Choisis Digital ou Physique, puis ajoute / modifie les produits.
          </p>
        </div>
        <button
          type="button"
          onClick={loadProducts}
          className="inline-flex items-center gap-2 rounded-[5px] border border-[#E8E0D8] bg-white px-4 py-3 text-sm font-semibold"
        >
          <FiRefreshCw aria-hidden /> Actualiser
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setTypeFilter(CATALOG_TYPES.DIGITAL)}
          className={`rounded-[8px] border px-5 py-5 text-left transition ${
            typeFilter === CATALOG_TYPES.DIGITAL
              ? "border-[#A97C72] bg-[#A97C72] text-white"
              : "border-[#E8E0D8] bg-white text-[#4B4242] hover:border-[#A97C72]"
          }`}
        >
          <p className="font-lora text-[22px] font-medium">Digital</p>
          <p className={`mt-1 text-sm ${typeFilter === CATALOG_TYPES.DIGITAL ? "text-white/90" : "text-[#7D6E66]"}`}>
            Invitations web / catalogue digital
          </p>
        </button>
        <button
          type="button"
          onClick={() => setTypeFilter(CATALOG_TYPES.PHYSICAL)}
          className={`rounded-[8px] border px-5 py-5 text-left transition ${
            typeFilter === CATALOG_TYPES.PHYSICAL
              ? "border-[#A97C72] bg-[#A97C72] text-white"
              : "border-[#E8E0D8] bg-white text-[#4B4242] hover:border-[#A97C72]"
          }`}
        >
          <p className="font-lora text-[22px] font-medium">Physique</p>
          <p className={`mt-1 text-sm ${typeFilter === CATALOG_TYPES.PHYSICAL ? "text-white/90" : "text-[#7D6E66]"}`}>
            Invitations imprimées / catalogue physique
          </p>
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTypeFilter("all")}
          className={`rounded-[5px] border px-4 py-2 text-sm font-semibold ${
            typeFilter === "all"
              ? "border-[#A97C72] bg-[#F7F2EC] text-[#A97C72]"
              : "border-[#E8E0D8] bg-white text-[#7D6E66]"
          }`}
        >
          Voir tout
        </button>
        <button
          type="button"
          onClick={() => openCreate(CATALOG_TYPES.DIGITAL)}
          className="inline-flex items-center gap-2 rounded-[5px] bg-[#A97C72] px-4 py-2 text-sm font-bold uppercase text-white"
        >
          <FiPlus aria-hidden /> Nouveau digital
        </button>
        <button
          type="button"
          onClick={() => openCreate(CATALOG_TYPES.PHYSICAL)}
          className="inline-flex items-center gap-2 rounded-[5px] border border-[#A97C72] px-4 py-2 text-sm font-bold uppercase text-[#A97C72]"
        >
          <FiPlus aria-hidden /> Nouveau physique
        </button>
      </div>

      {error ? (
        <p className="mb-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {editingId ? (
        <form
          onSubmit={handleSave}
          className="mb-6 rounded-[8px] border border-[#E8E0D8] bg-white p-5"
        >
          <h3 className="font-lora text-[18px] font-medium">
            {editingId === "new" ? "Nouveau produit" : "Modifier le produit"}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2"
              >
                <option value={CATALOG_TYPES.DIGITAL}>digital</option>
                <option value={CATALOG_TYPES.PHYSICAL}>physical</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Ordre</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Nom *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Slug</span>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2"
                placeholder="club-capri"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Catégorie</span>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-semibold text-[#7D6E66]">Prix (label)</span>
              <input
                value={form.priceLabel}
                onChange={(e) => setForm((f) => ({ ...f, priceLabel: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2"
                placeholder="Start at 49$ / à partir de 99dt"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block font-semibold text-[#7D6E66]">URL image</span>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                className="w-full rounded-[5px] border border-[#E8E0D8] px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.filled}
                onChange={(e) => setForm((f) => ({ ...f, filled: e.target.checked }))}
              />
              Badge rempli
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Actif sur le site
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-[5px] bg-[#A97C72] px-4 py-2 text-sm font-bold uppercase text-white disabled:opacity-50"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="rounded-[5px] border border-[#E8E0D8] px-4 py-2 text-sm font-semibold"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-[8px] border border-[#E8E0D8] bg-white shadow-sm">
        {loading ? (
          <p className="px-5 py-12 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#7D6E66]">
            Chargement
          </p>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 px-5 py-12 text-center">
            <p className="text-sm text-[#7D6E66]">
              Aucun produit Firestore — le site utilise encore les catalogues
              statiques.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {(typeFilter === CATALOG_TYPES.DIGITAL || typeFilter === "all") && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleSeed(CATALOG_TYPES.DIGITAL)}
                  className="rounded-[5px] bg-[#A97C72] px-5 py-3 text-sm font-bold uppercase text-white disabled:opacity-50"
                >
                  Importer le catalogue digital
                </button>
              )}
              {(typeFilter === CATALOG_TYPES.PHYSICAL || typeFilter === "all") && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleSeed(CATALOG_TYPES.PHYSICAL)}
                  className="rounded-[5px] border border-[#A97C72] px-5 py-3 text-sm font-bold uppercase text-[#A97C72] disabled:opacity-50"
                >
                  Importer le catalogue physique
                </button>
              )}
            </div>
          </div>
        ) : null}

        {!loading && filtered.length > 0 ? (
          <div className="divide-y divide-[#E8E0D8]">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="size-14 shrink-0 rounded-[5px] object-cover bg-[#F7F2EC]"
                    />
                  ) : (
                    <div className="size-14 shrink-0 rounded-[5px] bg-[#F7F2EC]" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs text-[#7D6E66]">
                      {product.type} · {product.category || "sans catégorie"} ·{" "}
                      {product.active ? "actif" : "inactif"}
                    </p>
                    <p className="text-xs text-[#7D6E66]">{product.priceLabel}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(product)}
                    disabled={busy}
                    className="rounded-[5px] border border-[#E8E0D8] px-3 py-2 text-sm font-semibold"
                  >
                    {product.active ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    className="rounded-[5px] border border-[#E8E0D8] px-3 py-2 text-sm font-semibold hover:border-[#A97C72]"
                  >
                    Éditer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-[5px] border border-red-200 px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    <FiTrash2 aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminCatalogPage;
