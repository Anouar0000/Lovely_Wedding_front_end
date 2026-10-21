import React, { useState } from "react";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/**
 * Bloc Figma sous Bestsellers / avant Invitations Web.
 * Group 65 / 63 / 64 — visuels complets (titre + texte inclus).
 */
const STEPS = [
  { alt: "Étape 1 : Choisissez votre invitation", image: `${a.stepDigital1}?v=group65` },
  { alt: "Étape 2 : Remplissez le formulaire", image: `${a.stepDigital2}?v=group63` },
  { alt: "Étape 3 : Recevez votre invitation", image: `${a.stepDigital3}?v=group64` },
];

function StepCard({ step, compact = false, dots = null }) {
  return (
    <div
      className={
        compact
          ? "relative w-[280px] shrink-0 overflow-hidden bg-[#F7F2EC]"
          : "relative w-full overflow-hidden bg-[#F7F2EC]"
      }
    >
      <img
        src={step.image}
        alt={step.alt}
        className={
          compact
            ? "block h-[420px] w-full object-contain object-top"
            : "block h-auto w-full object-contain object-top"
        }
        draggable={false}
      />
      {dots ? (
        <div className="absolute inset-x-0 bottom-4 z-[1] flex justify-center gap-1.5">{dots}</div>
      ) : null}
    </div>
  );
}

function DigitalEtapeSection() {
  const [step, setStep] = useState(0);

  return (
    <section id="livraison" className="scroll-mt-24 bg-[#F7F2EC]">
      {/* Mobile — carousel juste sous Delicate Beige */}
      <div className="relative mx-auto w-full max-w-[428px] lg:hidden">
        <StepCard
          step={STEPS[step]}
          dots={STEPS.map((_, i) => (
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
        />
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden max-w-6xl items-start justify-center gap-6 px-8 py-16 lg:flex xl:gap-8 xl:py-20">
        {STEPS.map((s, i) => (
          <StepCard key={i} step={s} compact />
        ))}
      </div>
    </section>
  );
}

export default DigitalEtapeSection;
