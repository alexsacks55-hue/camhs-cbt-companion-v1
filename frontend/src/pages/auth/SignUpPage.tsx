import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboarding } from "@/app/OnboardingContext";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/services/auth.service";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(50, "Username must be 50 characters or fewer.")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Only letters, numbers, underscores, and hyphens are allowed."
      ),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters."),
    password_confirm: z.string(),
    consent_given: z
      .boolean()
      .refine((v) => v === true, "Please confirm you understand how this app works."),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: "Passwords do not match.",
    path: ["password_confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  const { state: onboarding, reset: resetOnboarding } = useOnboarding();
  const { setTokenAndUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  // Guard: must have completed role selection first
  useEffect(() => {
    if (!onboarding.role) {
      navigate("/onboarding/role", { replace: true });
    }
  }, [onboarding.role, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { consent_given: false },
  });

  async function onSubmit(values: FormValues) {
    if (!onboarding.role) return;
    setServerError(null);

    try {
      const { user, accessToken } = await authApi.register({
        username: values.username,
        password: values.password,
        role: onboarding.role,
        age_band: onboarding.age_band ?? undefined,
        consent_given: values.consent_given,
        parental_aware: onboarding.parental_aware,
        manual_type: onboarding.manual_type ?? undefined,
      });
      resetOnboarding();
      setTokenAndUser(accessToken, user);
      navigate("/home", { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "We couldn't create your account. Please try again.";
      setServerError(message);
    }
  }

  return (
    <AuthLayout step={2} totalSteps={3}>
      <header className="mb-xl">
        <p className="text-caption text-muted-foreground">Create your account</p>
        <h1 className="mt-xs text-h2 text-foreground">Choose a username and password</h1>
        <p className="mt-sm text-body text-muted-foreground">
          You don't need to use your real name. Choose something you'll remember.
        </p>
      </header>

      {serverError && (
        <Alert variant="destructive" className="mb-lg">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-lg">
        <div className="space-y-sm">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="e.g. blue-sky-42"
            aria-describedby="username-hint username-error"
            {...register("username")}
          />
          <p id="username-hint" className="text-caption text-muted-foreground">
            Letters, numbers, hyphens and underscores only. Not your real name.
          </p>
          {errors.username && (
            <p id="username-error" className="text-caption text-destructive" role="alert">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-sm">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-describedby="password-hint password-error"
            {...register("password")}
          />
          <p id="password-hint" className="text-caption text-muted-foreground">
            At least 12 characters. Use a mix of letters and numbers.
          </p>
          {errors.password && (
            <p id="password-error" className="text-caption text-destructive" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-sm">
          <Label htmlFor="password_confirm">Confirm password</Label>
          <Input
            id="password_confirm"
            type="password"
            autoComplete="new-password"
            aria-describedby={errors.password_confirm ? "confirm-error" : undefined}
            {...register("password_confirm")}
          />
          {errors.password_confirm && (
            <p id="confirm-error" className="text-caption text-destructive" role="alert">
              {errors.password_confirm.message}
            </p>
          )}
        </div>

        {/* Consent */}
        <div className="rounded-lg border border-border bg-background p-md">
          <label className="flex items-start gap-md cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 flex-shrink-0 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
              aria-describedby={errors.consent_given ? "consent-error" : undefined}
              {...register("consent_given")}
            />
            <span className="text-caption text-muted-foreground">
              I understand that this app helps me track patterns and access CBT resources. It is
              not a crisis service. If I am in distress, I will contact a trusted adult or call
              a support line.
            </span>
          </label>
          {errors.consent_given && (
            <p id="consent-error" className="mt-sm text-caption text-destructive" role="alert">
              {errors.consent_given.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-xl text-center text-caption text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/sign-in" className="text-primary underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
