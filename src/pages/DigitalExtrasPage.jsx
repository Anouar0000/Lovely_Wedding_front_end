import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowRight, FiX } from "react-icons/fi";
import { DIGITAL_PRODUCTS } from "./DigitalProductDetailPage";
import {
  DIGITAL_EXTRAS,
  DIGITAL_SECTIONS,
  normalizeAddonIds,
  resolveDigitalExtras,
  resolveDigitalPack,
  resolveDigitalSections,
  toggleAddonId,
} from "../data/digital/orderAddons";

/**
 * Extras — Figma mobile + shell projet (header / max-w-6xl) comme les autres pages
 * Multi-sélection : cliquer pour ajouter / retirer (on peut tout sélectionner)
 */
function DigitalExtrasPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const product = DIGITAL_PRODUCTS[slug] || DIGITAL_PRODUCTS["sidi-bousaid"];

  const pack = resolveDigitalPack(location.state?.pack);
  const [extraIds, setExtraIds] = useState(() => {
    const fromState = normalizeAddonIds(
      location.state?.extraIds ?? location.state?.extraId,
      DIGITAL_EXTRAS
    );
    return fromState.length ? fromState : [DIGITAL_EXTRAS[0].id];
  });
  const [sectionIds, setSectionIds] = useState(() => {
    const fromState = normalizeAddonIds(
      location.state?.sectionIds ?? location.state?.sectionId,
      DIGITAL_SECTIONS
    );
    return fromState.length ? fromState : [DIGITAL_SECTIONS[0].id];
  });

  const selectedExtras = useMemo(() => resolveDigitalExtras(extraIds), [extraIds]);
  const selectedSections = useMemo(
    () => resolveDigitalSections(sectionIds),
    [sectionIds]
  );

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const sectionsTotal = selectedSections.reduce((sum, s) => sum + s.price, 0);
  const total = pack.price + extrasTotal + sectionsTotal;

  const summaryParts = [
    pack.label,
    selectedExtras.length
      ? `${selectedExtras.length} Extra${selectedExtras.length > 1 ? "s" : ""}`
      : null,
    selectedSections.length
      ? `${selectedSections.length} Section${selectedSections.length > 1 ? "s" : ""}`
      : null,
  ].filter(Boolean);

  const closeToProduct = () => {
    navigate(`/invitations-digital/${product.slug}`);
  };

  const handleContinue = () => {
    navigate(`/invitations-digital/${product.slug}/checkout`, {
      state: {
        pack: pack.id,
        extraIds,
        sectionIds,
        total,
      },
    });
  };

  return (
    <>
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white pb-[max(96px,calc(72px+env(safe-area-inset-bottom,0px)))] font-glacial text-[#4B4242]">
      <div className="mx-auto w-full max-w-[428px] md:max-w-3xl lg:max-w-6xl">
        <header className="flex h-[86px] items-center justify-between border-b border-[#C4BBB3] bg-white px-4 shadow-[0px_1px_5px_rgba(0,0,0,0.08)] lg:px-8">
          <h1 className="font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242] lg:text-[26px]">
            Ajoutez des extras
          </h1>
          <button
            type="button"
            onClick={closeToProduct}
            className="flex size-6 items-center justify-center text-[#4B4242] hover:opacity-70"
            aria-label="Fermer"
          >
            <FiX className="size-5" strokeWidth={2} />
          </button>
        </header>

        <div className="bg-[#F7F2EC]">
          <ul className="lg:grid lg:grid-cols-2">
            {DIGITAL_EXTRAS.map((item, index) => {
              const active = extraIds.includes(item.id);
              return (
                <li
                  key={item.id}
                  className="border-b border-[#C4BBB3] lg:odd:border-r"
                >
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setExtraIds((ids) => toggleAddonId(ids, item.id))}
                    className={`flex w-full items-center gap-3 px-4 text-left lg:min-h-[96px] lg:px-8 lg:py-5 ${
                      index === 0 ? "h-[108px] lg:h-auto" : "h-[100px] lg:h-auto"
                    }`}
                  >
                    <span
                      className={`size-[14px] shrink-0 rounded-full ${
                        active
                          ? "bg-[#4B4242]"
                          : "border border-[#4B4242] bg-transparent"
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-glacial text-[14px] font-bold leading-6 text-[#4B4242]">
                        {item.label}
                      </span>
                      <span className="block font-glacial text-[14px] font-normal leading-[18px] text-[#78716C]">
                        Economisez 10%
                      </span>
                    </span>
                    <span className="shrink-0 font-glacial text-[14px] font-bold leading-6 text-[#4B4242]">
                      {item.price}dt
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <section className="bg-white px-4 pb-8 pt-5 lg:px-8">
          <h2 className="font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-[#4B4242] lg:text-[20px]">
            Ajoutez une section
          </h2>

          <div className="-mx-4 mt-3 flex gap-6 overflow-x-auto hide-scrollbar px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0 xl:grid-cols-4">
            {DIGITAL_SECTIONS.map((item) => {
              const active = sectionIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSectionIds((ids) => toggleAddonId(ids, item.id))}
                  className="relative h-[96px] w-[311px] shrink-0 overflow-hidden rounded-[5px] border border-[#78716C] bg-white text-left lg:h-[100px] lg:w-full"
                >
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-[100px] rounded-[5px]"
                      style={{
                        background:
                          "linear-gradient(270deg, #C4A69C 11.54%, rgba(255, 255, 255, 0.2) 100%)",
                        transform: "matrix(-1, 0, 0, 1, 0, 0)",
                      }}
                    />
                  ) : null}
                  <span className="relative flex h-full items-center gap-3 px-3">
                    <span
                      className={`size-[14px] shrink-0 rounded-full ${
                        active
                          ? "bg-[#4B4242]"
                          : "border border-[#4B4242] bg-transparent"
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-urbanist text-[14px] font-bold capitalize leading-[17px] text-[#4B4242]">
                          {item.label}
                        </span>
                        <span className="shrink-0 font-urbanist text-[14px] font-bold uppercase leading-[17px] text-[#4B4242]">
                          {item.price}dt
                        </span>
                      </span>
                      <span className="mt-1 block font-urbanist text-[14px] font-normal leading-5 text-[#78716C]">
                        Economisez 10%
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <p className="sr-only">
        Produit <Link to={`/invitations-digital/${product.slug}`}>{product.name}</Link>
      </p>
    </div>

    {/* Hors overflow-x-hidden : Firefox coupe sinon le fixed */}
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#C4BBB3] bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_24px_rgba(75,66,66,0.12)]">
      <div className="mx-auto flex w-full max-w-[428px] items-center justify-between gap-3 md:max-w-3xl lg:max-w-6xl">
        <div className="min-w-0">
          <p className="truncate font-lora text-[18px] font-normal leading-7 tracking-[-0.18px] text-[#4B4242]">
            {summaryParts.join(" + ")}
          </p>
          <p className="font-glacial text-[18px] font-bold leading-6 text-[#4B4242]">
            {total}dt
          </p>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex h-12 w-[136px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#A97C72] font-glacial text-[14px] font-bold text-white shadow-[0px_8px_20px_rgba(168,125,115,0.28)] hover:bg-[#966B62]"
        >
          Continuer
          <FiArrowRight className="size-[18px]" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </div>
    </>
  );
}

export default DigitalExtrasPage;
