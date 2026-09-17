/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        /* ================================
           MAIN BRAND
           ================================ */
        primary: {
          DEFAULT: "#25211D",
          light: "#403A33",
          dark: "#171411",
          hover: "#332D27",
        },

        /* ================================
           LUXURY GOLD
           ================================ */
        gold: {
          DEFAULT: "#C49A32",
          light: "#E0B84D",
          dark: "#9A741E",
          muted: "#E8D39B",
        },

        /* ================================
           BACKGROUNDS
           ================================ */
        ivory: {
          DEFAULT: "#FCFAF5",
          light: "#FFFEFC",
          dark: "#F2ECE1",
        },

        cream: {
          DEFAULT: "#F7F3EA",
          light: "#FBF9F4",
          dark: "#EDE5D6",
        },

        /* ================================
           TEXT
           ================================ */
        brandDark: "#241F1B",

        text: {
          DEFAULT: "#241F1B",
          light: "#6F675F",
          muted: "#918980",
        },

        white: "#FFFFFF",

        /* ================================
           NEUTRAL COLORS
           ================================ */
        neutral: {
          50: "#FCFAF5",
          100: "#F7F3EA",
          200: "#EDE5D6",
          300: "#DDD4C6",
          400: "#B9AEA0",
          500: "#918980",
          600: "#70675E",
          700: "#514941",
          800: "#3D3630",
          900: "#241F1B",
        },
      },

      /* ================================
         FONTS
         ================================ */
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],

        serif: [
          "Playfair Display",
          "Georgia",
          "serif",
        ],
      },

      /* ================================
         SHADOWS
         ================================ */
      boxShadow: {
        luxury:
          "0 20px 60px rgba(36, 31, 27, 0.12)",

        "luxury-lg":
          "0 30px 80px rgba(36, 31, 27, 0.18)",

        gold:
          "0 10px 35px rgba(196, 154, 50, 0.20)",

        "gold-lg":
          "0 15px 45px rgba(196, 154, 50, 0.28)",
      },

      /* ================================
         ANIMATIONS
         ================================ */
      animation: {
        "fade-up": "fadeUp 0.8s ease-out both",
        "fade-in": "fadeIn 0.8s ease-out both",
        float: "float 4s ease-in-out infinite",
        "slow-zoom": "slowZoom 12s ease-in-out infinite alternate",
      },

      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(25px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-6px)",
          },
        },

        slowZoom: {
          "0%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1.08)",
          },
        },
      },

      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },

  plugins: [],
};