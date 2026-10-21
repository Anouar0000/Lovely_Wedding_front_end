import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { homeDigitalAssets as a } from "../components/home/homeDigitalAssets";

const PACKS = [
  { id: "essentiel", label: "Essentiel", price: 99, priceLabel: "99DT" },
  { id: "signature", label: "Signature", price: 175, priceLabel: "175DT" },
  { id: "sur-mesure", label: "Sur Mesure", price: 275, priceLabel: "275DT" },
];

const ACCORDIONS = [
  { title: "Comment ça marche", body: "Choisissez votre thème, personnalisez les textes et sections, puis partagez le lien avec vos invités." },
  { title: "Délai de livraison", body: "Votre invitation digitale est prête sous 7 jours après validation de vos contenus." },
  { title: "Ce qui est inclu", body: "RSVP, galerie, musique, animations et livre d'or selon le forfait choisi." },
];

const REVIEWS = [
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

/** Catalogue digital — slug → produit (welcome devant · invi derrière) */
export const DIGITAL_PRODUCTS = {
  "sidi-bousaid": {
    name: "Sidi Bou Said",
    slug: "sidi-bousaid",
    cover: a.heroCoverSidi,
    welcome: a.sidiWelcome || a.heroCoverSidi,
    invi: a.sidiInvi || a.heroCoverSidi,
    coverAlt: a.cardSidi,
    demoTo: "/digital-invitation/sidi-bousaid",
    desc: "Classic stationery-inspired design.",
    tags: ["RSVP", "Musique", "Arabesque"],
    category: "Arabesque",
  },
  "sakura-koi": {
    name: "Sakura Koi",
    slug: "sakura-koi",
    cover: a.heroCoverSakura,
    welcome: a.heroCoverSakura,
    invi: a.cardSakura,
    coverAlt: a.cardSakura,
    demoTo: "/digital-invitation/sakura-koi",
    desc: "Romantique et poétique, inspiré du Japon.",
    tags: ["RSVP", "Animations", "Romantique"],
    category: "Romantique",
  },
  celestial: {
    name: "Celestial",
    slug: "celestial",
    cover: a.heroCoverSakura,
    welcome: a.heroCoverSakura,
    invi: a.cardSakura,
    coverAlt: a.cardSakura,
    demoTo: "/digital-invitation/sakura-koi",
    desc: "Classic stationery-inspired design.",
    tags: ["RSVP", "Musique", "Romantique"],
    category: "Romantique",
  },
  "club-capri": {
    name: "Club Capri",
    slug: "club-capri",
    cover: a.heroCoverCapri,
    welcome: a.capriWelcome || a.heroCoverCapri,
    invi: a.capriInvi || a.cardCapri,
    coverAlt: a.cardCapri,
    demoTo: "/digital-invitation/club-capri",
    desc: "Méditerranée chic, énergie estivale.",
    tags: ["RSVP", "Galerie", "Moderne"],
    category: "Moderne",
  },
  "dolce-vita": {
    name: "La Dolce Vita",
    slug: "dolce-vita",
    cover: a.heroCoverDolce,
    welcome: a.heroCoverDolce,
    invi: a.cardDolce,
    coverAlt: a.cardDolce,
    demoTo: "/digital-invitation/dolce-vita",
    desc: "Douceur italienne pour votre grand jour.",
    tags: ["RSVP", "Musique", "Romantique"],
    category: "Romantique",
  },
  bridgerton: {
    name: "Bridgerton",
    slug: "bridgerton",
    cover: a.heroCoverBridgerton,
    welcome: a.heroCoverBridgerton,
    invi: a.themeBridgeton,
    coverAlt: a.themeBridgeton,
    demoTo: "/digital-invitation/bridgerton",
    desc: "Élégance regency, détails raffinés.",
    tags: ["RSVP", "Animations", "Moderne"],
    category: "Moderne",
  },
  "majestic-white": {
    name: "Majestic White",
    slug: "majestic-white",
    cover: a.heroCoverMajestic,
    welcome: a.heroCoverMajestic,
    invi: a.themeMajesticWhite,
    coverAlt: a.themeMajesticWhite,
    demoTo: "/digital-invitation/majestic-white",
    desc: "Minimalisme lumineux et majestueux.",
    tags: ["RSVP", "Galerie", "Romantique"],
    category: "Romantique",
  },
};

const RECOS = [
  { slug: "bridgerton", name: "Bridgerton", img: a.themeBridgeton },
  { slug: "majestic-white", name: "Majestic White", img: a.themeMajesticWhite },
];

/** iPhone vertical noir — Figma 160×313 */
function PhoneFrame({ src, title, className = "", objectPosition = "center" }) {
  return (
    <div
      className={`h-[313px] w-[160px] overflow-hidden rounded-[26px] border-[2px] border-[#131313] bg-[#131313] shadow-[0_18px_40px_-16px_rgba(75,66,66,0.45)] ${className}`}
    >
      <div className="absolute inset-[2px] overflow-hidden rounded-[23px] bg-[#F7F2EC]">
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          draggable={false}
        />
      </div>
      <span
        className="pointer-events-none absolute left-1/2 top-[6px] z-10 h-[8px] w-[36px] -translate-x-1/2 rounded-full bg-[#131313]"
        aria-hidden
      />
    </div>
  );
}

/**
 * Figma Product overview digital :
 * — chaque mockup 160×313 noir
 * — Welcome devant (gauche) · Invitation derrière (droite)
 */
function DualPhoneMockup({ welcomeSrc, inviSrc, name }) {
  return (
    <div className="relative mx-auto h-[340px] w-[300px] shrink-0 overflow-hidden">
      {/* Invitation — derrière, à droite */}
      <PhoneFrame
        src={inviSrc}
        title={`${name} — invitation`}
        objectPosition="center"
        className="absolute left-[128px] top-[6px] z-[1]"
      />
      {/* Welcome — devant, à gauche */}
      <PhoneFrame
        src={welcomeSrc}
        title={`${name} — welcome`}
        objectPosition="center"
        className="absolute left-[14px] top-[26px] z-[2]"
      />
    </div>
  );
}

/** Product overview digital — Figma hero invi / Product overview digital.png */
function DigitalProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = DIGITAL_PRODUCTS[slug] || DIGITAL_PRODUCTS["sidi-bousaid"];

  const [mode, setMode] = useState("apercu");
  const [packId, setPackId] = useState("essentiel");
  const [openAcc, setOpenAcc] = useState(-1);

  const selectedPack = useMemo(
    () => PACKS.find((p) => p.id === packId) || PACKS[0],
    [packId]
  );

  const handleContinue = () => {
    navigate(product.demoTo, { state: { pack: selectedPack.id, fromOverview: true } });
  };

  const handleDemo = () => {
    setMode("demo");
    navigate(product.demoTo);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" />

      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-6 text-[14px] text-lw-text lg:px-8 lg:pt-10">
        <Link to="/" className="hover:text-lw-accent">
          Accueil
        </Link>
        <span>›</span>
        <Link to="/invitations-digital" className="hover:text-lw-accent">
          Invitations Digitales
        </Link>
        <span>›</span>
        <span>Invitations {product.category}</span>
        <span>›</span>
        <span className="font-bold">{product.name}</span>
      </nav>

      {/* Hero — Figma Product overview digital · mockups 160×313 noir */}
      <section className="mt-4 bg-[#F7F2EC] lg:mt-8">
        <div className="mx-auto flex w-full max-w-[428px] flex-col items-center px-4 pb-8 pt-6 lg:max-w-6xl lg:px-8 lg:pb-12 lg:pt-10">
          <DualPhoneMockup
            welcomeSrc={product.welcome || product.cover}
            inviSrc={product.invi || product.coverAlt || product.cover}
            name={product.name}
          />

          <div className="mt-5 flex w-full shrink-0 items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setMode("apercu")}
              className={`inline-flex h-[40px] min-w-[118px] items-center justify-center rounded-[8px] px-5 font-glacial text-[14px] font-medium ${
                mode === "apercu"
                  ? "bg-[#C4A69C] text-white"
                  : "border border-[#C4A69C] bg-white text-[#C4A69C]"
              }`}
            >
              Aperçu
            </button>
            <button
              type="button"
              onClick={handleDemo}
              className={`inline-flex h-[40px] min-w-[118px] items-center justify-center rounded-[8px] px-5 font-glacial text-[14px] font-medium ${
                mode === "demo"
                  ? "bg-[#C4A69C] text-white"
                  : "border border-[#C4A69C] bg-white text-[#C4A69C]"
              }`}
            >
              Démo Direct
            </button>
          </div>
        </div>
      </section>

      {/* Config produit */}
      <section className="mx-auto w-full max-w-[428px] px-4 pb-10 pt-8 lg:max-w-xl lg:px-8 lg:pb-14 lg:pt-12">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-lora text-[28px] font-semibold leading-8 text-lw-text lg:text-[40px] lg:leading-tight">
            {product.name}
          </h1>
          <div className="flex gap-0.5 text-[14px] text-[#E8B84A]" aria-label="5 étoiles">
            {"★★★★★".split("").map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </div>

        <p className="mt-2 font-glacial text-[15px] leading-5 text-lw-muted lg:text-[16px]">
          {product.desc}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-[26px] items-center rounded-full border border-lw-line px-3 font-glacial text-[12px] text-lw-text"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-5 font-glacial text-[22px] font-bold leading-none text-[#B85C5C] lg:text-[26px]">
          {selectedPack.priceLabel}
        </p>

        <div className="mt-6 space-y-3">
          {PACKS.map((pack) => {
            const active = pack.id === packId;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => setPackId(pack.id)}
                className={`flex w-full items-center justify-between rounded-[8px] border px-4 py-3.5 text-left transition-colors ${
                  active
                    ? "border-lw-text/30 bg-gradient-to-r from-[#f0ebe6] to-white"
                    : "border-lw-line bg-gradient-to-r from-[#F7F2EC] to-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-[4px] border ${
                      active ? "border-lw-text bg-lw-text text-white" : "border-lw-line bg-white"
                    }`}
                    aria-hidden
                  >
                    {active ? "✓" : ""}
                  </span>
                  <span className="font-glacial text-[15px] font-medium text-lw-text">
                    {pack.label}
                  </span>
                </span>
                <span className="font-glacial text-[15px] font-semibold text-lw-text">
                  {pack.priceLabel}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#C4A69C] font-glacial text-[15px] font-semibold text-white hover:bg-[#b3958a]"
        >
          Continuer
        </button>

        <div className="mt-10 space-y-2">
          {ACCORDIONS.map((item, i) => {
            const open = openAcc === i;
            return (
              <div key={item.title} className="overflow-hidden rounded-[5px] bg-[#f4f4f4]">
                <button
                  type="button"
                  className="flex h-[56px] w-full items-center justify-between gap-4 px-4 text-left font-glacial text-[14px] font-medium text-lw-text"
                  aria-expanded={open}
                  onClick={() => setOpenAcc(open ? -1 : i)}
                >
                  <span>{item.title}</span>
                  <span className="text-lg leading-none" aria-hidden>
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? (
                  <p className="px-4 pb-4 font-glacial text-[14px] leading-5 text-lw-muted">
                    {item.body}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* Vos avis */}
      <section className="bg-white px-4 py-10 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-[428px] lg:max-w-xl">
          <h2 className="lw-h1 lg:text-[36px]">Vos avis</h2>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="font-glacial text-[18px] font-bold">4.7</p>
              <div className="flex gap-0.5 text-[#E8B84A]" aria-label="4.7 sur 5">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="h-[36px] rounded-[5px] border border-lw-text px-4 font-glacial text-[13px] font-medium"
            >
              Écrire un avis
            </button>
          </div>

          <div className="mt-6 divide-y divide-lw-line border-y border-lw-line">
            {REVIEWS.map((r, i) => (
              <article key={`${r.name}-${i}`} className="py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <p className="lw-h3">{r.name}</p>
                    <p className="lw-caption">{r.date}</p>
                  </div>
                  <div className="flex gap-0.5 text-sm text-[#E8B84A]" aria-label="5 étoiles">
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j}>{s}</span>
                    ))}
                  </div>
                </div>
                <h3 className="mt-3 font-glacial text-[16px] font-semibold text-lw-text">
                  {r.title}
                </h3>
                <p className="mt-1 font-glacial text-[14px] leading-5 text-lw-muted">{r.text}</p>
              </article>
            ))}
          </div>

          <p className="mt-6 text-center font-glacial text-[14px] font-bold capitalize text-lw-accent underline underline-offset-4">
            Lire tous les avis
          </p>
        </div>
      </section>

      {/* Recommandations */}
      <section className="bg-white px-4 pb-14 pt-4 lg:px-8 lg:pb-20">
        <div className="mx-auto w-full max-w-[428px] lg:max-w-3xl">
          <h2 className="text-center lw-h1 lg:text-[36px]">Autres recommandations</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:gap-10">
            {RECOS.filter((r) => r.slug !== product.slug).map((r) => (
              <button
                key={r.slug}
                type="button"
                className="text-left"
                onClick={() => navigate(`/invitations-digital/${r.slug}`)}
              >
                <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[5px] bg-[#fffaed] lg:aspect-[189/224] lg:h-auto">
                  <img
                    src={r.img}
                    alt={r.name}
                    className="h-[162px] w-[86px] object-contain"
                  />
                  <span className="absolute bottom-[12px] left-1/2 flex h-[19px] w-[127px] -translate-x-1/2 items-center justify-center rounded-full border border-lw-accent bg-white/90 font-glacial text-[10px] font-bold leading-none text-lw-accent">
                    à partir de 99dt
                  </span>
                </div>
                <h3 className="mt-4 lw-h3 lg:text-[24px]">{r.name}</h3>
                <p className="mt-1 lw-caption">
                  Includes music, animations
                  <br />& guestbook
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <DigitalHomeFooter />
    </div>
  );
}

export default DigitalProductDetailPage;
