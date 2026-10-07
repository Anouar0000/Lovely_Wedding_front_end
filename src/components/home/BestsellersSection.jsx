import React from "react";
import { useNavigate } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/** Best-sellers — Figma : centre plus haut, côtés plus bas, espace entre eux */
function BestsellersSection() {
  const navigate = useNavigate();

  return (
    <section className="overflow-x-hidden bg-white py-10 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <h2 className="px-4 text-center lw-h1 lg:text-[40px] lg:leading-tight">
          Les best-sellers
        </h2>
        <p className="mx-auto mt-2 max-w-[357px] px-4 text-center lw-sub lg:mt-3 lg:max-w-xl lg:text-[18px]">
          Les créations que vous avez le plus aimées.
        </p>

        <div className="mt-[35px] lg:mt-14 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
          <div className="relative mx-auto flex h-[410px] w-full items-end justify-center overflow-hidden lg:h-auto lg:overflow-visible">
            <div className="flex items-end justify-center gap-3 lg:gap-5">
              <img
                src={a.bestsellerLeft}
                alt=""
                className="h-[320px] w-[200px] shrink-0 rounded-[5px] object-cover opacity-90 lg:h-[380px] lg:w-[220px]"
              />
              <img
                src={a.bestsellerCenter}
                alt="Best-seller Delicate Beige"
                className="relative z-10 h-[410px] w-[256px] shrink-0 rounded-[5px] object-cover shadow-md lg:h-[480px] lg:w-[280px]"
              />
              <img
                src={a.bestsellerRight}
                alt=""
                className="h-[320px] w-[200px] shrink-0 rounded-[5px] object-cover opacity-90 lg:h-[380px] lg:w-[220px]"
              />
            </div>
          </div>

          <div className="mt-5 px-4 text-center lg:mt-0 lg:px-0 lg:text-left">
            <h3 className="lw-feature lg:text-[40px]">Delicate Beige</h3>
            <p className="mx-auto mt-[10px] max-w-[261px] font-urbanist text-[14px] leading-[25px] text-lw-muted lg:mx-0 lg:mt-4 lg:max-w-md lg:text-base lg:leading-7">
              Classic stationery-inspired designs and Elevate your event with curated envelopes,
              liners, and stamps
            </p>
            <button
              type="button"
              onClick={() => navigate("/invitations-digital")}
              className="mt-6 inline-flex h-[42px] w-[163px] items-center justify-center rounded-[5px] bg-lw-accent font-urbanist text-[14px] font-bold uppercase text-white hover:bg-lw-accentDark lg:mt-8"
            >
              crée maintenant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestsellersSection;
