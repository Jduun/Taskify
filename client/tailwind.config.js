/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: {
          "300": "#515151",
          "500": "#292B2F",
          "700": "#1C1D20",
          "900": "#121418"
        },
        extraColor: "#5B21B6",
        textColor: "white"
      }
    },
  },
  plugins: [],
}

