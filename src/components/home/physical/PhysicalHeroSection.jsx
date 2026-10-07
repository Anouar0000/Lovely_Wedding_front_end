import React from "react";
import { useNavigate } from "react-router-dom";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

/** Hero Figma Main Physical — titre → image → CTA (mobile) · desktop split */
function PhysicalHeroSection() {
  const navigate = useNavigate();

  return (
    <section className="overflow-x-hidden bg-[#f4f4f4] pb-8 pt-2 lg:pb-20 lg:pt-10">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:text-left">
          <div className="w-full">
            <h1 className="lw-hero lg:text-[52px] lg:leading-[1.15]">
              Pour tous les moments
              <br />
              qui comptent
            </h1>
            <p className="mx-auto mt-[18px] max-w-[338px] lw-sub leading-[30px] lg:mx-0 lg:mt-5 lg:max-w-[440px] lg:text-[20px] lg:leading-7">
              Votre invitation de mariage, à imprimer ou à partager.
            </p>
            <button
              type="button"
              onClick={() => navigate("/invitations-physique")}
              className="mt-10 hidden h-[42px] w-[163px] items-center justify-center gap-2 rounded-[5px] bg-white font-urbanist text-[14px] font-bold uppercase tracking-wide text-lw-accent shadow-sm ring-1 ring-lw-line hover:ring-lw-accent lg:inline-flex"
            >
              découvrir
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="relative mt-6 flex h-[377px] w-[115%] max-w-none items-center justify-center overflow-hidden lg:mt-0 lg:h-auto lg:w-full lg:overflow-visible">
            <img
              src={a.heroVisual}
              alt="Invitation imprimée Lovely"
              className="h-[377px] w-[494px] max-w-none object-contain lg:h-auto lg:w-full lg:max-w-[560px]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center lg:hidden">
          <button
            type="button"
            onClick={() => navigate("/invitations-physique")}
            className="inline-flex h-[42px] w-[163px] items-center justify-center gap-2 rounded-[5px] bg-white font-urbanist text-[14px] font-bold uppercase tracking-wide text-lw-accent shadow-sm ring-1 ring-lw-line"
          >
            découvrir
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhysicalHeroSection;
