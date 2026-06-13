// src/components/canvas/MainMenu.js (Corrected)

import React from 'react';
import { FiType, FiImage } from 'react-icons/fi';

function MainMenu({ onAddText, onShowApparenceMenu }) {
  return (
    // --- THIS IS THE CORRECTED PART ---
    // 1. We make THIS div the flex container.
    // 2. We add `flex`, `justify-center`, and `items-center`.
    // 3. We remove the `pt-2` because `items-center` will handle all vertical alignment.
    <div className="bg-white shadow-md border-t z-50 min-h-[100px] animate-fade-in-up flex justify-center items-center space-x-10 sm:mx-auto sm:max-w-md sm:rounded-t-lg sm:border sm:border-gray-200">
      
      {/* The inner div has been removed, the buttons are now direct children */}

      {/* Button to add a new text box */}
      <button onClick={onAddText} className="flex flex-col items-center">
        <div className="border border-black rounded-md w-6 h-6 flex items-center justify-center mb-1">
          <FiType className="text-lg" />
        </div>
        <span className="text-sm font-urbanist">Ajouter texte</span>
      </button>

      {/* Button to open the ApparenceMenu */}
      <button
        onClick={onShowApparenceMenu}
        className="flex flex-col items-center"
      >
        <div className="border border-black rounded-md w-6 h-6 flex items-center justify-center mb-1">
          <FiImage className="text-lg" />
        </div>
        <span className="text-sm font-urbanist">Apparence</span>
      </button>

    </div>
  );
}

export default MainMenu;
