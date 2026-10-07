import React from "react";
import { useNavigate } from "react-router-dom";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

const products = [
  {
    name: "Versailles",
    img: a.productVersailles,
    price: "à partir de 1.5dt/pcs",
    filled: false,
  },
  {
    name: "Sacré cœur",
    img: a.productSacreCoeur,
    price: "à partir de 1.5dt/pcs",
    filled: true,
  },
  {
    name: "Aimé",
    img: a.productAime,
    price: "à partir de 1.5dt/pcs",
    filled: false,
  },
  {
    name: "Passeport rosé",
    img: a.productPasseport,
    price: "à partir de 1.5dt/pcs",
    filled: false,
  },
];

/** Invitations physiques — Figma cards exactes 189×224 */
function PhysicalBestsellersSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-0 py-10 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] px-4 lg:max-w-6xl lg:px-0">
        <h2 className="text-center lw-h1 lg:text-[40px]">
          Invitations physiques
        </h2>
        <p className="mx-auto mt-3 max-w-[318px] text-center lw-sub lg:max-w-xl lg:text-[18px]">
          Une invitation personnalisée, imprimée avec soin pour votre grand jour.
        </p>

        <div className="mt-[35px] grid grid-cols-2 gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-8">
          {products.map((p) => (
            <article key={p.name} className="group flex flex-col">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => navigate("/invitations-physique")}
              >
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
                <h3 className="mt-4 lw-h3 leading-6 lg:text-[24px]">
                  {p.name}
                </h3>
                <p className="mt-1 lw-caption lg:text-[14px]">
                  Impression soignée · papier premium
                </p>
              </button>
            </article>
          ))}
        </div>

        <div className="mt-[42px] flex justify-center lg:mt-14">
          <button
            type="button"
            onClick={() => navigate("/invitations-physique")}
            className="h-[42px] w-[281px] rounded-[5px] bg-lw-accent font-urbanist text-[14px] font-bold uppercase tracking-[0.7px] text-white hover:bg-lw-accentDark"
          >
            découvrir toute la collection
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhysicalBestsellersSection;
