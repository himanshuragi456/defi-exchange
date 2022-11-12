/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      lg: "1024px",
      md: "768px",
      sm: "640px",
      xs: "540px",
    },
    extend: {
      typography: (theme) => ({
        dark: {
          css: {
            color: "red",
          },
        },
        light: {
          css: {
            color: "blue",
          },
        },
      }),
    },
    colors: {
      primary: "#151925",
      "white-fa": "#fafafa",
      "white-fe": "#EFEEEE",
      "grey-c1": "#C3C1C1",
      "grey-35": "#353535",
      "grey-51": "#515151",
      "blue-e6": "#00E6E6",
      "blue-d2": "#181D2A",
      "black-0d": "#0D0D0D",
      "grey-1e": "#1e1e1e",
      "grey-f3": "#f3f3f3",
      "grey-63": "#636363",
      "grey-ea": "#eaeaea",
      "grey-9e": "#9E9B9B",
      "blue-28": "#283049",
      "white-e2": "#E2E2E2",
      "grey-6a": "#6b6a6a",
    },
  },
  plugins: [],
  darkMode: "class",
};
