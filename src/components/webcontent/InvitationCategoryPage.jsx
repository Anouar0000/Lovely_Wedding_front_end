import React, { useState, useEffect, useRef } from "react";
import { FiX, FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function InvitationsCategoryPage({ title, models, selectedCategory, onResetCategory }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  const [filteredModels, setFilteredModels] = useState(models);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortType, setSortType] = useState(null); // 'price-asc', 'price-desc', 'date'

  const filterRef = useRef(null);

  useEffect(() => {
    setFilteredModels(models);
    setVisibleCount(6);
  }, [models]);

  const showMore = () => {
    setVisibleCount(models.length);
  };

  const sortModels = (type) => {
    let sorted = [...models];

    if (type === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (type === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (type === "date") {
      // Placeholder: You can add a date field and sort by new Date(a.date)
      sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); // Random for now
    }

    setSortType(type);
    setFilteredModels(sorted);
    setFilterOpen(false);
  };

  // Click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  return (
    <div className="pb-4">
      <section className="py-8 px-4">
        <h1 className="text-sm text-gray-600 pb-2">{filteredModels.length} produits trouvés</h1>

        {selectedCategory && (
          <div className="flex justify-between items-center mb-4 relative">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-200 px-3 py-1 rounded">
                <span className="text-sm text-gray-700">{selectedCategory}</span>
                <button onClick={onResetCategory} className="ml-2 text-gray-500 hover:text-gray-700">
                  <FiX />
                </button>
              </div>
              <button onClick={onResetCategory} className="text-sm text-gray-700 underline hover:text-black">
                Réinitialiser les filtres
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterOpen((prev) => !prev)}
                className="flex items-center text-sm text-gray-700 hover:text-black"
              >
                <FiFilter className="mr-1" />
                Filtrer
              </button>

              {filterOpen && (
                <div
                  ref={filterRef}
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 p-4 border"
                >
                  <h3 className="font-semibold mb-2 text-sm">Trier par:</h3>
                  <button
                    onClick={() => sortModels("price-asc")}
                    className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                      sortType === "price-asc" ? "font-bold text-black" : "text-gray-700"
                    }`}
                  >
                    Prix croissant
                  </button>
                  <button
                    onClick={() => sortModels("price-desc")}
                    className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                      sortType === "price-desc" ? "font-bold text-black" : "text-gray-700"
                    }`}
                  >
                    Prix décroissant
                  </button>
                  <button
                    onClick={() => sortModels("date")}
                    className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                      sortType === "date" ? "font-bold text-black" : "text-gray-700"
                    }`}
                  >
                    Date d’ajout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          {filteredModels.slice(0, visibleCount).map((model, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded cursor-pointer"
              onClick={() =>
                navigate(`/invitation-model/${encodeURIComponent(model.name)}`, {
                  state: { model, selectedCategory },
                })
              }
            >
              <div className="bg-gray-200 h-44 w-full flex items-center justify-center">
                <img
                  src={require(`../../${model.thumbnail}`)}
                  alt={model.name}
                  className="h-full object-cover w-full"
                />
              </div>
              <h1 className="mt-2 text-sm font-bold text-left w-full font-urbanist">{model.name}</h1>
              <p className="text-sm text-left w-full font-urbanist">à partir de {model.price}DT</p>
            </div>
          ))}
        </div>

        {visibleCount < filteredModels.length && (
          <div className="flex flex-col items-center py-8">
            <button
              className="bg-black text-white w-24 h-8 font-urbanist text-sm"
              onClick={showMore}
            >
              Voir Plus
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default InvitationsCategoryPage;
