import React from "react";
import { useNavigate } from "react-router-dom";
import { homeDigitalAssets as a } from "./homeDigitalAssets";

const themes = [
  { title: "Delicate Beige", image: a.themeDelicateBeige, to: "/invitations-digital" },
  { title: "Bridgerton", image: a.themeBridgeton, to: "/digital-invitation/bridgerton" },
  { title: "Majestic White", image: a.themeMajesticWhite, to: "/digital-invitation/majestic-white" },
];

function ThemesSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-4 py-12">
      <div className="w-full">
        <h2 className="text-center lw-h1 lg:text-[36px]">
          Choisissez le thème qui vous ressemble.
        </h2>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 lg:grid ">
          {themes.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => navigate(t.to)}
              className="min-w-[220px] flex-shrink-0 text-left lg:min-w-0"
            >
              <img src={t.image} alt={t.title} className="aspect-[3/4] w-full rounded-2xl object-cover" />
              <span className="mt-3 block lw-h3">{t.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ThemesSection;
