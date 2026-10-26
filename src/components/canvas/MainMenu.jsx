import React from "react";

function TextBlockIcon() {
  return (
    <svg width={29} height={29} viewBox="0 0 29 29" fill="none" aria-hidden>
      <rect x={2.5} y={2.5} width={24} height={24} rx={2} stroke="#292D32" strokeWidth={1.5} />
      <path d="M8 10h13M8 14.5h10M8 19h13" stroke="#292D32" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg width={29} height={29} viewBox="0 0 29 29" fill="none" aria-hidden>
      <rect x={2.5} y={2.5} width={24} height={24} rx={2} stroke="#292D32" strokeWidth={1.5} />
      <path
        d="M7 19.5l4.5-5.5 3.5 3.5 3-4 4 6H7z"
        stroke="#292D32"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle cx={11} cy={10} r={1.75} stroke="#292D32" strokeWidth={1.5} />
    </svg>
  );
}

function MainMenu({ onAddText, onShowApparenceMenu }) {
  return (
    <div className="w-full bg-white font-urbanist text-[#4B4242]">
      {/* Découpes & Perforations — bandeau au-dessus (Figma y≈850) */}
      <div className="flex items-center justify-center gap-8 border-t border-[#A19A9A]/50 bg-[#F4F4F4] px-4 py-2.5">
        <button type="button" className="flex items-center gap-2 text-[14px] font-normal leading-[17px]">
          <span className="inline-block h-0 w-[35px] border-t-2 border-dashed border-[#4B4242]" aria-hidden />
          Découpes & rainures
        </button>
        <button type="button" className="flex items-center gap-2 text-[14px] font-normal leading-[17px]">
          <span className="inline-block size-4 rounded-full border border-black" aria-hidden />
          Perforations
        </button>
      </div>

      <div className="flex h-[101px] items-center justify-center gap-[50px] sm:mx-auto sm:max-w-md">
        <button
          type="button"
          onClick={onAddText}
          className="flex w-[112px] flex-col items-center gap-1.5"
        >
          <TextBlockIcon />
          <span className="text-[14px] font-normal leading-[17px]">Ajouter texte</span>
        </button>

        <button
          type="button"
          onClick={onShowApparenceMenu}
          className="flex w-[112px] flex-col items-center gap-1.5"
        >
          <DesignIcon />
          <span className="text-[14px] font-normal leading-[17px]">Design</span>
        </button>
      </div>
    </div>
  );
}

export default MainMenu;
