import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sessionApi } from "@/services/session.service";

export default function JoinSessionPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError("Please enter the session code."); return; }

    setLoading(true);
    setError(null);
    try {
      // Validate the code exists before navigating
      await sessionApi.get(trimmed);
      navigate(`/session-companion/${trimmed}`);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setError("Session not found. Check the code and try again.");
      } else if (status === 410) {
        setError("This session has expired or ended.");
      } else {
        setError("We couldn't connect to the session. Please try again.");
      }
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
          <h1 className="text-h2 text-foreground">Join a session</h1>
          <p className="mt-xs text-body text-muted-foreground">
            Enter the code your CAMHS worker has given you.
          </p>
        </header>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleJoin} className="space-y-md" noValidate>
          <div className="space-y-sm">
            <Label htmlFor="session-code">Session code</Label>
            <Input
              id="session-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABC-123"
              className="text-xl tracking-widest uppercase font-mono max-w-[180px]"
              maxLength={7}
              autoComplete="off"
              autoCapitalize="characters"
            />
            <p className="text-caption text-muted-foreground">
              The code is 3 letters, a dash, and 3 numbers — for example, ABC-123.
            </p>
          </div>
          <Button type="submit" disabled={loading || code.trim().length < 7}>
            {loading ? "Joining…" : "Join session"}
          </Button>
        </form>

        <div className="rounded-xl border border-border bg-muted/30 p-lg">
          <p className="text-caption text-muted-foreground">
            <strong className="text-foreground">Remember:</strong> Activities completed in session
            companion mode are temporary and will not be saved. If you wish to keep a copy for
            discussion, you may take a screenshot. Please avoid including names or personal details.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
