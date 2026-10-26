import React, { useEffect, useState } from "react";
import data from "../../data/physical/categories.json";
import {
  PERSONALIZE_CARD_BACK,
  PERSONALIZE_CARD_FRONT,
} from "../home/homePhysicalAssets";

function CloseIcon() {
  return (
    <svg width={19} height={19} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x={3} y={3} width={18} height={18} rx={2} stroke="#292D32" strokeWidth={1.5} />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#292D32" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function ApparenceMenu({ model, designOptions: designOptionsProp, onDesignChange, onTemplateChange, onClose }) {
  const [designOptions, setDesignOptions] = useState(designOptionsProp || []);

  useEffect(() => {
    if (Array.isArray(designOptionsProp) && designOptionsProp.length > 0) {
      setDesignOptions(designOptionsProp);
      return;
    }

    if (!model?.name) return;

    const nameParts = model.name.trim().split(" ");
    if (nameParts.length < 2) {
      setDesignOptions(
        [1, 2, 3].map((i) => ({
          templateId: `personalize-${i}`,
          name: `${model.name} ${i}`,
          frontImage: PERSONALIZE_CARD_FRONT,
          fullData: {
            name: model.name,
            modelImage: PERSONALIZE_CARD_FRONT,
            modelImagep2: PERSONALIZE_CARD_BACK,
            templateId: model.templateId || "m1",
          },
        }))
      );
      return;
    }

    const category = nameParts[nameParts.length - 2];
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const categoryModelsArray = data.models[capitalizedCategory];

    if (Array.isArray(categoryModelsArray) && categoryModelsArray.length > 0) {
      setDesignOptions(
        categoryModelsArray.map((modelData) => ({
          templateId: modelData.templateId || modelData.name,
          name: modelData.name,
          frontImage: PERSONALIZE_CARD_FRONT,
          fullData: {
            ...modelData,
            modelImage: PERSONALIZE_CARD_FRONT,
            modelImagep2: PERSONALIZE_CARD_BACK,
          },
        }))
      );
    } else {
      setDesignOptions(
        [1, 2, 3].map((i) => ({
          templateId: `personalize-${i}`,
          name: `${model.name} ${i}`,
          frontImage: PERSONALIZE_CARD_FRONT,
          fullData: {
            name: model.name,
            modelImage: PERSONALIZE_CARD_FRONT,
            modelImagep2: PERSONALIZE_CARD_BACK,
            templateId: model.templateId || "m1",
          },
        }))
      );
    }
  }, [model, designOptionsProp]);

  return (
    <div className="relative w-full bg-white font-urbanist text-[#4B4242] sm:mx-auto sm:max-w-[430px]">
      <div className="pointer-events-none absolute inset-x-0 -top-[37px] flex justify-end px-2">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex h-[29px] w-[44px] items-center justify-end bg-white pr-2"
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="h-[208px] w-full">
        <div className="flex h-[54px] items-center border-b border-[#A19A9A]/50 px-4">
          <p className="w-full text-center text-[16px] leading-[19px]">Design</p>
        </div>

        <div className="h-[154px] overflow-hidden">
          {designOptions.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-[#78716C]">Aucune option de design trouvée.</p>
            </div>
          ) : (
            <div className="flex h-full overflow-x-auto hide-scrollbar">
              {designOptions.map((design, index) => {
                const selected = model?.modelImage === design.frontImage;
                return (
                  <button
                    key={design.templateId || index}
                    type="button"
                    className={`relative h-[148px] w-[148px] shrink-0 overflow-hidden border-r border-[#A19A9A] ${
                      selected ? "ring-2 ring-inset ring-[#A97C72]" : ""
                    }`}
                    onClick={() => {
                      onDesignChange?.(design.fullData || design);
                      onTemplateChange?.(design.fullData || design);
                    }}
                  >
                    <img
                      src={design.frontImage}
                      alt={design.name || `Design ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start pb-1">
        <div className="h-[6px] w-[228px] bg-[#D9D9D9]" aria-hidden />
      </div>
    </div>
  );
}

export default ApparenceMenu;
