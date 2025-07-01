// src/data/templateData.js

// NOTE: All position and width values are now percentages.
// They are based on a reference canvas of 390px (width) by 844px (height).
// This ensures the layout is responsive on all screen sizes.

export const templateData = {
  "m1": {
    name: "Modèle Mariage 1",
    prefilledTextBoxes: [
      {
        id: 1,
        text: "Ça y est ! Le grand jour est arrivé !",
        style: { fontSize: 16, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.4 },
        position: { x: 14.2, y: 19.2 }, // (40 / 390), (90 / 844)
        width: 71.8, // (280 / 390)
      },
      {
        id: 2,
        text: "Parce qu'on s'aime...",
        style: { fontSize: 15, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.4 },
        position: { x: 14.2, y: 23.2 }, // (40 / 390), (120 / 844)
        width: 71.8,
      },
      {
        id: 3,
        text: "Parce qu'on vous aime...",
        style: { fontSize: 15, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.4 },
        position: { x: 14.2, y: 27.2 }, // (40 / 390), (140 / 844)
        width: 71.8,
      },
      {
        id: 4,
        text: "La famille de Yakoubi et Talbi\nont l'immense plaisir de vous convier\nau mariage de leurs chers",
        style: { fontSize: 16, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.6 },
        position: { x: 14.2, y: 31.2 }, // (50 / 390), (160 / 844)
        width: 71.8, // (260 / 390)
      },
      {
        id: 5,
        text: "Abir et Oussama",
        style: { fontSize: 32, fontFamily: 'Pinyon Script', color: '#4a3a3a', alignment: 'center', bold: false, italic: false, lineHeight: 1.2 },
        position: { x: 14.2, y: 48.2 }, // (40 / 390), (240 / 844)
        width: 71.8,
      },
      {
        id: 6,
        text: "La soirée wteya aura lieu le 17 septembre 2021\nà 20h à la salle des fêtes",
        style: { fontSize: 16, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.6 },
        position: { x: 14.2, y: 56.2 }, // (40 / 390), (280 / 844)
        width: 71.8,
      },
      {
        id: 7,
        text: "« Zitouna Events »\nKm 7 Rte de Mornaguia",
        style: { fontSize: 15, fontFamily: 'Pinyon Script', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.6 },
        position: { x: 14.2, y: 72.65 }, // (40 / 390), (360 / 844)
        width: 71.8,
      },
    ]
  },
  "anniversaireBleu": {
    name: "Anniversaire - Fête Bleue",
    prefilledTextBoxes: [ /* ... a different set of text boxes ... */ ]
  }
};