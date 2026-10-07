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
        lw: {
          bg: "#FFFFFF",
          surface: "#F4F4F4",
          accent: "#C4A69C",
          accentDark: "#B39288",
          text: "#4B4242",
          muted: "#78716C",
          line: "#E8E2DC",
          sage: "#BAB8A3",
          footer: "#D0C7BE",
        },
        customColor: {
          1: "#EFEBE4",
          2: "#BDCBE5",
          3: "#D9B9AC",
          4: "#B0B0B0",
          5: "#E1E9D1",
          6: "#B69EAC",
          7: "#F2E5D4",
          8: "#F3EEEC"
        },
      },
      keyframes: {
        "hero-marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "hero-marquee": "hero-marquee 22s linear infinite",
      },
      fontFamily: {
        amiri: ['"Amiri Quran"', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        pinyon: ['"Pinyon Script"', 'cursive'],
        taprom: ['"Taprom"', 'cursive'],
        josefin: ['"Josefin Sans"', 'sans-serif'],
        urbanist: ['"Urbanist"', 'system-ui', 'sans-serif'],
        antic: ['"Antic Didone"', 'Georgia', 'serif'],
        roboto: ['"Roboto"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        lora: ['"Lora"', 'serif'],
        raleway: ['"Raleway"', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
        crimson: ['"Crimson Text"', 'serif'],
        abhaya: ['"Abhaya Libre"', 'Georgia', 'serif'],
      },
      fontWeight: {
        medium: '500',
        semibold: '600',
      },
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },
  plugins: [],
};
