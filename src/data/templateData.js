// src/data/templateData.js

// NOTE: Don't forget to import these fonts (e.g., from Google Fonts) in your main CSS file!
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&family=Great+Vibes&display=swap');

export const templateData = {
  "m1": {
    name: "Modèle Mariage 1",
    prefilledTextBoxes: [
      {
        id: 1,
        text: "Ça y est ! Le grand jour est arrivé !",
        style: { fontSize: 16, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.4 },
        position: { x: 40, y: 90 }, // You will need to adjust these values
        width: 280,
      },
      {
        id: 2,
        text: "Parce qu'on s'aime...",
        style: { fontSize: 15, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.4 },
        position: { x: 40, y: 120 },
        width: 280,
      },
      {
        id: 3,
        text: "Parce qu'on vous aime...",
        style: { fontSize: 15, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.4 },
        position: { x: 40, y: 140 },
        width: 280,
      },
      {
        id: 4,
        text: "La famille de Yakoubi et Talbi\nont l'immense plaisir de vous convier\nau mariage de leurs chers",
        style: { fontSize: 16, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.6 },
        position: { x: 50, y: 160 },
        width: 260,
      },
      {
        id: 5,
        text: "Abir et Oussama",
        style: { fontSize: 32, fontFamily: 'Pinyon Script', color: '#4a3a3a', alignment: 'center', bold: false, italic: false, lineHeight: 1.2 },
        position: { x: 40, y: 240 },
        width: 280,
      },
      {
        id: 6,
        text: "La soirée wteya aura lieu le 17 septembre 2021\nà 20h à la salle des fêtes",
        style: { fontSize: 16, fontFamily: 'Playfair Display', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.6 },
        position: { x: 40, y: 280 },
        width: 280,
      },
      {
        id: 7,
        text: "« Zitouna Events »\nKm 7 Rte de Mornaguia",
        style: { fontSize: 15, fontFamily: 'Pinyon Script', color: '#6a5a5a', alignment: 'center', bold: false, italic: false, lineHeight: 1.6 },
        position: { x: 40, y: 360 },
        width: 280,
      },
    ]
  },
  // You can add more templates here in the future
  "anniversaireBleu": {
    name: "Anniversaire - Fête Bleue",
    prefilledTextBoxes: [ /* ... a different set of text boxes ... */ ]
  }
};