module.exports = {
  content: ['./app/**/*.tsx', './components/**/*.tsx', './features/**/*.tsx', './pages/**/*.tsx', './index.tsx'],
  theme: {
    extend: {
      colors: {
        black: '#423e3e',
        primary: {
          dark: '#10B981',
          DEFAULT: '#34D399',
          light: '#A7F3D0',
        },
        secondary: {
          dark: '#3B82F6',
          DEFAULT: '#60A5FA',
          light: '#BFDBFE',
        },
        tertiary: {
          dark: '#EF4444',
          DEFAULT: '#F87171',
          light: '#FECACA',
        },
        quarternary: {
          dark: '#B5B324',
          DEFAULT: '#F8F671',
          light: '#FFFEC9',
        },
        col1: {
          dark: '#ff2121',
          DEFAULT: '#ff8787',
          light: '#ffdede',
        },
        col2: {
          dark: '#ff9b21',
          DEFAULT: '#ffc987',
          light: '#fff0de',
        },
        col3: {
          dark: '#e5ff21',
          DEFAULT: '#f1ff87',
          light: '#fbffde',
        },
        col4: {
          dark: '#6bff21',
          DEFAULT: '#afff87',
          light: '#e9ffde',
        },
        col5: {
          dark: '#21ff51',
          DEFAULT: '#87ffa1',
          light: '#deffe5',
        },
        col6: {
          dark: '#21ffcf',
          DEFAULT: '#87ffe5',
          light: '#defff8',
        },
        col7: {
          dark: '#21b5ff',
          DEFAULT: '#87d7ff',
          light: '#def4ff',
        },
        col8: {
          dark: '#213bff',
          DEFAULT: '#8795ff',
          light: '#dee2ff',
        },
        col9: {
          dark: '#8521ff',
          DEFAULT: '#bd87ff',
          light: '#eddeff',
        },
        col10: {
          dark: '#ff21ff',
          DEFAULT: '#ff87ff',
          light: '#ffdeff',
        },
        brown: {
          dark: '#312f2f',
          DEFAULT: '#423e3e',
          light: '#908989',
        },
        selected: '#d0d050',
      },
      fontFamily: { sans: ['Nunito', 'sans-serif'], creep: ['Creepster', 'cursive'] },
      height: {
        navbar: '3rem',
        main: `calc(100vh - 3rem)`,
        header: '4rem',
        headerlg: '6rem',
        content: `calc(100vh - 7rem)`,
        contentsm: `calc(100vh - 11rem)`,
        dialoglg: `calc(100vh - 12rem)`,
        dialog: `calc(100vh - 16rem)`,
        dialogsm: `calc(100vh - 24rem)`,
        imageMed: '120px',
        imageSmall: '80px',
      },
      maxHeight: {
        dialog: `calc(100vh - 16rem)`,
      },
      maxWidth: {
        dialog: `calc(100vw - 24rem)`,
      },
      width: {
        menuSmall: '3rem',
        boardSmall: `calc(100vw - 3rem)`,
        boardMainSmall: `calc((100vw - 3rem)*(2/3))`,
        sidebarSmall: `calc((100vw - 3rem)*(1/3))`,
        menu: `12rem`,
        board: `calc(100vw - 12rem)`,
        boardMain: `calc((100vw - 12rem)*(2/3))`,
        sidebar: `calc((100vw - 12rem)*(1/3))`,
        imageMed: '120px',
        imageSmall: '80px',
        imageXSmall: '40px',
        dropdown: `18rem`,
      },
      zIndex: {
        100: '100',
      },
      transitionProperty: { width: 'width', height: 'height' },
      gridTemplateColumns: {
        right: 'auto 200px 200px',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  variants: {
    backgroundColor: ['odd', 'even', 'hover', 'disabled', 'focus', 'active'],
    textColor: ['disabled', 'hover'],
    animation: ['hover'],
    border: ['active', 'focus'],
    pointerEvents: ['disabled'],
    boxShadow: ['hover', 'disabled'],
    ringColor: ['hover', 'disabled'],
    cursor: ['disabled'],
  },
  plugins: [],
}
