import React, { useMemo, useState } from "react";
import { FiSliders } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import {
  DIGITAL_CATALOG_PRODUCTS,
  DigitalCatalogCard,
} from "../components/digital/DigitalCatalogCard";
import { useFavorites } from "../context/FavoritesContext";

/**
 * Catalogue Figma Group 23 — mobile 2 col · desktop 3/4 col responsive
 */
const FILTERS = ["Romantique", "Moderne", "Arabesque"];

function InvitationsDigitalPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const products = useMemo(
    () =>
      filter
        ? DIGITAL_CATALOG_PRODUCTS.filter((p) => p.category === filter)
        : DIGITAL_CATALOG_PRODUCTS,
    [filter]
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" context="digitale" catalogMobile />

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
        <div className="mt-6 grid grid-cols-2 justify-items-center gap-x-4 gap-y-12 pb-12 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:mt-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {products.map((p) => (
            <DigitalCatalogCard
              key={p.id}
              product={p}
              liked={isFavorite(p.id)}
              onToggleFavorite={(product) =>
                toggleFavorite({
                  id: product.id,
                  title: product.name,
                  to: product.to,
                  image: product.img,
                  productType: "digital",
                })
              }
              onOpen={(product) => navigate(product.to)}
            />
          ))}
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
