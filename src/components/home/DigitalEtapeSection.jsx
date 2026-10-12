import React, { useState } from "react";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/** Visuels Figma « STEP DIGITAL 1/2/3 » (dossier hero invi) */
const STEPS = [
  {
    title: (
      <>
        Etape 1:
        <br />
        Choisissez votre invitation
      </>
    ),
    text: (
      <>
        Parcourez nos créations, choisissez votre
        <br />
        thème, votre design et les sections qui
        <br />
        vous plaisent.
      </>
    ),
    image: a.stepDigital1,
  },
  {
    title: (
      <>
        Etape 2:
        <br />
        Ajoutez vos détails
      </>
    ),
    text: (
      <>
        Remplissez notre petit formulaire avec les
        <br />
        détails de votre mariage, et laissez-nous
        <br />
        donner vie à votre invitation.
      </>
    ),
    image: a.stepDigital2,
  },
  {
    title: (
      <>
        Etape 3:
        <br />
        Recevez votre invitation
      </>
    ),
    text: (
      <>
        Votre invitation personnalisée est
        <br />
        préparée avec soin et vous est envoyée
        <br />
        sous 7 jours.
      </>
    ),
    image: a.stepDigital3,
  },
];

const glassStyle = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.25) 100%)",
};

function StepCard({ step, compact = false, dots = null }) {
  return (
    <div
      className={
        compact
          ? "relative h-[420px] w-[280px] shrink-0 overflow-hidden bg-[#F7F2EC]"
          : "relative h-full w-full overflow-hidden bg-[#F7F2EC]"
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <img
          src={step.image}
          alt=""
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[1]">
        <div
          className={
            compact
              ? "flex h-[140px] w-full flex-col items-center justify-center rounded-[5px] px-4 py-3 backdrop-blur-[4px]"
              : "mx-auto flex h-[198px] w-full max-w-[426px] flex-col items-center justify-center rounded-[5px] px-6 py-5 backdrop-blur-[4px]"
          }
          style={glassStyle}
        >
          <div
            className={
              compact
                ? "w-full text-left"
                : "mx-auto w-full max-w-[287px] text-left"
            }
          >
            <h2
              className={
                compact
                  ? "font-abhaya text-[15px] font-medium leading-[18px] text-[#332B29]"
                  : "font-abhaya text-[20px] font-medium leading-6 text-[#332B29]"
              }
            >
              {step.title}
            </h2>
            <p
              className={
                compact
                  ? "mt-1 font-urbanist text-[11px] font-normal leading-[14px] text-[#6F6760]"
                  : "mt-0 font-urbanist text-[15px] font-normal leading-5 text-[#6F6760]"
              }
            >
              {step.text}
            </p>
          </div>
          {dots}
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile : carousel 428×615 — Desktop : 3 étapes côte à côte, plus petites
 */
function DigitalEtapeSection() {
  const [step, setStep] = useState(0);

  return (
    <section className="bg-[#F7F2EC]">
      {/* Mobile — une étape */}
      <div className="relative mx-auto h-[615px] w-full max-w-[428px] overflow-hidden lg:hidden">
        <StepCard
          step={STEPS[step]}
          dots={
            <div className="mt-6 flex w-full items-center justify-center gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Étape ${i + 1}`}
                  aria-current={i === step ? "true" : undefined}
                  onClick={() => setStep(i)}
                  className={
                    i === step
                      ? "h-[6px] w-[18px] rounded-full bg-lw-text transition-all"
                      : "h-[6px] w-[6px] rounded-full bg-[#C9BDB3] transition-all"
                  }
                />
              ))}
            </div>
          }
        />
      </div>

      {/* Desktop — 3 étapes côte à côte */}
      <div className="mx-auto hidden max-w-6xl items-stretch justify-center gap-6 px-8 py-16 lg:flex xl:gap-8 xl:py-20">
        {STEPS.map((s, i) => (
          <StepCard key={i} step={s} compact />
        ))}
      </div>
    </section>
  );
}

export default DigitalEtapeSection;
