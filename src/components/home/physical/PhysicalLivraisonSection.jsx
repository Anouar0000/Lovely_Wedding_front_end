import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

/** Étape 3 livraison — Figma carte 396×169 */
function PhysicalLivraisonSection() {
  return (
    <section className="bg-[#f4f4f4] px-4 py-10 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative mx-auto flex h-[260px] w-full max-w-[396px] items-center justify-center lg:h-[320px] lg:max-w-lg">
          <img
            src={a.livraison}
            alt=""
            className="h-[206px] w-auto max-w-[209px] object-contain lg:h-[260px] lg:max-w-[300px]"
          />
        </div>

        <div className="relative z-10 mx-auto -mt-4 w-full max-w-[396px] rounded-[5px] bg-white px-8 py-5 text-left shadow-sm sm:px-14 lg:mt-0 lg:max-w-none lg:px-10 lg:py-10">
          <h2 className="lw-h2 leading-7 text-lw-text lg:text-[36px] lg:leading-tight">
            Etape 3:
            <br />
            Recevez vos invitations
          </h2>
          <p className="mt-2 max-w-[260px] font-urbanist text-[14px] leading-5 text-lw-muted lg:mt-5 lg:max-w-md lg:text-[16px] lg:leading-6">
            Vos invitations sont imprimées avec soin et prêtes à être reçues sous 7 jours.
          </p>

          <div className="mt-4 flex items-center justify-between lg:mt-8 lg:max-w-xs">
            <button
              type="button"
              aria-label="Précédent"
              className="flex h-[26px] w-[26px] items-center justify-center text-lw-text"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              type="button"
              aria-label="Suivant"
              className="flex h-[26px] w-[26px] items-center justify-center text-lw-text"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhysicalLivraisonSection;
