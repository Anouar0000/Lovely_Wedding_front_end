import React, { useEffect, useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";

const FIGMA = "/assets/home-physical/figma";

/** Catalogue Figma 167:292 — invitations physiques */
const FILTERS = ["Tous", "Rustique", "Outeya", "Cire"];

const PRODUCTS = [
  {
    name: "Versailles",
    img: `${FIGMA}/catalog-4.png`,
    price: "à partir de 1.5dt/pcs",
    filled: false,
    category: "Rustique",
  },
  {
    name: "Sacré cœur",
    img: `${FIGMA}/catalog-1.png`,
    price: "à partir de 1.5dt/pcs",
    filled: true,
    category: "Outeya",
  },
  {
    name: "Aimé",
    img: `${FIGMA}/catalog-5.png`,
    price: "à partir de 1.5dt/pcs",
    filled: false,
    category: "Cire",
  },
  {
    name: "Passeport rosé",
    img: `${FIGMA}/catalog-2.png`,
    price: "à partir de 1.5dt/pcs",
    filled: false,
    category: "Rustique",
  },
  {
    name: "Rustique 3",
    img: `${FIGMA}/catalog-6.png`,
    price: "à partir de 1.5dt/pcs",
    filled: false,
    category: "Rustique",
  },
  {
    name: "Arabesque 1",
    img: `${FIGMA}/catalog-3.png`,
    price: "à partir de 1.5dt/pcs",
    filled: false,
    category: "Outeya",
  },
];

function InvitationsPhysiquePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Tous");
  const [visible, setVisible] = useState(6);

  useEffect(() => {
    setVisible(6);
  }, [filter]);

  const filtered = useMemo(
    () => (filter === "Tous" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter]
  );
  const products = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  const openProduct = (p) => {
    navigate(`/invitation-model/${encodeURIComponent(p.name)}`, {
      state: {
        model: {
          name: p.name,
          price: 1.5,
          image: p.img,
          templateId: p.name,
        },
        selectedCategory: p.category,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="imprimee" />

      <main className="mx-auto w-full max-w-[428px] flex-1 px-4 pb-12 lg:max-w-6xl lg:px-8 lg:pb-20">
        <nav className="flex items-center gap-2 pt-6 text-[14px] text-lw-text lg:pt-10">
          <Link to="/" className="font-normal hover:text-lw-accent">
            Accueil
          </Link>
          <span aria-hidden className="text-lw-muted">
            ›
          </span>
          <span className="font-bold">Invitations Physiques</span>
        </nav>

        <div className="mt-6 flex gap-3 overflow-x-auto hide-scrollbar pb-1 lg:mt-8 lg:flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`h-[30px] w-[133px] shrink-0 rounded-[5px] bg-[#fffaed] font-urbanist text-[14px] text-lw-text lg:h-[36px] lg:w-auto lg:px-6 ${
                filter === f ? "ring-1 ring-lw-accent" : ""
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between lg:mt-8">
          <p className="font-urbanist text-[14px] tracking-[2.8px] text-lw-text lg:text-[15px]">
            {filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé
            {filtered.length > 1 ? "s" : ""}
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 font-urbanist text-[16px] text-lw-text"
            aria-hidden
          >
            <FiFilter className="text-[17px]" />
            Filtrer
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {products.map((p) => (
            <article key={p.name} className="group">
              <button type="button" className="w-full text-left" onClick={() => openProduct(p)}>
                <div className="relative h-[224px] w-full overflow-hidden rounded-[5px] transition-shadow lg:aspect-[189/224] lg:h-auto lg:group-hover:shadow-md">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 lg:group-hover:scale-105"
                  />
                  <span
                    className={`absolute bottom-[12px] left-1/2 flex h-[19px] w-[127px] -translate-x-1/2 items-center justify-center rounded-full font-urbanist text-[10px] font-bold leading-none ${
                      p.filled
                        ? "bg-lw-accent text-white"
                        : "border border-lw-accent bg-white/90 text-lw-accent"
                    }`}
                  >
                    {p.price}
                  </span>
                </div>
                <h2 className="mt-4 lw-h3 leading-6 lg:text-[24px]">{p.name}</h2>
                <p className="mt-1 lw-caption lg:text-[14px]">
                  Impression soignée
                  <br />
                  papier premium
                </p>
              </button>
            </article>
          ))}
        </div>

        {visible < filtered.length ? (
          <div className="mt-[42px] flex justify-center lg:mt-14">
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="h-[42px] w-[163px] rounded-[5px] bg-lw-accent font-urbanist text-[14px] font-bold uppercase tracking-[0.7px] text-white hover:bg-lw-accentDark"
            >
              Voir plus
            </button>
          </div>
        ) : null}
      </main>

      <DigitalHomeFooter />
    </div>
  );
}

export default InvitationsPhysiquePage;
