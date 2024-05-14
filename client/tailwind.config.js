/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: {
          "300": "#515151",
          "500": "#292B2F",
          "700": "#1c1d20",
          "900": "#121418"
        },
        extraColor: "violet-800",
        textColor: "white"
      }
    },
  },
  plugins: [],
}

