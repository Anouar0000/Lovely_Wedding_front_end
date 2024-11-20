/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this line is included
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',     // Add your custom color codes here
        secondary: '#ffed4a',
        accent: '#e3342f',
        customGreen: '#10B981', // Example custom color
        customBlue: {
          light: '#85d7ff',
          DEFAULT: '#1fb6ff',   // `DEFAULT` is the base color
          dark: '#009eeb',
        },
        // Add more custom colors as needed
      },
    },
  },
  plugins: [],
};
