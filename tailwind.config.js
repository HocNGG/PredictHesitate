/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        "muted-foreground": "var(--muted-foreground)",
      },
      borderRadius: {
        xl: "var(--radius)",
      },
    },
  },
  plugins: [],
}