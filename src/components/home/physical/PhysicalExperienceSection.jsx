import React from "react";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

const cards = [
  {
    title: "Papiers raffinés",
    text: "Des papiers choisis pour leur qualité et leur élégance.",
    img: a.expPapiers,
  },
  {
    title: "Finitions soignées",
    text: "Des détails travaillés avec soin pour une invitation unique.",
    img: a.expFinitions,
  },
];

/** L’expérience — Figma exact 280×408 */
function PhysicalExperienceSection() {
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
          {cards.map((c) => (
            <article
              key={c.title}
              className="relative h-[408px] w-[280px] shrink-0 overflow-hidden rounded-[5px] lg:h-[480px] lg:w-auto lg:max-w-none"
            >
              <img src={c.img} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 lg:hover:scale-[1.03]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pb-5 text-white lg:p-8">
                <h3 className="lw-h2 leading-7 lg:text-[28px]">{c.title}</h3>
                <p className="mt-1 max-w-[188px] font-urbanist text-[14px] leading-5 lg:max-w-[280px] lg:text-[16px]">
                  {c.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PhysicalExperienceSection;
