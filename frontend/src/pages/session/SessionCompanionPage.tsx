import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "shared/types/enums";

export default function SessionCompanionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isPractitioner =
    user?.role === UserRole.Practitioner ||
    user?.role === UserRole.TraineePractitioner ||
    user?.role === UserRole.Admin;

  return (
    <AppLayout>
      <header className="mb-xl max-w-content">
        <h1 className="text-h2 text-foreground">Session Companion</h1>
        <p className="mt-xs text-body text-muted-foreground">
          A temporary shared space to use during a session with your CAMHS worker.
          Nothing is saved permanently.
        </p>
      </header>

      <div className="max-w-content space-y-lg">
        {isPractitioner ? (
          <div className="rounded-xl border border-border bg-card p-lg space-y-md">
            <h2 className="text-body font-semibold text-foreground">Start a session</h2>
            <p className="text-caption text-muted-foreground">
              Create a session code to share with a young person. The session lasts up to 10 minutes
              of inactivity, then closes automatically.
            </p>
            <Button onClick={() => navigate("/session-companion/start")}>
              Start new session
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-lg space-y-md">
            <h2 className="text-body font-semibold text-foreground">Join a session</h2>
            <p className="text-caption text-muted-foreground">
              Your CAMHS worker will give you a short code to enter here.
            </p>
            <Button onClick={() => navigate("/session-companion/join")}>
              Enter session code
            </Button>
          </div>
        )}

        <div className="rounded-xl border border-border bg-muted/30 p-lg">
          <h2 className="text-body font-semibold text-foreground">About session mode</h2>
          <ul className="mt-sm space-y-xs text-caption text-muted-foreground list-disc list-inside">
            <li>Activities completed in session companion mode are temporary and will not be saved.</li>
            <li>If you wish to keep a copy for discussion, you may take a screenshot.</li>
            <li>Please avoid including names or personal details in any screenshots.</li>
            <li>Sessions close automatically after 10 minutes of inactivity.</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
