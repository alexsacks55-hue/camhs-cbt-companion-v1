import { useNavigate } from "react-router-dom";
import { AgeBand, UserRole } from "shared/types/enums";
import { useOnboarding } from "@/app/OnboardingContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AGE_OPTIONS: Array<{
  value: AgeBand;
  label: string;
  sublabel?: string;
}> = [
  { value: AgeBand.Under11, label: "Under 11", sublabel: "A parent or carer will help me use this." },
  { value: AgeBand.ElevenToFifteen, label: "11 to 15" },
  { value: AgeBand.SixteenToEighteen, label: "16 to 18" },
];

export default function AgeBandPage() {
  const navigate = useNavigate();
  const { state, setAgeBand } = useOnboarding();

  // Guard: only young_person should reach this page
  if (state.role !== UserRole.YoungPerson) {
    navigate("/onboarding/role");
    return null;
  }

  function handleSelect(band: AgeBand) {
    setAgeBand(band);

    if (band === AgeBand.Under11) {
      // Under 11: redirect toward parent-led model — as per brief
      navigate("/onboarding/under-11");
    } else if (band === AgeBand.ElevenToFifteen) {
      navigate("/onboarding/parental-awareness");
    } else {
      // 16–18: independent use
      navigate("/onboarding/treatment");
    }
  }

  return (
    <AuthLayout step={1} totalSteps={3}>
      <header className="mb-xl">
        <p className="text-caption text-muted-foreground">About you</p>
        <h1 className="mt-xs text-h2 text-foreground">How old are you?</h1>
        <p className="mt-sm text-body text-muted-foreground">
          This helps us set up the right kind of account for you.
        </p>
      </header>

      <ul className="flex flex-col gap-sm" role="list">
        {AGE_OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full rounded-lg border border-border bg-background px-lg py-md text-left",
                "transition-all duration-micro",
                "hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                "active:scale-[0.99]"
              )}
            >
              <span className="block text-body font-medium text-foreground">{option.label}</span>
              {option.sublabel && (
                <span className="mt-xs block text-caption text-muted-foreground">
                  {option.sublabel}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-lg">
        <Button
          variant="ghost"
          onClick={() => navigate("/onboarding/role")}
          className="w-full text-muted-foreground"
        >
          ← Back
        </Button>
      </div>
    </AuthLayout>
  );
}
