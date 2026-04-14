/**
 * Shared NHS-styled dashboard components.
 * NHS Blue: #003087  |  NHS Light Blue: #41B6E6
 */

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ── NHS Lozenge ───────────────────────────────────────────────────────────────

export function NHSLozenge({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded ${size === "lg" ? "px-4 py-1.5" : "px-2.5 py-1"}`}
      style={{ backgroundColor: "#ffffff" }}
      aria-label="NHS"
    >
      <span
        className={`font-black tracking-tight leading-none ${size === "lg" ? "text-xl" : "text-sm"}`}
        style={{ color: "#003087" }}
      >
        NHS
      </span>
    </span>
  );
}

// ── Welcome Banner ────────────────────────────────────────────────────────────

interface BannerProps {
  username: string;
  roleLabel: string;
  message: string;
  treatmentLabel?: string;
}

export function NHSWelcomeBanner({ username, roleLabel, message, treatmentLabel }: BannerProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-xl py-lg text-white"
      style={{ background: "linear-gradient(135deg, #003087 0%, #005EB8 60%, #0072CE 100%)" }}
    >
      {/* ── Decorative layer ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #41B6E6, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 right-8 h-48 w-48 rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #ffffff, transparent)" }}
      />

      {/* ── Greeting row: name left, treatment badge right ── */}
      <div className="relative flex items-start justify-between gap-lg">
        <div>
          <p className="text-caption font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>
            {roleLabel}
          </p>
          <h1 className="mt-xs text-h2 font-bold text-white">
            Hi, {username}
          </h1>
        </div>
        {treatmentLabel && (
          <span
            className="mt-xs shrink-0 rounded-full px-md py-xs text-caption font-semibold"
            style={{ backgroundColor: "rgba(65,182,230,0.25)", color: "rgba(255,255,255,0.95)" }}
          >
            {treatmentLabel}
          </span>
        )}
      </div>

      {/* ── One-line message ── */}
      <p
        className="relative mt-sm text-body leading-relaxed"
        style={{ color: "rgba(255,255,255,0.75)" }}
      >
        {message}
      </p>
    </div>
  );
}

// ── Card colour presets ───────────────────────────────────────────────────────

export type NHSCardColor = "blue" | "teal" | "lavender" | "sand" | "navy";

const CARD_COLOR_STYLES: Record<NHSCardColor, {
  background: string;
  border: string;
  iconBg: string;
  textColor: string;
  arrowColor: string;
}> = {
  blue: {
    background: "linear-gradient(145deg, #EEF6FC 0%, #F8FCFF 100%)",
    border:     "#41B6E6",
    iconBg:     "rgba(65,182,230,0.16)",
    textColor:  "#003087",
    arrowColor: "#41B6E6",
  },
  teal: {
    background: "linear-gradient(145deg, #EBF6F1 0%, #F6FDFB 100%)",
    border:     "#6BAF92",
    iconBg:     "rgba(107,175,146,0.16)",
    textColor:  "#1F5C41",
    arrowColor: "#6BAF92",
  },
  lavender: {
    background: "linear-gradient(145deg, #F2F0F9 0%, #FAF9FE 100%)",
    border:     "#9A8BC1",
    iconBg:     "rgba(154,139,193,0.16)",
    textColor:  "#4A3A7A",
    arrowColor: "#9A8BC1",
  },
  sand: {
    background: "linear-gradient(145deg, #FAF5E8 0%, #FFFDF6 100%)",
    border:     "#C4953A",
    iconBg:     "rgba(196,149,58,0.16)",
    textColor:  "#7A5A10",
    arrowColor: "#C4953A",
  },
  navy: {
    background: "linear-gradient(145deg, #EEF1F8 0%, #F7F9FC 100%)",
    border:     "#003087",
    iconBg:     "rgba(0,48,135,0.10)",
    textColor:  "#003087",
    arrowColor: "#005EB8",
  },
};

// ── Section Card ──────────────────────────────────────────────────────────────

interface CardProps {
  title:       string;
  description: string;
  linkTo:      string;
  linkLabel:   string;
  icon?:       string;
  /** Controls the card's tint and accent colour. Default: "blue". */
  color?:      NHSCardColor;
}

export function NHSCard({ title, description, linkTo, linkLabel, icon, color = "blue" }: CardProps) {
  const s = CARD_COLOR_STYLES[color];

  return (
    <Link
      to={linkTo}
      className={cn(
        "group relative block overflow-hidden rounded-xl p-lg",
        "border shadow-card",
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      )}
      style={{
        background:      s.background,
        borderColor:     `${s.border}40`,  // 25% opacity at rest
        // ring color via CSS (Tailwind focus-visible uses --ring which is NHS Blue)
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = s.border;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = `${s.border}40`;
      }}
    >
      {/* Coloured left border accent */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl"
        style={{ backgroundColor: s.border }}
      />

      <div className="pl-xs">
        {icon && (
          <span
            className="mb-md flex h-11 w-11 items-center justify-center rounded-xl text-xl"
            style={{ backgroundColor: s.iconBg }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <h3 className="text-body font-bold" style={{ color: s.textColor }}>
          {title}
        </h3>
        <p className="mt-xs text-caption leading-relaxed text-muted-foreground">
          {description}
        </p>
        <span
          className="mt-md inline-flex items-center gap-xs text-caption font-semibold"
          style={{ color: s.arrowColor }}
        >
          {linkLabel}
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
