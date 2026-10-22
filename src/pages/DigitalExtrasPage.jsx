import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import { DIGITAL_PRODUCTS } from "./DigitalProductDetailPage";
import {
  DIGITAL_EXTRAS,
  DIGITAL_SECTIONS,
  resolveDigitalExtra,
  resolveDigitalPack,
  resolveDigitalSection,
} from "../data/digital/orderAddons";

/**
 * Étape commande digitale — Figma 1318:861 / Extras.png
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white pb-[100px] font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" context="digitale" />

      <header className="mx-auto flex w-full max-w-[428px] items-center justify-between border-b border-[#E8E0D8] px-4 py-4 lg:max-w-xl lg:px-8">
        <h1 className="font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-[#4B4242]">
          Ajoutez des extras
        </h1>
        <button
          type="button"
          onClick={closeToProduct}
          className="rounded p-2 text-[#4B4242] hover:bg-[#F7F2EC]"
          aria-label="Fermer"
        >
          <FiX className="size-5" strokeWidth={1.5} />
        </button>
      </header>

      <main className="mx-auto w-full max-w-[428px] flex-1 lg:max-w-xl">
        <div className="bg-[#F7F2EC] px-4 py-1">
          <ul>
            {DIGITAL_EXTRAS.map((item) => {
              const active = item.id === extraId;
              return (
                <li key={item.id} className="border-b border-[#E8E0D8] last:border-0">
                  <button
                    type="button"
                    onClick={() => setExtraId(item.id)}
                    className="flex w-full items-center gap-3 py-4 text-left"
                  >
                    <span
                      className={`size-[14px] shrink-0 rounded-full border ${
                        active
                          ? "border-[#332B29] bg-[#332B29]"
                          : "border-[#C4A69C] bg-transparent"
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-glacial text-[16px] font-bold leading-6 text-[#4B4242]">
                        {item.label}
                      </span>
                      <span className="block font-glacial text-[14px] leading-[18px] text-[#78716c]">
                        Economisez 10%
                      </span>
                    </span>
                    <span className="shrink-0 font-glacial text-[16px] font-bold leading-6 text-[#4B4242]">
                      {item.price}dt
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <section className="bg-white px-4 pb-6 pt-8">
          <h2 className="font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-[#4B4242]">
            Ajoutez une section
          </h2>

          <div className="mt-5 flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {DIGITAL_SECTIONS.map((item) => {
              const active = item.id === sectionId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSectionId(item.id)}
                  className="relative h-[98px] w-[220px] shrink-0 overflow-hidden rounded-[5px] border-[0.5px] border-[#C4A69C] bg-white text-left"
                >
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#C4A69C] to-white/20"
                    />
                  ) : null}
                  <span className="relative flex h-full items-start gap-2.5 px-3 py-3">
                    <span
                      className={`mt-1 size-[14px] shrink-0 rounded-full border ${
                        active
                          ? "border-[#332B29] bg-[#332B29]"
                          : "border-[#C4A69C] bg-white"
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="truncate font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-[#4B4242]">
                          {item.label}
                        </span>
                        <span className="shrink-0 font-lora text-[18px] font-normal leading-[34px] tracking-[-0.18px] text-[#4B4242]">
                          {item.price}DT
                        </span>
                      </span>
                      <span className="block font-glacial text-[14px] leading-[18px] text-[#78716c]">
                        Economisez 10%
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E8E0D8] bg-white px-4 py-3 shadow-[0_-4px_24px_rgba(75,66,66,0.1)]">
        <div className="mx-auto flex w-full max-w-[428px] items-center justify-between gap-3 lg:max-w-xl">
          <div className="min-w-0">
            <p className="truncate font-lora text-[16px] font-medium leading-6 text-[#4B4242]">
              {summaryParts.join(" + ")}
            </p>
            <p className="font-glacial text-[18px] font-bold leading-6 text-[#4B4242]">
              {total}dt
            </p>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#A97C72] px-6 font-glacial text-[14px] font-bold text-white shadow-[0px_8px_10px_rgba(168,125,115,0.28)] hover:bg-[#966B62]"
          >
            Continuer
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <p className="sr-only">
        Produit <Link to={`/invitations-digital/${product.slug}`}>{product.name}</Link>
      </p>
    </div>
  );
}

export default DigitalExtrasPage;
