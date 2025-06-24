import React, { useState } from 'react';
import {
  AiOutlineColumnHeight
} from "react-icons/ai";
import {
  CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight
} from "react-icons/ci";
import {
  FiType, FiTrash2
} from 'react-icons/fi';
// Import our single source of truth for fonts
import { fontOptions } from '../../config/fontConfig'; // Adjust this path if your config file is elsewhere

function BottomMenu({
  onDelete, setSelectedTextId,
  fontSize, setFontSize,
  alignment, setAlignment,
  fontFamily, setFontFamily,
  setTextColor,
  lineHeight, setLineHeight
}) {
  const [activeTab, setActiveTab] = useState('format');
  const [activeSubTab, setActiveSubTab] = useState('FontSize');

  const toggleSubTab = (tab) => {
    setActiveSubTab(tab);
  };

  const alignmentIcons = {
    left: <CiTextAlignLeft size={24} />,
    center: <CiTextAlignCenter size={24} />,
    right: <CiTextAlignRight size={24} />
  };

  const colorOptions = [
    '#D8C3D5', '#E6E6E6', '#F2D8C7', '#EDEAD0', '#000000',
    '#FFFFFF', '#7F7F7F', '#E63946', '#4A4A4A'
  ];

  const lineHeightOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  return (
    <div className="fixed bottom-0 left-0 w-full h-[195px] shadow-md z-50">
      <div className="flex justify-between items-center ">
        <button onClick={onDelete} className="bg-white px-4 py-1">
          <FiTrash2 className="text-xl" />
        </button>
        <button onClick={() => setSelectedTextId(null)} className="bg-white px-4">
          <span className="text-xl">✕</span>
        </button>
      </div>

      <div className="flex justify-center items-center bg-white w-full border-b">
        <button
          className={`${activeTab === 'format' ? 'bg-gray-100' : ''} px-4 py-3`}
          onClick={() => { setActiveTab('format'); setActiveSubTab('FontSize'); }}
        >
          Format
        </button>
        <button
          className={`${activeTab === 'textStyle' ? 'bg-gray-100' : ''} px-4 py-3`}
          onClick={() => { setActiveTab('textStyle'); setActiveSubTab(null); }}
        >
          Police
        </button>
      </div>

      {activeTab === 'format' && (
        <div className="pt-3 px-4 bg-white">
          <div className="flex justify-around border-b">
            <button
              onClick={() => toggleSubTab('FontSize')}
              className={`${activeSubTab === 'FontSize' ? 'border-b-2 border-black' : ''} px-1 pb-2`}
            >
              <FiType size={20} />
            </button>
            <button
              onClick={() => toggleSubTab('LineHeight')}
              className={`${activeSubTab === 'LineHeight' ? 'border-b-2 border-black' : ''} px-1 pb-2`}
            >
              <AiOutlineColumnHeight size={20} />
            </button>
            <button
              onClick={() => toggleSubTab('TextAlign')}
              className={`${activeSubTab === 'TextAlign' ? 'border-b-2 border-black' : ''} px-1 pb-2`}
            >
              <CiTextAlignCenter size={20} />
            </button>
          </div>

          {activeSubTab === 'FontSize' && (
            <div className="flex justify-center gap-2 overflow-x-auto py-2 mt-2 hide-scrollbar">
              {[10, 12, 14, 16, 18, 20, 22, 24, 26, 28].map(size => (
                <button
                  key={size}
                  className={`px-2 py-1 ${fontSize === size ? 'bg-gray-100' : ''}`}
                  onClick={() => setFontSize(size)}
                >
                  {size}px
                </button>
              ))}
            </div>
          )}

          {activeSubTab === 'LineHeight' && (
            <div className="flex justify-center gap-2 overflow-x-auto py-2 mt-2 hide-scrollbar">
              {lineHeightOptions.map(height => (
                <button
                  key={height}
                  className={`px-2 py-1 ${lineHeight === height ? 'bg-gray-100' : ''}`}
                  onClick={() => setLineHeight(height)}
                >
                  {height}
                </button>
              ))}
            </div>
          )}

          {activeSubTab === 'TextAlign' && (
            <div className="flex justify-center gap-2 overflow-x-auto hide-scrollbar py-2 mt-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  className={`px-2 py-1 ${alignment === align ? 'bg-gray-100' : ''}`}
                  onClick={() => setAlignment(align)}
                >
                  {alignmentIcons[align]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'textStyle' && (
        <div>
          <div className="flex overflow-x-auto border-b hide-scrollbar">
            {/* The font list is now imported, not defined locally */}
            {fontOptions.map((font) => (
              <button
                key={font.name}
                className={`p-4 ${fontFamily === font.pdfName ? 'bg-gray-100' : 'bg-white'}`}
                style={{ fontFamily: font.pdfName }}
                onClick={() => setFontFamily(font.pdfName)}
              >
                {font.name}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4 overflow-x-auto hide-scrollbar py-2 bg-white">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #000' : 'none' }}
                onClick={() => setTextColor(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BottomMenu;