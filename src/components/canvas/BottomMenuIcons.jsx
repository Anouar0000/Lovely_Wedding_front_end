import React from 'react';
import { FiType, FiAlignLeft, FiAlignCenter, FiAlignRight } from 'react-icons/fi';
import { RxFontSize } from 'react-icons/rx';
import { PiTextAaDuotone } from 'react-icons/pi';

export const FormatIcons = [
  { key: 'fontSize', icon: <FiType className="text-xl" /> },
  { key: 'lineHeight', icon: <RxFontSize className="text-xl" /> },
  { key: 'alignment', icon: <FiAlignCenter className="text-xl" /> },
  { key: 'fontStyle', icon: <PiTextAaDuotone className="text-xl" /> },
];

export const AlignmentIcons = [
  { key: 'left', icon: <FiAlignLeft className="text-xl" /> },
  { key: 'center', icon: <FiAlignCenter className="text-xl" /> },
  { key: 'right', icon: <FiAlignRight className="text-xl" /> },
];

export const FontFamilies = ['أميري قرآن', 'Playfair Display', 'Rouge Script', 'Josefin Sans'];

export const FontSizes = Array.from({ length: 10 }, (_, i) => 10 + i * 2); // [10,12,...28]

export const LineHeights = Array.from({ length: 10 }, (_, i) => (0.5 + i * 0.5).toFixed(1)); // ['0.5', '1.0', ...]
