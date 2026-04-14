import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ResourceCategory } from "shared/types/enums";

interface CategoryMeta {
  label:       string;
  description: string;
  emoji:       string;
  topBorder:   string; // hex colour for the thick top stripe
  iconBg:      string; // hex colour with alpha for icon circle
  gradient:    string; // Tailwind gradient classes
  textColor:   string; // hex for category label
}

const CATEGORY_META: Record<ResourceCategory, CategoryMeta> = {
  [ResourceCategory.Anxiety]: {
    label:       "Anxiety",
    description: "Understanding worry, breathing techniques, and gradual exposure.",
    emoji:       "🌊",
    topBorder:   "#4F7CAC",
    iconBg:      "rgba(79,124,172,0.14)",
    gradient:    "from-[#4F7CAC]/10 via-[#4F7CAC]/5 to-transparent",
    textColor:   "#2B5F8A",
  },
  [ResourceCategory.LowMood]: {
    label:       "Low Mood",
    description: "Behavioural activation, thought patterns, and finding small positives.",
    emoji:       "🌱",
    topBorder:   "#9A8BC1",
    iconBg:      "rgba(154,139,193,0.14)",
    gradient:    "from-[#9A8BC1]/10 via-[#9A8BC1]/5 to-transparent",
    textColor:   "#6B5B9E",
  },
  [ResourceCategory.BehaviouralChallenges]: {
    label:       "Behavioural Challenges",
    description: "Understanding behaviour, routines, and working through difficulties.",
    emoji:       "🧩",
    topBorder:   "#C4953A",
    iconBg:      "rgba(196,149,58,0.14)",
    gradient:    "from-[#E9D8A6]/30 via-[#E9D8A6]/15 to-transparent",
    textColor:   "#8A6520",
  },
  [ResourceCategory.Sleep]: {
    label:       "Sleep",
    description: "Sleep hygiene, wind-down routines, and understanding sleep patterns.",
    emoji:       "🌙",
    topBorder:   "#6BAF92",
    iconBg:      "rgba(107,175,146,0.14)",
    gradient:    "from-[#6BAF92]/12 via-[#6BAF92]/6 to-transparent",
    textColor:   "#3D7A5E",
  },
};

interface CategoryCardProps {
  category: ResourceCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const meta = CATEGORY_META[category];

  return (
    <Link
      to={`/resources/${category}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-gradient-to-br p-lg",
        "border border-border/60 shadow-card",
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
        meta.gradient,
      )}
    >
      {/* Thick top colour stripe */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-1 rounded-t-xl"
        style={{ backgroundColor: meta.topBorder }}
      />

      {/* Icon in coloured circle */}
      <div
        className="mb-md mt-xs flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
        style={{ backgroundColor: meta.iconBg }}
        aria-hidden="true"
      >
        {meta.emoji}
      </div>

      <h2
        className="text-body font-bold"
        style={{ color: meta.textColor }}
      >
        {meta.label}
      </h2>
      <p className="mt-xs text-caption text-muted-foreground leading-relaxed">
        {meta.description}
      </p>

      {/* Arrow */}
      <div className="mt-md flex items-center gap-xs">
        <span
          className="text-caption font-semibold transition-all duration-150 group-hover:gap-sm"
          style={{ color: meta.textColor }}
        >
          Explore
        </span>
        <span
          aria-hidden="true"
          className="text-caption font-semibold transition-transform duration-150 group-hover:translate-x-1"
          style={{ color: meta.textColor }}
        >
          →
        </span>
      </div>
    </Link>
  );
}

export { CATEGORY_META };
export type { CategoryMeta };
