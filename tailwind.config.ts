import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bdd1ff",
          300: "#90b0ff",
          400: "#5d85ff",
          500: "#3d60ff",
          600: "#2540f5",
          700: "#1d31db",
          800: "#1e2bae",
          900: "#1f2a89",
          950: "#151a50",
        },
        violet2: {
          50: "#f5f1ff",
          100: "#ebe3ff",
          200: "#d8c9ff",
          300: "#bca3ff",
          400: "#9e77ff",
          500: "#8250f5",
          600: "#6d35e5",
          700: "#5c27c6",
          800: "#4b219e",
          900: "#3e1e7f",
        },
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dfe3ea",
          300: "#c2c8d3",
          400: "#8e95a5",
          500: "#626a7c",
          600: "#434a5c",
          700: "#2f3545",
          800: "#1d2230",
          900: "#0f1320",
          950: "#070912",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        card: "0 2px 4px rgba(16,24,40,0.04), 0 8px 24px -8px rgba(16,24,40,0.08)",
        pop: "0 10px 40px -10px rgba(31, 42, 137, 0.35)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(2deg)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.4" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "sparkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0.4)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        // Subtle non-uniform flicker — 6 keyframes irregularly spaced so it
        // doesn't read as a clean pulse. Used by <StreakFlame /> for tier
        // ≥ torch (DEC-054). The transform is tiny but the brightness shift
        // sells the "alive" feel.
        "flame-flicker": {
          "0%": { transform: "scale(1) rotate(0deg)", opacity: "0.94" },
          "18%": { transform: "scale(1.04) rotate(-0.6deg)", opacity: "1" },
          "37%": { transform: "scale(0.99) rotate(0.4deg)", opacity: "0.92" },
          "55%": { transform: "scale(1.03) rotate(-0.3deg)", opacity: "1" },
          "73%": { transform: "scale(1.01) rotate(0.5deg)", opacity: "0.96" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "0.94" },
        },
        // Badge unlock celebration — used by badge-toast + future
        // achievement animations (DEC-054 A3).
        "badge-pop": {
          "0%": { transform: "scale(0.4) rotate(-12deg)", opacity: "0" },
          "55%": { transform: "scale(1.15) rotate(4deg)", opacity: "1" },
          "78%": { transform: "scale(0.96) rotate(-2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.5s cubic-bezier(.2,.8,.2,1)",
        "scale-in": "scale-in 0.35s cubic-bezier(.2,.8,.2,1)",
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
        "bounce-in": "bounce-in 0.5s cubic-bezier(.2,.9,.2,1)",
        sparkle: "sparkle 1.8s ease-in-out infinite",
        "flame-flicker": "flame-flicker 2.2s ease-in-out infinite",
        "badge-pop": "badge-pop 0.7s cubic-bezier(.34,1.56,.64,1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
