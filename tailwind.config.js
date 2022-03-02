module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      colors: {
        brand: "#f6dc3b",
        dark: {
          300: "#b5b9d6",
          400: "#53566b",
          500: "#45455f",
          600: "#393950",
          700: "#29293b",
          800: "#1d1d2b",
          900: "#181824",
        },
        light: "#ffffff",
      },
      fontFamily: {
        display: ["aktiv-grotesk-extended", "sans-serif"],
        body: ["aktiv-grotesk", "sans-serif"],
        code: ["source-code-pro", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
