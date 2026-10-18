import React, { useState } from "react";

/** FAQ — Figma 1741:326 */
const faqs = [
  "How long until I receive my invitation ?",
  "How long until I receive my invitation ?",
  "How long until I receive my invitation ?",
  "How long until I receive my invitation ?",
];

function Chevron({ open }) {
  return (
    <svg
      width={12}
      height={8}
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden
      className={`shrink-0 text-[#332b29] transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq" className="scroll-mt-24 bg-white px-4 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[397px] lg:max-w-3xl">
        <h2 className="text-center font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-lw-text lg:text-[40px] lg:leading-tight">
          FAQ
        </h2>
        <p className="mx-auto mt-2 max-w-[241px] text-center font-glacial text-[18px] font-normal leading-6 text-lw-muted">
          Frequently asked questions
        </p>

        <div className="mt-10 space-y-[11px]">
          {faqs.map((q, i) => {
            const isOpen = open === i;
            return (
              <div
                key={`${q}-${i}`}
                className="overflow-hidden rounded-[5px] border border-lw-accent bg-white"
              >
                <button
                  type="button"
                  className="flex h-[64px] w-full items-center justify-between gap-4 px-4 text-left font-urbanist text-[14px] font-normal leading-5 text-[#332b29]"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{q}</span>
                  <Chevron open={isOpen} />
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
