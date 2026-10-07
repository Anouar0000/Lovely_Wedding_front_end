import React from "react";

/** Lettres d’amour — Figma 1229:714 / 1247:2121 */
const reviews = [
  {
    name: "Asma",
    date: "23 / 11 / 2025",
    title: "Travail minutieux",
    text: "Merci énormément wallah yaatikom alf sa7a pour votre professionnalisme , j’ai trop adoré le travail minutieux",
  },
  {
    name: "Asma",
    date: "23 / 11 / 2025",
    title: "Travail minutieux",
    text: "Merci énormément wallah yaatikom alf sa7a pour votre professionnalisme , j’ai trop adoré le travail minutieux",
  },
  {
    name: "Asma",
    date: "23 / 11 / 2025",
    title: "Travail minutieux",
    text: "Merci énormément wallah yaatikom alf sa7a pour votre professionnalisme , j’ai trop adoré le travail minutieux",
  },
  {
    name: "Asma",
    date: "23 / 11 / 2025",
    title: "Travail minutieux",
    text: "Merci énormément wallah yaatikom alf sa7a pour votre professionnalisme , j’ai trop adoré le travail minutieux",
  },
];

function ReviewsSection() {
  return (
    <section className="bg-[#f4f4f4] px-4 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-3xl lg:max-w-4xl">
        <h2 className="text-center lw-h1 lg:text-[40px]">
          Lettres d&apos;amour
        </h2>
        <p className="mx-auto mt-3 max-w-[241px] text-center lw-sub lg:max-w-xl lg:text-[18px]">
          Découvrez les avis de nos mariés.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 lg:mt-10">
          <p className="font-urbanist text-[14px] font-bold text-lw-text lg:text-[16px]">4.7</p>
          <div className="flex gap-1 text-lw-accent" aria-label="4.7 sur 5">
            {"★★★★★".split("").map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <p className="font-urbanist text-[14px] font-bold capitalize text-lw-text lg:text-[16px]">
            Basée sur 142 Avis
          </p>
        </div>

        <div className="mt-6 divide-y divide-lw-line border-y border-lw-line lg:mt-8">
          {reviews.map((r, i) => (
            <article key={`${r.name}-${i}`} className="py-5 lg:py-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <p className="lw-h3">{r.name}</p>
                  <p className="lw-caption">{r.date}</p>
                </div>
                <div className="flex gap-0.5 text-sm text-lw-accent" aria-label="5 étoiles">
                  {"★★★★★".split("").map((s, j) => (
                    <span key={j}>{s}</span>
                  ))}
                </div>
              </div>
              <h3 className="mt-3 font-urbanist text-[16px] font-semibold text-lw-text lg:text-[18px]">
                {r.title}
              </h3>
              <p className="mt-1 font-urbanist text-[14px] leading-5 text-lw-muted lg:max-w-3xl lg:text-[15px] lg:leading-6">
                {r.text}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center font-urbanist text-[14px] font-bold capitalize text-lw-accent underline underline-offset-4">
          Lire tous les avis
        </p>
      </div>
    </section>
  );
}

export default ReviewsSection;
