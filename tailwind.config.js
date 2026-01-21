module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Background utilities
    "bg-info",
    "bg-success",
    "bg-error",
    "bg-warning",
    "bg-issue",
    "bg-default",
    "bg-foreground",

    // Border utilities
    "border-info",
    "border-success",
    "border-error",
    "border-warning",
    "border-issue",
    "border-default",
    "border-foreground",

    // Text utilities
    "text-info",
    "text-success",
    "text-error",
    "text-warning",
    "text-issue",
    "text-default",
    "text-foreground",

    // Magic hover utilities - works with any color above
    "hover:bg-darker",
    "hover:text-darker",
    "hover:border-darker",
  ],
};
