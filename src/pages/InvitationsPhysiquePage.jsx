import React, { useEffect, useMemo, useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import FavoritesHeartIcon from "../components/icons/FavoritesHeartIcon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { useFavorites } from "../context/FavoritesContext";
import {
  CATALOG_TYPES,
  catalogProductToCanvasModel,
  listActiveCatalogProducts,
} from "../services/catalogProducts";

const FIGMA = "/assets/home-physical/figma";

/** Catalogue Figma 167:292 — invitations physiques tous */
const FILTERS = ["Rustique", "Outeya", "Cire"];

const STATIC_PRODUCTS = [
  {
    id: "versailles",
    name: "Versailles",
    img: `${FIGMA}/catalog-4.png`,
    price: "Start at 49$",
    category: "Rustique",
  },
  {
    id: "sacre-coeur",
    name: "Sacré cœur",
    img: `${FIGMA}/catalog-1.png`,
    price: "Start at 49$",
    category: "Outeya",
  },
  {
    id: "aime",
    name: "Aimé",
    img: `${FIGMA}/catalog-5.png`,
    price: "Start at 49$",
    category: "Cire",
  },
  {
    id: "passeport-rose",
    name: "Passeport Rosé",
    img: `${FIGMA}/catalog-2.png`,
    price: "Start at 49$",
    category: "Rustique",
  },
  {
    id: "rustique-3",
    name: "Rustique 3",
    img: `${FIGMA}/catalog-6.png`,
    price: "Start at 49$",
    category: "Rustique",
  },
  {
    id: "arabesque-1",
    name: "Arabesque 1",
    img: `${FIGMA}/catalog-3.png`,
    price: "Start at 49$",
    category: "Outeya",
  },
];

function mapCatalogProduct(p) {
  const canvas = catalogProductToCanvasModel(p);
  const unitPrice = Number(p.unitPrice) || Number(canvas?.unitPrice) || 1.5;
  return {
    id: p.id,
    name: p.name,
    img: p.imageUrl || canvas?.modelImage || `${FIGMA}/catalog-4.png`,
    price: p.priceLabel || `${unitPrice} DT / unité`,
    unitPrice,
    category: p.category || "Rustique",
    canvasModel: canvas,
  };
}

function InvitationsPhysiquePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const initialFilter =
    typeof location.state?.filter === "string" && FILTERS.includes(location.state.filter)
      ? location.state.filter
      : null;
  const [filter, setFilter] = useState(initialFilter);
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await listActiveCatalogProducts(CATALOG_TYPES.PHYSICAL);
        if (active) setCatalog(items.length ? items.map(mapCatalogProduct) : null);
      } catch {
        if (active) setCatalog(null);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const source = catalog || STATIC_PRODUCTS;

  const products = useMemo(
    () => (filter ? source.filter((p) => p.category === filter) : source),
    [filter, source]
  );

  const openProduct = (p) => {
    const canvas = p.canvasModel;
    const unitPrice = Number(p.unitPrice) || Number(canvas?.unitPrice) || 1.5;
    navigate(`/invitation-model/${encodeURIComponent(p.name)}`, {
      state: {
        model: canvas
          ? {
              ...canvas,
              image: canvas.modelImage || p.img,
              price: unitPrice,
              unitPrice,
            }
          : {
              name: p.name,
              price: unitPrice,
              unitPrice,
              image: p.img,
              templateId: "m1",
              modelImage: p.img,
            },
        productId: p.id,
        selectedCategory: p.category,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" context="imprimee" />

      <main className="mx-auto w-full max-w-[428px] flex-1 px-4 pb-[18px] lg:max-w-6xl lg:px-8 lg:pb-[18px]">
        <nav className="flex flex-wrap items-center gap-2 pt-6 text-[14px] text-lw-text lg:pt-10">
          <Link to="/imprimee" className="font-normal hover:text-lw-accent">
            Accueil
          </Link>
          <span aria-hidden className="text-lw-muted">
            ›
          </span>
          {filter ? (
            <>
              <button
                type="button"
                onClick={() => setFilter(null)}
                className="font-normal hover:text-lw-accent"
              >
                Invitations Physique
              </button>
              <span aria-hidden className="text-lw-muted">
                ›
              </span>
              <span className="font-bold">{filter}</span>
            </>
          ) : (
            <span className="font-bold">Invitations Physique</span>
          )}
        </nav>

        <div className="mt-6 flex w-full gap-2 lg:mt-8 lg:gap-3 lg:flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(active ? null : f)}
                aria-pressed={active}
                className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[5px] bg-[#fffaed] font-glacial text-[14px] leading-none text-lw-text lg:h-[36px] lg:w-[133px] lg:flex-none ${
                  active ? "border border-[#C4A69C]" : "border border-transparent"
                }`}
              >
                <span>{f}</span>
                {active ? <FiX className="size-3.5 shrink-0" aria-hidden /> : null}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between lg:mt-8">
          <p className="font-glacial text-[16px] leading-6 text-lw-text">
            {products.length} produit{products.length > 1 ? "s" : ""} trouvé
            {products.length > 1 ? "s" : ""}
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 font-glacial text-[16px] leading-6 text-lw-text"
            aria-hidden
          >
            <FiFilter className="text-[17px]" />
            Filtrer
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:mt-10 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {products.map((p) => {
            const liked = isFavorite(p.id);
            return (
              <article key={p.id} className="lw-product-card group flex w-full min-w-0 max-w-full flex-col">
                <div className="relative w-full min-w-0">
                  <button
                    type="button"
                    aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
                    aria-pressed={liked}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite({
                        id: p.id,
                        title: p.name,
                        to: `/invitation-model/${encodeURIComponent(p.name)}`,
                        image: p.img,
                        productType: "print",
                      });
                    }}
                    className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center text-[#E23D48] transition-transform active:scale-90"
                  >
                    <FavoritesHeartIcon filled={liked} />
                  </button>
                  <button type="button" className="w-full min-w-0 text-left" onClick={() => openProduct(p)}>
                    <div className="lw-product-card-media relative aspect-[189/224] w-full overflow-hidden rounded-[5px] bg-[#fffaed]">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h2 className="mt-[9px] break-words font-lora text-[16px] font-normal leading-6 tracking-[-0.5px] text-[#4B4242] sm:text-[18px] sm:leading-[34px] sm:tracking-[-1px]">
                      {p.name}
                    </h2>
                    <p className="mt-[2px] break-words font-glacial text-[13px] font-normal leading-[18px] tracking-normal text-[#78716c] sm:text-[14px]">
                      Impression soignée · papier premium
                    </p>
                    <p className="mt-[2px] font-glacial text-[14px] font-bold leading-[24px] text-lw-text">
                      {p.price}
                    </p>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {products.length === 0 ? (
          <p className="mt-10 text-center lw-body">Aucun modèle dans cette catégorie.</p>
        ) : null}
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default InvitationsPhysiquePage;
