import React, { useEffect, useMemo, useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { LuHeart } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { homeDigitalAssets as a } from "../components/home/homeDigitalAssets";
import { useFavorites } from "../context/FavoritesContext";
import {
  CATALOG_TYPES,
  listActiveCatalogProducts,
} from "../services/catalogProducts";

/** Catalogue Figma 1789:326 / Group 23 — invitations digitales */
const FILTERS = ["Romantique", "Moderne", "Arabesque"];

const STATIC_PRODUCTS = [
  {
    id: "sidi-bousaid",
    name: "Sidi Bou Said",
    img: a.cardSidi,
    to: "/invitations-digital/sidi-bousaid",
    category: "Arabesque",
    priceLabel: "Start at 49$",
  },
  {
    id: "dolce-vita",
    name: "Dolce Vita",
    img: a.cardDolce,
    to: "/invitations-digital/dolce-vita",
    category: "Romantique",
    priceLabel: "Start at 49$",
  },
  {
    id: "bridgerton",
    name: "Bridgeton",
    img: a.themeBridgeton,
    to: "/invitations-digital/bridgerton",
    category: "Moderne",
    priceLabel: "Start at 49$",
  },
  {
    id: "majestic-white",
    name: "Majestic White",
    img: a.themeMajesticWhite,
    to: "/invitations-digital/majestic-white",
    category: "Romantique",
    priceLabel: "Start at 49$",
  },
  {
    id: "club-capri",
    name: "Club Capri",
    img: a.cardCapri,
    to: "/invitations-digital/club-capri",
    category: "Moderne",
    priceLabel: "Start at 49$",
  },
  {
    id: "sakura-koi",
    name: "Sakura Koi",
    img: a.cardSakura,
    to: "/invitations-digital/sakura-koi",
    category: "Romantique",
    priceLabel: "Start at 49$",
  },
];

function mapCatalogProduct(p) {
  const slug = p.slug || p.id;
  return {
    id: p.id,
    name: p.name,
    img: p.imageUrl || a.cardCapri,
    to: `/invitations-digital/${slug}`,
    category: p.category || "Moderne",
    priceLabel: p.priceLabel || "Start at 49$",
  };
}

function InvitationsDigitalPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await listActiveCatalogProducts(CATALOG_TYPES.DIGITAL);
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

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" context="digitale" />

      <main className="mx-auto w-full max-w-[428px] flex-1 px-4 pb-[18px] lg:max-w-6xl lg:px-8 lg:pb-[18px]">
        <nav className="flex flex-wrap items-center gap-2 pt-6 text-[14px] text-lw-text lg:pt-10">
          <Link to="/" className="font-normal hover:text-lw-accent">
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
                Invitations Digitales
              </button>
              <span aria-hidden className="text-lw-muted">
                ›
              </span>
              <span className="font-bold">{filter}</span>
            </>
          ) : (
            <span className="font-bold">Invitations Digitales</span>
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
                className={`flex h-[30px] flex-1 items-center justify-center gap-1.5 rounded-[5px] bg-[#fffaed] font-glacial text-[14px] leading-none text-lw-text lg:h-[36px] lg:w-[133px] lg:flex-none ${
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
              <article key={p.id} className="lw-product-card group flex flex-col p-1">
                <div className="relative">
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
                        to: p.to,
                        image: p.img,
                        productType: "digital",
                      });
                    }}
                    className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center transition-transform active:scale-90"
                  >
                    <LuHeart
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden
                      className={
                        liked ? "fill-[#E23D48] text-[#E23D48]" : "fill-none text-[#4B4242]"
                      }
                    />
                  </button>
                  <button type="button" className="w-full text-left" onClick={() => navigate(p.to)}>
                    <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[5px] bg-[#fffaed] shadow-[0px_1px_5px_0px_rgba(0,0,0,0.12)] lg:aspect-[189/224] lg:h-auto">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="h-[162px] w-auto max-w-[42%] object-contain transition-transform duration-300 lg:h-[75%] lg:group-hover:scale-105"
                      />
                    </div>
                    <h2 className="mt-3 font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-lw-text lg:mt-4 lg:text-[24px] lg:leading-8">
                      {p.name}
                    </h2>
                    <p className="mt-0 font-glacial text-[14px] leading-[18px] text-[#78716c]">
                      Includes music, animations
                      <br />
                      {"& guestbook"}
                    </p>
                    <p className="mt-2 font-glacial text-[14px] font-bold leading-6 text-lw-text">
                      {p.priceLabel}
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

export default InvitationsDigitalPage;
