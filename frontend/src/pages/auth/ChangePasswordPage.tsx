import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/services/auth.service";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z
  .object({
    current_password: z.string().min(1, "Please enter your current password."),
    new_password: z
      .string()
      .min(12, "New password must be at least 12 characters."),
    confirm_password: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await authApi.changePassword(values.current_password, values.new_password);
      setSuccess(true);
      reset();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      setServerError(message);
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <header className="mb-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-md -ml-sm text-muted-foreground"
          >
            ← Back
          </Button>
          <h1 className="text-h2 text-foreground">Change password</h1>
          <p className="mt-sm text-body text-muted-foreground">
            Choose a strong password of at least 12 characters.
          </p>
        </header>

        {success && (
          <Alert className="mb-lg border-green-200 bg-green-50 text-green-800">
            <AlertDescription>Password changed successfully.</AlertDescription>
          </Alert>
        )}

        {serverError && (
          <Alert variant="destructive" className="mb-lg">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-lg">
          <div className="space-y-sm">
            <Label htmlFor="current_password">Current password</Label>
            <Input
              id="current_password"
              type="password"
              autoComplete="current-password"
              aria-describedby={errors.current_password ? "current-error" : undefined}
              {...register("current_password")}
            />
            {errors.current_password && (
              <p id="current-error" className="text-caption text-destructive" role="alert">
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div className="space-y-sm">
            <Label htmlFor="new_password">New password</Label>
            <Input
              id="new_password"
              type="password"
              autoComplete="new-password"
              aria-describedby={errors.new_password ? "new-error" : undefined}
              {...register("new_password")}
            />
            {errors.new_password && (
              <p id="new-error" className="text-caption text-destructive" role="alert">
                {errors.new_password.message}
              </p>
            )}
          </div>

          <div className="space-y-sm">
            <Label htmlFor="confirm_password">Confirm new password</Label>
            <Input
              id="confirm_password"
              type="password"
              autoComplete="new-password"
              aria-describedby={errors.confirm_password ? "confirm-error" : undefined}
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p id="confirm-error" className="text-caption text-destructive" role="alert">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Change password"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
