// src/config/fontConfig.js

// This file is the single source of truth for all font-related information.
export const fontOptions = [
  {
    name: 'Playfair Display',
    displayName: 'Playfair Display', // <-- ADDED
    pdfName: 'Playfair Display',
    isArabic: false, // <-- ADDED
    files: {
      regular: '/fonts/PlayfairDisplay-Regular.ttf',
      bold: '/fonts/PlayfairDisplay-Bold.ttf',
      italic: '/fonts/PlayfairDisplay-Italic.ttf',
      boldItalic: '/fonts/PlayfairDisplay-BoldItalic.ttf',
    }
  },
  {
    name: 'Pinyon Script',
    displayName: 'Pinyon Script', // <-- ADDED
    pdfName: 'Pinyon Script',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/PinyonScript-Regular.ttf' }
  },
  {
    name: 'Josefin Sans',
    displayName: 'Josefin Sans', // <-- ADDED
    pdfName: 'Josefin Sans',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/JosefinSans-VariableFont_wght.ttf' }
  },
  {
    name: 'Urbanist',
    displayName: 'Urbanist', // <-- ADDED
    pdfName: 'Urbanist',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/Urbanist-VariableFont_wght.ttf' }
  },
  {
    name: 'Antic Didone',
    displayName: 'Antic Didone', // <-- ADDED
    pdfName: 'Antic Didone',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/AnticDidone-Regular.ttf' }
  },
  {
    name: 'Roboto',
    displayName: 'Roboto', // <-- ADDED
    pdfName: 'Roboto',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/Roboto-Regular.ttf' }
  },
  {
    name: 'Montserrat',
    displayName: 'Montserrat', // <-- ADDED
    pdfName: 'Montserrat',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/Montserrat-Regular.ttf' }
  },
  {
    name: 'Lora',
    displayName: 'Lora', // <-- ADDED
    pdfName: 'Lora',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/Lora-Regular.ttf' }
  },
  {
    name: 'Raleway',
    displayName: 'Raleway', // <-- ADDED
    pdfName: 'Raleway',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/Raleway-Regular.ttf' }
  },
  {
    name: 'Open Sans',
    displayName: 'Open Sans', // <-- ADDED
    pdfName: 'Open Sans',
    isArabic: false, // <-- ADDED
    files: { regular: '/fonts/OpenSans-Regular.ttf' }
  },
  {
    name: 'Cairo',
    displayName: 'كايرو',
    pdfName: 'Cairo',
    isArabic: true,
    files: {} // No local files needed for Google Fonts
  },
  {
    name: 'Amiri Quran',
    displayName: 'عَمِيري',
    pdfName: 'Amiri Quran',
    isArabic: true,
    files: { regular: '/fonts/AmiriQuran-Regular.ttf' }
  },
];