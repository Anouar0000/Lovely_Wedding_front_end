import React from "react";

/** Lettres d’amour — Figma 1229:713 (fond) + 1695:761 (contenu) */
function ArrowIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0">
      <path
        d="M3.75 9H14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3.75L14.25 9L9 14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const reviews = [
  {
    name: "Lilia & Rayen",
    meta: "Achat vérifié • Formule Signature",
    text: "“Très professionnel ! Les invités ont particulièrement apprécié les invitations bilingues (français/arabe). On recommande à 100%.”",
    date: "Posté le 12 Septembre 2026",
  },
  {
    name: "Lilia & Rayen",
    meta: "Achat vérifié • Formule Signature",
    text: "“Très professionnel ! Les invités ont particulièrement apprécié les invitations bilingues (français/arabe). On recommande à 100%.”",
    date: "Posté le 12 Septembre 2026",
  },
  {
    name: "Lilia & Rayen",
    meta: "Achat vérifié • Formule Signature",
    text: "“Très professionnel ! Les invités ont particulièrement apprécié les invitations bilingues (français/arabe). On recommande à 100%.”",
    date: "Posté le 12 Septembre 2026",
  },
];

function Stars({ size = "sm", className = "", label }) {
  const textSize = size === "lg" ? "text-[14px]" : "text-[12px]";
  return (
    <span
      className={`inline-flex gap-0.5 leading-none text-[#ffd220] ${textSize} ${className}`}
      aria-label={label}
      aria-hidden={!label}
    >
      {"★★★★★".split("").map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </span>
  );
}

function ReviewsSection() {
  return (
    <section id="our-story" className="scroll-mt-24 bg-[#f7f2ec] px-4 pt-12 pb-6 lg:px-8 lg:pt-20 lg:pb-10">
      <div className="mx-auto w-full max-w-[399px] lg:max-w-xl">
        <h2 className="text-center font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-lw-text lg:text-[40px] lg:leading-tight">
          Lettres d&apos;amour
        </h2>
        <p className="mx-auto mt-2 max-w-[241px] text-center font-glacial text-[18px] font-normal leading-6 text-lw-muted">
          Découvrez les avis de nos mariés.
        </p>

        {/* Score card */}
        <div className="mt-8 rounded-3xl border border-lw-accent bg-white px-5 py-5 lg:mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-lora text-[40px] font-medium leading-9 tracking-[-0.4px] text-lw-text">
              4.7
            </p>
            <Stars size="lg" label="4.7 sur 5" />
          </div>
          <p className="mt-2 font-glacial text-[14px] font-normal leading-[18px] text-lw-text">
            Plus de 250 couples satisfaits
          </p>
          <p className="mt-1 font-glacial text-[12px] font-normal leading-6 text-lw-muted">
            95% de recommandations positives
          </p>
        </div>

        {/* Review cards */}
        <div className="mt-4 flex flex-col gap-4 lg:mt-5 lg:gap-5">
          {reviews.map((r, i) => (
            <article
              key={`${r.name}-${i}`}
              className="rounded-3xl border border-lw-accent bg-white px-5 py-5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-lw-text">
                  {r.name}
                </p>
                <Stars className="mt-2 shrink-0" />
              </div>
              <p className="font-glacial text-[14px] font-normal leading-[18px] text-lw-muted">
                {r.meta}
              </p>
              <p className="mt-3 font-glacial text-[14px] font-normal leading-[18px] text-[#1c1917]">
                {r.text}
              </p>
              <p className="mt-4 font-glacial text-[12px] font-normal leading-6 text-[#a89f91]">
                {r.date}
              </p>
            </article>
          ))}
        </div>

        <a
          href="#our-story"
          className="mx-auto mt-8 flex h-12 w-fit items-center gap-2.5 px-1 font-glacial text-[14px] font-bold leading-6 text-[#a97c72]"
        >
          Lire tous les avis
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

export default ReviewsSection;
