import React, { useMemo, useState } from "react";
import { FiSliders } from "react-icons/fi";
import { LuHeart } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { homeDigitalAssets as a } from "../components/home/homeDigitalAssets";
import { useFavorites } from "../context/FavoritesContext";

/**
 * Catalogue Figma Group 23 — mobile 2 col · desktop 3/4 col responsive
 */
const FILTERS = ["Romantique", "Moderne", "Arabesque"];

const PRODUCTS = [
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
    img: a.screenCapri,
    screen: a.screenCapri,
    to: "/invitations-digital/club-capri",
    category: "Moderne",
    priceLabel: "Start at 49$",
  },
  {
    id: "sakura-koi",
    name: "Sakura Koi",
    img: a.screenSakura,
    screen: a.screenSakura,
    to: "/invitations-digital/sakura-koi",
    category: "Romantique",
    priceLabel: "Start at 49$",
  },
];

/** Même chassis iPhone que les tuiles Figma (cadre fin + Dynamic Island). */
function CatalogPhoneMock({ src, alt }) {
  return (
    <div className="relative aspect-[189/222] w-full overflow-hidden rounded-[5px] bg-[#fffaed]">
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

function InvitationsDigitalPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const products = useMemo(
    () => (filter ? PRODUCTS.filter((p) => p.category === filter) : PRODUCTS),
    [filter]
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" context="digitale" hideFavorites catalogMobile />

      <main className="mx-auto w-full max-w-[428px] flex-1 px-4 pb-0 md:max-w-3xl md:px-6 lg:max-w-6xl lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 pt-6 text-[14px] leading-[18px] text-[#4B4242] lg:pt-10">
          <Link to="/" className="font-normal hover:text-lw-accent">
            Accueil
          </Link>
          <span aria-hidden>›</span>
          <span className="font-bold leading-6">Invitations Digitales</span>
        </nav>

        <div className="mt-[28px] flex gap-3 overflow-x-auto hide-scrollbar lg:mt-8 lg:flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(active ? null : f)}
                aria-pressed={active}
                className={`h-[30px] w-[133px] shrink-0 rounded-[5px] bg-[#fffaed] font-glacial text-[14px] leading-none text-[#4B4242] lg:h-9 ${
                  active ? "ring-1 ring-[#C4A69C]" : ""
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between lg:mt-8">
          <p className="font-glacial text-[16px] leading-6 text-[#4B4242]">
            {`${products.length} produits trouvés`}
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-glacial text-[16px] leading-6 text-[#4B4242]"
            aria-label="Filtrer"
          >
            <FiSliders className="size-[17px]" />
            Filtrer
          </button>
        </div>

        {/* Mobile 2 · tablet 3 · desktop 4 */}
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 pb-12 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:mt-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {products.map((p) => {
            const liked = isFavorite(p.id);
            return (
              <article key={p.id} className="group flex flex-col">
                <div className="relative">
                  <span
                    className="pointer-events-none absolute right-1 top-1 z-10 size-9 rounded-sm bg-[#fffaed]"
                    aria-hidden
                  />
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
                    className="absolute right-2 top-2 z-20 flex size-8 items-center justify-center"
                  >
                    <LuHeart
                      size={18}
                      strokeWidth={1.75}
                      aria-hidden
                      className={
                        liked
                          ? "fill-[#E23D48] text-[#E23D48]"
                          : "fill-none text-[#E23D48]"
                      }
                    />
                  </button>

                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => navigate(p.to)}
                  >
                    {p.screen ? (
                      <div className="transition-transform duration-300 group-hover:scale-[1.02]">
                        <CatalogPhoneMock src={p.screen} alt={p.name} />
                      </div>
                    ) : (
                      <div className="relative aspect-[189/222] w-full overflow-hidden rounded-[5px] bg-[#fffaed]">
                        <img
                          src={`${p.img}?v=g23`}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          draggable={false}
                        />
                      </div>
                    )}
                    <h2 className="mt-3 font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-[#4B4242] lg:text-[20px] lg:leading-8">
                      {p.name}
                    </h2>
                    <p className="font-glacial text-[14px] leading-[18px] text-[#78716c]">
                      Includes music, animations
                      <br />
                      {"& guestbook"}
                    </p>
                    <p className="mt-1 font-glacial text-[14px] font-bold leading-6 text-[#4B4242]">
                      {p.priceLabel}
                    </p>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {products.length === 0 ? (
          <p className="mt-10 pb-10 text-center lw-body">Aucun modèle dans cette catégorie.</p>
        ) : null}
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default InvitationsDigitalPage;
