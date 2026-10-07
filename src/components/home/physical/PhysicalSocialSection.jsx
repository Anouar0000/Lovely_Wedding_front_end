import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CommunityVideoCard from "../CommunityVideoCard";
import {
  communitySlides as slides,
  COMMUNITY_CARD_W as CARD_W,
  COMMUNITY_CARD_H as CARD_H,
} from "../communitySlides";
import { useCommunityCarousel } from "../useCommunityCarousel";

const DESKTOP_VISIBLE = 3;

/** Communauté physique — même layout desktop / mobile */
function PhysicalSocialSection() {
  const { scrollerRef, index, activeId, go, setActiveId } = useCommunityCarousel(slides);
  const [deskStart, setDeskStart] = useState(0);
  const [deskActive, setDeskActive] = useState(slides[0].id);

  const maxStart = Math.max(0, slides.length - DESKTOP_VISIBLE);
  const deskSlides = slides.slice(deskStart, deskStart + DESKTOP_VISIBLE);

  const deskGo = (dir) => {
    setDeskStart((s) => Math.min(maxStart, Math.max(0, s + dir)));
  };

  useEffect(() => {
    const mid = deskSlides[Math.min(1, deskSlides.length - 1)];
    if (mid) setDeskActive(mid.id);
  }, [deskStart]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="overflow-x-hidden bg-white py-10 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <h2 className="px-4 text-center lw-h1 lg:text-[40px]">Communauté</h2>
        <p className="mx-auto mt-2 max-w-[241px] px-4 text-center lw-sub lg:mt-3 lg:max-w-none lg:text-[18px]">
          Ecoutez leurs avis
        </p>

        <div className="relative mt-14 hidden lg:block">
          <div className="flex items-end justify-center gap-8 px-14">
            {deskSlides.map((s) => (
              <figure key={s.id} className="w-[280px] shrink-0 text-center">
                <CommunityVideoCard
                  slide={s}
                  active={deskActive === s.id}
                  onActivate={setDeskActive}
                  className="mx-auto"
                  style={{ width: 280, height: Math.round((280 * CARD_H) / CARD_W) }}
                />
                <figcaption className="mt-3 font-urbanist text-sm font-medium text-lw-text">
                  {s.handle}
                </figcaption>
              </figure>
            ))}
          </div>

          <button
            type="button"
            aria-label="Précédent"
            disabled={deskStart === 0}
            onClick={() => deskGo(-1)}
            className="absolute left-2 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lw-text shadow disabled:opacity-30"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          <button
            type="button"
            aria-label="Suivant"
            disabled={deskStart >= maxStart}
            onClick={() => deskGo(1)}
            className="absolute right-2 top-[42%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lw-text shadow disabled:opacity-30"
          >
            <FiChevronRight className="text-lg" />
          </button>

          <div className="mt-8 flex justify-center gap-1.5">
            {Array.from({ length: maxStart + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Page ${i + 1}`}
                onClick={() => setDeskStart(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === deskStart ? "w-4 bg-lw-accent" : "w-1.5 bg-lw-line"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-8 lg:hidden">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto hide-scrollbar scroll-smooth px-[calc((100%-min(78vw,305px))/2)] pb-1"
          >
            {slides.map((s) => (
              <figure
                key={s.id}
                className="w-[min(78vw,305px)] shrink-0 snap-center text-center"
              >
                <CommunityVideoCard
                  slide={s}
                  active={activeId === s.id}
                  onActivate={setActiveId}
                  className="mx-auto aspect-[305/486] w-full shadow-md"
                />
                <figcaption className="mt-3 font-urbanist text-[14px] font-medium text-lw-text">
                  {s.handle}
                </figcaption>
              </figure>
            ))}
          </div>

          <button
            type="button"
            aria-label="Précédent"
            onClick={() => go(-1)}
            className="absolute left-2 top-[42%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lw-text shadow"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <button
            type="button"
            aria-label="Suivant"
            onClick={() => go(1)}
            className="absolute right-2 top-[42%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lw-text shadow"
          >
            <FiChevronRight className="text-base" />
          </button>

          <div className="mt-4 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-4 bg-lw-accent" : "w-1.5 bg-lw-line"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhysicalSocialSection;
