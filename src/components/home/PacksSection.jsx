import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CHECK_ICON = "/assets/home-digital/figma/circle-check.svg";
const CHECK_ICON_ROSE = "/assets/home-digital/figma/circle-check-rose.svg";
const ARROW_ICON = "/assets/home-digital/figma/arrow-right.svg";
const ARROW_ICON_DARK = "/assets/home-digital/figma/arrow-right-dark.svg";
const ARROW_ICON_WHITE = "/assets/home-digital/figma/arrow-right-white.svg";
const SUR_MESURE_STARS = "/assets/home-digital/figma/sur-mesure-stars.png";
const SUR_MESURE_VIP_BADGE = "/assets/home-digital/figma/sur-mesure-vip-badge.svg";

const CheckIcon = ({ className = "", tone = "currentColor", size = 18 }) => (
  <svg
    className={`shrink-0 ${className}`}
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden
  >
    <circle cx="9" cy="9" r="7.25" stroke={tone} strokeWidth="1.5" />
    <path
      d="M5.5 9.2L7.8 11.5L12.5 6.5"
      stroke={tone}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SIGNATURE_W = 395;
const SIGNATURE_H = 633;

const SIGNATURE_TAGS = ["Musique", "Vidéo save the date", "Illustrations animées"];

/** Garde les 3 tags sur une ligne dans la largeur Figma (331px). */
function SignatureTags() {
  const wrapRef = useRef(null);
  const rowRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const row = rowRef.current;
    if (!wrap || !row) return undefined;
    const fit = () => {
      const have = wrap.clientWidth;
      const need = row.scrollWidth;
      setScale(have > 0 && need > have ? have / need : 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden">
      <div
        ref={rowRef}
        className="flex w-max flex-nowrap items-start gap-[6px]"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "left center",
        }}
      >
        {SIGNATURE_TAGS.map((tag) => (
          <span
            key={tag}
            className="inline-flex shrink-0 items-start whitespace-nowrap rounded-full bg-white/30 px-[10px] py-[5px] font-glacial text-[12px] font-normal leading-6 text-white"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Figma Plan / Signature — node 1611:1027 (395×633). Scale si l’écran est plus étroit. */
function SignaturePackCard({ onChoose }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => {
      const w = el.clientWidth;
      setScale(w > 0 && w < SIGNATURE_W ? w / SIGNATURE_W : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full max-w-[395px]"
      style={{ height: SIGNATURE_H * scale }}
    >
    <article
      className="absolute left-0 top-0 overflow-hidden rounded-[24px] bg-[#C4A69C] text-white shadow-[0px_24px_48px_-8px_rgba(51,43,41,0.22)]"
      style={{
        width: SIGNATURE_W,
        height: SIGNATURE_H,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
      data-name="Plan / Signature"
    >
      {/* Header — x:32 y:36 w:331 h:164 */}
      <div className="absolute left-8 right-8 top-9 h-[164px]">
        <div className="relative h-9 w-full">
          <h3 className="absolute left-0 top-0 font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-white">
            Signature
          </h3>
          <span className="absolute right-0 top-[7px] inline-flex h-[21px] items-center rounded-full bg-white px-[10px] font-glacial text-[12px] font-bold leading-none text-[#4B4242]">
            Le plus choisi
          </span>
        </div>
        <p className="absolute left-0 top-[70px] font-glacial text-[16px] font-normal leading-6 text-white">
          Paiement unique
        </p>
        <div className="absolute left-0 top-[109px] flex items-baseline gap-1 text-white">
          <span className="font-lora text-[50px] font-medium leading-9 tracking-[-0.5px]">175</span>
          <span className="font-glacial text-[16px] font-normal leading-6">DT</span>
        </div>
      </div>

      {/* Divider — y:200 */}
      <div className="absolute left-8 right-8 top-[200px] h-px bg-white" />

      {/* Inclus — Figma y:221 ; lignes à y 70/108/146/184 */}
      <div className="absolute left-8 right-8 top-[221px] h-[208px]">
        <p className="absolute left-0 top-0 font-glacial text-[14px] font-normal leading-[18px] text-white">
          INCLUS
        </p>
        <p className="absolute left-0 top-8 whitespace-nowrap font-glacial text-[14px] font-bold leading-6 tracking-[0.04em] text-white">
          Tout l&apos;Essentiel, plus :
        </p>
        {[
          { y: 70, text: "Jusqu’à 10 sections personnalisées" },
          { y: 108, text: "Gestion des cadeaux & cagnottes" },
          { y: 146, text: "2 langues (français / arabe)" },
          { y: 184, text: "4 retouches sur-mesure du design" },
        ].map((row) => (
          <div
            key={row.text}
            className="absolute left-0 right-0 flex h-5 items-center gap-3"
            style={{ top: row.y }}
          >
            <img src={CHECK_ICON} alt="" width={20} height={20} className="size-5 shrink-0" />
            <p className="whitespace-nowrap font-glacial text-[16px] font-normal leading-5 text-white">
              {row.text}
            </p>
          </div>
        ))}
      </div>

      {/* Détails — Figma 1611:1050, y:445, h:84 */}
      <div className="absolute left-8 right-8 top-[445px] flex h-[84px] flex-col gap-[14px]">
        <p className="w-full font-glacial text-[14px] font-normal leading-[18px] text-white">
          L&apos;Essentiel, enrichi de nombreuses options et fonctionnalités.
        </p>
        <SignatureTags />
      </div>

      {/* Button — y:549 h:48 */}
      <button
        type="button"
        onClick={onChoose}
        className="absolute left-8 right-8 top-[549px] inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#A97C72] pl-6 pr-5 font-glacial text-[14px] font-bold leading-6 text-white shadow-[0px_8px_10px_rgba(168,125,115,0.28)] transition-colors hover:bg-[#966c63]"
      >
        Choisir Signature
        <img src={ARROW_ICON} alt="" width={18} height={18} className="size-[18px] shrink-0" />
      </button>
    </article>
    </div>
  );
}

const ESSENTIEL_W = 395;
const ESSENTIEL_H = 666;

/** Figma Plan / Essentiel — node 1611:1179 (395×666). */
function EssentielPackCard({ onChoose }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => {
      const w = el.clientWidth;
      setScale(w > 0 && w < ESSENTIEL_W ? w / ESSENTIEL_W : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full max-w-[395px]"
      style={{ height: ESSENTIEL_H * scale }}
    >
      <article
        className="absolute left-0 top-0 overflow-hidden rounded-[24px] border border-solid border-[#E3D9CE] bg-white"
        style={{
          width: ESSENTIEL_W,
          height: ESSENTIEL_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        data-name="Plan / Essentiel"
      >
        {/* Header — x:32 y:36 */}
        <div className="absolute left-8 right-8 top-9 h-[164px]">
          <h3 className="absolute left-0 top-0 font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-[#4B4242]">
            Essentiel
          </h3>
          <p className="absolute left-0 top-[70px] font-glacial text-[16px] font-normal leading-6 text-[#4B4242]">
            Paiement unique
          </p>
          <div className="absolute left-0 top-[109px] flex items-baseline gap-1 text-[#4B4242]">
            <span className="font-lora text-[50px] font-medium leading-9 tracking-[-0.5px]">99</span>
            <span className="font-glacial text-[16px] font-normal leading-6">DT</span>
          </div>
        </div>

        {/* Divider — y:200 */}
        <div className="absolute left-8 right-8 top-[200px] h-px bg-[#E3D9CE]" />

        {/* Inclus — y:229 ; lignes y 32/70/108/146/184 */}
        <div className="absolute left-8 right-8 top-[229px] h-[208px]">
          <p className="absolute left-0 top-0 font-glacial text-[14px] font-normal leading-[18px] text-[#A97C72]">
            INCLUS
          </p>
          {[
            { y: 32, text: "6 sections personnalisées" },
            { y: 70, text: "RSVP + espace client" },
            { y: 108, text: "Enveloppe animée" },
            { y: 146, text: "2 retouches sur-mesure du design" },
            { y: 184, text: "Intégration musique & vidéo" },
          ].map((row) => (
            <div
              key={row.text}
              className="absolute left-0 right-0 flex h-6 items-start gap-3"
              style={{ top: row.y }}
            >
              <img
                src={CHECK_ICON_ROSE}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0"
              />
              <p className="min-w-0 flex-1 font-glacial text-[16px] font-normal leading-6 text-[#332B29]">
                {row.text}
              </p>
            </div>
          ))}
        </div>

        {/* Détails — y:465 */}
        <div className="absolute left-8 right-8 top-[465px] flex flex-col gap-[14px]">
          <p className="w-full font-glacial text-[14px] font-normal leading-[18px] text-[#6F6760]">
            Un modèle de notre collection, personnalisé avec vos informations.
          </p>
          <div className="flex flex-wrap content-start gap-1.5">
            {["Musique", "Illustrations animées"].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-start whitespace-nowrap rounded-full bg-[rgba(196,166,156,0.6)] px-[10px] py-[5px] font-glacial text-[14px] font-normal leading-[18px] text-[#332B29]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Button — y:583 h:48 ; Figma stroke 1.5px #332B29 */}
        <button
          type="button"
          onClick={onChoose}
          className="absolute left-8 right-8 top-[583px] box-border inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white pl-6 pr-5 font-glacial text-[14px] font-bold leading-6 text-[#332B29] transition-colors hover:bg-[#F7F2EC]"
          style={{ border: "1.5px solid #332B29" }}
        >
          Choisir Essentiel
          <img
            src={ARROW_ICON_DARK}
            alt=""
            width={18}
            height={18}
            className="size-[18px] shrink-0"
          />
        </button>
      </article>
    </div>
  );
}

const SUR_MESURE_W = 395;
const SUR_MESURE_H = 669;

/** Figma Plan / Sur mesure — node 1611:1279 (395×669). */
function SurMesurePackCard({ onChoose }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => {
      const w = el.clientWidth;
      setScale(w > 0 && w < SUR_MESURE_W ? w / SUR_MESURE_W : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full max-w-[395px]"
      style={{ height: SUR_MESURE_H * scale }}
    >
      <article
        className="absolute left-0 top-0 overflow-hidden rounded-[24px] border border-solid border-[#FFE7B8] bg-[#332B29]"
        style={{
          width: SUR_MESURE_W,
          height: SUR_MESURE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        data-name="Plan / Sur mesure"
      >
        {/* Stars — top decorative layer */}
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-[325px] w-full overflow-hidden rounded-t-[24px]">
          <img
            src={SUR_MESURE_STARS}
            alt=""
            className="absolute left-0 top-[-6%] h-[108%] w-full max-w-none object-cover mix-blend-screen"
          />
        </div>

        {/* Header — y:36 */}
        <div className="absolute left-8 right-8 top-9 z-10 h-[164px]">
          <div className="relative h-9 w-full">
            <h3 className="absolute left-0 top-0 font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-white">
              Sur Mesure
            </h3>
            <div className="absolute right-0 top-[6px] h-6 w-[118px]">
              <img
                src={SUR_MESURE_VIP_BADGE}
                alt=""
                width={118}
                height={24}
                className="absolute inset-0 size-full"
              />
              <p className="absolute inset-0 flex items-center justify-center font-glacial text-[12px] font-bold leading-none text-white">
                ✦ EXPÉRIENCE VIP
              </p>
            </div>
          </div>
          <p className="absolute left-0 top-[70px] font-glacial text-[16px] font-normal leading-6 text-white">
            Paiement unique
          </p>
          <div className="absolute left-0 top-[109px] flex items-baseline gap-1 text-white">
            <span className="font-lora text-[50px] font-medium leading-9 tracking-[-0.5px]">275</span>
            <span className="font-glacial text-[16px] font-normal leading-6">DT</span>
          </div>
        </div>

        {/* Divider — y:200 */}
        <div className="absolute left-8 right-8 top-[200px] z-10 h-px bg-white" />

        {/* Inclus — y:229 ; lignes 38/76/114/152/190 */}
        <div className="absolute left-8 right-8 top-[229px] z-10 h-[214px]">
          <p className="absolute left-0 top-0 font-glacial text-[16px] font-normal leading-6 text-[#A97C72]">
            INCLUS
          </p>
          <p className="absolute left-0 top-[38px] whitespace-nowrap font-glacial text-[14px] font-bold leading-6 text-white">
            Tout Signature, plus :
          </p>
          {[
            { y: 76, text: "Sections illimitées" },
            { y: 114, text: "Contact direct avec notre designer" },
            { y: 152, text: "3 langues" },
            { y: 190, text: "Icônes & illustrations personnalisées" },
          ].map((row) => (
            <div
              key={row.text}
              className="absolute left-0 right-0 flex h-6 items-start gap-3"
              style={{ top: row.y }}
            >
              <img
                src={CHECK_ICON_ROSE}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0"
              />
              <p className="min-w-0 flex-1 font-glacial text-[16px] font-normal leading-6 text-white">
                {row.text}
              </p>
            </div>
          ))}
        </div>

        {/* Détails — y:460 */}
        <div className="absolute left-8 right-8 top-[460px] z-10 flex flex-col gap-[14px]">
          <p className="w-full font-glacial text-[14px] font-normal leading-[18px] text-white">
            Une personnalisation complète de votre invitation, avec notre designer.
          </p>
          <div className="flex flex-wrap content-start gap-1.5">
            {[
              "Musique",
              "Vidéo save the date personnalisée",
              "Illustrations animées",
              "Monogramme",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-start whitespace-nowrap rounded-full bg-white/30 px-[10px] py-[5px] font-glacial text-[14px] font-normal leading-[18px] text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Button — y:589 h:48 */}
        <button
          type="button"
          onClick={onChoose}
          className="absolute left-8 right-8 top-[589px] z-10 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#A97C72] pl-6 pr-5 font-glacial text-[15px] font-bold leading-none tracking-[0.15px] text-white transition-colors hover:bg-[#966c63]"
        >
          Choisir Sur mesure
          <img
            src={ARROW_ICON_WHITE}
            alt=""
            width={18}
            height={18}
            className="size-[18px] shrink-0"
          />
        </button>
      </article>
    </div>
  );
}

const TRUST_POINTS = [
  "Paiement unique, sans abonnement",
  "Modifications illimitées 30 jours",
  "Support WhatsApp 7j/7",
];

function PacksSection() {
  const navigate = useNavigate();
  const choose = (packId) => navigate("/signup", { state: { pack: packId } });

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

        <div className="mt-8 flex w-full min-w-0 flex-col items-center gap-5 overflow-x-hidden lg:mt-14 lg:grid lg:grid-cols-3 lg:items-start lg:justify-items-center lg:gap-6">
          <SignaturePackCard onChoose={() => choose("signature")} />
          <EssentielPackCard onChoose={() => choose("essentiel")} />
          <SurMesurePackCard onChoose={() => choose("sur-mesure")} />
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-[395px] flex-col items-center lg:mt-14">
          <p className="w-full max-w-[395px] text-center font-glacial text-[14px] font-normal leading-[18px] text-[#78716C]">
            Un paiement unique, pas d&apos;abonnement. Changez de forfait à tout moment avant
            l&apos;envoi.
          </p>
          <ul className="mt-3 flex flex-col items-center gap-[17px]">
            {TRUST_POINTS.map((pt) => (
              <li
                key={pt}
                className="flex items-center gap-2 font-jost text-[13px] font-normal leading-[18px] text-[#6F6760]"
              >
                <CheckIcon size={16} tone="#6F6760" />
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
