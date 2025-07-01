// src/components/canvas/MainMenu.js

import React, { useState, useEffect, useRef } from 'react';
import { FiType, FiImage } from 'react-icons/fi';
import data from '../../data/categories.json';

function MainMenu({
  onAddText,
  activeTab,
  setActiveTab,
  model,
  onDesignChange // This is the key function we will now use
}) {
  const [designOptions, setDesignOptions] = useState([]);
  const designRef = useRef(null);
  const designButtonRef = useRef(null);

  const toggleTab = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  // This effect now reads the structured data from the JSON and prepares it for display.
  useEffect(() => {
    if (model?.name) {
      // Find the category from the current model's name (e.g., "Rustique")
      const category = model.name.split(' ')[1]; 
      const capitalizedCategory = category?.charAt(0).toUpperCase() + category?.slice(1);
      
      // Get all the design objects for that category from the JSON file
      const categoryDesigns = data.models[capitalizedCategory];

      if (categoryDesigns) {
        // Transform the designs into a format the menu can display.
        // We iterate over the keys (e.g., "rustique-1", "rustique-2")
        const options = Object.keys(categoryDesigns).map(templateId => {
          const designData = categoryDesigns[templateId];
          return {
            templateId: templateId, // e.g., "rustique-3"
            frontImage: designData.modelImage // The image to show in the thumbnail
          };
        });
        setDesignOptions(options);
      }
    }
  }, [model]); // This runs whenever the model changes

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeTab === 'design' &&
        designRef.current &&
        !designRef.current.contains(event.target) &&
        designButtonRef.current &&
        !designButtonRef.current.contains(event.target)
      ) {
        setActiveTab(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeTab, setActiveTab]); // Added setActiveTab to dependencies

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t pt-6 z-50 min-h-[100px]">
      <div className="flex justify-center items-center space-x-10">
        {/* Add Text */}
        <button onClick={onAddText} className="flex flex-col items-center">
          <div className="border border-black rounded-md w-6 h-6 flex items-center justify-center mb-1">
            <FiType className="text-lg" />
          </div>
          <span className="text-sm font-urbanist">Ajouter texte</span>
        </button>

        {/* Design toggle */}
        <button
          ref={designButtonRef}
          onClick={() => toggleTab('design')}
          className="flex flex-col items-center"
        >
          <div className="border border-black rounded-md w-6 h-6 flex items-center justify-center mb-1">
            <FiImage className="text-lg" />
          </div>
          <span className="text-sm font-urbanist">Design</span>
        </button>
      </div>

      {/* Design selection panel - This JSX is kept as you requested */}
      {activeTab === 'design' && (
        <div className="mt-4 px-4" ref={designRef}>
          <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
            {designOptions.map((design) => (
              <div
                key={design.templateId} // Use the unique templateId as the key
                className={`relative flex-shrink-0 w-[80px] h-[100px] rounded-lg overflow-hidden border ${
                  // The selection check is now based on the active model's image
                  model.modelImage === design.frontImage ? 'border-blue-500' : 'border-gray-300'
                } hover:opacity-80 transition-all duration-300 cursor-pointer`}
                // THE CRITICAL CHANGE: Call onDesignChange with the templateId
                onClick={() => onDesignChange(design.templateId)}
              >
                <img
                  src={design.frontImage} // Display the front image of the design
                  alt={`Template ${design.templateId}`}
                  className="w-full h-full object-cover"
                />
                {model.modelImage === design.frontImage && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainMenu;