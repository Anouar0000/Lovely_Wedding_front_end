import React from "react";
import { LuHeart } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../../context/FavoritesContext";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

const products = [
  {
    id: "versailles",
    name: "Versailles",
    img: a.productVersailles,
    price: "à partir de 1.5dt/pcs",
    to: "/invitations-physique",
  },
  {
    id: "sacre-coeur",
    name: "Sacré cœur",
    img: a.productSacreCoeur,
    price: "à partir de 1.5dt/pcs",
    to: "/invitations-physique",
  },
  {
    id: "aime",
    name: "Aimé",
    img: a.productAime,
    price: "à partir de 1.5dt/pcs",
    to: "/invitations-physique",
  },
  {
    id: "passeport-rose",
    name: "Passeport rosé",
    img: a.productPasseport,
    price: "à partir de 1.5dt/pcs",
    to: "/invitations-physique",
  },
];

/** Invitations physiques — parity Digitale (grid, favoris, prix bold) */
function PhysicalBestsellersSection() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="bg-white px-0 py-8 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <div className="mx-auto flex w-[399px] max-w-[calc(100%-16px)] flex-col items-center gap-3 text-center lg:w-full lg:max-w-2xl">
          <h2 className="font-abhaya text-[26px] font-semibold leading-[30px] text-lw-text lg:text-[40px] lg:leading-tight">
            Invitations physiques
          </h2>
          <p className="font-urbanist text-[16px] font-medium leading-6 text-lw-muted lg:text-[20px] lg:leading-7">
            Une invitation personnalisée, imprimée
            <br className="lg:hidden" />
            <span className="hidden lg:inline"> </span>
            avec soin pour votre grand jour.
          </p>
        </div>

        <div className="mt-[35px] grid grid-cols-2 gap-4 px-4 lg:mt-14 lg:grid-cols-4 lg:gap-8 lg:px-0">
          {products.map((p) => {
            const liked = isFavorite(p.id);
            return (
              <article key={p.id} className="group flex flex-col">
                <div className="relative">
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
                        productType: "print",
                      });
                    }}
                    className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center text-[#E23D48] transition-transform active:scale-90 lg:right-3 lg:top-3"
                  >
                    <LuHeart
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden
                      className={liked ? "fill-[#E23D48] text-[#E23D48]" : "fill-none text-[#E23D48]"}
                    />
                  </button>
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => navigate("/invitations-physique")}
                  >
                    <div className="relative h-[224px] w-full overflow-hidden rounded-[5px] bg-[#fffaed] transition-shadow lg:aspect-[189/260] lg:h-auto lg:min-h-[280px] lg:group-hover:shadow-md">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 lg:group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-4 lw-h3 leading-6 lg:mt-5 lg:text-[24px]">{p.name}</h3>
                    <p className="mt-1 lw-caption lg:mt-2 lg:text-[14px] lg:leading-5">
                      Impression soignée · papier premium
                    </p>
                    <p className="mt-2 font-urbanist text-[14px] font-bold leading-5 text-lw-text lg:mt-3 lg:text-[15px]">
                      {p.price}
                    </p>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-[42px] flex justify-center lg:mt-16">
          <button
            type="button"
            onClick={() => navigate("/invitations-physique")}
            className="inline-flex items-center gap-1.5 font-urbanist text-[14px] font-medium leading-none text-[#A97C72] underline-offset-4 hover:underline lg:text-[16px]"
          >
            Découvrir toute la collection
            <span aria-hidden className="text-[16px] leading-none lg:text-[18px]">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhysicalBestsellersSection;
