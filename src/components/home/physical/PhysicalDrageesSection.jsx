import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

/** Dragées — parity Save The Dates (scroll + barre, sans prix / voir) */
function PhysicalDrageesSection() {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  const [progress, setProgress] = useState({ left: 0, width: 0.32 });

  const items = [
    { title: "Sidi Bou Said", image: a.drageeSidi },
    { title: "La Dolce Vita", image: a.drageeDolce, isNew: true },
  ];

  const updateProgress = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) {
      setProgress({ left: 0, width: 1 });
      return;
    }
    const ratio = el.clientWidth / el.scrollWidth;
    const thumb = Math.max(0.28, Math.min(0.4, ratio));
    const left = (el.scrollLeft / max) * (1 - thumb);
    setProgress({ left, width: thumb });
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
    <section className="bg-white px-0 py-10 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <div className="mx-auto flex w-[399px] max-w-[calc(100%-16px)] flex-col items-center gap-2.5 text-center lg:w-full lg:max-w-2xl lg:gap-3">
          <h2 className="font-lora text-[30px] font-semibold leading-[34px] text-lw-text lg:text-[40px] lg:leading-tight">
            Dragées
          </h2>
          <p className="font-glacial text-[18px] font-medium leading-6 text-lw-muted lg:text-[20px] lg:leading-7">
            Des créations personnalisées pour
            <br className="lg:hidden" />
            <span className="hidden lg:inline"> </span>
            accompagner votre grand jour.
          </p>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex gap-[30px] overflow-x-auto hide-scrollbar px-4 pb-1 lg:mt-14 lg:grid lg:grid-cols-2 lg:justify-items-center lg:gap-10 lg:overflow-visible lg:px-0"
        >
          {items.map((item) => (
            <article key={item.title} className="w-[280px] shrink-0 lg:w-[320px]">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => navigate("/invitations-physique")}
              >
                <div className="relative h-[310px] w-[280px] shrink-0 overflow-hidden rounded-[5px] lg:h-[354px] lg:w-[320px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={280}
                    height={310}
                    className="h-full w-full object-cover"
                  />
                  {item.isNew ? (
                    <span className="absolute right-0 top-0 flex h-[30px] w-[70px] items-center justify-center rounded-bl-[5px] bg-lw-sage font-glacial text-[11px] font-bold uppercase text-white lg:h-[34px] lg:w-[80px] lg:text-[12px]">
                      NEW
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-5 lw-h3 leading-6 lg:mt-6 lg:text-[28px]">{item.title}</h3>
                <p className="mt-1 lw-caption leading-5 lg:mt-2 lg:text-[15px] lg:leading-6">
                  Boîte personnalisée · finition soignée
                </p>
              </button>
            </article>
          ))}
        </div>

        <div
          className="relative mx-auto my-[50px] h-[2px] w-[calc(100%-32px)] max-w-[360px] bg-[#D9D2CB] lg:hidden"
          aria-hidden
        >
          <div
            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#4B4242] transition-[left,width] duration-150 ease-out"
            style={{
              width: `${progress.width * 100}%`,
              left: `${progress.left * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default PhysicalDrageesSection;
