import React, { useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { homeDigitalAssets as a } from "../components/home/homeDigitalAssets";

/** Catalogue Figma 1102:344 — mobile Figma · desktop grille 3–4 cols */
const FILTERS = ["Tous", "Romantique", "Moderne", "Arabesque"];

const PRODUCTS = [
  { name: "Club Capri", img: a.cardCapri, filled: true, to: "/digital-invitation/club-capri", category: "Moderne" },
  { name: "Sakura Koi", img: a.cardSakura, filled: false, to: "/digital-invitation/sakura-koi", category: "Romantique" },
  { name: "Sidi Bou Said", img: a.cardSidi, filled: false, to: "/digital-invitation/sidi-bousaid", category: "Arabesque" },
  { name: "La Dolce Vita", img: a.cardDolce, filled: true, to: "/digital-invitation/dolce-vita", category: "Romantique" },
  { name: "Bridgerton", img: a.themeBridgeton, filled: false, to: "/digital-invitation/bridgerton", category: "Moderne" },
  { name: "Majestic White", img: a.themeMajesticWhite, filled: true, to: "/digital-invitation/majestic-white", category: "Romantique" },
];

function InvitationsDigitalPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Tous");

  const products = useMemo(
    () => (filter === "Tous" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="digitale" />

      <main className="mx-auto w-full max-w-[428px] flex-1 px-4 pb-12 lg:max-w-6xl lg:px-8 lg:pb-20">
        <nav className="flex items-center gap-2 pt-6 text-[14px] text-lw-text lg:pt-10">
          <Link to="/" className="font-normal hover:text-lw-accent">
            Accueil
          </Link>
          <span aria-hidden>›</span>
          <span className="font-bold">Invitations Digitales</span>
        </nav>

        <div className="mt-6 flex gap-3 overflow-x-auto hide-scrollbar pb-1 lg:mt-8 lg:flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`h-[30px] w-[133px] shrink-0 rounded-[5px] bg-[#fffaed] text-[14px] lg:h-[36px] lg:w-auto lg:px-6 ${
                filter === f ? "ring-1 ring-lw-accent" : ""
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between lg:mt-8">
          <p className="text-[14px] tracking-[2.8px] lg:text-[15px]">
            {products.length} produit{products.length > 1 ? "s" : ""} trouvé
            {products.length > 1 ? "s" : ""}
          </p>
          <button type="button" className="inline-flex items-center gap-2 text-[16px]" aria-hidden>
            <FiFilter className="text-[17px]" />
            Filtrer
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {products.map((p) => (
            <article key={p.key || p.name + p.to} className="group">
              <button type="button" className="w-full text-left" onClick={() => navigate(p.to)}>
                <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[5px] bg-[#fffaed] transition-shadow lg:aspect-[189/224] lg:h-auto lg:group-hover:shadow-md">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-[162px] w-[86px] object-contain transition-transform duration-300 lg:h-[75%] lg:w-auto lg:max-w-[42%] lg:group-hover:scale-105"
                  />
                  <span
                    className={`absolute bottom-[12px] left-1/2 flex h-[19px] w-[127px] -translate-x-1/2 items-center justify-center rounded-full font-urbanist text-[10px] font-bold leading-none ${
                      p.filled
                        ? "bg-lw-accent text-white"
                        : "border border-lw-accent bg-white/90 text-lw-accent"
                    }`}
                  >
                    à partir de 99dt
                  </span>
                </div>
                <h2 className="mt-4 lw-h3 leading-6 lg:text-[24px]">{p.name}</h2>
                <p className="mt-1 text-[13px] leading-4 text-lw-muted lg:text-[14px]">
                  Musique, animations
                  <br />& livre d&apos;or
                </p>
              </button>
            </article>
          ))}
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
