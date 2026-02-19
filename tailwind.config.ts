import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core luxury palette — derived from the logo
        charcoal: {
          DEFAULT: "#222826",
          50: "#F4F6F5",
          100: "#E0E6E2",
          200: "#B8C4BC",
          300: "#8FA198",
          400: "#677F74",
          500: "#4D6358",
          600: "#384A41",
          700: "#2D3E35",
          800: "#222826",  // ← logo bg
          900: "#171D1B",
          950: "#0D110F",
        },
        champagne: {
          DEFAULT: "#C4A882",
          50: "#FAF6F0",
          100: "#F3EAD8",
          200: "#E8D5B2",
          300: "#DCC08D",
          400: "#D1AC6A",
          500: "#C4A882",  // ← logo smoke color
          600: "#B08F62",
          700: "#8C7048",
          800: "#6B5435",
          900: "#4A3A24",
          950: "#2A2016",
        },
        silk: {
          DEFAULT: "#F5F0E8",
          50: "#FFFEF9",
          100: "#F5F0E8",
          200: "#EBE1D1",
          300: "#D8CDB8",
          400: "#C4B89D",
          500: "#B0A280",
        },
      },
      fontFamily: {
        arabic: ["Tajawal", "Cairo", "sans-serif"],
      },
      backgroundImage: {
        "luxury-gradient": "linear-gradient(135deg, #0D110F 0%, #222826 40%, #1A2320 100%)",
        "gold-gradient": "linear-gradient(135deg, #C4A882 0%, #DCC08D 50%, #B08F62 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(44,59,50,0.8) 0%, rgba(26,35,30,0.9) 100%)",
        "hero-radial": "radial-gradient(ellipse at 60% 50%, rgba(196,168,130,0.12) 0%, transparent 60%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s ease-out",
        "smoke": "smoke 6s ease-in-out infinite",
        "smoke-slow": "smoke 9s ease-in-out infinite 1.5s",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float": "float 5s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideUp: { "0%": { transform: "translateY(100%)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        scaleIn: { "0%": { transform: "scale(0.92)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
        smoke: {
          "0%, 100%": { transform: "translateY(0px) scaleX(1)", opacity: "0.7" },
          "50%": { transform: "translateY(-8px) scaleX(1.05)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(196,168,130,0.15), 0 0 40px rgba(196,168,130,0.05)" },
          "50%": { boxShadow: "0 0 30px rgba(196,168,130,0.3),  0 0 60px rgba(196,168,130,0.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      boxShadow: {
        "luxury": "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(196,168,130,0.15)",
        "gold": "0 4px 24px rgba(196,168,130,0.25)",
        "gold-lg": "0 8px 40px rgba(196,168,130,0.3)",
        "card": "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(196,168,130,0.08)",
        "inner-gold": "inset 0 1px 0 rgba(196,168,130,0.2)",
      },
      borderColor: {
        gold: "rgba(196,168,130,0.25)",
        "gold-bright": "rgba(220,192,141,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
