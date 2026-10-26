import React, { useState } from "react";
import { fontOptions } from "../../config/fontConfig";

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
const LINE_HEIGHTS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const COLOR_OPTIONS = [
  "#B69EAC",
  "#D9D9D9",
  "#D9B9AC",
  "#E1E9D1",
  "#F2E5D4",
  "#000000",
  "#FFFFFF",
  "#868686",
  "#DB2F2F",
  "#4B4242",
];

function CloseIcon({ size = 19 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x={3} y={3} width={18} height={18} rx={2} stroke="#292D32" strokeWidth={1.5} />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#292D32" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width={29} height={29} viewBox="0 0 29 29" fill="none" aria-hidden>
      <rect x={2.5} y={2.5} width={24} height={24} rx={2} stroke="#292D32" strokeWidth={1.5} />
      <path
        d="M10 11h9M11.5 11V10a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0117.5 10v1M12 13v5M14.5 13v5M17 13v5"
        stroke="#292D32"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function TextSizeIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h10M9 6v12M14 18h6M17 10v8" stroke="#4B4242" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function LineHeightIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 5v14M4 7l2-2 2 2M4 17l2 2 2-2M12 8h8M12 12h6M12 16h8" stroke="#292D32" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function AlignCenterIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M6 12h12M4 17h16" stroke="#4B4242" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function AlignLeftIcon({ size = 31 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 31 31" fill="none" aria-hidden>
      <path d="M6 9h19M6 15.5h14M6 22h19" stroke="#4B4242" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function AlignRightIcon({ size = 31 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 31 31" fill="none" aria-hidden>
      <path d="M6 9h19M11 15.5h14M6 22h19" stroke="#4B4242" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function SmallcapsIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 17V8h5.5v1.6H7.1v2.2h3V13.4h-3v1.9H11V17H5zm9.2 0l-.9-2.4H10l-.9 2.4H7.5L11 7h2.2l3.5 10h-2.5zM12.4 9.6L11.1 13h2.6l-1.3-3.4z"
        fill="#292D32"
      />
    </svg>
  );
}

function BottomMenu({
  onDelete,
  setSelectedTextId,
  fontSize,
  setFontSize,
  alignment,
  setAlignment,
  fontFamily,
  setFontFamily,
  setTextColor,
  lineHeight,
  setLineHeight,
  textTransform,
  setTextTransform,
  smallCaps,
  setSmallCaps,
}) {
  const [activeTab, setActiveTab] = useState("format");
  const [activeSubTab, setActiveSubTab] = useState("FontSize");

  const subUnderline = (id) =>
    activeSubTab === id ? "bg-[#4B4242]" : "bg-transparent";

  return (
    <div className="relative w-full bg-white font-urbanist text-[#4B4242] sm:mx-auto sm:max-w-[430px]">
      {/* Trash + close above panel */}
      <div className="pointer-events-none absolute inset-x-0 -top-[37px] flex h-[29px] items-center justify-between px-2">
        <button
          type="button"
          onClick={onDelete}
          className="pointer-events-auto rounded-sm bg-white p-0.5"
          aria-label="Supprimer"
        >
          <TrashIcon />
        </button>
        <button
          type="button"
          onClick={() => setSelectedTextId(null)}
          className="pointer-events-auto flex h-[29px] w-[44px] items-center justify-end bg-white pr-2"
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="h-[208px] w-full">
        {/* Format / Police tabs */}
        <div className="relative flex h-[54px] items-stretch border-b border-[#A19A9A]/50">
          <button
            type="button"
            className={`flex w-1/2 items-center justify-center text-[16px] leading-[19px] ${
              activeTab === "format" ? "bg-[#F4F4F4]" : "bg-white"
            }`}
            onClick={() => {
              setActiveTab("format");
              setActiveSubTab("FontSize");
            }}
          >
            Format
          </button>
          <div className="absolute left-1/2 top-0 h-[54px] w-px -translate-x-1/2 bg-[#A19A9A]" aria-hidden />
          <button
            type="button"
            className={`flex w-1/2 items-center justify-center text-[16px] leading-[19px] ${
              activeTab === "textStyle" ? "bg-[#F4F4F4]" : "bg-white"
            }`}
            onClick={() => {
              setActiveTab("textStyle");
              setActiveSubTab(null);
            }}
          >
            Police
          </button>
        </div>

        {activeTab === "format" && (
          <div>
            {/* Sub-toolbar icons */}
            <div className="relative flex h-[53px] items-center justify-around border-b border-[#A19A9A]/50 px-6">
              <button
                type="button"
                className="relative flex flex-col items-center pb-1"
                onClick={() => setActiveSubTab("FontSize")}
                aria-label="Taille"
              >
                <TextSizeIcon />
                <span className={`absolute -bottom-px h-[3px] w-[49px] ${subUnderline("FontSize")}`} />
              </button>
              <button
                type="button"
                className="relative flex flex-col items-center pb-1"
                onClick={() => setActiveSubTab("LineHeight")}
                aria-label="Interligne"
              >
                <LineHeightIcon />
                <span className={`absolute -bottom-px h-[3px] w-[49px] ${subUnderline("LineHeight")}`} />
              </button>
              <button
                type="button"
                className="relative flex flex-col items-center pb-1"
                onClick={() => setActiveSubTab("TextAlign")}
                aria-label="Alignement"
              >
                <AlignCenterIcon />
                <span className={`absolute -bottom-px h-[3px] w-[49px] ${subUnderline("TextAlign")}`} />
              </button>
              <button
                type="button"
                className="relative flex flex-col items-center pb-1"
                onClick={() => setActiveSubTab("TextType")}
                aria-label="Casse"
              >
                <SmallcapsIcon />
                <span className={`absolute -bottom-px h-[3px] w-[49px] ${subUnderline("TextType")}`} />
              </button>
            </div>

            {activeSubTab === "FontSize" && (
              <div className="flex h-[101px] items-center justify-between gap-1 overflow-x-auto px-2 hide-scrollbar">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`flex h-[31px] w-[30px] shrink-0 items-center justify-center text-[16px] font-semibold leading-[19px] ${
                      Number(fontSize) === size ? "bg-[#F3F3F3]" : ""
                    }`}
                    onClick={() => setFontSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {activeSubTab === "LineHeight" && (
              <div className="flex h-[101px] items-center justify-between gap-1 overflow-x-auto px-2 hide-scrollbar">
                {LINE_HEIGHTS.map((height) => (
                  <button
                    key={height}
                    type="button"
                    className={`flex h-[31px] w-[30px] shrink-0 items-center justify-center text-[16px] font-semibold leading-[19px] ${
                      Number(lineHeight) === height ? "bg-[#F3F3F3]" : ""
                    }`}
                    onClick={() => setLineHeight(height)}
                  >
                    {height}
                  </button>
                ))}
              </div>
            )}

            {activeSubTab === "TextAlign" && (
              <div className="flex h-[101px] items-center justify-center gap-[54px]">
                {[
                  { id: "left", icon: <AlignLeftIcon /> },
                  { id: "center", icon: <AlignCenterIcon size={31} /> },
                  { id: "right", icon: <AlignRightIcon /> },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`flex size-[46px] items-center justify-center ${
                      alignment === opt.id ? "bg-[#F3F3F3]" : ""
                    }`}
                    onClick={() => setAlignment(opt.id)}
                    aria-label={opt.id}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>
            )}

            {activeSubTab === "TextType" && (
              <div className="flex h-[101px] items-center justify-center gap-10">
                {[
                  { id: "uppercase", label: "AB" },
                  { id: "none", label: "Ab" },
                  { id: "lowercase", label: "ab" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`flex size-[46px] items-center justify-center text-[18px] leading-[22px] ${
                      (textTransform || "none") === opt.id ? "bg-[#F3F3F3]" : ""
                    }`}
                    onClick={() => {
                      setTextTransform?.(opt.id);
                      if (opt.id === "uppercase") setSmallCaps?.(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  type="button"
                  className={`flex size-[46px] items-center justify-center ${
                    smallCaps ? "bg-[#F3F3F3]" : ""
                  }`}
                  onClick={() => setSmallCaps?.(!smallCaps)}
                  aria-label="Petites capitales"
                >
                  <SmallcapsIcon />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "textStyle" && (
          <div className="flex h-[154px] flex-col">
            <div className="flex flex-1 items-center gap-6 overflow-x-auto px-3 hide-scrollbar">
              {fontOptions.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  className={`flex h-[101px] w-[101px] shrink-0 items-center justify-center px-2 text-center text-[14px] leading-[18px] ${
                    fontFamily === font.pdfName ? "bg-[#F3F3F3]" : ""
                  }`}
                  style={{ fontFamily: font.pdfName }}
                  onClick={() => setFontFamily(font.pdfName)}
                >
                  {font.displayName}
                </button>
              ))}
            </div>
            <div className="flex h-[47px] items-center justify-between gap-2 overflow-x-auto border-t border-[#A19A9A]/50 px-2 hide-scrollbar">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="size-[26px] shrink-0 rounded-full"
                  style={{
                    backgroundColor: color,
                    border: color === "#FFFFFF" ? "0.5px solid #000" : "none",
                  }}
                  onClick={() => setTextColor(color)}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="flex justify-start pb-1 pl-0 pt-0">
        <div className="h-[6px] w-[228px] bg-[#D9D9D9]" aria-hidden />
      </div>
    </div>
  );
}

export default BottomMenu;
