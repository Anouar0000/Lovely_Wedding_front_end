/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
        secondary: '#ffed4a',
        accent: '#e3342f',
        customGreen: '#10B981',
        customColor: {
          1: "#EFEBE4",
          2: "#BDCBE5",
          3: "#D9B9AC",
          4: "#B0B0B0", // Grey added here
          5: "#E1E9D1",
          6: "#B69EAC",
          7: "#F2E5D4",
          8: "#F3EEEC"
        },
      },
      fontFamily: {
        amiri: ['"Amiri Quran"', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        pinyon: ['"Pinyon Script"', 'cursive'],
        josefin: ['"Josefin Sans"', 'sans-serif'],
        urbanist: ['"Urbanist"', 'sans-serif'],
        antic: ['"Antic Didone"', 'serif'],
        roboto: ['"Roboto"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        lora: ['"Lora"', 'serif'],
        raleway: ['"Raleway"', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
        abhaya: ['"Abhaya Libre"', 'serif'], // ✅ Added
      },      
    },
  },
  plugins: [],
};
