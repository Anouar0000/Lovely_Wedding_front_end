// src/components/canvas/CardSwitcher.js

import React from 'react';

function CardSwitcher({ model, currentCard, setCurrentCard }) {
  // Don't render anything if the model doesn't have a second page.
  if (!model?.modelImagep2) {
    return null;
  }

  return (
    // REMOVED: "absolute", "bottom-...", "left-1/2", "-translate-x-1/2", "z-20"
    // ADDED: "py-2" to create vertical space (8px top and bottom).
    // This provides the gap between the cards and the buttons.
    <div className="w-full flex justify-center py-2">
      <div className="flex rounded-md shadow-lg overflow-hidden border border-gray-300">
        <button
          onClick={() => setCurrentCard('front')}
          className={`px-6 py-2 text-sm font-medium transition-colors duration-200 ${
            currentCard === 'front'
              ? 'bg-black text-white' // Active style
              : 'bg-white text-black hover:bg-gray-100' // Inactive style
          }`}
        >
          1ère Carte
        </button>
        <button
          onClick={() => setCurrentCard('back')}
          className={`px-6 py-2 text-sm font-medium transition-colors duration-200 border-l border-gray-300 ${
            currentCard === 'back'
              ? 'bg-black text-white' // Active style
              : 'bg-white text-black hover:bg-gray-100' // Inactive style
          }`}
        >
          2ème carte
        </button>
      </div>
    </div>
  );
}

export default CardSwitcher;