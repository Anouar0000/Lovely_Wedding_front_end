import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

const STEPS = [
  {
    title: (
      <>
        Etape 1:
        <br />
        Choisissez votre invitation
      </>
    ),
    text: "Parcourez nos créations, choisissez votre thème, votre design et les sections qui vous plaisent.",
    images: [a.etapePhone1, a.etapePhone2, a.etapePhone3, a.etapePhone4],
  },
  {
    title: (
      <>
        Etape 2:
        <br />
        Personnalisez les détails
      </>
    ),
    text: "Ajoutez vos textes, photos, programme et informations pratiques pour vos invités.",
    images: [a.etapePhone2, a.etapePhone3, a.etapePhone4, a.etapePhone1],
  },
  {
    title: (
      <>
        Etape 3:
        <br />
        Partagez le lien
      </>
    ),
    text: "Publiez votre invitation et envoyez le lien à vos proches. Suivez les RSVP en un clin d’œil.",
    images: [a.etapePhone3, a.etapePhone4, a.etapePhone1, a.etapePhone2],
  },
];

/** Étape — Figma carte 396×169 · desktop 2 colonnes + navigation */
function DigitalEtapeSection() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const go = (dir) => {
    setStep((s) => (s + dir + STEPS.length) % STEPS.length);
  };

  return (
    <section className="bg-[#fffaed] px-4 py-10 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative mx-auto grid h-[300px] w-full max-w-[396px] grid-cols-2 gap-3 overflow-hidden lg:h-[420px] lg:max-w-lg lg:gap-5">
          {current.images.map((src, i) => (
            <img
              key={`${step}-${i}`}
              src={src}
              alt=""
              className={`h-[160px] w-full -rotate-[12deg] rounded-[12px] object-cover shadow-md lg:h-[200px] ${
                i % 2 === 1 ? (i === 1 ? "mt-8" : "mt-4") : i === 2 ? "-mt-2" : ""
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto -mt-6 w-full max-w-[396px] rounded-[5px] bg-white px-8 py-5 text-left shadow-sm sm:px-14 lg:mt-0 lg:max-w-none lg:px-10 lg:py-10">
          <h2 className="lw-h2 leading-7 text-lw-text lg:text-[36px] lg:leading-tight">
            {current.title}
          </h2>
          <p className="mt-2 max-w-[260px] font-urbanist text-[14px] leading-5 text-lw-muted lg:mt-5 lg:max-w-md lg:text-[16px] lg:leading-6">
            {current.text}
          </p>

          <div className="mt-4 flex items-center justify-between lg:mt-8 lg:max-w-xs">
            <button
              type="button"
              aria-label="Précédent"
              onClick={() => go(-1)}
              className="flex h-[26px] w-[26px] items-center justify-center text-lw-text hover:text-lw-accent"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <p className="font-urbanist text-[12px] text-lw-muted">
              {step + 1} / {STEPS.length}
            </p>
            <button
              type="button"
              aria-label="Suivant"
              onClick={() => go(1)}
              className="flex h-[26px] w-[26px] items-center justify-center text-lw-text hover:text-lw-accent"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DigitalEtapeSection;
