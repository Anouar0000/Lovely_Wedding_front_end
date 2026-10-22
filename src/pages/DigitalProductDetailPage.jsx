import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiPlay, FiStar } from "react-icons/fi";
import { LuHeart } from "react-icons/lu";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { homeDigitalAssets as a } from "../components/home/homeDigitalAssets";
import { useFavorites } from "../context/FavoritesContext";

const PACKS = [
  {
    id: "essentiel",
    label: "Essentiel",
    priceLabel: "99dt",
    desc: "Classic stationery-inspired design.",
  },
  {
    id: "signature",
    label: "Signature",
    priceLabel: "175dt",
    desc: "Classic stationery-inspired design.",
  },
  {
    id: "sur-mesure",
    label: "Sur Mesure",
    priceLabel: "275dt",
    desc: "Classic stationery-inspired design.",
  },
];

const ACCORDIONS = [
  {
    title: "Comment ça marche",
    body: "Choisissez votre thème, personnalisez les textes et sections, puis partagez le lien avec vos invités.",
  },
  {
    title: "Délai de livraison",
    body: "Votre invitation digitale est prête sous 7 jours après validation de vos contenus.",
  },
  {
    title: "Ce qui est inclu",
    body: "RSVP, galerie, musique, animations et livre d'or selon le forfait choisi.",
  },
];

