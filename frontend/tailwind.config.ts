import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ── Design token colours from design-guidelines.md ──────────────────
      colors: {
        // Semantic CSS variable colours (used by shadcn/ui)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // App-specific palette from design-guidelines.md
        calm: {
          blue: "#4F7CAC",
          teal: "#6BAF92",
          sand: "#E9D8A6",
          lavender: "#9A8BC1",
        },
        brand: {
          bg: "#F7F8FA",
          surface: "#FFFFFF",
          text: "#1F2933",
          subtle: "#4B5563",
        },
        status: {
          success: "#6BAF92",
          info: "#4F7CAC",
          warning: "#E9D8A6",
          error: "#E07A7A",
        },
      },
      // ── 8-point spacing grid from design-guidelines.md ──────────────────
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
      },
      // ── Typography scale from design-guidelines.md ───────────────────────
      fontSize: {
        caption: ["14px", { lineHeight: "1.5" }],
        body: ["16px", { lineHeight: "1.5" }],
        h3: ["20px", { lineHeight: "1.4", fontWeight: "500" }],
        h2: ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        h1: ["32px", { lineHeight: "1.3", fontWeight: "600" }],
      },
      maxWidth: {
        content: "700px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card:          "var(--shadow-card)",
        "card-hover":  "var(--shadow-card-hover)",
        strong:        "var(--shadow-strong)",
        xs:            "var(--shadow-xs)",
      },
      // ── Motion guidelines ─────────────────────────────────────────────────
      transitionDuration: {
        micro: "150ms",
        page: "200ms",
        gentle: "300ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 200ms ease-out",
        "accordion-up":   "accordion-up 200ms ease-out",
        "fade-in":        "fade-in 200ms ease-out",
        "fade-out":       "fade-out 200ms ease-out",
        "slide-up":       "slide-up 250ms ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
