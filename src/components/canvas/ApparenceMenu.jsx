// src/components/canvas/ApparenceMenu.js (Final Fix)

import React, { useState, useEffect } from 'react';
import data from '../../data/physical/categories.json';

function ApparenceMenu({
  model,
  onDesignChange,
  onTemplateChange,
  onClose
}) {
  const [designOptions, setDesignOptions] = useState([]);
  const [activeTab, setActiveTab] = useState('design');

  useEffect(() => {
    if (!model || !model.name) {
      console.log("ApparenceMenu: Waiting for a valid model.");
      return; 
    }

    console.log(`ApparenceMenu: Received model.name = "${model.name}"`);

    const nameParts = model.name.trim().split(' ');

    // Add a check to ensure there are enough parts in the name
    if (nameParts.length < 2) {
      console.error(`ApparenceMenu: model.name "${model.name}" is too short to extract a category.`);
      return;
    }

    // --- THIS IS THE FIX ---
    // We get the second-to-last element, which is the category name.
    // e.g., in ['Modèle', 'Mariage', '1'], this will correctly get 'Mariage'.
    const category = nameParts[nameParts.length - 2];
    // --- END OF FIX ---
    
    console.log(`ApparenceMenu: Extracted category = "${category}"`);
    
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    
    const categoryModelsArray = data.models[capitalizedCategory];

    if (Array.isArray(categoryModelsArray) && categoryModelsArray.length > 0) {
      console.log(`ApparenceMenu: ✅ Success! Found ${categoryModelsArray.length} models for category "${capitalizedCategory}".`);
      
      const options = categoryModelsArray.map(modelData => ({
        templateId: modelData.templateId || modelData.name, // Fallback key
        name: modelData.name,
        frontImage: modelData.modelImage,
        fullData: modelData
      }));

      setDesignOptions(options);

    } else {
      console.error(`ApparenceMenu: ❌ Failed! No models found for category "${capitalizedCategory}" or it's not an array.`);
      setDesignOptions([]);
    }

  }, [model]);

  // The JSX for rendering the menu remains the same.
  return (
    <div className="fixed bottom-0 left-0 w-full h-[195px] shadow-md z-50 bg-white animate-fade-in-up sm:left-1/2 sm:w-[min(92vw,640px)] sm:-translate-x-1/2 sm:rounded-t-lg sm:border sm:border-gray-200">
      <div className="flex justify-end items-center ">
        <button onClick={onClose} className="bg-white px-4 ">
          <span className="text-xl">✕</span>
        </button>
      </div>

      <div className="flex justify-center items-center bg-white w-full border-b">
        <button
          className={`font-urbanist px-4 py-3 ${activeTab === 'design' ? 'bg-gray-100' : ''}`}
          onClick={() => setActiveTab('design')}
        >
          Design
        </button>
        <button
          className={`font-urbanist px-4 py-3 ${activeTab === 'template' ? 'bg-gray-100' : ''}`}
          onClick={() => setActiveTab('template')}
        >
          Modèle
        </button>
      </div>

      <div className="bg-white h-[calc(100%-90px)] overflow-hidden">
        {designOptions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Aucune option de design trouvée.</p>
          </div>
        ) : (
          <>
            {activeTab === 'design' && (
              <div className="flex overflow-x-auto hide-scrollbar h-full items-center">
                {designOptions.map((design) => (
                  <div
                    key={design.templateId}
                    className={`relative flex-shrink-0 w-[80px] h-[100px] rounded-lg overflow-hidden border ${
                      model.modelImage === design.frontImage ? 'border-blue-500' : 'border-gray-300'
                    } hover:opacity-80 transition-all duration-300 cursor-pointer`}
                    onClick={() => onDesignChange(design.fullData)}
                  >
                    <img src={design.frontImage} alt={`Design ${design.templateId}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'template' && (
              <div className="flex overflow-x-auto hide-scrollbar h-full items-center">
                {designOptions.map((template) => (
                  <div
                    key={template.templateId}
                    className={`relative flex-shrink-0 w-[80px] h-[100px] rounded-lg overflow-hidden border-2 p-2 flex items-center justify-center text-center bg-gray-50 ${
                      model.templateId === template.templateId ? 'border-blue-500' : 'border-gray-300'
                    } hover:border-blue-400 transition-all duration-300 cursor-pointer`}
                    onClick={() => onTemplateChange(template.fullData)}
                  >
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      {template.name.replace("Modèle ", "")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ApparenceMenu;
