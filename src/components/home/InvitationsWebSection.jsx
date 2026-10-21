import React from "react";
import { LuHeart } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/** Invitations Web — design hero (cover + cadre iPhone) */
const cards = [
  {
    id: "sidi-bousaid",
    title: "Sidi Bou Said",
    image: a.heroCoverSidi,
    to: "/invitations-digital/sidi-bousaid",
  },
  {
    id: "celestial",
    title: "Celestial",
    image: a.heroCoverSakura,
    to: "/invitations-digital/celestial",
  },
  {
    id: "bridgerton",
    title: "Bridgerton",
    image: a.heroCoverBridgerton,
    to: "/invitations-digital/bridgerton",
  },
  {
    id: "majestic-white",
    title: "Majestic White",
    image: a.heroCoverMajestic,
    to: "/invitations-digital/majestic-white",
  },
];

/** Figma Lucide heart */
const heartProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true };

/** Figma phone — noir fin 78×168 · desktop un peu plus grand */
function PhonePreview({ src, title }) {
  return (
    <div className="relative mx-auto h-[168px] w-[78px] overflow-hidden rounded-[14px] border-[1.5px] border-[#131313] bg-[#131313] shadow-[0_10px_24px_-12px_rgba(75,66,66,0.4)] lg:h-[200px] lg:w-[94px] lg:rounded-[16px] lg:border-2">
      <div className="absolute inset-[1.5px] overflow-hidden rounded-[12px] bg-[#F7F2EC] lg:inset-[2px] lg:rounded-[14px]">
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </div>
      <span
        className="pointer-events-none absolute left-1/2 top-[4px] z-10 h-[6px] w-[22px] -translate-x-1/2 rounded-full bg-[#131313] lg:top-[5px] lg:h-[7px] lg:w-[26px]"
        aria-hidden
      />
    </div>
  );
}

function InvitationsWebSection() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="bg-white px-0 py-8 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <div className="mx-auto flex w-[399px] max-w-[calc(100%-16px)] flex-col items-center gap-3 text-center lg:w-full lg:max-w-2xl">
          <h2 className="font-lora text-[26px] font-medium leading-[30px] text-lw-text lg:text-[40px] lg:leading-tight">
            Invitations Web
          </h2>
          <p className="font-glacial text-[16px] font-medium leading-6 text-lw-muted lg:text-[20px] lg:leading-7">
            Un site personnalisé pour partager
            <br className="lg:hidden" />
            <span className="hidden lg:inline"> </span>
            tous les détails de votre mariage.
          </p>
        </div>

        <div className="mt-[35px] grid grid-cols-2 gap-4 px-4 lg:mt-14 lg:grid-cols-4 lg:gap-8 lg:px-0">
          {cards.map((c) => {
            const liked = isFavorite(c.id);
            return (
              <article key={c.id} className="lw-product-card group flex flex-col p-1">
                <div className="relative">
                  <button
                    type="button"
                    aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
                    aria-pressed={liked}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite({
                        id: c.id,
                        title: c.title,
                        to: c.to,
                        image: c.image,
                        productType: "digital",
                      });
                    }}
                    className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center text-[#E23D48] transition-transform active:scale-90 lg:right-3 lg:top-3"
                  >
                    <LuHeart
                      {...heartProps}
                      className={liked ? "fill-[#E23D48] text-[#E23D48]" : "fill-none text-[#E23D48]"}
                    />
                  </button>
                  <button type="button" className="w-full text-left" onClick={() => navigate(c.to)}>
                    <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[5px] bg-[#fffaed] lg:aspect-[189/260] lg:h-auto lg:min-h-[280px]">
                      <PhonePreview src={c.image} title={c.title} />
                    </div>
                    <h3 className="mt-4 lw-h3 leading-6 lg:mt-5 lg:text-[24px]">{c.title}</h3>
                    <p className="mt-1 lw-caption lg:mt-2 lg:text-[14px] lg:leading-5">
                      Includes music, animations
                      <br />& guestbook
                    </p>
                    <p className="mt-2 font-glacial text-[14px] font-bold leading-5 text-lw-text lg:mt-3 lg:text-[15px]">
                      Start at 49$
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
            onClick={() => navigate("/invitations-digital")}
            className="inline-flex items-center gap-1.5 font-glacial text-[14px] font-medium leading-none text-[#A97C72] underline-offset-4 hover:underline lg:text-[16px]"
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

export default InvitationsWebSection;
