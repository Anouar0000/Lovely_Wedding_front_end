import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

/** Trouvez votre forfait — Figma mobile · desktop carte élargie */
const TABS = ["Essentiel", "Signature", "Sur mesure"];

const PACKS = {
  Essentiel: {
    title: "Essentiel",
    price: "à partir de 99dt",
    image: a.packSignature,
    desc: "L’essentiel pour partager votre invitation digitale avec élégance.",
    tags: ["RSVP", "Galerie", "Carte"],
    points: [
      "Jusqu’à 6 sections",
      "1 langue",
      "2 retouches du design",
      "Lien public personnalisé",
      "Support email",
    ],
  },
  Signature: {
    title: "Signature",
    price: "à partir de 175dt",
    image: a.packSignature,
    desc: "Votre invitation Essentiel, enrichie de nombreuses options et fonctionnalités.",
    tags: ["Musique", "Vidéo save the date", "Illustrations animées"],
    points: [
      "Jusqu’a 10 sections",
      "Gestion des cadeaux",
      "2 langues",
      "4 retouches du design",
      "Tout ce qui est inclus dans le forfait Essentiel.",
    ],
  },
  "Sur mesure": {
    title: "Sur mesure",
    price: "sur devis",
    image: a.packSignature,
    desc: "Un design unique, pensé avec vous pour votre histoire.",
    tags: ["Design unique", "Direction artistique", "Accompagnement"],
    points: [
      "Sections illimitées",
      "Design 100 % personnalisé",
      "Illustrations sur mesure",
      "Révisions dédiées",
      "Accompagnement prioritaire",
    ],
  },
};

function PacksSection() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Signature");
  const pack = useMemo(() => PACKS[tab] || PACKS.Signature, [tab]);

  return (
    <section className="bg-[#f4f4f4] px-4 py-12 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-4xl">
        <h2 className="text-center lw-h1 lg:text-[40px]">Trouvez votre forfait</h2>
        <p className="mx-auto mt-3 max-w-[241px] text-center lw-sub lg:max-w-xl lg:text-[18px]">
          Choisissez le forfait qui correspond à vos envies.
        </p>

        <div className="mt-8 flex justify-center gap-6 lg:mt-10 lg:gap-10">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`font-urbanist text-[18px] ${
                tab === t
                  ? "border-b-2 border-lw-text font-bold text-lw-text"
                  : "font-normal text-lw-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <article className="relative mx-auto mt-6 h-[442px] w-[303px] overflow-hidden rounded-[5px] bg-white shadow-sm lg:mt-10 lg:grid lg:h-auto lg:w-full lg:max-w-none lg:grid-cols-2">
          <div className="relative h-[184px] overflow-hidden rounded-t-[5px] bg-[#bab8a3] lg:h-auto lg:min-h-[320px] lg:rounded-l-[5px] lg:rounded-tr-none">
            <img src={pack.image} alt="" className="h-full w-full object-cover" />
            <span className="absolute right-0 top-0 flex h-[35px] min-w-[135px] items-center justify-center rounded-bl-[5px] bg-white px-3 font-urbanist text-[14px] font-bold text-[#a1092b]">
              {pack.price}
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white lg:p-8">
              <h3 className="lw-h2 lg:text-[32px]">{pack.title}</h3>
              <p className="mt-1 font-urbanist text-[14px] leading-5 text-white/95 lg:mt-2 lg:text-[16px] lg:leading-6">
                {pack.desc}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 lg:mt-4">
                {pack.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-lw-accent px-2 py-0.5 font-urbanist text-[10px] font-bold text-lw-accent lg:text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <ul className="space-y-0 px-5 py-4 lg:flex lg:flex-col lg:justify-center lg:px-10 lg:py-8">
            {pack.points.map((pt) => (
              <li
                key={pt}
                className="border-b border-lw-line py-3 font-urbanist text-[14px] text-lw-muted last:border-0 lg:py-4 lg:text-[15px]"
              >
                ✓ {pt}
              </li>
            ))}
          </ul>
        </article>

        <div className="mt-8 flex justify-center lg:mt-12">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="inline-flex h-[42px] w-[163px] items-center justify-center rounded-[5px] bg-lw-accent font-urbanist text-[14px] font-bold uppercase text-white hover:bg-lw-accentDark"
          >
            crée maintenant
          </button>
        </div>
      </div>
    </section>
  );
}

export default PacksSection;
