import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import InvitationCategoryPage from "../components/webcontent/InvitationCategoryPage";
import BaseSection from "../components/webcontent/BaseSection";
import data from "../data/categories.json";
import { useLocation } from "react-router-dom";
import img from "../assets/icons/Asset2.png";
import calimg from '../assets/images/caligraphy.png';

const getShuffledModels = (modelsData) => {
  let allModels = Object.values(modelsData).flat();
  for (let i = allModels.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [allModels[i], allModels[j]] = [allModels[j], allModels[i]];
  }
  return allModels;
};

const getImageSrc = (category) => {
  try {
    return require(`../assets/models/${category.toLowerCase()}/thumbnail/${category.toLowerCase()}1.png`);
  } catch (pngError) {
    try {
      return require(`../assets/models/${category.toLowerCase()}/thumbnail/${category.toLowerCase()}1.jpg`);
    } catch (jpgError) {
      console.warn(`Image not found for ${category}`);
      return null;
    }
  }
};

function InvitationsPhysiquePage() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = data.categories;

  // FIX #3: Added a fallback `|| []` to prevent the app from crashing.
  // If `data.models[selectedCategory]` is not found, `models` will be an empty array.
  const models = selectedCategory
    ? (data.models[selectedCategory] || [])
    : getShuffledModels(data.models);

  useEffect(() => {
    const stateCat = location.state?.selectedCategory;
    if (stateCat) {
      setSelectedCategory(stateCat);
      localStorage.setItem("selectedCategory", stateCat);
    } else if (location.key === "default") {
      const storedCat = localStorage.getItem("selectedCategory");
      if (storedCat) {
        setSelectedCategory(storedCat);
      }
    } else {
      setSelectedCategory(null);
      localStorage.removeItem("selectedCategory");
    }
  }, [location.state]); // Updated dependency for clarity

  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem("selectedCategory", selectedCategory);
    } else {
      localStorage.removeItem("selectedCategory");
    }
  }, [selectedCategory]);

  return (
    <div className="font-sans flex flex-col min-h-screen bg-[#F4F4F4]">
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <Header />
      </div>

      <div>
        <BaseSection
          title={`${selectedCategory || ""}`}
          description="Parcourez nos faire-part classés par collection pour vous aider à choisir votre thème de mariage et composez votre papeterie."
          setSelectedCategory={setSelectedCategory}
        />

        <section className="py-4 px-4">
          <div className="mx-auto max-w-6xl overflow-x-auto hide-scrollbar">
            <div className="flex gap-6 justify-start items-center lg:justify-center">
              <div
                className={`flex-shrink-0 flex flex-col items-center text-center w-28 cursor-pointer ${!selectedCategory ? "font-bold text-black" : ""}`}
                onClick={() => setSelectedCategory(null)}
              >
                <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center">
                  <img src={img} alt="All Models" className="w-full h-full object-cover rounded-full" />
                </div>
                <p className="mt-2 text-sm font-urbanist">Tous</p>
              </div>

              {categories.map((category, index) => {
                const imageSrc = getImageSrc(category);
                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 flex flex-col items-center text-center w-28 cursor-pointer ${selectedCategory === category ? "font-bold text-black" : ""}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center">
                      {imageSrc ? <img src={imageSrc} alt={category} className="w-full h-full object-cover rounded-full" /> : <p>Image not found</p>}
                    </div>
                    <p className="mt-2 text-sm font-urbanist">{category}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <InvitationCategoryPage
          title={`${selectedCategory || ""}`}
          models={models}
          selectedCategory={selectedCategory}
          onResetCategory={() => setSelectedCategory("")}
        />
      </div>

      <section className="py-8 px-4 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:items-center md:gap-10">
          <div className="mb-4"><img src={calimg} alt="" className="mx-auto max-h-[360px] object-contain" /></div>
          <div>
            <h2 className="text-xl test-left font-abhaya mb-2">Calligraphie</h2>
            <p className="text-gray-700 mb-4 text-sm">Optez pour un faire-part mariage luxueux et chic qui reflètera l'élégance et le raffinement de votre événement. Avec des designs haut de gamme</p>
            <button className="py-2 bg-transparent text-black border-b-2 border-black mb-3">Découvrir</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InvitationsPhysiquePage;
