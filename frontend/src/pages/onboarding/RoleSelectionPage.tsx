import { useNavigate } from "react-router-dom";
import { UserRole } from "shared/types/enums";
import { useOnboarding } from "@/app/OnboardingContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { cn } from "@/lib/utils";

const ROLES: Array<{
  value: UserRole;
  label: string;
  description: string;
  emoji: string;
}> = [
  {
    value: UserRole.YoungPerson,
    label: "Young person",
    description: "I'm attending CAMHS and want to track my mood and access resources.",
    emoji: "🌱",
  },
  {
    value: UserRole.ParentCarer,
    label: "Parent or carer",
    description: "I'm supporting a young person and want to access guidance and worksheets.",
    emoji: "🤝",
  },
  {
    value: UserRole.Practitioner,
    label: "Practitioner",
    description: "I'm a CAMHS clinician delivering CBT sessions.",
    emoji: "💼",
  },
  {
    value: UserRole.TraineePractitioner,
    label: "Trainee practitioner",
    description: "I'm training as a CAMHS clinician and want to access resources.",
    emoji: "📚",
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { setRole } = useOnboarding();

  function handleSelect(role: UserRole) {
    setRole(role);
    // nextRoute() is calculated after state update — navigate based on role directly
    if (role === UserRole.YoungPerson) {
      navigate("/onboarding/age");
    } else if (role === UserRole.ParentCarer) {
      navigate("/onboarding/treatment");
    } else {
      navigate("/auth/sign-up");
    }
  }

  return (
    <AuthLayout step={0} totalSteps={3}>
      <header className="mb-xl">
        <p className="text-caption text-muted-foreground">Welcome</p>
        <h1 className="mt-xs text-h2 text-foreground">Who are you?</h1>
        <p className="mt-sm text-body text-muted-foreground">
          This helps us show you the right experience. Your answer is private.
        </p>
      </header>

      <ul className="flex flex-col gap-sm" role="list">
        {ROLES.map((role) => (
          <li key={role.value}>
            <button
              onClick={() => handleSelect(role.value)}
              className={cn(
                "w-full rounded-lg border border-border bg-background px-lg py-md text-left",
                "transition-all duration-micro",
                "hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                "active:scale-[0.99]"
              )}
              aria-label={`I am a ${role.label}`}
            >
              <span className="flex items-start gap-md">
                <span className="text-2xl" aria-hidden="true">{role.emoji}</span>
                <span>
                  <span className="block text-body font-medium text-foreground">
                    {role.label}
                  </span>
                  <span className="mt-xs block text-caption text-muted-foreground">
                    {role.description}
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-xl text-center text-caption text-muted-foreground">
        Already have an account?{" "}
        <a href="/auth/sign-in" className="text-primary underline-offset-2 hover:underline">
          Sign in
        </a>
      </p>
    </AuthLayout>
  );
}
