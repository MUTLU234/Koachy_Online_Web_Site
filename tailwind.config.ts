import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Müşteri renk paleti - v4'te @theme ile tanımlanıyor
        background: {
          DEFAULT: "#F9FAFB", // Arka plan rengi
          dark: "#111827",
        },
        accent: {
          DEFAULT: "#10B981", // Vurgu rengi (Yeşil)
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981", // Vurgu
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
      },
      borderRadius: {
        // Yumuşak köşeler
        DEFAULT: "0.75rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(79, 70, 229, 0.1), 0 10px 20px -2px rgba(79, 70, 229, 0.04)",
        hover: "0 10px 30px -5px rgba(79, 70, 229, 0.2), 0 15px 35px -3px rgba(79, 70, 229, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
