import React, { useEffect, useMemo, useState } from "react";
import { FiExternalLink, FiFilter, FiLink, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import groupsData from "../data/digital/groups.json";
import dolceVitaTemplate from "../data/digital/templates/dolce-vita.json";
import sidiBouSaidTemplate from "../data/digital/templates/sidi-bousaid.json";
import heroImage from "../assets/images/onlydigital1.png";

const digitalTemplatesById = {
  [dolceVitaTemplate.id]: dolceVitaTemplate,
  [sidiBouSaidTemplate.id]: sidiBouSaidTemplate,
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
    <div className="font-sans flex min-h-screen flex-col bg-[#F4F4F4]">
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <Header />
      </div>

      <main className="flex-1 pt-[57px]">
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
              <div>
                <div className="text-xs font-urbanist text-gray-600">
                  Accueil &gt; <span className="font-bold text-black">Invitations Digital</span>
                </div>
                <h1 className="mt-8 text-3xl font-abhaya text-black">Invitations Digital</h1>
                <p className="mt-4 font-urbanist text-sm leading-6 text-gray-700">
                  Choisissez un modele digital pour creer une landing page partageable par lien, ou un post pret a envoyer aux invites.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center font-urbanist text-xs">
                  <div className="border border-gray-200 bg-[#F4F4F4] px-3 py-4">
                    <FiLink className="mx-auto mb-2 text-lg" />
                    Lien prive
                  </div>
                  <div className="border border-gray-200 bg-[#F4F4F4] px-3 py-4">
                    <FiExternalLink className="mx-auto mb-2 text-lg" />
                    Partage mobile
                  </div>
                  <div className="border border-gray-200 bg-[#F4F4F4] px-3 py-4">
                    <FiRefreshCw className="mx-auto mb-2 text-lg" />
                    Modifiable
                  </div>
                </div>
              </div>

              <div className="h-64 overflow-hidden bg-gray-200 md:h-80">
                <img src={heroImage} alt="Invitation digitale" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-gray-200 bg-[#F4F4F4] px-4 py-5">
          <div className="mx-auto flex max-w-5xl gap-5 overflow-x-auto hide-scrollbar">
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

        <section className="mx-auto max-w-5xl px-4 py-8">
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

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
            {templates.map((template) => (
              <article key={template.name} className="bg-white shadow-full">
                <div className="h-44 bg-gray-200 md:h-56">
                  <img
                    src={getImage(template.thumbnail)}
                    alt={template.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="mb-2 font-urbanist text-xs uppercase text-gray-500">{template.format}</div>
                  <h3 className="font-abhaya text-lg leading-5">{template.name}</h3>
                  <p className="mt-2 min-h-[64px] font-urbanist text-xs leading-5 text-gray-700">
                    {template.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <span key={feature} className="bg-gray-100 px-2 py-1 font-urbanist text-[11px] text-gray-700">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-urbanist text-sm font-bold">a partir de {template.price}DT</p>
                    <button
                      className="border-b-2 border-black pb-1 font-urbanist text-sm"
                      onClick={() => template.previewPath && navigate(template.previewPath)}
                    >
                      Voir plus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default InvitationsDigitalPage;
