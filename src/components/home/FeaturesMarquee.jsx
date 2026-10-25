import React from "react";

const DEFAULT_ITEMS = [
  "RSVP",
  "Custom Domain",
  "Save The Dates",
  "Custom Music",
  "Guest Book",
  "Live Updates",
];

/** Bandeau Figma — ticker horizontal infini */
function FeaturesMarquee({ items = DEFAULT_ITEMS }) {
  const track = [...items, ...items];

  return (
    <section className="overflow-hidden bg-[#F7F2EC] py-4" aria-label="Fonctionnalités">
      <div className="flex w-max animate-hero-marquee gap-10 whitespace-nowrap px-4 font-glacial text-[14px] font-bold uppercase tracking-[0.12em] text-lw-text lg:gap-14">
        {track.map((label, i) => (
          <span key={`${label}-${i}`}>{label}</span>
        ))}
      </div>
    </section>
  );
}

export default FeaturesMarquee;
