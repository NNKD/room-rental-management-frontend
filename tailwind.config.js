/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: "#091638",
        darkGray: "#888F9F",
        gray: "#B7BDCB",
        lightGray: "#E1E1EC",
        primary: "#1C3988",
        hover: "#6E8AE9",
        lightBlue: "#F3F3FA",
      },
      keyframes: {
        slideRightToLeft: {
          "0%": { opacity: 0, transform: "translateX(20%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        }
      },
      animation: {
        "slide-right-to-left-500": "slideRightToLeft 0.5s forwards",
      }
    },
  },
  plugins: [],
}