const REVIEWS = [
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

/** Catalogue digital — slug → produit */
export const DIGITAL_PRODUCTS = {
  "sidi-bousaid": {
    name: "Sidi Bou Said",
    slug: "sidi-bousaid",
    cover: a.heroCoverSidi,
    welcome: a.sidiWelcome || a.heroCoverSidi,
    invi: a.sidiInvi || a.cardSidi,
    coverAlt: a.cardSidi,
    heroMedia: a.productOverviewDigital,
    demoTo: "/digital-invitation/sidi-bousaid",
    desc: "Classic stationery-inspired design.",
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
    desc: "Classic stationery-inspired design.",
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
    desc: "Classic stationery-inspired design.",
    category: "Moderne",
  },
  "dolce-vita": {
    name: "Dolce Vita",
    slug: "dolce-vita",
    cover: a.heroCoverDolce,
    welcome: a.heroCoverDolce,
    invi: a.cardDolce,
    coverAlt: a.cardDolce,
    demoTo: "/digital-invitation/dolce-vita",
    desc: "Classic stationery-inspired design.",
    category: "Romantique",
  },
  bridgerton: {
    name: "Bridgeton",
    slug: "bridgerton",
    cover: a.heroCoverBridgerton,
    welcome: a.heroCoverBridgerton,
    invi: a.themeBridgeton,
    coverAlt: a.themeBridgeton,
    demoTo: "/digital-invitation/bridgerton",
    desc: "Classic stationery-inspired design.",
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
    desc: "Classic stationery-inspired design.",
    category: "Romantique",
  },
};

const RECOS = [
  { slug: "bridgerton", name: "Bridgeton", img: a.themeBridgeton },
  { slug: "majestic-white", name: "Majestic White", img: a.themeMajesticWhite },
  { slug: "sidi-bousaid", name: "Sidi Bou Said", img: a.cardSidi },
  { slug: "dolce-vita", name: "Dolce Vita", img: a.cardDolce },
];

/** Product overview digital — Figma 1238:1953 */
function DigitalProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const product = DIGITAL_PRODUCTS[slug] || DIGITAL_PRODUCTS["sidi-bousaid"];

  const [packId, setPackId] = useState("essentiel");
  const [openAcc, setOpenAcc] = useState(-1);
  const [heroSlide, setHeroSlide] = useState(0);

  const selectedPack = useMemo(
    () => PACKS.find((p) => p.id === packId) || PACKS[0],
    [packId]
  );

  const recommendations = useMemo(
    () => RECOS.filter((r) => r.slug !== product.slug).slice(0, 2),
    [product.slug]
  );

  const handleOrder = () => {
    navigate(`/invitations-digital/${product.slug}/extras`, {
      state: { pack: selectedPack.id, fromOverview: true },
    });
  };

  const handlePlayDemo = () => {
    navigate(product.demoTo, { state: { pack: selectedPack.id, fromOverview: true } });
  };

  const phoneSrc = product.invi || product.coverAlt || product.cover;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white pb-[88px] font-glacial text-lw-text lg:pb-0">
      <DigitalHomeHeader mode="none" context="digitale" />

      <nav className="mx-auto flex w-full max-w-[428px] flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-6 text-[14px] text-lw-text lg:max-w-6xl lg:px-8 lg:pt-10">
        <Link to="/" className="hover:text-lw-accent">
          Accueil
        </Link>
        <span aria-hidden className="text-lw-muted">
          ›
        </span>
        <Link to="/invitations-digital" className="hover:text-lw-accent">
          Invitations Digitales
        </Link>
        <span aria-hidden className="text-lw-muted">
          ›
        </span>
        <span className="font-bold">{product.name}</span>
      </nav>

      <div className="mx-auto w-full max-w-[428px] px-4 pb-0 pt-5 lg:max-w-6xl lg:px-8 lg:pb-0 lg:pt-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* Hero media — Figma beige card + phone + play */}
          <div>
            <div className="relative mx-auto h-[537px] w-[396px] max-w-full overflow-hidden rounded-[24px] bg-[#F7F6F1] lg:mx-0">
              {product.heroMedia && heroSlide === 0 ? (
                <button
                  type="button"
                  onClick={handlePlayDemo}
                  className="absolute inset-0 block h-full w-full"
                  aria-label="Lancer la vidéo interactive"
                >
                  <img
                    src={product.heroMedia}
                    alt={product.name}
                    className="h-full w-full object-cover object-top"
                  />
                </button>
              ) : (
                <>
                  <p className="absolute left-1/2 top-[34px] z-10 w-[273px] -translate-x-1/2 text-center font-glacial text-[14px] leading-[18px] text-[#78716c]">
                    Lancer la vidéo interactive
                  </p>
                  <button
                    type="button"
                    onClick={handlePlayDemo}
                    className="absolute left-1/2 top-[72px] z-10 flex h-[370px] w-[166px] -translate-x-1/2 items-center justify-center"
                    aria-label="Lancer la démo"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[28px] border-[2.5px] border-[#131313] bg-[#131313] shadow-[0_18px_40px_-16px_rgba(75,66,66,0.45)]">
                      <img
                        src={phoneSrc}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                      <span
                        className="pointer-events-none absolute left-1/2 top-[8px] z-10 h-[8px] w-[40px] -translate-x-1/2 rounded-full bg-[#131313]"
                        aria-hidden
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/15">
                        <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-[#4B4242] shadow-md">
                          <FiPlay className="ml-0.5 size-6 fill-current" aria-hidden />
                        </span>
                      </span>
                    </div>
                  </button>
                </>
              )}

              <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 py-1">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    aria-current={heroSlide === i}
                    onClick={() => setHeroSlide(i)}
                    className={
                      heroSlide === i
                        ? "h-[6px] w-[20px] rounded-full bg-[#332B29]"
                        : "size-[6px] rounded-full bg-[#C4A69C]/70"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <section className="mt-6 lg:mt-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-lw-text lg:text-[40px] lg:leading-tight">
                {product.name}
              </h1>
              <p
                className="inline-flex items-center gap-1 font-glacial text-[14px] text-lw-muted"
                aria-label="Note 4,7 sur 5, 31 avis"
              >
                <FiStar className="size-4 fill-[#E8B84A] text-[#E8B84A]" aria-hidden />
                <span className="font-medium text-lw-text">4.7</span>
                <span className="underline underline-offset-2">(31)</span>
              </p>
            </div>

            <p className="mt-2 font-glacial text-[14px] leading-[18px] text-[#78716c]">
              {product.desc}
            </p>

            <div className="mt-6 space-y-3">
              {PACKS.map((pack) => {
                const active = pack.id === packId;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setPackId(pack.id)}
                    className={`relative flex w-full overflow-hidden rounded-[5px] border-[0.5px] border-[#C4A69C] text-left ${
                      active ? "bg-white" : "bg-white"
                    }`}
                  >
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-y-0 left-0 w-[194px] max-w-[48%] bg-gradient-to-r from-[#C4A69C]/90 to-white/20"
                      />
                    ) : null}
                    <span className="relative flex w-full items-start gap-3 px-4 py-4">
                      <span
                        className={`mt-1.5 size-[14px] shrink-0 rounded-full border ${
                          active
                            ? "border-[#332B29] bg-[#332B29]"
                            : "border-[#C4A69C] bg-white"
                        }`}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-lw-text">
                            {pack.label}
                          </span>
                          <span className="shrink-0 font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-lw-text">
                            {pack.priceLabel}
                          </span>
                        </span>
                        <span className="mt-0 block font-glacial text-[14px] leading-[18px] text-[#78716c]">
                          {pack.desc}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sticky CTA — Figma Passer la commande */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8E0D8] bg-white px-4 py-3 shadow-[0_-4px_24px_rgba(75,66,66,0.1)] lg:static lg:mt-[18px] lg:border-0 lg:px-0 lg:py-0 lg:shadow-none">
              <div className="mx-auto flex w-full max-w-[428px] items-center justify-between gap-3 lg:max-w-none">
                <div className="min-w-0">
                  <p className="truncate font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-lw-text">
                    {selectedPack.label}
                  </p>
                  <p className="font-glacial text-[18px] font-bold leading-6 text-lw-text">
                    {selectedPack.priceLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOrder}
                  className="inline-flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#A97C72] px-5 font-glacial text-[14px] font-bold text-white shadow-[0px_8px_10px_rgba(168,125,115,0.28)] hover:bg-[#966B62]"
                >
                  Passer la commande
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>

            {/* Accordéons + avis — fond beige */}
            <div className="-mx-4 mt-8 bg-[#F7F2EC] px-4 pb-8 pt-2 lg:-mx-0 lg:mt-10 lg:rounded-[24px] lg:px-5">
              <div>
                {ACCORDIONS.map((item, i) => {
                  const open = openAcc === i;
                  return (
                    <div key={item.title} className="border-b border-[#E8E0D8]">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 py-[18px] text-left font-glacial text-[16px] font-normal leading-6 text-lw-text"
                        aria-expanded={open}
                        onClick={() => setOpenAcc(open ? -1 : i)}
                      >
                        <span>{item.title}</span>
                        <span
                          className="flex size-5 shrink-0 items-center justify-center text-[20px] font-light leading-none text-lw-text"
                          aria-hidden
                        >
                          {open ? "−" : "+"}
                        </span>
                      </button>
                      {open ? (
                        <p className="pb-4 font-glacial text-[14px] leading-5 text-[#7D6E66]">
                          {item.body}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-[52px] flex flex-col gap-[18px]">
                {REVIEWS.map((r, i) => (
                  <article
                    key={`${r.name}-${i}`}
                    className="rounded-[24px] border-[0.5px] border-[#C4A69C] bg-white px-5 py-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-[#4B4242]">
                        {r.name}
                      </p>
                      <div
                        className="mt-2 flex shrink-0 gap-0 text-[12px] leading-none text-[#FFD220]"
                        aria-label="5 étoiles"
                      >
                        {"★★★★★".split("").map((s, j) => (
                          <span key={j}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <p className="font-glacial text-[14px] font-normal leading-[18px] text-[#78716C]">
                      {r.meta}
                    </p>
                    <p className="mt-3 font-glacial text-[14px] font-normal leading-[18px] text-[#1C1917]">
                      {r.text}
                    </p>
                    <p className="mt-4 font-glacial text-[12px] font-normal leading-6 text-[#A89F91]">
                      {r.date}
                    </p>
                  </article>
                ))}

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[#A97C72] bg-transparent px-6 font-glacial text-[14px] font-bold leading-6 text-[#A97C72] hover:bg-white/60"
                  >
                    Ecrire un avis
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-[53px] bg-white px-4 pb-[53px] pt-0 lg:px-8">
        <div className="mx-auto w-full max-w-[428px] lg:max-w-3xl">
          <h2 className="text-center font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-lw-text lg:text-[36px]">
            Autres Recommendation
          </h2>
          <div className="mt-[53px] grid grid-cols-2 gap-4 lg:gap-10">
            {recommendations.map((r) => {
              const liked = isFavorite(r.slug);
              return (
                <article key={r.slug} className="lw-product-card group relative p-1 text-left">
                  <button
                    type="button"
                    aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
                    aria-pressed={liked}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite({
                        id: r.slug,
                        title: r.name,
                        to: `/invitations-digital/${r.slug}`,
                        image: r.img,
                        productType: "digital",
                      });
                    }}
                    className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center"
                  >
                    <LuHeart
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden
                      className={
                        liked ? "fill-[#E23D48] text-[#E23D48]" : "fill-none text-[#4B4242]"
                      }
                    />
                  </button>
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => navigate(`/invitations-digital/${r.slug}`)}
                  >
                    <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden rounded-[5px] bg-[#fffaed] lg:aspect-[189/224] lg:h-auto">
                      <img
                        src={r.img}
                        alt={r.name}
                        className="h-[162px] w-auto max-w-[42%] object-contain"
                      />
                    </div>
                    <h3 className="mt-3 font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-lw-text">
                      {r.name}
                    </h3>
                    <p className="font-glacial text-[14px] leading-[18px] text-[#78716c]">
                      Includes music, animations
                      <br />
                      {"& guestbook"}
                    </p>
                    <p className="mt-2 font-glacial text-[14px] font-bold leading-6 text-lw-text">
                      Start at 49$
                    </p>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <DigitalHomeFooter />
    </div>
  );
}

export default DigitalProductDetailPage;
