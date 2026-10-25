import React from "react";
import { Link, useNavigate } from "react-router-dom";
import FavoritesHeartIcon from "../components/icons/FavoritesHeartIcon";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { homeDigitalAssets as a } from "../components/home/homeDigitalAssets";
import { useFavorites } from "../context/FavoritesContext";

/** Écrans seuls (sans cœur Figma) pour le mockup favoris. */
const DIGITAL_SCREENS = {
  "sidi-bousaid": a.cardSidi,
  "dolce-vita": a.cardDolce,
  bridgerton: a.themeBridgeton,
  bridgeton: a.themeBridgeton,
  "majestic-white": a.themeMajesticWhite,
  "club-capri": a.screenCapri,
  "sakura-koi": a.screenSakura,
  celestial: a.heroCoverSakura,
};

/** Même chassis iPhone que le catalogue digital. */
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

function resolveDigitalScreen(item) {
  return DIGITAL_SCREENS[item.id] || item.image || "";
}

function FavoritesPage() {
  const navigate = useNavigate();
  const { items, removeFavorite, count } = useFavorites();

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
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:mt-10 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {items.map((item) => {
              const price = item.priceLabel || "Start at 49$";
              const isDigital = item.productType !== "print";
              const digitalSrc = isDigital ? resolveDigitalScreen(item) : "";

              return (
                <article key={item.id} className="lw-product-card group flex flex-col p-1">
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Retirer des favoris"
                      aria-pressed
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFavorite(item.id);
                      }}
                      className="absolute right-2 top-2 z-20 flex size-8 items-center justify-center text-[#E23D48] transition-transform active:scale-90"
                    >
                      <FavoritesHeartIcon filled />
                    </button>
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => navigate(item.to || "/")}
                    >
                      {isDigital && digitalSrc ? (
                        <div className="transition-transform duration-300 group-hover:scale-[1.02]">
                          <CatalogPhoneMock src={digitalSrc} alt={item.title} />
                        </div>
                      ) : (
                        <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[5px] bg-[#fffaed] lg:aspect-[189/224] lg:h-auto">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-300 lg:group-hover:scale-105"
                              draggable={false}
                            />
                          ) : (
                            <span className="font-glacial text-[14px] text-lw-muted">Aperçu</span>
                          )}
                        </div>
                      )}
                      <h2 className="mt-3 font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-lw-text lg:mt-4 lg:text-[24px] lg:leading-8">
                        {item.title}
                      </h2>
                      <p className="mt-0 font-glacial text-[14px] leading-[18px] text-[#78716c]">
                        Includes music, animations
                        <br />
                        {"& guestbook"}
                      </p>
                      <p className="mt-2 font-glacial text-[14px] font-bold leading-6 text-lw-text">
                        {price}
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
