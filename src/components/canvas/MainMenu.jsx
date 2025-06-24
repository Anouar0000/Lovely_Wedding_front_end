import React, { useState, useEffect, useRef } from 'react';
import { FiType, FiImage } from 'react-icons/fi';
import data from '../../data/categories.json';

function MainMenu({
  onAddText,
  selectedTemplate,
  setSelectedTemplate,
  activeTab,
  setActiveTab,
  model
}) {
  const [designOptions, setDesignOptions] = useState([]);
  const designRef = useRef(null);
  const designButtonRef = useRef(null);

  const toggleTab = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  useEffect(() => {
    if (model?.modelImage && model?.name) {
      const category = model.name.split(' ')[1];
      const capitalizedCategory = category?.charAt(0).toUpperCase() + category?.slice(1);
      const models = data.models[capitalizedCategory] || [];

      const loadImages = async () => {
        const options = [];

        for (let i = 0; i < models.length; i++) {
          const index = i + 1;
          const base = `/assets/models/${category.toLowerCase()}/model/${category.toLowerCase()}${index}`;

          const checkImage = (ext) =>
            new Promise((res) => {
              const img = new Image();
              img.src = `${base}.${ext}`;
              img.onload = () => res(`${base}.${ext}`);
              img.onerror = () => res(null);
            });

          const [png, jpg] = await Promise.all([checkImage('png'), checkImage('jpg')]);
          const valid = png || jpg;
          if (valid) {
            options.push({ id: index, image: valid });
          }
        }

        setDesignOptions(options);
      };

      loadImages();
    }
  }, [model]);

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
  }, [activeTab]);

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

      {/* Design selection panel */}
      {activeTab === 'design' && (
        <div className="mt-4 px-4" ref={designRef}>
          <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
            {designOptions.map((design) => (
              <div
                key={design.id}
                className={`relative flex-shrink-0 w-[80px] h-[100px] rounded-lg overflow-hidden border ${
                  selectedTemplate === design.image ? 'border-blue-500' : 'border-gray-300'
                } hover:opacity-80 transition-all duration-300 cursor-pointer`}
                onClick={() => setSelectedTemplate(design.image)}
              >
                <img
                  src={design.image}
                  alt={`Template ${design.id}`}
                  className="w-full h-full object-cover"
                />
                {selectedTemplate === design.image && (
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
