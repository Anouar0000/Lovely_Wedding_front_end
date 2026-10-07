import React from "react";
import { useNavigate } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

function ConceptDigitalSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-4 py-12">
      <div className="flex flex-col gap-6">
        <img
          src={a.heroVisual2}
          alt=""
          className="mx-auto w-full max-w-md object-contain"
        />
        <div className="text-center">
          <h2 className="lw-h2">
            Un site personnalisé pour partager tous les détails de votre mariage.
          </h2>
          <p className="mt-4 lw-body">
            Créez, personnalisez et envoyez votre invitation digitale en quelques minutes.
          </p>
          <button
            type="button"
            onClick={() => navigate("/invitations-digital")}
            className="mt-6 lw-btn px-8"
          >
            VOIR LE CATALOGUE
          </button>
        </div>
      </div>
    </section>
  );
}

export default ConceptDigitalSection;
