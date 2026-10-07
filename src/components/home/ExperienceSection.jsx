import React from "react";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/** L'expérience — Figma exact 280×408 */
function ExperienceSection() {
  return (
    <section className="bg-[#f4f4f4] px-0 py-10 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <h2 className="px-4 text-center lw-h1 lg:text-[40px]">
          L&apos;expérience
        </h2>
        <p className="mx-auto mt-3 max-w-[241px] px-4 text-center lw-sub lg:max-w-xl lg:text-[18px]">
          Découvrez tout ce qui rend votre invitation unique.
        </p>

        <div className="mt-8 flex gap-[30px] overflow-x-auto hide-scrollbar px-4 pb-1 lg:mt-14 lg:grid lg:grid-cols-2 lg:gap-10 lg:overflow-visible lg:px-0">
          <article className="relative h-[408px] w-[280px] shrink-0 overflow-hidden rounded-[5px] lg:h-[480px] lg:w-auto lg:max-w-none">
            <img src={a.webCard1} alt="" className="h-full w-full object-cover transition-transform duration-500 lg:hover:scale-[1.03]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pb-5 text-white lg:p-8">
              <h3 className="lw-h2 leading-7 lg:text-[32px]">Enveloppe animée</h3>
              <p className="mt-1 max-w-[228px] font-urbanist text-[14px] leading-5 lg:max-w-[320px] lg:text-[16px]">
                Une ouverture animée pour créer une première impression mémorable.
              </p>
            </div>
          </article>
          <article className="relative h-[408px] w-[280px] shrink-0 overflow-hidden rounded-[5px] lg:h-[480px] lg:w-auto lg:max-w-none">
            <img src={a.webCard2} alt="" className="h-full w-full object-cover transition-transform duration-500 lg:hover:scale-[1.03]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pb-5 text-white lg:p-8">
              <h3 className="lw-h2 leading-7 lg:text-[32px]">Thèmes exclusifs</h3>
              <p className="mt-1 max-w-[176px] font-urbanist text-[14px] leading-5 lg:max-w-[280px] lg:text-[16px]">
                Choisissez le thème qui vous ressemble.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
