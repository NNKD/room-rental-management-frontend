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
        lightGreen: "#17c2b1",
        lightGreenHover: "#129e91",
        mincream: "#f2fafa"
      },
      keyframes: {
        slideRightToLeft: {
          "0%": { opacity: 0, transform: "translateX(20%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        slideTopToBottom: {
          "0%": { opacity: 0, transform: "translateY(-20%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0},
          "100%": { opacity: 1},
        }
      },
      animation: {
        "slide-right-to-left-500": "slideRightToLeft 0.5s forwards",
        "slide-top-to-bottom-400": "slideTopToBottom 0.4s forwards",
        "fade-in-500": "fadeIn 0.5s forwards",
      }
    },
  },
  plugins: [],
}

