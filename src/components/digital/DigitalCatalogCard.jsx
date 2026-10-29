import React from "react";
import { homeDigitalAssets as a } from "../home/homeDigitalAssets";
import FavoritesHeartIcon from "../icons/FavoritesHeartIcon";

/**
 * Catalogue Figma Group 23 — mêmes tuiles que /invitations-digital.
 * Tuiles `img` = export Figma complet (fond crème + téléphone).
 * `screen` = contenu seul (sans bezel) pour CatalogPhoneMock (Capri / Sakura).
 */
export const DIGITAL_CATALOG_PRODUCTS = [
  {
    id: "sidi-bousaid",
    name: "Sidi Bou Said",
    img: a.catalogTileSidi,
    to: "/invitations-digital/sidi-bousaid",
    category: "Arabesque",
    priceLabel: "Start at 49$",
  },
  {
    id: "dolce-vita",
    name: "Dolce Vita",
    img: a.catalogTileDolce,
    to: "/invitations-digital/dolce-vita",
    category: "Romantique",
    priceLabel: "Start at 49$",
  },
  {
    id: "bridgerton",
    name: "Bridgeton",
    img: a.catalogTileBridgeton,
    to: "/invitations-digital/bridgerton",
    category: "Moderne",
    priceLabel: "Start at 49$",
  },
  {
    id: "majestic-white",
    name: "Majestic White",
    img: a.catalogTileMajestic,
    to: "/invitations-digital/majestic-white",
    category: "Romantique",
    priceLabel: "Start at 49$",
  },
  {
    id: "club-capri",
    name: "Club Capri",
    img: a.catalogTileCapri,
    screen: a.screenCapri,
    to: "/invitations-digital/club-capri",
    category: "Moderne",
    priceLabel: "Start at 49$",
  },
  {
    id: "sakura-koi",
    name: "Sakura Koi",
    img: a.catalogTileSakura,
    screen: a.screenSakura,
    to: "/invitations-digital/sakura-koi",
    category: "Romantique",
    priceLabel: "Start at 49$",
  },
];

/** Tuile responsive (ratio Figma 189×224) — chassis iPhone (cadre fin + Dynamic Island). */
export function CatalogPhoneMock({ src, alt }) {
  return (
    <div className="relative aspect-[189/224] w-full overflow-hidden rounded-[5px] bg-[#fffaed]">
      <div className="absolute left-[28.5%] top-[12.5%] h-[77%] w-[42.5%] rounded-[16%/8%] bg-[#1c1c1c] p-[1.6%] shadow-[2px_6px_8px_-2px_rgba(75,66,66,0.45)]">
        <div className="relative h-full w-full overflow-hidden rounded-[14%/7%] bg-[#F7F2EC]">
          <img
            src={src}
            alt={alt}
            className="pointer-events-none block h-full w-full object-cover object-top"
            draggable={false}
          />
          <span
            className="pointer-events-none absolute left-1/2 top-[2%] h-[3%] w-[26%] -translate-x-1/2 rounded-full bg-[#131313]"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Carte produit catalogue — code unique pour /invitations-digital et recommandations.
 * Tuile fluide (ratio Figma 189×224). Les exports ont un cœur dessiné : on le masque + bouton favoris.
 */
export function DigitalCatalogCard({
  product,
  liked,
  onToggleFavorite,
  onOpen,
  /**
   * Recommandations : ratio Figma 189×224, max 189px, mais fluide
   * pour laisser un vrai gap sur mobile (2×189 ne rentre pas dans ~360px utiles).
   */
  fixedTile = false,
}) {
  const usePhoneMock = Boolean(product.screen);
  const mediaBox =
    "lw-product-card-media relative aspect-[189/224] w-full overflow-hidden rounded-[5px] bg-[#fffaed]";

  return (
    <article
      className={`lw-product-card group flex min-w-0 flex-col ${
        fixedTile ? "w-full max-w-[189px]" : "w-full max-w-full"
      }`}
    >
      <div className="relative w-full min-w-0">
        {/* Masque le cœur intégré dans les exports Figma (tuiles sans screen) */}
        {!usePhoneMock ? (
          <span
            className="pointer-events-none absolute right-0 top-0 z-10 h-11 w-11 bg-[#fffaed]"
            aria-hidden
          />
        ) : null}
        <button
          type="button"
          aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={liked}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(product);
          }}
          className="absolute right-2 top-2 z-20 flex size-8 items-center justify-center"
        >
          <FavoritesHeartIcon filled={liked} />
        </button>

        <button type="button" className="w-full min-w-0 text-left" onClick={() => onOpen?.(product)}>
          {usePhoneMock ? (
            <div className="lw-product-card-media w-full overflow-hidden rounded-[5px]">
              <CatalogPhoneMock src={product.screen} alt={product.name} />
            </div>
          ) : (
            <div className={mediaBox}>
              <img
                src={product.img}
                alt={product.name}
                width={189}
                height={224}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          )}
          <h2 className="mt-3 break-words font-lora text-[16px] font-normal leading-6 tracking-[-0.18px] text-[#4B4242] sm:text-[18px] sm:leading-[34px] lg:text-[20px] lg:leading-8">
            {product.name}
          </h2>
          <p className="break-words font-glacial text-[13px] leading-[18px] text-[#78716c] sm:text-[14px]">
            Includes music, animations
            <br />
            {"& guestbook"}
          </p>
          <p className="mt-1 font-glacial text-[14px] font-bold leading-6 text-[#4B4242]">
            {product.priceLabel}
          </p>
        </button>
      </div>
    </article>
  );
}
