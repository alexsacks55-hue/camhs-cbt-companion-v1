import { useNavigate } from "react-router-dom";
import { UserRole } from "shared/types/enums";
import { useOnboarding } from "@/app/OnboardingContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TREATMENTS: Array<{
  value: string;
  label: string;
  description: string;
  emoji: string;
}> = [
  {
    value: "anxiety",
    label: "Anxiety",
    description: "CBT support for managing anxiety, worry, and fears.",
    emoji: "🌿",
  },
  {
    value: "low_mood",
    label: "Low Mood",
    description: "CBT support for low mood and depression.",
    emoji: "🌤️",
  },
  {
    value: "behavioural_challenges",
    label: "Behavioural Challenges",
    description: "CBT support for managing difficult behaviours and patterns.",
    emoji: "🧩",
  },
  {
    value: "sleep",
    label: "Sleep",
    description: "CBT support for improving sleep patterns and routines.",
    emoji: "🌙",
  },
];

export default function TreatmentSelectionPage() {
  const navigate = useNavigate();
  const { state, setManualType } = useOnboarding();

  // Guard: only young_person and parent_carer should reach this page
  if (state.role !== UserRole.YoungPerson && state.role !== UserRole.ParentCarer) {
    navigate("/onboarding/role");
    return null;
  }

  function handleSelect(treatment: string) {
    setManualType(treatment);
    navigate("/auth/sign-up");
  }

  return (
    <AuthLayout step={2} totalSteps={3}>
      <header className="mb-xl">
        <p className="text-caption text-muted-foreground">Your programme</p>
        <h1 className="mt-xs text-h2 text-foreground">What are you receiving treatment for?</h1>
        <p className="mt-sm text-body text-muted-foreground">
          This helps us show you only the resources relevant to your programme.
        </p>
      </header>

      <ul className="flex flex-col gap-sm" role="list">
        {TREATMENTS.map((treatment) => (
          <li key={treatment.value}>
            <button
              onClick={() => handleSelect(treatment.value)}
              className={cn(
                "w-full rounded-lg border border-border bg-background px-lg py-md text-left",
                "transition-all duration-micro",
                "hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                "active:scale-[0.99]"
              )}
              aria-label={`I am receiving treatment for ${treatment.label}`}
            >
              <span className="flex items-start gap-md">
                <span className="text-2xl" aria-hidden="true">{treatment.emoji}</span>
                <span>
                  <span className="block text-body font-medium text-foreground">
                    {treatment.label}
                  </span>
                  <span className="mt-xs block text-caption text-muted-foreground">
                    {treatment.description}
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-lg">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-full text-muted-foreground"
        >
          ← Back
        </Button>
      </div>
    </AuthLayout>
  );
}
