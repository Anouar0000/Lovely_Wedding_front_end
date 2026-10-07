import React from "react";
import { useNavigate } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/** Invitations Web — Figma cards exactes 189×224 · mockup ~86×162 */
const cards = [
  { title: "Club Capri", image: a.cardCapri, to: "/digital-invitation/club-capri", filled: true },
  { title: "Sakura Koi", image: a.cardSakura, to: "/digital-invitation/sakura-koi", filled: false },
  { title: "Bridgerton", image: a.themeBridgeton, to: "/digital-invitation/bridgerton", filled: false },
  { title: "Majestic White", image: a.themeMajesticWhite, to: "/digital-invitation/majestic-white", filled: true },
];

const pricePill =
  "absolute bottom-[12px] left-1/2 flex h-[19px] w-[127px] -translate-x-1/2 items-center justify-center rounded-full font-urbanist text-[10px] font-bold leading-none";

function InvitationsWebSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-0 py-10 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] px-4 lg:max-w-6xl lg:px-0">
        <h2 className="text-center lw-h1 lg:text-[40px]">
          Invitations Web
        </h2>
        <p className="mx-auto mt-3 max-w-[287px] text-center lw-sub lg:max-w-xl lg:text-[18px]">
          Un site personnalisé pour partager tous les détails de votre mariage.
        </p>

        <div className="mt-[35px] grid grid-cols-2 gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-8">
          {cards.map((c) => (
            <article key={c.title} className="group flex flex-col">
              <button type="button" className="w-full text-left" onClick={() => navigate(c.to)}>
                <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[5px] bg-[#fffaed] transition-shadow lg:aspect-[189/224] lg:h-auto lg:group-hover:shadow-md">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-[162px] w-[86px] object-contain transition-transform duration-300 lg:h-[75%] lg:w-auto lg:max-w-[42%] lg:group-hover:scale-105"
                  />
                  <span
                    className={`${pricePill} ${
                      c.filled
                        ? "bg-lw-accent text-white"
                        : "border border-lw-accent bg-white/90 text-lw-accent"
                    }`}
                  >
                    à partir de 99dt
                  </span>
                </div>
                <h3 className="mt-4 lw-h3 leading-6 lg:text-[24px]">
                  {c.title}
                </h3>
                <p className="mt-1 lw-caption lg:text-[14px]">
                  Musique, animations
                  <br />& livre d&apos;or
                </p>
              </button>
            </article>
          ))}
        </div>

        <div className="mt-[42px] flex justify-center lg:mt-14">
          <button
            type="button"
            onClick={() => navigate("/invitations-digital")}
            className="h-[42px] w-[281px] rounded-[5px] bg-lw-accent font-urbanist text-[14px] font-bold uppercase tracking-[0.7px] text-white hover:bg-lw-accentDark"
          >
            découvrir toute la collection
          </button>
        </div>
      </div>
    </section>
  );
}

export default InvitationsWebSection;
