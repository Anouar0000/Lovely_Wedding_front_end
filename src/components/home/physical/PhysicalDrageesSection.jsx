import React from "react";
import { useNavigate } from "react-router-dom";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

const items = [
  {
    title: "Sidi Bou Said",
    image: a.drageeSidi,
    price: "à partir de 39dt",
  },
  {
    title: "La Dolce Vita",
    image: a.drageeDolce,
    price: "à partir de 39dt",
    isNew: true,
  },
];

/** Dragées — Figma exact 280×310 */
function PhysicalDrageesSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-0 py-10 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <h2 className="px-4 text-center lw-h1 lg:text-[40px]">
          Dragées
        </h2>
        <p className="mx-auto mt-3 max-w-[272px] px-4 text-center lw-sub lg:max-w-xl lg:text-[18px]">
          Des créations personnalisées pour accompagner votre grand jour.
        </p>

        <div className="mt-8 flex gap-[30px] overflow-x-auto hide-scrollbar px-4 pb-1 lg:mt-14 lg:grid lg:grid-cols-2 lg:gap-10 lg:overflow-visible lg:px-0">
          {items.map((item) => (
            <article key={item.title} className="w-[280px] shrink-0 lg:w-auto">
              <div className="relative h-[310px] w-[280px] overflow-hidden rounded-[5px] lg:h-auto lg:w-full lg:aspect-[280/310]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                {item.isNew ? (
                  <span className="absolute right-0 top-0 flex h-[30px] w-[70px] items-center justify-center rounded-bl-[5px] bg-lw-sage font-urbanist text-[11px] font-bold uppercase text-white">
                    NEW
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 lw-h3 leading-6 lg:text-[28px]">
                {item.title}
              </h3>
              <p className="mt-1 lw-caption leading-5 lg:text-[14px]">
                Includes music, animations & guestbook
              </p>
              <span className="mt-3 inline-flex h-[19px] w-[127px] items-center justify-center rounded-full border border-lw-accent font-urbanist text-[10px] font-bold leading-none text-lw-accent">
                {item.price}
              </span>
              <button
                type="button"
                onClick={() => navigate("/invitations-physique")}
                className="mt-3 block border-b border-lw-text pb-0.5 font-urbanist text-sm font-semibold"
              >
                Voir le produit
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PhysicalDrageesSection;
