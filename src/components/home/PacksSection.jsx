import React from "react";
import { useNavigate } from "react-router-dom";

const CheckIcon = ({ className = "" }) => (
  <svg
    className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${className}`}
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden
  >
    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M5.5 9.2L7.8 11.5L12.5 6.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PACKS = [
  {
    id: "signature",
    title: "Signature",
    badge: "Le plus choisi",
    badgeClass: "bg-white/90 text-[#5C4A44]",
    price: "175",
    currency: "DT",
    intro: "Tout l'Essentiel, plus :",
    points: [
      "Jusqu’à 10 sections personnalisées",
      "Gestion des cadeaux & cagnottes",
      "2 langues (français / arabe)",
      "4 retouches sur-mesure du design",
    ],
    description: "L'Essentiel, enrichi de nombreuses options et fonctionnalités.",
    tags: ["Musique", "Vidéo save the date", "Illustrations animées"],
    tagClass: "border-white/40 bg-white/15 text-white",
    cardClass:
      "bg-[#AD8C84] text-white shadow-sm [background-image:radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.18)_0_1px,transparent_2px),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.14)_0_1px,transparent_2px),radial-gradient(circle_at_45%_70%,rgba(255,255,255,0.12)_0_1px,transparent_2px)]",
    mutedClass: "text-white/90",
    priceClass: "text-white",
    dividerClass: "border-white/25",
    inclusClass: "text-white/70",
    btnClass: "bg-[#8F6F66] text-white hover:bg-[#7d6159] border-transparent",
    cta: "Choisir Signature",
  },
  {
    id: "essentiel",
    title: "Essentiel",
    badge: null,
    price: "99",
    currency: "DT",
    intro: null,
    inclusLabel: "INCLUS",
    points: [
      "6 sections personnalisées",
      "RSVP + espace client",
      "Enveloppe animée",
      "2 retouches sur-mesure du design",
      "Intégration musique & vidéo",
    ],
    description: "Un modèle de notre collection, personnalisé avec vos informations.",
    tags: ["Musique", "Illustrations animées"],
    tagClass: "border-[#E8D9CF] bg-[#F3E9E2] text-[#5C4A44]",
    cardClass: "bg-white text-lw-text shadow-sm",
    mutedClass: "text-lw-muted",
    priceClass: "text-lw-text",
    dividerClass: "border-[#E8E0D8]",
    inclusClass: "text-lw-muted",
    btnClass: "bg-white text-lw-text border-lw-text hover:bg-[#F7F2EC]",
    cta: "Choisir Essentiel",
  },
  {
    id: "sur-mesure",
    title: "Sur Mesure",
    badge: "+ EXPÉRIENCE VIP",
    badgeClass: "bg-[#C4A06A] text-white",
    price: "275",
    currency: "DT",
    intro: "Tout Signature, plus :",
    inclusLabel: "INCLUS",
    points: [
      "Sections illimitées",
      "Contact direct avec notre designer",
      "3 langues",
      "Icônes & illustrations personnalisées",
    ],
    description: "Une personnalisation complète de votre invitation, avec notre designer.",
    tags: [
      "Musique",
      "Vidéo save the date personnalisée",
      "Illustrations animées",
      "Monogramme",
    ],
    tagClass: "border-[#D4C4A0]/60 bg-white/35 text-[#3D3429]",
    cardClass:
      "bg-gradient-to-b from-[#F0E4C4] to-[#D9C48A] text-[#3D3429] shadow-sm",
    mutedClass: "text-[#3D3429]/85",
    priceClass: "text-[#3D3429]",
    dividerClass: "border-[#3D3429]/15",
    inclusClass: "text-[#3D3429]/60",
    btnClass: "bg-transparent text-[#3D3429] border-[#3D3429] hover:bg-white/40",
    cta: "Choisir Sur mesure",
  },
];

const TRUST_POINTS = [
  "Paiement unique, sans abonnement",
  "Modifications illimitées 30 jours",
  "Support WhatsApp 7j/7",
];

function PacksSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#F7F2EC] px-4 py-10 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-5xl">
        <div className="mx-auto flex w-[399px] max-w-[calc(100%-8px)] flex-col items-center text-center lg:w-full lg:max-w-2xl">
          <h2 className="font-abhaya text-[30px] font-bold leading-[36px] text-lw-text">
            Trouvez votre forfait
          </h2>
          <p className="mt-[7px] font-urbanist text-[18px] font-medium leading-6 text-lw-muted">
            Choisissez le forfait qui
            <br />
            correspond à vos envies.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-5 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-stretch">
          {PACKS.map((pack) => (
            <article
              key={pack.id}
              className={`flex flex-col rounded-[24px] px-5 py-6 lg:px-6 lg:py-7 ${pack.cardClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-playfair text-[28px] font-normal leading-tight lg:text-[30px]">
                  {pack.title}
                </h3>
                {pack.badge ? (
                  <span
                    className={`mt-1 inline-flex shrink-0 rounded-full px-2.5 py-1 font-urbanist text-[10px] font-semibold leading-none ${pack.badgeClass}`}
                  >
                    {pack.badge}
                  </span>
                ) : null}
              </div>

              <p className={`mt-4 font-urbanist text-[13px] ${pack.mutedClass}`}>
                Paiement unique
              </p>
              <p className={`mt-1 flex items-baseline gap-1.5 ${pack.priceClass}`}>
                <span className="font-urbanist text-[44px] font-bold leading-none tracking-tight">
                  {pack.price}
                </span>
                <span className="font-urbanist text-[18px] font-semibold">{pack.currency}</span>
              </p>

              <div className={`my-5 border-t ${pack.dividerClass}`} />

              {pack.inclusLabel ? (
                <p
                  className={`mb-2 font-urbanist text-[11px] font-semibold uppercase tracking-[0.12em] ${pack.inclusClass}`}
                >
                  {pack.inclusLabel}
                </p>
              ) : null}
              {pack.intro ? (
                <p className={`mb-3 font-urbanist text-[14px] font-medium ${pack.mutedClass}`}>
                  {pack.intro}
                </p>
              ) : null}

              <ul className="space-y-2.5">
                {pack.points.map((pt) => (
                  <li
                    key={pt}
                    className={`flex items-start gap-2.5 font-urbanist text-[14px] leading-5 ${pack.mutedClass}`}
                  >
                    <CheckIcon />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <p className={`mt-4 font-urbanist text-[13px] leading-5 ${pack.mutedClass}`}>
                {pack.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {pack.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex rounded-full border px-3 py-1.5 font-urbanist text-[12px] font-medium ${pack.tagClass}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate("/signup", { state: { pack: pack.id } })}
                className={`mt-6 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-full border font-urbanist text-[14px] font-bold ${pack.btnClass}`}
              >
                {pack.cta}
                <span aria-hidden>→</span>
              </button>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[320px] text-center lg:mt-14 lg:max-w-lg">
          <p className="font-urbanist text-[13px] leading-5 text-lw-muted">
            Un paiement unique, pas d&apos;abonnement. Changez de forfait à tout moment avant
            l&apos;envoi.
          </p>
          <ul className="mt-5 flex flex-col items-center gap-2.5">
            {TRUST_POINTS.map((pt) => (
              <li
                key={pt}
                className="flex items-center gap-2 font-urbanist text-[14px] font-medium leading-5 text-lw-text"
              >
                <CheckIcon className="text-lw-text" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default PacksSection;
