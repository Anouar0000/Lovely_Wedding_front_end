import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/** Mobile : taille dynamique selon la carte centrée · Desktop : gauche / centre / droite */
const CARDS = [
  {
    src: a.bestsellerLeft,
    alt: "",
    featured: false,
    desktopClass:
      "lg:order-1 lg:h-[440px] lg:w-[240px] lg:opacity-100 lg:shadow-none",
  },
  {
    src: a.bestsellerCenter,
    alt: "Best-seller Delicate Beige",
    featured: true,
    desktopClass: "lg:order-2 lg:h-[480px] lg:w-[280px] lg:opacity-100 lg:shadow-md",
  },
  {
    src: a.bestsellerRight,
    alt: "",
    featured: false,
    desktopClass:
      "lg:order-3 lg:h-[440px] lg:w-[240px] lg:opacity-100 lg:shadow-none",
  },
];

/** Best-sellers — mobile rail · desktop 3 cartes centrées, texte sous le centre */
function BestsellersSection() {
  const navigate = useNavigate();
  const railRef = useRef(null);
  const cardRefs = useRef([]);
  /** Index de la carte la plus proche du centre (featured = 1 au chargement) */
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const updateActive = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setActiveIndex(1);
        return;
      }

      const railRect = rail.getBoundingClientRect();
      const centerX = railRect.left + railRect.width / 2;
      let best = 0;
      let bestDist = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - centerX);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      setActiveIndex((prev) => (prev === best ? prev : best));
    };

    updateActive();
    rail.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      rail.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <section className="overflow-x-hidden bg-white pb-12 pt-8 lg:pb-24 lg:pt-20">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <h2 className="px-4 text-center lw-h1 lg:text-[40px] lg:leading-tight">
          Les Best-Sellers
        </h2>
        <p className="mx-auto mt-2 w-[357px] max-w-[calc(100%-16px)] whitespace-nowrap text-center font-urbanist text-[18px] font-medium leading-6 text-lw-muted lg:mt-3 lg:w-auto lg:max-w-xl lg:text-[20px]">
          Les créations que vous avez le plus aimées.
        </p>
      </div>

      <div
        ref={railRef}
        className="mt-[35px] flex snap-x snap-mandatory items-end gap-6 overflow-x-auto hide-scrollbar pb-1 max-lg:[padding-left:max(16px,calc((100%-256px)/2))] max-lg:pr-[18%] lg:mt-14 lg:items-end lg:justify-center lg:gap-8 lg:overflow-visible lg:px-8"
      >
        {CARDS.map((card, i) => {
          const isActive = activeIndex === i;
          const mobileOrder = card.featured ? "order-1" : i === 0 ? "order-2" : "order-3";
          return (
            <img
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              src={card.src}
              alt={card.alt}
              className={`pointer-events-none shrink-0 snap-center rounded-[5px] object-cover transition-[height,opacity,box-shadow] duration-300 ease-out w-[256px] ${mobileOrder} ${
                isActive ? "h-[410px] opacity-100 shadow-md" : "h-[320px] opacity-90"
              } ${card.desktopClass}`}
              draggable={false}
              loading={i > 0 ? "lazy" : undefined}
            />
          );
        })}
      </div>

      {/* Mobile : sous la carte 256px · Desktop : sous la carte centrale (280) */}
      <div className="mx-auto mt-5 w-[256px] text-left lg:mt-10 lg:grid lg:w-full lg:max-w-6xl lg:grid-cols-[240px_32px_280px_32px_240px] lg:justify-center lg:px-8">
        <div className="lg:col-start-3 lg:w-[280px]">
          <h3 className="lw-feature lg:text-[36px]">Delicate Beige</h3>
          <p className="mt-[10px] w-[261px] max-w-full font-urbanist text-[16px] font-normal leading-6 text-lw-muted lg:mt-4 lg:w-full lg:text-[17px] lg:leading-7">
            Classic stationery-inspired designs and Elevate your event with curated envelopes,
            liners, and stamps
          </p>
          <button
            type="button"
            onClick={() => navigate("/invitations-digital")}
            className="mt-5 inline-flex h-[44px] items-center justify-center gap-2 rounded-full border border-[#A97C72] px-6 font-urbanist text-[14px] font-bold leading-none text-[#A97C72] transition-colors hover:bg-[#A97C72] hover:text-white lg:mt-6"
          >
            Créer mon invitation
            <span aria-hidden className="text-[16px] leading-none">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default BestsellersSection;
