import React, { useState } from "react";

/** FAQ — Figma 1012:844 (copy client, sans réponses inventées) */
const faqs = [
  "How long until I receive my invitation ?",
  "How long until I receive my invitation ?",
  "How long until I receive my invitation ?",
  "How long until I receive my invitation ?",
];

function FaqSection() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq" className="bg-white px-4 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <h2 className="text-center lw-h1 lg:text-[40px]">
          FAQ
        </h2>
        <p className="mx-auto mt-3 max-w-[241px] text-center lw-sub lg:max-w-xl lg:text-[18px]">
          Frequently asked questions
        </p>
        <div className="mt-10 space-y-[11px]">
          {faqs.map((q, i) => {
            const isOpen = open === i;
            return (
              <div
                key={`${q}-${i}`}
                className="overflow-hidden rounded-[5px] bg-[#f4f4f4]"
              >
                <button
                  type="button"
                  className="flex h-[64px] w-full items-center justify-between gap-4 px-4 text-left font-urbanist text-[14px] font-medium text-lw-text"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{q}</span>
                  <span className="text-lg leading-none" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
