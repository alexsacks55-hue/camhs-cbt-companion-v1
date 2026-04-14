import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  username: z.string().min(1, "Please enter your username."),
  password: z.string().min(1, "Please enter your password."),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const from = (location.state as { from?: Location })?.from?.pathname ?? "/home";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await signIn(values.username, values.password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "We couldn't sign you in. Please check your username and password.";
      setServerError(message);
    }
  }

  return (
    <AuthLayout>
      <header className="mb-xl">
        <h1 className="text-h2 text-foreground">Welcome back</h1>
        <p className="mt-sm text-body text-muted-foreground">
          Sign in to continue to your space.
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
            aria-describedby={errors.username ? "username-error" : undefined}
            {...register("username")}
          />
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
            autoComplete="current-password"
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p id="password-error" className="text-caption text-destructive" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-xl text-center text-caption text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/onboarding/role" className="text-primary underline-offset-2 hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
