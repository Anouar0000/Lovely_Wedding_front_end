import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiPlay, FiStar } from "react-icons/fi";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import {
  DIGITAL_CATALOG_PRODUCTS,
  DigitalCatalogCard,
} from "../components/digital/DigitalCatalogCard";
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
    date: "Posté le 12 Septembre 2024",
  },
  {
    name: "Lilia & Rayen",
    meta: "Achat vérifié • Formule Signature",
    text: "“Très professionnel ! Les invités ont particulièrement apprécié les invitations bilingues (français/arabe). On recommande à 100%.”",
    date: "Posté le 12 Septembre 2024",
  },
];

/** Catalogue digital — slug → produit (Figma Product overview digital) */
export const DIGITAL_PRODUCTS = {
  "sidi-bousaid": {
    name: "Sidi Bou Said",
    slug: "sidi-bousaid",
    cover: a.heroCoverSidi,
    invi: a.cardSidi,
    heroGallery: [a.gallerySidi1, a.gallerySidi2, a.gallerySidi3],
    demoTo: "/digital-invitation/sidi-bousaid",
    desc: "Classic stationery-inspired design.",
    category: "Arabesque",
  },
  "sakura-koi": {
    name: "Sakura Koi",
    slug: "sakura-koi",
    cover: a.heroCoverSakura,
    invi: a.cardSakura,
    heroGallery: [a.gallerySakura1, a.gallerySakura2, a.gallerySakura3],
    demoTo: "/digital-invitation/sakura-koi",
    desc: "Classic stationery-inspired design.",
    category: "Romantique",
  },
  celestial: {
    name: "Celestial",
    slug: "celestial",
    cover: a.heroCoverSakura,
    invi: a.cardSakura,
    heroGallery: [a.gallerySakura1, a.gallerySakura2, a.gallerySakura3],
    demoTo: "/digital-invitation/sakura-koi",
    desc: "Classic stationery-inspired design.",
    category: "Romantique",
  },
  "club-capri": {
    name: "Club Capri",
    slug: "club-capri",
    cover: a.heroCoverCapri,
    invi: a.cardCapri,
    heroGallery: [a.galleryCapri1, a.galleryCapri2, a.galleryCapri3],
    demoTo: "/digital-invitation/club-capri",
    desc: "Classic stationery-inspired design.",
    category: "Moderne",
  },
  "dolce-vita": {
    name: "Dolce Vita",
    slug: "dolce-vita",
    cover: a.heroCoverDolce,
    invi: a.cardDolce,
    heroGallery: [a.galleryDolce1, a.galleryDolce2, a.galleryDolce3],
    demoTo: "/digital-invitation/dolce-vita",
    desc: "Classic stationery-inspired design.",
    category: "Romantique",
  },
  bridgerton: {
    name: "Bridgeton",
    slug: "bridgerton",
    cover: a.heroCoverBridgerton,
    invi: a.themeBridgeton,
    heroGallery: [a.galleryBridgerton1, a.galleryBridgerton2, a.galleryBridgerton3],
    demoTo: "/digital-invitation/bridgerton",
    desc: "Classic stationery-inspired design.",
    category: "Moderne",
  },
  "majestic-white": {
    name: "Majestic White",
    slug: "majestic-white",
    cover: a.heroCoverMajestic,
    invi: a.themeMajesticWhite,
    heroGallery: [a.galleryMajestic1, a.galleryMajestic2, a.galleryMajestic3],
    demoTo: "/digital-invitation/majestic-white",
    desc: "Classic stationery-inspired design.",
    category: "Romantique",
  },
};

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
    () => DIGITAL_CATALOG_PRODUCTS.filter((p) => p.id !== product.slug).slice(0, 2),
    [product.slug]
  );

  const phoneSrc = product.invi || product.cover;

  /** Galerie HTML responsive — 3 écrans invitation */
  const heroSlides = useMemo(() => {
    const gallery = product.heroGallery || [];
    const s0 = gallery[0] || phoneSrc;
    const s1 = gallery[1] || phoneSrc;
    const s2 = gallery[2] || phoneSrc;
    return [
      { src: s0, play: true },
      { src: s1, play: false },
      { src: s2, play: false },
    ];
  }, [product.heroGallery, phoneSrc]);

  const activeSlide = heroSlides[heroSlide] || heroSlides[0];

  useEffect(() => {
    setHeroSlide(0);
  }, [product.slug]);

  const handleOrder = () => {
    navigate(`/invitations-digital/${product.slug}/extras`, {
      state: { pack: selectedPack.id, fromOverview: true },
    });
  };

  const handlePlayDemo = () => {
    navigate(product.demoTo, { state: { pack: selectedPack.id, fromOverview: true } });
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white pb-[88px] font-glacial text-lw-text lg:pb-0">
      <DigitalHomeHeader mode="none" context="digitale" />

      <nav className="mx-auto flex w-full max-w-[428px] flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-6 text-[14px] leading-[18px] text-[#4B4242] md:max-w-3xl lg:max-w-6xl lg:px-8 lg:pt-10">
        <Link to="/" className="font-normal hover:text-lw-accent">
          Accueil
        </Link>
        <span aria-hidden>›</span>
        <Link to="/invitations-digital" className="font-normal hover:text-lw-accent">
          Invitations Digitales
        </Link>
        <span aria-hidden>›</span>
        <span className="font-bold">{product.name}</span>
      </nav>

      <div className="mx-auto w-full max-w-[428px] px-4 pb-0 pt-5 md:max-w-3xl lg:grid lg:max-w-6xl lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-10">
        {/* Hero 396×538 — fond Group 555 + téléphone + points (tous produits) */}
        <div className="relative mx-auto h-[538px] w-[396px] max-w-full overflow-hidden rounded-[24px] bg-[#F7F6F1] lg:mx-0">
          <img
            src={`${a.heroFloralBg}?v=g555`}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
            draggable={false}
          />

          {activeSlide.play ? (
            <p className="absolute left-1/2 top-[34px] z-10 w-[273px] -translate-x-1/2 text-center font-glacial text-[14px] leading-[18px] text-[#78716c]">
              Lancer la vidéo interactive
            </p>
          ) : null}

          <button
            type="button"
            onClick={activeSlide.play ? handlePlayDemo : undefined}
            className="absolute left-1/2 top-[72px] z-10 flex h-[370px] w-[166px] -translate-x-1/2 items-center justify-center"
            aria-label={activeSlide.play ? "Lancer la démo" : product.name}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[28px] border-[2.5px] border-[#131313] bg-[#131313] shadow-[0_18px_40px_-16px_rgba(75,66,66,0.45)]">
              <img
                src={`${activeSlide.src}?v=g4`}
                alt={product.name}
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
              <span
                className="pointer-events-none absolute left-1/2 top-[8px] z-10 h-[8px] w-[40px] -translate-x-1/2 rounded-full bg-[#131313]"
                aria-hidden
              />
              {activeSlide.play ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <span className="flex size-14 items-center justify-center rounded-full bg-white text-[#4B4242] shadow-md ring-1 ring-black/10">
                    <FiPlay className="ml-0.5 size-6 fill-current" aria-hidden />
                  </span>
                </span>
              ) : null}
            </div>
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={heroSlide === i ? "true" : undefined}
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

        <div className="lg:pt-2">

        {/* Titre + note */}
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-[#4B4242]">
            {product.name}
          </h1>
          <p
            className="inline-flex items-center gap-1 font-glacial text-[14px] text-[#78716c]"
            aria-label="Note 4,7 sur 5, 31 avis"
          >
            <FiStar className="size-4 fill-[#E8B84A] text-[#E8B84A]" aria-hidden />
            <span className="font-medium text-[#4B4242]">4.7</span>
            <span className="underline underline-offset-2">(31)</span>
          </p>
        </div>

        <p className="mt-2 font-glacial text-[14px] leading-[18px] text-[#78716c]">
          {product.desc}
        </p>

        {/* Packs */}
        <div className="mt-6 space-y-3">
          {PACKS.map((pack) => {
            const active = pack.id === packId;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => setPackId(pack.id)}
                className="relative flex w-full overflow-hidden rounded-[5px] border-[0.5px] border-[#C4A69C] bg-white text-left"
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
                      <span className="font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-[#4B4242]">
                        {pack.label}
                      </span>
                      <span className="shrink-0 font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-[#4B4242]">
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

        {/* CTA — Figma sticky mobile */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8E0D8] bg-white px-4 py-3 shadow-[0_-4px_24px_rgba(75,66,66,0.1)] lg:static lg:mt-[18px] lg:border-0 lg:px-0 lg:py-0 lg:shadow-none">
          <div className="mx-auto flex w-full max-w-[428px] items-center justify-between gap-3 lg:max-w-none">
            <div className="min-w-0">
              <p className="truncate font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-[#4B4242]">
                {selectedPack.label}
              </p>
              <p className="font-glacial text-[18px] font-bold leading-6 text-[#4B4242]">
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

        {/* Accordéons + avis */}
        <div className="-mx-4 mt-8 bg-[#F7F2EC] px-4 pb-8 pt-2 lg:mx-0 lg:rounded-[16px]">
          <div>
            {ACCORDIONS.map((item, i) => {
              const open = openAcc === i;
              return (
                <div key={item.title} className="border-b border-[#E8E0D8]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-[18px] text-left font-glacial text-[16px] font-normal leading-6 text-[#4B4242]"
                    aria-expanded={open}
                    onClick={() => setOpenAcc(open ? -1 : i)}
                  >
                    <span>{item.title}</span>
                    <span
                      className="flex size-5 shrink-0 items-center justify-center text-[20px] font-light leading-none"
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
        </div>
      </div>

      <section className="mt-[53px] bg-white px-4 pb-[53px] pt-0 lg:px-8">
        <div className="mx-auto w-full max-w-[428px] md:max-w-3xl lg:max-w-6xl">
          <h2 className="text-center font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-[#4B4242]">
            Autres recommandations
          </h2>
          {/* Même grille / card que /invitations-digital */}
          <div className="mt-[53px] grid grid-cols-2 justify-items-center gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
            {recommendations.map((p) => (
              <DigitalCatalogCard
                key={p.id}
                product={p}
                liked={isFavorite(p.id)}
                onToggleFavorite={(product) =>
                  toggleFavorite({
                    id: product.id,
                    title: product.name,
                    to: product.to,
                    image: product.img,
                    productType: "digital",
                  })
                }
                onOpen={(product) => navigate(product.to)}
              />
            ))}
          </div>
        </div>
      </section>

      <DigitalHomeFooter />
    </div>
  );
}

export default DigitalProductDetailPage;
