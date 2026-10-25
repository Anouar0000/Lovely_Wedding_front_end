import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/** Save The Dates — mobile scroll · desktop grille 2 cols */
function SaveTheDatesSection() {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  /** Figma mini-bar : 93×1.5 sur piste 396 */
  const THUMB_W = 93;
  const TRACK_W = 396;
  const [thumbLeft, setThumbLeft] = useState(0);

  const items = [
    {
      title: "Sidi Bou Said",
      image: a.std1,
      to: "/digital-invitation/sidi-bousaid",
      price: "25$",
    },
    {
      title: "La Dolce Vita",
      image: a.std2,
      to: "/digital-invitation/dolce-vita",
      isNew: true,
      price: "25$",
    },
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

  return (
    <section id="save-the-dates" className="scroll-mt-24 bg-white px-0 pt-10 pb-[92px] lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <div className="mx-auto flex w-[399px] max-w-[calc(100%-16px)] flex-col items-center gap-2.5 text-center lg:w-full lg:max-w-2xl lg:gap-3">
          <h1 className="font-lora text-[30px] font-medium leading-[34px] text-lw-text lg:text-[40px] lg:leading-tight">
            Save The Dates
          </h1>
          <p className="font-glacial text-[18px] font-normal leading-6 text-lw-muted lg:text-[20px] lg:leading-7">
            Une vidéo élégante pour
            <br className="lg:hidden" />
            <span className="hidden lg:inline"> </span>
            annoncer votre grand jour.
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
                onClick={() => navigate(item.to)}
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
                <div className="mt-[10px] flex flex-col">
                  <h3 className="font-lora text-[18px] font-normal leading-[34px] tracking-[-1px] text-lw-text">
                    {item.title}
                  </h3>
                  <p className="mt-[2px] font-glacial text-[12px] font-normal leading-[18px] text-lw-muted lg:text-[15px] lg:leading-6">
                    Includes music, animations
                    <br />
                    & guestbook
                  </p>
                  <p className="mt-[2px] font-glacial text-[14px] font-bold leading-5 text-lw-text lg:text-[15px]">
                    {item.price}
                  </p>
                </div>
              </button>
            </article>
          ))}
        </div>

        <div
          className="relative mx-auto mt-[32px] h-[0.5px] w-[396px] max-w-[calc(100%-32px)] bg-[#D9D2CB] lg:hidden"
          aria-hidden
        >
          <div
            className="absolute top-1/2 h-[1.5px] w-[93px] -translate-y-1/2 rounded-full bg-[#4B4242] transition-[left] duration-150 ease-out"
            style={{ left: `${thumbLeft}px` }}
          />
        </div>
      </div>
    </section>
  );
}

export default SaveTheDatesSection;
