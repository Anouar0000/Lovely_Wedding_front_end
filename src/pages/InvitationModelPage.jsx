import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown, FiX } from "react-icons/fi";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import DigitalHomeFooter from "../components/home/DigitalHomeFooter";
import { useCart } from "../context/CartContext";

const FIGMA = "/assets/home-physical/figma";

const ACCORDIONS = [
  { title: "Comment ça marche", body: "" },
  { title: "Délai de livraison", body: "" },
  { title: "Option accompagnement", body: "" },
];

const RECOS = [
  {
    name: "Versailles",
    img: `${FIGMA}/catalog-4.png`,
    price: "à partir de 1.5dt/pcs",
    filled: false,
  },
  {
    name: "Sacré cœur",
    img: `${FIGMA}/catalog-1.png`,
    price: "à partir de 1.5dt/pcs",
    filled: true,
  },
];

/** Product overview physique — Figma 169:618 */
function InvitationModelPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const model = location.state?.model;
  const selectedCategory = location.state?.selectedCategory || "Rustique";

  const [popup, setPopup] = useState(null);
  const popupRef = useRef(null);
  const [qté, setQté] = useState("");
  const [format, setFormat] = useState("Page plié (9,5 x 21 cm)");
  const [motif, setMotif] = useState("Bagues Doré");
  const [openAcc, setOpenAcc] = useState(-1);
  const [added, setAdded] = useState(false);

  const imageSrc = useMemo(() => {
    if (!model) return `${FIGMA}/catalog-6.png`;
    if (model.image) return model.image;
    if (model.thumbnail) {
      try {
        return require(`../${model.thumbnail}`);
      } catch {
        return `${FIGMA}/catalog-6.png`;
      }
    }
    return `${FIGMA}/catalog-6.png`;
  }, [model]);

  const openPopup = (label) => {
    setPopup(label);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setPopup(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };
    if (popup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popup]);

  const quantityOptions = [100, 120, 150, 170, 200, 220, 250, 270];
  const formatOptions = [
    "Page plié (9,5 x 21 cm)",
    "Page simple (10 x 15 cm)",
    "Carré (14 x 14 cm)",
  ];
  const motifOptions = ["Bagues Doré", "Fleurs Blanches", "Motif Classique"];
  const isFormValid = Boolean(qté && format && motif);

  const handlePersonalize = () => {
    if (!isFormValid) return;
    navigate("/personalize", { state: { model, qté, format, motif } });
  };

  const handleAddToCart = () => {
    if (!isFormValid || !model) return;
    addItem({
      productType: "physical",
      productId: model.templateId || model.name,
      title: model.name,
      qty: Number(String(qté).match(/\d+/)?.[0]) || 1,
      unitPrice: Number(model.price) || 1.5,
      format,
      motif,
      meta: { category: selectedCategory },
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  if (!model) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-urbanist text-lw-text">
        <DigitalHomeHeader mode="imprimee" />
        <p className="flex-1 p-10 text-center text-lw-muted">Aucun modèle sélectionné.</p>
        <DigitalHomeFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-urbanist text-lw-text">
      <DigitalHomeHeader mode="imprimee" />

      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-6 text-[14px] text-lw-text lg:px-8 lg:pt-10">
        <Link to="/" className="hover:text-lw-accent">
          Accueil
        </Link>
        <span>›</span>
        <Link to="/invitations-physique" className="hover:text-lw-accent">
          Invitations Physique
        </Link>
        <span>›</span>
        <span>Invitations {selectedCategory}</span>
        <span>›</span>
        <span className="font-bold">{model.name}</span>
      </nav>

      {/* Mobile : image full-bleed · Desktop : 2 colonnes image | détails */}
      <div className="mt-6 w-full lg:mx-auto lg:mt-10 lg:grid lg:max-w-6xl lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-8">
        <div className="w-full">
          <img
            src={imageSrc}
            alt={model.name}
            className="h-[537px] w-full object-cover lg:h-auto lg:min-h-[560px] lg:rounded-[5px] lg:object-cover"
          />
        </div>

        <section className="bg-[#fffaed] px-4 pb-10 pt-8 lg:rounded-[5px] lg:px-8 lg:pb-12 lg:pt-10">
          <div className="mx-auto w-full lg:mx-0">
            <h1 className="lw-h1 lg:text-[40px] lg:leading-tight">
              {model.name}
            </h1>
            <p className="mt-3 max-w-[398px] lw-sub lg:mt-4 lg:leading-7">
              Une invitation imprimée soignée — papier premium, finitions raffinées pour votre grand
              jour.
            </p>
            <p className="mt-4 font-abhaya text-[16px] text-[#1a1612]">350 gsm</p>

            <div className="mt-8 border-t border-lw-line">
              {[
                {
                  label: "Quantité :",
                  value: qté || "Choisissez votre quantité",
                  key: "Quantité",
                },
                { label: "Format :", value: format, key: "Format" },
                { label: "Motif :", value: motif, key: "Motif" },
              ].map((row) => (
                <button
                  key={row.key}
                  type="button"
                  className="flex w-full items-center justify-between border-b border-lw-line py-4 text-left"
                  onClick={() => openPopup(row.key)}
                >
                  <span className="font-urbanist text-[14px] font-bold capitalize text-lw-text">
                    {row.label}
                  </span>
                  <span className="flex items-center gap-2 font-urbanist text-[14px] text-lw-muted">
                    {row.value}
                    <FiChevronDown />
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-center font-urbanist text-[14px] font-bold uppercase text-lw-text lg:text-left">
              À partir de 1.5DT la pièce
            </p>
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handlePersonalize}
              className={`mt-3 flex h-[42px] w-[163px] items-center justify-center rounded-[5px] font-urbanist text-[14px] font-bold uppercase tracking-[0.7px] text-white mx-auto lg:mx-0 ${
                isFormValid ? "bg-lw-accent hover:bg-lw-accentDark" : "cursor-not-allowed bg-lw-line"
              }`}
            >
              Personnaliser
            </button>
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleAddToCart}
              className="mx-auto mt-3 block text-center font-urbanist text-sm font-semibold text-lw-accent underline underline-offset-4 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40 lg:mx-0 lg:text-left"
            >
              {added ? "Ajouté au panier" : "Ajouter au panier"}
            </button>

            <div className="mt-10 border-t border-lw-line">
              {ACCORDIONS.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-lw-line py-4 text-left"
                  onClick={() => setOpenAcc(openAcc === i ? -1 : i)}
                >
                  <span className="text-lg leading-none">{openAcc === i ? "−" : "+"}</span>
                  <span className="font-urbanist text-[14px] font-bold capitalize text-lw-text">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white px-4 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-center lw-h1 lg:text-[36px]">
            Autres recommandations
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:mx-auto lg:max-w-3xl lg:gap-10">
            {RECOS.map((r) => (
              <button
                key={r.name}
                type="button"
                className="text-left"
                onClick={() =>
                  navigate(`/invitation-model/${encodeURIComponent(r.name)}`, {
                    state: {
                      model: { name: r.name, price: 1.5, image: r.img, templateId: r.name },
                      selectedCategory,
                    },
                  })
                }
              >
                <div className="relative h-[224px] w-full overflow-hidden rounded-[5px] lg:aspect-[189/224] lg:h-auto">
                  <img src={r.img} alt={r.name} className="h-full w-full object-cover" />
                  <span
                    className={`absolute bottom-[12px] left-1/2 flex h-[19px] w-[127px] -translate-x-1/2 items-center justify-center rounded-full font-urbanist text-[10px] font-bold leading-none ${
                      r.filled
                        ? "bg-lw-accent text-white"
                        : "border border-lw-accent bg-white/90 text-lw-accent"
                    }`}
                  >
                    {r.price}
                  </span>
                </div>
                <h3 className="mt-4 lw-h3 lg:text-[24px]">{r.name}</h3>
                <p className="mt-1 lw-caption">
                  Includes music, animations & guestbook
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {popup ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div
            ref={popupRef}
            className="max-h-[75vh] w-full overflow-hidden rounded-t-[12px] bg-white p-4 sm:max-w-md sm:rounded-[12px]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="lw-h2">{popup}</h2>
              <button type="button" onClick={closePopup} aria-label="Fermer">
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="max-h-[58vh] space-y-1 overflow-y-auto pr-1">
              {popup === "Quantité" &&
                quantityOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="flex w-full items-center justify-between border-b border-lw-line px-3 py-3 text-left hover:bg-lw-surface"
                    onClick={() => {
                      setQté(`${option} (à 1.5DT l'unité)`);
                      closePopup();
                    }}
                  >
                    <span>{option} (à 1.5DT l&apos;unité)</span>
                    <span className="font-bold">{option * 1.5} DT</span>
                  </button>
                ))}
              {popup === "Format" &&
                formatOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="flex w-full border-b border-lw-line px-3 py-3 text-left hover:bg-lw-surface"
                    onClick={() => {
                      setFormat(option);
                      closePopup();
                    }}
                  >
                    {option}
                  </button>
                ))}
              {popup === "Motif" &&
                motifOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="flex w-full border-b border-lw-line px-3 py-3 text-left hover:bg-lw-surface"
                    onClick={() => {
                      setMotif(option);
                      closePopup();
                    }}
                  >
                    {option}
                  </button>
                ))}
            </div>
          </div>
        </div>
      ) : null}

      <DigitalHomeFooter />
    </div>
  );
}

export default InvitationModelPage;
