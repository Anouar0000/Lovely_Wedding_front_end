import React, { useCallback, useEffect, useRef, useState } from "react";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

const CARDS = [
  { title: "Enveloppe animée", image: a.webCard1 },
  { title: "Thèmes exclusifs", image: a.webCard2 },
  { title: "Accompagnement", image: a.webCard3 },
  { title: "Espace Client", image: a.webCard4 },
];

/** L'expérience — mobile scroll · desktop grille 4 cols */
function ExperienceSection() {
  const scrollerRef = useRef(null);
  /** Figma mini-bar : 93×1.5 sur piste 396 (même Save The Dates) */
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
              className="relative h-[408px] w-[280px] shrink-0 overflow-hidden rounded-[5px] lg:h-auto lg:w-auto lg:aspect-[280/408]"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover transition-transform duration-500 lg:hover:scale-[1.03]"
                draggable={false}
              />
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

export default ExperienceSection;
