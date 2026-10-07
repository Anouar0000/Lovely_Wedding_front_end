import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const quantities = ["200 pcs", "300 pcs", "400 pcs"];

/** Trouvez votre forfait — Figma 1173:626 */
function PhysicalPacksSection() {
  const navigate = useNavigate();
  const [qty, setQty] = useState("200 pcs");

  return (
    <section className="bg-[#f4f4f4] px-4 py-12 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-3xl">
        <h2 className="text-center lw-h1 lg:text-[40px]">
          Trouvez votre forfait
        </h2>
        <p className="mx-auto mt-3 max-w-[241px] text-center lw-sub lg:max-w-xl lg:text-[18px]">
          Choisissez le forfait qui correspond à vos envies.
        </p>

        <div className="mt-8 flex justify-center gap-6 lg:mt-10 lg:gap-10">
          {quantities.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQty(q)}
              className={`font-urbanist text-[18px] ${
                qty === q
                  ? "border-b-2 border-lw-text font-bold text-lw-text"
                  : "font-normal text-lw-text"
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        <img
          src="/assets/home-physical/figma/promo-card.png"
          alt="Exclusivité web — Réduction 5%"
          className="mx-auto mt-6 h-[184px] w-[303px] rounded-[5px] object-cover lg:mt-10 lg:h-[240px] lg:w-full lg:max-w-lg"
        />

        <div className="mt-8 flex justify-center lg:mt-12">
          <button
            type="button"
            onClick={() => navigate("/invitations-physique")}
            className="inline-flex h-[42px] w-[163px] items-center justify-center rounded-[5px] bg-lw-accent font-urbanist text-[14px] font-bold uppercase text-white hover:bg-lw-accentDark"
          >
            crée maintenant
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhysicalPacksSection;
