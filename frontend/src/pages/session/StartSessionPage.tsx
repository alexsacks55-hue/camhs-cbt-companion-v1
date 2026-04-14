import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sessionApi } from "@/services/session.service";

export default function StartSessionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const { session_code } = await sessionApi.start();
      navigate(`/session-companion/${session_code}`);
    } catch {
      setError("We couldn't start a session right now. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <nav className="mb-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/session-companion")}
          className="text-muted-foreground -ml-sm"
        >
          ← Session Companion
        </Button>
      </nav>

      <div className="max-w-content space-y-lg">
        <header>
          <h1 className="text-h2 text-foreground">Start a session</h1>
          <p className="mt-xs text-body text-muted-foreground">
            A unique session code will be created for you to share with the young person.
          </p>
        </header>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-xl border border-border bg-card p-lg space-y-md">
          <h2 className="text-body font-semibold text-foreground">Before you start</h2>
          <ul className="space-y-xs text-caption text-muted-foreground list-disc list-inside">
            <li>The session lasts up to 10 minutes of inactivity before auto-closing.</li>
            <li>No session data is saved permanently.</li>
            <li>Share the code verbally — do not send it via unsecured messaging.</li>
          </ul>
          <Button onClick={handleStart} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Creating session…" : "Create session code"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
