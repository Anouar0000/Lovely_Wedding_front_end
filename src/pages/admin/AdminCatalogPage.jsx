import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { isAbortError } from "../../lib/firebase";
import {
  CATALOG_TYPES,
  createCatalogProduct,
  deleteCatalogProduct,
  listAllCatalogProducts,
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [typeFilter, setTypeFilter] = useState("all");

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

  const openCreate = () => {
    setEditingId("new");
    setForm(EMPTY_FORM);
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

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-lora text-[28px] font-medium text-[#4B4242] lg:text-[36px]">Catalogue</h2>
          <p className="mt-1 text-sm text-[#7D6E66]">
            Produits digital / physique. Si la collection est vide, le site garde les listes statiques.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadProducts}
            className="inline-flex items-center gap-2 rounded-[5px] border border-[#E8E0D8] bg-white px-4 py-3 text-sm font-semibold"
          >
            <FiRefreshCw aria-hidden /> Actualiser
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-[5px] bg-[#A97C72] px-4 py-3 text-sm font-bold uppercase text-white"
          >
            <FiPlus aria-hidden /> Nouveau
          </button>
        </div>
      </div>

      <div className="mb-4 flex overflow-hidden rounded-[5px] border border-[#E8E0D8] bg-white text-sm font-semibold">
        {[
          ["all", "Tous"],
          [CATALOG_TYPES.DIGITAL, "Digital"],
          [CATALOG_TYPES.PHYSICAL, "Physique"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTypeFilter(value)}
            className={`px-4 py-3 ${
              typeFilter === value ? "bg-[#A97C72] text-white" : "text-[#7D6E66]"
            }`}
          >
            {label}
          </button>
        ))}
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
          <p className="px-5 py-12 text-center text-sm text-[#7D6E66]">
            Aucun produit Firestore — le site utilise encore les catalogues statiques.
          </p>
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
