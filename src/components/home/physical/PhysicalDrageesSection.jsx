import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useHorizontalWheelScroll from "../../../hooks/useHorizontalWheelScroll";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

/** Dragées — parity Save The Dates (scroll + barre Figma + prix) */
function PhysicalDrageesSection() {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  /** Figma mini-bar : 93×1.5 sur piste 396 */
  const THUMB_W = 93;
  const TRACK_W = 396;
  const [thumbLeft, setThumbLeft] = useState(0);

  const items = [
    { title: "Sidi Bou Said", image: a.drageeSidi, price: "Start at 49$" },
    { title: "La Dolce Vita", image: a.drageeDolce, isNew: true, price: "Start at 49$" },
  ];

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
    <section id="dragees" className="scroll-mt-24 bg-white px-0 pt-[60px] pb-[92px] lg:px-8 lg:pb-24 lg:pt-[60px]">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <div className="mx-auto flex w-[399px] max-w-[calc(100%-16px)] flex-col items-center gap-2.5 text-center lg:w-full lg:max-w-2xl lg:gap-3">
          <h2 className="font-lora text-[26px] font-medium leading-[36px] tracking-[-1px] text-lw-text lg:text-[40px] lg:leading-tight">
            Dragées
          </h2>
          <p className="font-glacial text-[18px] font-normal leading-6 text-lw-muted lg:text-[20px] lg:leading-7">
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
            <article key={item.title} className="lw-product-card w-[280px] shrink-0 p-1 lg:w-[320px]">
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
                <div className="mt-[9px] flex flex-col gap-[2px]">
                  <h3 className="font-lora text-[18px] font-normal leading-[34px] tracking-[-1px] text-[#4B4242]">
                    {item.title}
                  </h3>
                  <p className="font-glacial text-[14px] font-normal leading-[18px] tracking-normal text-[#78716c]">
                    Boîte personnalisée · finition soignée
                  </p>
                  <p className="font-glacial text-[14px] font-bold leading-[24px] text-lw-text">
                    {item.price}
                  </p>
                </div>
              </button>
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

export default PhysicalDrageesSection;
