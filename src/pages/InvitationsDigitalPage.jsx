import React, { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiExternalLink, FiFilter, FiLink, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import groupsData from "../data/digital/groups.json";
import dolceVitaTemplate from "../data/digital/templates/dolce-vita.json";
import sidiBouSaidTemplate from "../data/digital/templates/sidi-bousaid.json";
import brezzaMarinaTemplate from "../data/digital/templates/brezza-marina.json";
import bridgertonTemplate from "../data/digital/templates/bridgerton.json";
import celestialTemplate from "../data/digital/templates/celestial.json";
import heroImage from "../assets/images/onlydigital1.png";
import dolceColumns from "../assets/digital/dolce-vita/figma-layer-01.png";
import dolceSun from "../assets/digital/dolce-vita/figma-layer-05.png";
import dolceVenue from "../assets/digital/dolce-vita/figma-layer-07.png";
import sidiView from "../assets/digital/sidi-bousaid/export-v2/dress-code-illustration.png";
import sidiLines from "../assets/digital/sidi-bousaid/export-v2/countdown-panel.png";
import brezzaVenue from "../assets/digital/brezza-marina/location-venue.png";
import brezzaAttire from "../assets/digital/brezza-marina/dress-code-attire.png";
import bridgertonHeroBg from "../assets/digital/bridgerton/hero-bg.png";
import bridgertonCouplePhoto from "../assets/digital/bridgerton/hero-couple-photo.png";
import bridgertonStampButterfly from "../assets/digital/bridgerton/stamp-4-4471f0.png";
import bridgertonStampSwan from "../assets/digital/bridgerton/stamp-1-4de4a6.png";
import bridgertonTornPaper from "../assets/digital/bridgerton/torn-paper-1.svg";
import celestialHeroBg from "../assets/digital/celestial/hero-bg.png";
import celestialEnvelope from "../assets/digital/celestial/black-enveloppe.png";
import celestialSunIcon from "../assets/digital/celestial/sun-icon.svg";
import celestialMoonSun from "../assets/digital/celestial/moon-sun-reveal.svg";

const digitalTemplatesById = {
  [dolceVitaTemplate.id]: dolceVitaTemplate,
  [sidiBouSaidTemplate.id]: sidiBouSaidTemplate,
  [brezzaMarinaTemplate.id]: brezzaMarinaTemplate,
  [bridgertonTemplate.id]: bridgertonTemplate,
  [celestialTemplate.id]: celestialTemplate,
};

const getGroupTemplates = (group) =>
  group.templateIds.map((templateId) => digitalTemplatesById[templateId]).filter(Boolean);

const getAllTemplates = () => groupsData.groups.flatMap((group) => getGroupTemplates(group));

const getImage = (path) => {
  try {
    return require(`../${path}`);
  } catch (error) {
    return heroImage;
  }
};

const templateThemes = {
  "dolce-vita": {
    eyebrow: "Italian garden",
    bg: "bg-[#f5f0df]",
    panel: "bg-[#fbf8ea]",
    accent: "text-[#130554]",
    border: "border-[#e3d17b]",
    button: "bg-[#08306b] text-white",
    preview: "dolce",
  },
  "sidi-bousaid": {
    eyebrow: "Sidi Bou Said",
    bg: "bg-[#dcebf0]",
    panel: "bg-[#f8fcff]",
    accent: "text-[#08306b]",
    border: "border-[#8fb9d4]",
    button: "bg-[#08306b] text-white",
    preview: "sidi",
  },
  "brezza-marina": {
    eyebrow: "Brezza Marina",
    bg: "bg-[#e8f3f8]",
    panel: "bg-[#ffffff]",
    accent: "text-[#0093d8]",
    border: "border-[#aacfe1]",
    button: "bg-[#08306b] text-white",
    preview: "brezza",
  },
  "bridgerton": {
    eyebrow: "Bridgerton Regency",
    bg: "bg-[#fdfbf7]",
    panel: "bg-[#ffffff]",
    accent: "text-[#722f37]",
    border: "border-[#e8d8d8]",
    button: "bg-[#722f37] text-white",
    preview: "bridgerton",
  },
  "celestial": {
    eyebrow: "Cosmic & Celestial",
    bg: "bg-[#0f172a]",
    panel: "bg-[#1e293b]",
    accent: "text-[#e8cc33]",
    border: "border-[#334155]",
    button: "bg-[#d48744] text-white",
    preview: "celestial",
  },
};

const getTemplateTheme = (templateId) =>
  templateThemes[templateId] || {
    eyebrow: "Digital invite",
    bg: "bg-white",
    panel: "bg-white",
    accent: "text-black",
    border: "border-gray-200",
    button: "bg-[#08306b] text-white",
    preview: "image",
  };

const TemplatePreview = ({ template }) => {
  const theme = getTemplateTheme(template.id);

  if (theme.preview === "celestial") {
    return (
      <div className="relative flex h-full min-h-[230px] items-center justify-center overflow-hidden bg-[#0a0d14]">
        <img src={celestialHeroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d14]/40 via-transparent to-[#0a0d14]/80" />
        <img src={celestialMoonSun} alt="" className="absolute -bottom-4 inset-x-0 w-full object-contain opacity-75 pointer-events-none" />
        <div className="relative z-10 w-[50%] max-w-[145px] overflow-hidden rounded-md border-2 border-[#d48744]/60 shadow-[0_16px_36px_rgba(0,0,0,0.7)]">
          <img src={celestialEnvelope} alt={template.name} className="h-full w-full object-cover" />
        </div>
        <img
          src={celestialSunIcon}
          alt=""
          className="absolute right-4 top-4 z-20 w-7 drop-shadow-[0_0_8px_rgba(232,204,51,0.8)] pointer-events-none animate-pulse"
        />
      </div>
    );
  }

  if (theme.preview === "bridgerton") {
    return (
      <div className="relative flex h-full min-h-[230px] items-center justify-center overflow-hidden bg-[#fdfbf7]">
        <img src={bridgertonHeroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-[#722f37]/10" />
        <img src={bridgertonTornPaper} alt="" className="absolute -bottom-5 inset-x-0 w-full object-cover opacity-90 pointer-events-none" />
        <div className="relative z-10 w-[52%] max-w-[155px] overflow-hidden rounded border-4 border-white shadow-[0_16px_36px_rgba(114,47,55,0.22)]">
          <img src={bridgertonCouplePhoto} alt={template.name} className="h-full w-full object-cover" />
        </div>
        <img
          src={bridgertonStampButterfly}
          alt=""
          className="absolute right-3 top-3 z-20 w-11 drop-shadow-md -rotate-12 pointer-events-none"
        />
        <img
          src={bridgertonStampSwan}
          alt=""
          className="absolute left-3 bottom-4 z-20 w-10 drop-shadow-md rotate-12 opacity-90 pointer-events-none"
        />
      </div>
    );
  }

  if (theme.preview === "sidi") {
    return (
      <div className="relative flex h-full min-h-[230px] items-center justify-center overflow-hidden bg-[#dcebf0]">
        <img src={sidiLines} alt="" className="absolute inset-x-0 top-6 h-24 w-full object-cover opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-[54%] bg-[#fbfcf5]" />
        <div className="absolute left-5 top-6 h-20 w-20 rounded-full bg-[#f4d23b]/80 blur-2xl" />
        <div className="relative w-[58%] max-w-[170px] overflow-hidden border-[10px] border-white shadow-[0_18px_45px_rgba(8,48,107,0.2)]">
          <img src={sidiView} alt={template.name} className="h-full w-full object-cover" />
        </div>
      </div>
    );
  }

  if (theme.preview === "dolce") {
    return (
      <div className="relative flex h-full min-h-[230px] items-center justify-center overflow-hidden bg-[#ebe7dd]">
        <img src={dolceColumns} alt="" className="absolute top-0 h-full w-full object-cover opacity-95" />
        <div className="absolute inset-5 border border-[#130554]/20 bg-[#f9faf3]/80" />
        <img src={dolceSun} alt="" className="absolute top-8 w-16" />
        <img src={dolceVenue} alt={template.name} className="relative mt-16 w-[44%] max-w-[145px] drop-shadow-xl" />
      </div>
    );
  }

  if (theme.preview === "brezza") {
    return (
      <div className="relative flex h-full min-h-[230px] items-center justify-center overflow-hidden bg-[#e8f3f8]">
        <img src={brezzaVenue} alt="" className="absolute inset-x-0 top-2 h-28 w-full object-contain opacity-75" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[#ffffff]" />
        <div className="relative w-[50%] max-w-[150px] overflow-hidden rounded-lg border-4 border-white shadow-[0_15px_35px_rgba(0,147,216,0.18)]">
          <img src={brezzaAttire} alt={template.name} className="h-full w-full object-cover" />
        </div>
      </div>
    );
  }

  return <img src={getImage(template.thumbnail)} alt={template.name} className="h-full w-full object-cover" />;
};

function InvitationsDigitalPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortType, setSortType] = useState("default");

  const templates = useMemo(() => {
    const selectedGroup = selectedCategory
      ? groupsData.groups.find((group) => group.id === selectedCategory)
      : null;

    const selectedTemplates = selectedCategory
      ? getGroupTemplates(selectedGroup || { templateIds: [] })
      : getAllTemplates();

    if (sortType === "price-asc") {
      return [...selectedTemplates].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortType === "price-desc") {
      return [...selectedTemplates].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return selectedTemplates;
  }, [selectedCategory, sortType]);

  useEffect(() => {
    setSortType("default");
  }, [selectedCategory]);

  return (
    <div className="font-sans flex min-h-screen flex-col bg-[#edf2f1]">
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <Header />
      </div>

      <main className="flex-1 pt-[57px]">
        <section className="bg-[#f8fbfb]">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="max-w-2xl">
              <div className="text-xs font-urbanist text-gray-600">
                Accueil &gt; <span className="font-bold text-black">Invitations Digital</span>
              </div>
              <h1 className="mt-8 text-4xl font-abhaya leading-none text-black md:text-5xl">
                Invitations Digital
              </h1>
              <p className="mt-4 font-urbanist text-sm leading-6 text-gray-700">
                Choisissez un modele digital pour creer une landing page partageable par lien, ou un post pret a envoyer aux invites.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 font-urbanist text-xs text-gray-700">
                <span className="inline-flex items-center gap-2 border border-[#c7d6d8] bg-white px-3 py-2">
                  <FiLink className="text-[#08306b]" /> Lien prive
                </span>
                <span className="inline-flex items-center gap-2 border border-[#c7d6d8] bg-white px-3 py-2">
                  <FiExternalLink className="text-[#08306b]" /> Partage mobile
                </span>
                <span className="inline-flex items-center gap-2 border border-[#c7d6d8] bg-white px-3 py-2">
                  <FiRefreshCw className="text-[#08306b]" /> Modifiable
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d8dedf] bg-white px-4 py-5">
          <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto hide-scrollbar">
            <button
              className={`flex-shrink-0 border-b-2 px-1 pb-2 font-urbanist text-sm ${
                !selectedCategory ? "border-black font-bold text-black" : "border-transparent text-gray-600"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              Tous
            </button>

            {groupsData.groups.map((category) => (
              <button
                key={category.id}
                className={`flex-shrink-0 border-b-2 px-1 pb-2 font-urbanist text-sm ${
                  selectedCategory === category.id ? "border-black font-bold text-black" : "border-transparent text-gray-600"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-urbanist text-sm text-gray-600">{templates.length} modeles digitaux trouves</h2>
            <label className="flex items-center gap-2 font-urbanist text-sm text-gray-700">
              <FiFilter />
              <select
                value={sortType}
                onChange={(event) => setSortType(event.target.value)}
                className="border border-gray-300 bg-white px-2 py-1 text-sm"
              >
                <option value="default">Filtrer</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix decroissant</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {
              const theme = getTemplateTheme(template.id);

              return (
              <article key={template.name} className={`overflow-hidden border ${theme.border} ${theme.panel} shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl`}>
                <div className={`h-64 ${theme.bg} sm:h-72`}>
                  <TemplatePreview template={template} />
                </div>
                <div className="p-4">
                  <div className={`mb-2 font-urbanist text-xs uppercase tracking-[0.18em] ${theme.accent}`}>
                    {theme.eyebrow} / {template.format}
                  </div>
                  <h3 className="font-abhaya text-2xl leading-6">{template.name}</h3>
                  <p className="mt-2 min-h-[64px] font-urbanist text-xs leading-5 text-gray-700">
                    {template.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <span key={feature} className="border border-black/10 bg-white/70 px-2 py-1 font-urbanist text-[11px] text-gray-700">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-urbanist text-sm font-bold">a partir de {template.price}DT</p>
                    <button
                      className={`inline-flex items-center gap-2 px-3 py-2 font-urbanist text-sm transition hover:opacity-90 ${theme.button}`}
                      onClick={() => template.previewPath && navigate(template.previewPath)}
                    >
                      Apercu <FiArrowRight />
                    </button>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default InvitationsDigitalPage;

