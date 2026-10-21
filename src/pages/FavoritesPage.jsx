import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuHeart } from "react-icons/lu";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { useFavorites } from "../context/FavoritesContext";

function FavoritesPage() {
  const navigate = useNavigate();
  const { items, removeFavorite, count } = useFavorites();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 lg:px-8 lg:py-16">
        <nav className="flex items-center gap-2 text-[14px] text-lw-text">
          <Link to="/" className="hover:text-lw-accent">
            Accueil
          </Link>
          <span aria-hidden>›</span>
          <span className="font-bold">Favoris</span>
        </nav>

        <h1 className="mt-6 text-center lw-h1 lg:text-left lg:text-[40px] lg:leading-tight">
          Favoris
        </h1>
        <p className="mx-auto mt-2 max-w-[320px] text-center lw-body lg:mx-0 lg:max-w-none lg:text-left lg:text-[16px]">
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
          <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-8">
            {items.map((item) => (
              <article key={item.id} className="group relative flex flex-col">
                <button
                  type="button"
                  aria-label="Retirer des favoris"
                  onClick={() => removeFavorite(item.id)}
                  className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center text-[#E23D48] transition-transform active:scale-90"
                >
                  <LuHeart size={18} strokeWidth={1.5} className="fill-[#E23D48]" aria-hidden />
                </button>
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => navigate(item.to || "/")}
                >
                  <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[5px] bg-[#fffaed] lg:aspect-[189/224] lg:h-auto lg:group-hover:shadow-md">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className={
                          item.productType === "digital"
                            ? "h-[162px] w-[86px] object-contain lg:h-[75%] lg:w-auto lg:max-w-[42%]"
                            : "h-full w-full object-cover"
                        }
                      />
                    ) : (
                      <span className="font-glacial text-[14px] text-lw-muted">Aperçu</span>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-lw-accent">
                    {item.productType === "print" ? "Imprimé" : "Digital"}
                  </p>
                  <h2 className="mt-1 font-lora text-[18px] font-normal leading-[28px] tracking-[-0.18px] text-lw-text lg:text-[22px]">
                    {item.title}
                  </h2>
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default FavoritesPage;
