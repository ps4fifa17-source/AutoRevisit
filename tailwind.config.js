module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111315",
        graphite: "#202327",
        stonewash: "#F4F1EA",
        paper: "#FFFDF8",
        acid: "#B8FF3C",
        gold: "#FFC400",
        line: "#E7E0D4"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17,19,21,0.10)",
        glow: "0 0 0 1px rgba(184,255,60,0.35), 0 24px 70px rgba(184,255,60,0.16)"
      }
    },
  },
  plugins: [],
};
