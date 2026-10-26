import React, { useCallback, useEffect, useRef, useState } from "react";
import useHorizontalWheelScroll from "../../../hooks/useHorizontalWheelScroll";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

/** Cartes expérience — texte en overlay (assets sans copy Figma intégrée) */
const CARDS = [
  {
    title: "Papiers raffinés",
    text: "Des papiers choisis pour leur qualité et leur élégance.",
    image: a.expCard1,
  },
  {
    title: "Finitions soignées",
    text: "Des détails travaillés avec soin pour une invitation unique.",
    image: a.expCard2,
  },
  {
    title: "Sceaux & rubans",
    text: "Des embellissements artisanaux pour un rendu d’exception.",
    image: a.expCard3,
  },
  {
    title: "Formats uniques",
    text: "Cartes, parchemins et créations sur-mesure pour votre jour.",
    image: a.expCard4,
  },
];

/** L'expérience — mobile scroll · desktop grille 4 cols (parity Digitale) */
function PhysicalExperienceSection() {
  const scrollerRef = useRef(null);
  /** Figma mini-bar : 93×1.5 sur piste 396 (même Digitale) */
  const THUMB_W = 93;
  const TRACK_W = 396;
  const [thumbLeft, setThumbLeft] = useState(0);

  const updateProgress = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) {
      setThumbLeft(0);
      return;
    }
    const travel = TRACK_W - THUMB_W;
    setThumbLeft((el.scrollLeft / max) * travel);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  useHorizontalWheelScroll(scrollerRef);

  return (
    <section
      id="experience"
      className="scroll-mt-24 bg-[#F7F2EC] px-0 pt-8 pb-[92px] lg:px-8 lg:pb-24 lg:pt-16"
    >
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <div className="mx-auto flex w-[399px] max-w-[calc(100%-16px)] flex-col items-center gap-3 text-center lg:w-full lg:max-w-2xl">
          <h2 className="mt-[5px] font-lora text-[30px] font-medium leading-[34px] text-lw-text lg:text-[40px] lg:leading-tight">
            L&apos;expérience
          </h2>
          <p className="font-glacial text-[18px] font-normal leading-6 text-lw-muted lg:text-[20px] lg:leading-7">
            Découvrez tout ce qui rend
            <br className="lg:hidden" />
            <span className="hidden lg:inline"> </span>
            votre invitation unique.
          </p>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex gap-[30px] overflow-x-auto hide-scrollbar px-4 pb-1 lg:mt-14 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0"
        >
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="relative h-[408px] w-[280px] shrink-0 overflow-hidden rounded-[5px] lg:h-auto lg:min-w-0 lg:w-auto lg:aspect-[280/408]"
            >
              <img
                src={card.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 lg:hover:scale-[1.03]"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-5 pt-16">
                <h3 className="font-lora text-[22px] font-medium leading-7 text-white drop-shadow-sm">
                  {card.title}
                </h3>
                <p className="mt-1 max-w-[220px] font-glacial text-[14px] font-normal leading-5 text-white/95 drop-shadow-sm">
                  {card.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div
          className="relative mx-auto mt-[32px] h-px w-[396px] max-w-[calc(100%-32px)] bg-[#C4BBB3] lg:hidden"
          aria-hidden
        >
          <div
            className="absolute top-1/2 h-0.5 w-[93px] -translate-y-1/2 rounded-full bg-[#4B4242] transition-[left] duration-150 ease-out"
            style={{ left: `${thumbLeft}px` }}
          />
        </div>
      </div>
    </section>
  );
}

export default PhysicalExperienceSection;
