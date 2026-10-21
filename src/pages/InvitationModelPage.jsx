import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiChevronDown, FiStar, FiX } from "react-icons/fi";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { useCart } from "../context/CartContext";

const FIGMA = "/assets/home-physical/figma";

const UNIT_PRICE = 1.5;

const QUANTITY_OPTIONS = [100, 120, 150, 170, 200, 220, 250, 270];

const FORMAT_OPTIONS = [
  "Page plié (15 x 21 cm)",
  "Page plié (9,5 x 21 cm)",
  "Page simple (10 x 15 cm)",
  "Carré (14 x 14 cm)",
];

const MOTIF_OPTIONS = ["Bagues Or", "Bagues Doré", "Fleurs Blanches", "Motif Classique"];

const ACCORDIONS = [
  {
    title: "Comment ça marche",
    body: "Choisissez quantité, format et motif, personnalisez vos textes, puis validez votre commande.",
  },
  {
    title: "Délai de livraison",
    body: "Impression et expédition sous 7 à 14 jours ouvrés après validation.",
  },
  {
    title: "Ce qui est inclu",
    body: "Invitation imprimée, enveloppe assortie et finitions selon le motif choisi.",
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

const PHYSICAL_PRODUCTS = [
  { name: "Versailles", img: `${FIGMA}/catalog-4.png`, category: "Rustique" },
  { name: "Sacré cœur", img: `${FIGMA}/catalog-1.png`, category: "Outeya" },
  { name: "Aimé", img: `${FIGMA}/catalog-5.png`, category: "Cire" },
  { name: "Passeport Rosé", img: `${FIGMA}/catalog-2.png`, category: "Rustique" },
  { name: "Rustique 3", img: `${FIGMA}/catalog-6.png`, category: "Rustique" },
  { name: "Arabesque 1", img: `${FIGMA}/catalog-3.png`, category: "Outeya" },
];

const CATALOG_BY_NAME = Object.fromEntries(
  PHYSICAL_PRODUCTS.map((p) => [p.name, { img: p.img, category: p.category }]).concat([
    ["Passeport rosé", { img: `${FIGMA}/catalog-2.png`, category: "Rustique" }],
  ])
);

/** Product overview physique — détails Figma (dropdowns + Passer la commande) */
function InvitationModelPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { modelName: routeName } = useParams();
  const { addItem } = useCart();

  const resolvedName = location.state?.model?.name || decodeURIComponent(routeName || "");
  const catalogHit = CATALOG_BY_NAME[resolvedName];
  const model =
    location.state?.model ||
    (resolvedName
      ? {
          name: resolvedName,
          price: UNIT_PRICE,
          image: catalogHit?.img || `${FIGMA}/catalog-6.png`,
          templateId: resolvedName,
        }
      : null);
  const selectedCategory =
    location.state?.selectedCategory || catalogHit?.category || "Rustique";

  const [qty, setQty] = useState(100);
  const [format, setFormat] = useState(FORMAT_OPTIONS[0]);
  const [motif, setMotif] = useState(MOTIF_OPTIONS[0]);
  const [popup, setPopup] = useState(null);
  const [openAcc, setOpenAcc] = useState(-1);
  const popupRef = useRef(null);

  const unitPrice = UNIT_PRICE;
  const imageSrc = useMemo(() => {
    if (!model) return `${FIGMA}/catalog-6.png`;
    return model.image || catalogHit?.img || `${FIGMA}/catalog-6.png`;
  }, [model, catalogHit]);

  const total = qty ? qty * unitPrice : null;
  const isFormValid = Boolean(qty && format && motif);

  const recommendations = useMemo(() => {
    const sameCat = PHYSICAL_PRODUCTS.filter(
      (p) => p.category === selectedCategory && p.name !== model?.name
    );
    const pool = sameCat.length >= 2 ? sameCat : PHYSICAL_PRODUCTS.filter((p) => p.name !== model?.name);
    return pool.slice(0, 2);
  }, [selectedCategory, model?.name]);

  const closePopup = () => setPopup(null);

  useEffect(() => {
    if (!popup) return undefined;
    const onDown = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) closePopup();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [popup]);

  const openProduct = (p) => {
    navigate(`/invitation-model/${encodeURIComponent(p.name)}`, {
      state: {
        model: {
          name: p.name,
          price: UNIT_PRICE,
          image: p.img,
          templateId: p.name,
        },
        selectedCategory: p.category,
      },
    });
  };

  const handleOrder = () => {
    if (!isFormValid || !model) return;
    addItem({
      productType: "physical",
      productId: model.templateId || model.name,
      title: model.name,
      qty,
      unitPrice,
      format,
      motif,
      meta: { category: selectedCategory },
    });
    navigate("/cart");
  };

  if (!model) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-glacial text-lw-text">
        <DigitalHomeHeader mode="none" context="imprimee" />
        <p className="flex-1 p-10 text-center text-lw-muted">Aucun modèle sélectionné.</p>
        <DigitalHomeFooter />
      </div>
    );
  }

  const rows = [
    {
      key: "Quantité",
      label: "Quantité :",
      value: qty ? `${qty} (à ${unitPrice}DT l'unité)` : "Choisissez votre quantité",
      muted: !qty,
    },
    { key: "Format", label: "Format :", value: format, muted: false },
    { key: "Motif", label: "Motif :", value: motif, muted: false },
  ];

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white pb-[88px] font-glacial text-lw-text lg:pb-0">
      <DigitalHomeHeader mode="none" context="imprimee" />

      <nav className="mx-auto flex w-full max-w-[428px] flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-6 text-[14px] text-lw-text lg:max-w-6xl lg:px-8 lg:pt-10">
        <Link to="/imprimee" className="hover:text-lw-accent">
          Accueil
        </Link>
        <span aria-hidden className="text-lw-muted">
          ›
        </span>
        <Link to="/invitations-physique" className="hover:text-lw-accent">
          Invitations Physique
        </Link>
        <span aria-hidden className="text-lw-muted">
          ›
        </span>
        <Link
          to="/invitations-physique"
          state={{ filter: selectedCategory }}
          className="hover:text-lw-accent"
        >
          {selectedCategory}
        </Link>
        <span aria-hidden className="text-lw-muted">
          ›
        </span>
        <span className="font-bold">{model.name}</span>
      </nav>

      <div className="mx-auto w-full max-w-[428px] px-4 pb-0 pt-5 lg:max-w-6xl lg:px-8 lg:pb-0 lg:pt-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          <div>
            <div className="mx-auto h-[537px] w-[396px] max-w-full overflow-hidden rounded-[20px] bg-[#fffaed] lg:mx-0">
              <img src={imageSrc} alt={model.name} className="h-full w-full object-cover" />
            </div>
          </div>

          <section className="mt-6 lg:mt-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-lora text-[28px] font-medium leading-[30px] tracking-[-0.28px] text-lw-text lg:text-[40px] lg:leading-tight">
                {model.name}
              </h1>
              <p
                className="inline-flex items-center gap-1 font-glacial text-[14px] text-lw-muted"
                aria-label="Note 4,7 sur 5, 21 avis"
              >
                <FiStar className="size-4 fill-[#E8B84A] text-[#E8B84A]" aria-hidden />
                <span className="font-medium text-lw-text">4.7</span>
                <span className="underline underline-offset-2">(21)</span>
              </p>
            </div>

            <p className="mt-2 font-glacial text-[14px] leading-5 text-lw-muted">
              Classic stationery-inspired design.
            </p>

            {/* Amount — Value: Lora Medium 22/34 -1% · Currency Sub 2 Glacial 16/24 #7D6E66 */}
            <p className="mt-3 inline-flex items-baseline gap-1">
              <span className="font-lora text-[22px] font-medium leading-[34px] tracking-[-0.01em] text-lw-text">
                {UNIT_PRICE}
              </span>
              <span className="font-glacial text-[16px] font-normal leading-6 text-[#7D6E66]">
                DT
              </span>
            </p>

            <div className="mt-6 border-t border-[#E8E0D8]">
              {rows.map((row) => (
                <button
                  key={row.key}
                  type="button"
                  onClick={() => setPopup(row.key)}
                  className="flex w-full items-center justify-between gap-3 border-b border-[#E8E0D8] py-4 text-left"
                >
                  <span className="shrink-0 font-glacial text-[14px] font-bold text-lw-text">
                    {row.label}
                  </span>
                  <span
                    className={`flex min-w-0 items-center gap-2 font-glacial text-[14px] ${
                      row.muted ? "text-lw-muted" : "text-lw-text"
                    }`}
                  >
                    <span className="truncate">{row.value}</span>
                    <FiChevronDown className="size-4 shrink-0" aria-hidden />
                  </span>
                </button>
              ))}
            </div>

            {/* Résumé + CTA — fixe en bas (mobile), in-flow desktop */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8E0D8] bg-white px-4 py-3 shadow-[0_-4px_24px_rgba(75,66,66,0.1)] lg:static lg:mt-[18px] lg:border-0 lg:px-0 lg:py-0 lg:shadow-none">
              <div className="mx-auto flex w-full max-w-[428px] items-center justify-between gap-3 lg:max-w-none">
                <div className="min-w-0">
                  <p className="truncate font-lora text-[16px] font-medium leading-6 text-lw-text">
                    {model.name}
                  </p>
                  <p className="mt-0.5 font-glacial text-[18px] font-bold leading-[24px] tracking-normal text-lw-text">
                    {total != null
                      ? `${total % 1 === 0 ? total : total.toFixed(1)}dt`
                      : `${UNIT_PRICE}dt`}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={handleOrder}
                  className={`inline-flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-full px-5 font-glacial text-[14px] font-semibold text-white ${
                    isFormValid
                      ? "bg-[#A97C72] hover:bg-[#966B62]"
                      : "cursor-not-allowed bg-[#D9D9D9]"
                  }`}
                >
                  Passer la commande
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>

            {/* Accordéons + avis — fond beige Figma #F7F2EC */}
            <div className="-mx-4 mt-8 bg-[#F7F2EC] px-4 pb-8 pt-2 lg:-mx-0 lg:rounded-[24px] lg:px-5">
              <div>
                {ACCORDIONS.map((item, i) => {
                  const open = openAcc === i;
                  return (
                    <div key={item.title} className="border-b border-[#E8E0D8]">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 py-[18px] text-left font-glacial text-[14px] font-medium leading-5 text-lw-text"
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
            Autres recommandations
          </h2>
          <div className="mt-[53px] grid grid-cols-2 gap-4 lg:gap-10">
            {recommendations.map((r) => (
              <button
                key={r.name}
                type="button"
                className="lw-product-card group p-1 text-left"
                onClick={() => openProduct(r)}
              >
                <div className="relative h-[224px] w-full overflow-hidden rounded-[5px] bg-[#fffaed] lg:aspect-[189/224] lg:h-auto">
                  <img src={r.img} alt={r.name} className="h-full w-full object-cover" />
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
            ))}
          </div>
        </div>
      </section>

      {popup ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#C4A69C]/50 sm:items-center"
          role="presentation"
          onClick={closePopup}
        >
          <div
            ref={popupRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-[428px] overflow-hidden rounded-none bg-white shadow-[0_-8px_32px_rgba(75,66,66,0.18)]"
          >
            <div className="flex items-center justify-between px-5 pb-1 pt-5">
              <h2
                id="popup-title"
                className="font-glacial text-[20px] font-semibold leading-7 text-lw-text"
              >
                {popup}
              </h2>
              <button
                type="button"
                onClick={closePopup}
                aria-label="Fermer"
                className="flex size-8 items-center justify-center text-lw-text"
              >
                <FiX className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 pb-8">
              {popup === "Quantité" &&
                QUANTITY_OPTIONS.map((option) => {
                  const lineTotal = option * unitPrice;
                  const active = qty === option;
                  const totalLabel =
                    lineTotal % 1 === 0 ? `${lineTotal}DT` : `${lineTotal.toFixed(1)}DT`;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors ${
                        active
                          ? "border border-[#C4A69C] bg-white"
                          : "border-b border-[#E8E0D8] border-x-0 border-t-0 hover:bg-[#F7F2EC]/40"
                      }`}
                      onClick={() => {
                        setQty(option);
                        closePopup();
                      }}
                    >
                      <span className="font-glacial text-[14px] font-normal leading-5 text-[#7D6E66]">
                        {option} (à {unitPrice}DT l&apos;unité)
                      </span>
                      <span className="shrink-0 font-glacial text-[14px] font-bold leading-5 text-lw-text">
                        {totalLabel}
                      </span>
                    </button>
                  );
                })}
              {popup === "Format" &&
                FORMAT_OPTIONS.map((option) => {
                  const active = format === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`flex w-full px-4 py-4 text-left font-glacial text-[14px] text-lw-text transition-colors ${
                        active
                          ? "border border-[#C4A69C] bg-white font-medium"
                          : "border-b border-[#E8E0D8] border-x-0 border-t-0 hover:bg-[#F7F2EC]/40"
                      }`}
                      onClick={() => {
                        setFormat(option);
                        closePopup();
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              {popup === "Motif" &&
                MOTIF_OPTIONS.map((option) => {
                  const active = motif === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`flex w-full px-4 py-4 text-left font-glacial text-[14px] text-lw-text transition-colors ${
                        active
                          ? "border border-[#C4A69C] bg-white font-medium"
                          : "border-b border-[#E8E0D8] border-x-0 border-t-0 hover:bg-[#F7F2EC]/40"
                      }`}
                      onClick={() => {
                        setMotif(option);
                        closePopup();
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      ) : null}

      <DigitalHomeFooter />
    </div>
  );
}

export default InvitationModelPage;
