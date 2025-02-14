/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Caveat fonts
        caveat: ["Caveat-Regular", "cursive"],
        "caveat-bold": ["Caveat-Bold", "cursive"],
        "caveat-medium": ["Caveat-Medium", "cursive"],
        "caveat-semibold": ["Caveat-SemiBold", "cursive"],
        // Quicksand fonts
        quicksand: ["Quicksand-Regular", "sans-serif"],
        "quicksand-bold": ["Quicksand-Bold", "sans-serif"],
        "quicksand-medium": ["Quicksand-Medium", "sans-serif"],
        "quicksand-semibold": ["Quicksand-SemiBold", "sans-serif"],
        "quicksand-light": ["Quicksand-Light", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#fde8eb",
          100: "#f9cdd1",
          200: "#f3a1a7",
          300: "#ec7580",
          400: "#e84a58",
          500: "#C31034", // base primary color
          600: "#ac0d2f",
          700: "#931029",
          800: "#7a0b23",
          900: "#62091d",
        },
        accent: {
          50: "#f4f8f9",
          100: "#e0f0f3",
          200: "#b7dce2",
          300: "#8fc8d1",
          400: "#66b4c0",
          500: "#3d9fb0", // base accent color
          600: "#32879a",
          700: "#296f7e",
          800: "#1f5662",
          900: "#153e46",
        },
      },
    },
  },
  plugins: [],
};
