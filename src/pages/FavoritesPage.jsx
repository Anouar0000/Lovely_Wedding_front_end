import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import FavoritesHeartIcon from "../components/icons/FavoritesHeartIcon";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import {
  DIGITAL_CATALOG_PRODUCTS,
  DigitalCatalogCard,
} from "../components/digital/DigitalCatalogCard";
import { useFavorites } from "../context/FavoritesContext";

function FavoritesPage() {
  const navigate = useNavigate();
  const { items, removeFavorite, toggleFavorite, isFavorite, count } = useFavorites();

  const catalogById = useMemo(() => {
    const map = new Map();
    DIGITAL_CATALOG_PRODUCTS.forEach((p) => map.set(p.id, p));
    // Ancien nom marketing « Celestial » = Sakura Koi
    map.set("celestial", map.get("sakura-koi"));
    return map;
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-[428px] flex-1 px-4 pb-[18px] lg:max-w-6xl lg:px-8 lg:pb-[18px]">
        <nav className="flex flex-wrap items-center gap-2 pt-6 text-[14px] text-lw-text lg:pt-10">
          <Link to="/" className="font-normal hover:text-lw-accent">
            Accueil
          </Link>
          <span aria-hidden className="text-lw-muted">
            ›
          </span>
          <span className="font-bold">Favoris</span>
        </nav>

        <h1 className="mt-6 font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-lw-text lg:text-[40px] lg:leading-tight">
          Favoris
        </h1>
        <p className="mt-2 font-glacial text-[14px] leading-[18px] text-[#78716c] lg:text-[16px] lg:leading-6">
          {count > 0
            ? `${count} modèle${count > 1 ? "s" : ""} enregistré${count > 1 ? "s" : ""}.`
            : "Retrouvez ici les invitations que vous aimez."}
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[5px] bg-[#fffaed] px-6 py-10 text-center">
            <p className="font-lora text-[22px] font-medium text-lw-text">Aucun favori pour le moment</p>
            <p className="mt-2 text-sm text-lw-muted">
              Touchez le cœur sur un modèle pour l&apos;enregistrer ici.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/invitations-physique"
                className="inline-flex h-[42px] min-w-[200px] items-center justify-center rounded-[5px] border border-lw-accent bg-white px-4 text-sm font-bold uppercase text-lw-accent"
              >
                Invitations imprimées
              </Link>
              <Link
                to="/invitations-digital"
                className="inline-flex h-[42px] min-w-[200px] items-center justify-center rounded-[5px] bg-lw-accent px-4 text-sm font-bold uppercase text-white hover:bg-lw-accentDark"
              >
                Invitations digitales
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 pb-12 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:mt-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
            {items.map((item) => {
              const catalog =
                catalogById.get(item.id) ||
                (item.title?.toLowerCase().includes("celestial")
                  ? catalogById.get("sakura-koi")
                  : null);
              if (catalog) {
                return (
                  <DigitalCatalogCard
                    key={catalog.id}
                    product={{
                      ...catalog,
                      priceLabel: item.priceLabel || catalog.priceLabel,
                    }}
                    liked={isFavorite(catalog.id)}
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
                );
              }

              return (
                <article key={item.id} className="lw-product-card group flex w-full min-w-0 flex-col">
                  <div className="relative w-full min-w-0">
                    <button
                      type="button"
                      aria-label="Retirer des favoris"
                      aria-pressed
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFavorite(item.id);
                      }}
                      className="absolute right-2 top-2 z-20 flex size-8 items-center justify-center"
                    >
                      <FavoritesHeartIcon filled />
                    </button>
                    <button
                      type="button"
                      className="w-full min-w-0 text-left"
                      onClick={() => navigate(item.to || "/")}
                    >
                      <div className="lw-product-card-media relative aspect-[189/224] w-full overflow-hidden rounded-[5px] bg-[#fffaed]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center font-glacial text-[14px] text-lw-muted">
                            Aperçu
                          </span>
                        )}
                      </div>
                      <h2 className="mt-3 break-words font-lora text-[16px] font-normal leading-6 tracking-[-0.18px] text-[#4B4242] sm:text-[18px] sm:leading-[34px]">
                        {item.title}
                      </h2>
                      <p className="font-glacial text-[14px] leading-[18px] text-[#78716c]">
                        {item.productType === "print"
                          ? "Impression soignée · papier premium"
                          : "Includes music, animations & guestbook"}
                      </p>
                      <p className="mt-1 font-glacial text-[14px] font-bold leading-6 text-[#4B4242]">
                        {item.priceLabel || (item.productType === "print" ? "Start at 49$" : "Start at 49$")}
                      </p>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default FavoritesPage;
