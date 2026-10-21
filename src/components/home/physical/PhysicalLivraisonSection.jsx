import React, { useState } from "react";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

/**
 * Étapes home imprimée — ordre 1→2→3 : Group 63 phy / 64phy / 65 phy.
 */
const STEPS = [
  { alt: "Étape 1 : Choisissez votre invitation", image: `${a.stepPhy1}?v=order123` },
  { alt: "Étape 2 : Personnalisez votre invitation", image: `${a.stepPhy2}?v=order123` },
  { alt: "Étape 3 : Recevez vos invitations", image: `${a.stepPhy3}?v=order123` },
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

function PhysicalLivraisonSection() {
  const [step, setStep] = useState(0);

  return (
    <section id="livraison" className="scroll-mt-24 bg-[#F7F2EC]">
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

      <div className="mx-auto hidden max-w-6xl items-start justify-center gap-6 px-8 py-16 lg:flex xl:gap-8 xl:py-20">
        {STEPS.map((s, i) => (
          <StepCard key={i} step={s} compact />
        ))}
      </div>
    </section>
  );
}

export default PhysicalLivraisonSection;
