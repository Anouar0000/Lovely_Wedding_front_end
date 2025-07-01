// src/components/canvas/MainMenu.js

import React, { useState, useEffect, useRef } from 'react';
import { FiType, FiImage, FiFileText, FiLayout } from 'react-icons/fi';
import data from '../../data/categories.json';

function MainMenu({
  onAddText,
  activeTab,
  setActiveTab,
  model,
  onDesignChange, // For changing only the background images
  onTemplateChange // For changing the entire template (images + text)
}) {
  const [designOptions, setDesignOptions] = useState([]);
  
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const menuRef = useRef(null);
  const designButtonRef = useRef(null);

  const handleMainTabClick = () => {
    if (activeTab === 'design') {
        setActiveSubMenu('options');
    } else {
        setActiveTab('design');
        setActiveSubMenu('options');
    }
  };

  const handleSubMenuClick = (choice) => {
      setActiveSubMenu(choice); 
  };
  
  useEffect(() => {
    if (model?.name) {
      const category = model.name.split(' ')[1]; 
      const capitalizedCategory = category?.charAt(0).toUpperCase() + category?.slice(1);
      const categoryModels = data.models[capitalizedCategory];

      if (categoryModels) {
        const options = Object.keys(categoryModels).map(templateId => ({
            templateId: templateId,
            name: categoryModels[templateId].name, // Get the name for text thumbnails
            frontImage: categoryModels[templateId].modelImage,
            fullData: categoryModels[templateId]
        }));
        setDesignOptions(options);
      }
    }
  }, [model]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeTab === 'design' &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        designButtonRef.current &&
        !designButtonRef.current.contains(event.target)
      ) {
        setActiveTab(null);
        setActiveSubMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeTab, setActiveTab]);

  return (
    <div ref={menuRef} className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t pt-2 z-50 min-h-[100px]">
      <div className="flex justify-center items-center space-x-10 border-b pb-2">
        <button onClick={onAddText} className="flex flex-col items-center">
          <div className="border border-black rounded-md w-6 h-6 flex items-center justify-center mb-1">
            <FiType className="text-lg" />
          </div>
          <span className="text-sm font-urbanist">Ajouter texte</span>
        </button>

        <button
          ref={designButtonRef}
          onClick={handleMainTabClick}
          className="flex flex-col items-center"
        >
          <div className="border border-black rounded-md w-6 h-6 flex items-center justify-center mb-1">
            <FiImage className="text-lg" />
          </div>
          <span className="text-sm font-urbanist">Apparence</span>
        </button>
      </div>

      {activeTab === 'design' && (
        <div className="mt-2 px-4 pb-6">
            {/* --- RENDER THE SUB-MENU --- */}
            {activeSubMenu === 'options' && (
                <div className="flex justify-center items-center space-x-6 animate-fade-in-up">
                    <button onClick={() => handleSubMenuClick('design')} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100">
                        {/* CHANGE #1: Icon is now black */}
                        <FiLayout className="text-2xl mb-1 text-black"/>
                        <span className="text-xs font-medium">Changer le Design</span>
                    </button>
                    <button onClick={() => handleSubMenuClick('template')} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100">
                        {/* CHANGE #1: Icon is now black */}
                        <FiFileText className="text-2xl mb-1 text-black"/>
                        <span className="text-xs font-medium">Changer le Modèle</span>
                    </button>
                </div>
            )}

            {/* --- RENDER THE "Changer le Design" THUMBNAILS --- */}
            {activeSubMenu === 'design' && (
                <div className="flex overflow-x-auto space-x-2 hide-scrollbar">
                    {designOptions.map((design) => (
                    <div
                        key={design.templateId}
                        className={`relative flex-shrink-0 w-[80px] h-[100px] rounded-lg overflow-hidden border ${
                        model.modelImage === design.frontImage ? 'border-blue-500' : 'border-gray-300'
                        } hover:opacity-80 transition-all duration-300 cursor-pointer`}
                        onClick={() => onDesignChange(design.fullData)}
                    >
                        <img
                        src={design.frontImage}
                        alt={`Design ${design.templateId}`}
                        className="w-full h-full object-cover"
                        />
                        {model.modelImage === design.frontImage && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20" />
                        )}
                    </div>
                    ))}
                </div>
            )}

            {/* --- RENDER THE "Changer le Modèle" THUMBNAILS (with text) --- */}
            {activeSubMenu === 'template' && (
                <div className="flex overflow-x-auto space-x-2 hide-scrollbar">
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
        </div>
      )}
    </div>
  );
}

export default MainMenu;