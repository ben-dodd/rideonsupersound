module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#280A0A",
        primary: {
          dark: "#10B981",
          DEFAULT: "#34D399",
          light: "#A7F3D0",
        },
        secondary: {
          dark: "#3B82F6",
          DEFAULT: "#60A5FA",
          light: "#BFDBFE",
        },
        tertiary: {
          dark: "#EF4444",
          DEFAULT: "#F87171",
          light: "#FECACA",
        },
        quarternary: {
          dark: "#B5B324",
          DEFAULT: "#F8F671",
          light: "#FFFEC9",
        },
        col1: {
          dark: "#ff2121",
          DEFAULT: "#ff8787",
          light: "#ffdede",
        },
        col2: {
          dark: "#ff9b21",
          DEFAULT: "#ffc987",
          light: "#fff0de",
        },
        col3: {
          dark: "#e5ff21",
          DEFAULT: "#f1ff87",
          light: "#fbffde",
        },
        col4: {
          dark: "#6bff21",
          DEFAULT: "#afff87",
          light: "#e9ffde",
        },
        col5: {
          dark: "#21ff51",
          DEFAULT: "#87ffa1",
          light: "#deffe5",
        },
        col6: {
          dark: "#21ffcf",
          DEFAULT: "#87ffe5",
          light: "#defff8",
        },
        col7: {
          dark: "#21b5ff",
          DEFAULT: "#87d7ff",
          light: "#def4ff",
        },
        col8: {
          dark: "#213bff",
          DEFAULT: "#8795ff",
          light: "#dee2ff",
        },
        col9: {
          dark: "#8521ff",
          DEFAULT: "#bd87ff",
          light: "#eddeff",
        },
        col10: {
          dark: "#ff21ff",
          DEFAULT: "#ff87ff",
          light: "#ffdeff",
        },
      },
      fontFamily: { sans: ["OpenDyslexic", "sans-serif"] },
      height: {
        nav: "4rem",
        menu: `calc(100vh - 4rem)`,
        search: "4rem",
        inventory: `calc(100vh - 8rem)`,
      },
      width: { icons: "3rem" },
      transitionProperty: { width: "width" },
      // fontFamily: { sans: ["Varela Round", "sans-serif"] },
    },
  },
  variants: {
    backgroundColor: ["odd", "even", "hover", "disabled", "focus", "active"],
    textColor: ["disabled", "hover"],
    animation: ["hover"],
    border: ["active", "focus"],
    pointerEvents: ["disabled"],
    boxShadow: ["hover", "disabled"],
    ringColor: ["hover", "disabled"],
    cursor: ["disabled"],
  },
  plugins: [],
};
