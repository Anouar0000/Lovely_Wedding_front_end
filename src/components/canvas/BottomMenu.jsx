import React, { useState } from 'react';
import {
  AiOutlineColumnHeight, AiOutlineFontSize
} from "react-icons/ai";
import {
  CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight
} from "react-icons/ci";
import {
  FiType, FiCornerDownLeft, FiCornerUpRight, FiTrash2
} from 'react-icons/fi';

function BottomMenu({
  onDelete,
  fontSize, setFontSize,
  alignment, setAlignment,
  fontFamily, setFontFamily,
  setTextColor,
  lineHeight, setLineHeight,
  isBold, setIsBold,
  isItalic, setIsItalic
}) {
  const [activeTab, setActiveTab] = useState('format');
  const [activeSubTab, setActiveSubTab] = useState(null);

  const toggleSubTab = (tab) => {
    setActiveSubTab((prev) => (prev === tab ? null : tab));
  };

  const alignmentIcons = {
    left: <CiTextAlignLeft />,
    center: <CiTextAlignCenter />,
    right: <CiTextAlignRight />
  };

  const fontOptions = [
    { name: 'Amiri Quran', family: 'font-amiri' },
    { name: 'Playfair Display', family: 'font-playfair' },
    { name: 'Pinyon Script', family: 'font-pinyon' },
    { name: 'Josefin Sans', family: 'font-josefin' },
    { name: 'Urbanist', family: 'font-urbanist' },
    { name: 'Antic Didone', family: 'font-antic' },
    { name: 'Roboto', family: 'font-roboto' },
    { name: 'Montserrat', family: 'font-montserrat' },
    { name: 'Lora', family: 'font-lora' },
    { name: 'Raleway', family: 'font-raleway' },
    { name: 'Open Sans', family: 'font-opensans' }
  ];

  const colorOptions = [
    '#D8C3D5', '#E6E6E6', '#F2D8C7', '#EDEAD0', '#000000',
    '#FFFFFF', '#7F7F7F', '#E63946', '#4A4A4A'
  ];

  const lineHeightOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  return (
    <div className="absolute bottom-0 left-0 w-full h-[140px] bg-white shadow-md border-t z-50">
      <div className="flex justify-between items-center px-4">
        <button onClick={onDelete}>
          <FiTrash2 className="text-xl" />
        </button>
        <div className="flex space-x-4">
          <button
            className={`${activeTab === 'format' ? 'border-b-2 border-black' : ''}`}
            onClick={() => { setActiveTab('format'); setActiveSubTab(null); }}
          >
            Format
          </button>
          <button
            className={`${activeTab === 'textStyle' ? 'border-b-2 border-black' : ''}`}
            onClick={() => { setActiveTab('textStyle'); setActiveSubTab(null); }}
          >
            Police
          </button>
        </div>
        <button onClick={() => setActiveTab(null)}>
          <span className="text-xl">✕</span>
        </button>
      </div>

      {/* Sub-tabs and content */}
      {activeTab === 'format' && (
        <div className="mt-3 px-4">
          <div className="flex justify-around mb-4">
            <button onClick={() => toggleSubTab('FontSize')}><FiType /></button>
            <button onClick={() => toggleSubTab('LineHeight')}><AiOutlineColumnHeight /></button>
            <button onClick={() => toggleSubTab('TextAlign')}><CiTextAlignCenter /></button>
          </div>

          {activeSubTab === 'FontSize' && (
            <div className="flex justify-center gap-2 overflow-x-auto">
              {[10, 12, 14, 16, 18, 20, 22, 24, 26, 28].map(size => (
                <button
                  key={size}
                  className={`px-2 py-1 ${fontSize === size ? 'bg-black text-white' : 'bg-gray-200'}`}
                  onClick={() => setFontSize(size)}
                >
                  {size}px
                </button>
              ))}
            </div>
          )}

          {activeSubTab === 'LineHeight' && (
            <div className="flex justify-center gap-2 overflow-x-auto">
              {lineHeightOptions.map(height => (
                <button
                  key={height}
                  className={`px-2 py-1 ${lineHeight === height ? 'bg-black text-white' : 'bg-gray-200'}`}
                  onClick={() => setLineHeight(height)}
                >
                  {height}
                </button>
              ))}
            </div>
          )}

          {activeSubTab === 'TextAlign' && (
            <div className="flex justify-center gap-2 overflow-x-auto">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  className={`px-2 py-1 ${alignment === align ? 'bg-black text-white' : 'bg-gray-200'}`}
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
        <div className="mt-3 px-4">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {fontOptions.map((font) => (
              <button
                key={font.name}
                className={`p-2 rounded-lg ${fontFamily === font.family ? 'bg-black text-white' : 'bg-white'} ${font.family}`}
                onClick={() => setFontFamily(font.family)}
              >
                {font.name}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                className="w-8 h-8 rounded-full"
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
