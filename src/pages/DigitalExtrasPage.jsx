import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowRight, FiX } from "react-icons/fi";
import { DIGITAL_PRODUCTS } from "./DigitalProductDetailPage";
import {
  DIGITAL_EXTRAS,
  DIGITAL_SECTIONS,
  resolveDigitalExtra,
  resolveDigitalPack,
  resolveDigitalSection,
} from "../data/digital/orderAddons";

/**
 * Extras — Figma mobile + shell projet (header / max-w-6xl) comme les autres pages
 */
function DigitalExtrasPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const product = DIGITAL_PRODUCTS[slug] || DIGITAL_PRODUCTS["sidi-bousaid"];

  const pack = resolveDigitalPack(location.state?.pack);
  const [extraId, setExtraId] = useState(location.state?.extraId || DIGITAL_EXTRAS[0].id);
  const [sectionId, setSectionId] = useState(
    location.state?.sectionId || DIGITAL_SECTIONS[0].id
  );

  const selectedExtra = useMemo(() => resolveDigitalExtra(extraId), [extraId]);
  const selectedSection = useMemo(() => resolveDigitalSection(sectionId), [sectionId]);

  const total =
    pack.price + (selectedExtra?.price || 0) + (selectedSection?.price || 0);

  const summaryParts = [
    pack.label,
    selectedExtra ? "1 Extra" : null,
    selectedSection ? "1 Section" : null,
  ].filter(Boolean);

  const closeToProduct = () => {
    navigate(`/invitations-digital/${product.slug}`);
  };

  const handleContinue = () => {
    navigate(`/invitations-digital/${product.slug}/checkout`, {
      state: {
        pack: pack.id,
        extraId,
        sectionId,
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
              const active = item.id === extraId;
              return (
                <li
                  key={item.id}
                  className="border-b border-[#C4BBB3] lg:odd:border-r"
                >
                  <button
                    type="button"
                    onClick={() => setExtraId(item.id)}
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
              const active = item.id === sectionId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSectionId(item.id)}
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
