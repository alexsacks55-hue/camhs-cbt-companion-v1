import { useNavigate } from "react-router-dom";
import { UserRole, AgeBand } from "shared/types/enums";
import { useOnboarding } from "@/app/OnboardingContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";

/**
 * Shown when a young person selects "under 11".
 * Redirects toward the parent-led use model per the brief.
 */
export default function Under11Page() {
  const navigate = useNavigate();
  const { setRole, setAgeBand } = useOnboarding();

  function switchToParent() {
    setRole(UserRole.ParentCarer);
    setAgeBand(AgeBand.Adult); // clear the child age band
    navigate("/auth/sign-up");
  }

  return (
    <AuthLayout>
      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">
          It looks like a parent or carer should set this up
        </h1>
      </header>

      <div className="space-y-md text-body text-muted-foreground">
        <p>
          This app is designed for young people aged 11 and over to use on their own.
        </p>
        <p>
          If you are under 11, it is best for a parent or carer to create an account and
          use the app with you together.
        </p>
      </div>

      <div className="mt-xl flex flex-col gap-sm">
        <Button onClick={switchToParent} className="w-full">
          Set up a parent or carer account instead
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
