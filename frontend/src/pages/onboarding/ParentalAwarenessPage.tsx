import { useNavigate } from "react-router-dom";
import { AgeBand, UserRole } from "shared/types/enums";
import { useOnboarding } from "@/app/OnboardingContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";

export default function ParentalAwarenessPage() {
  const navigate = useNavigate();
  const { state, setParentalAware } = useOnboarding();

  // Guard: only young_person aged 11–15 should reach this page
  if (
    state.role !== UserRole.YoungPerson ||
    state.age_band !== AgeBand.ElevenToFifteen
  ) {
    navigate("/onboarding/role");
    return null;
  }

  function handleContinue() {
    setParentalAware(true);
    navigate("/onboarding/treatment");
  }

  return (
    <AuthLayout step={2} totalSteps={3}>
      <header className="mb-xl">
        <p className="text-caption text-muted-foreground">One more thing</p>
        <h1 className="mt-xs text-h2 text-foreground">A note for young people aged 11 to 15</h1>
      </header>

      <div className="space-y-md rounded-lg border border-border bg-background p-lg text-body text-muted-foreground">
        <p>
          Because you are between 11 and 15, we ask that a parent or carer is aware that you
          are using this app.
        </p>
        <p>
          You do not need to share everything you record — this is your private space. But
          it is important that a trusted adult knows you are using it.
        </p>
        <p className="font-medium text-foreground">
          Please let a parent or carer know before continuing.
        </p>
      </div>

      <div className="mt-xl flex flex-col gap-sm">
        <Button onClick={handleContinue} className="w-full">
          A trusted adult knows — continue
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/onboarding/age")}
          className="w-full text-muted-foreground"
        >
          ← Back
        </Button>
      </div>
    </AuthLayout>
  );
}
