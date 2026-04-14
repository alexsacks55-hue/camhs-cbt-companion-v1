/**
 * Auth / onboarding layout.
 * Full-page NHS Blue header strip + centred card below — consistent with the rest of the app.
 */
export function AuthLayout({
  children,
  step,
  totalSteps,
}: {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      {/* ── NHS Header ─────────────────────────────────────────────────────── */}
      <header
        className="w-full px-lg py-md"
        style={{ backgroundColor: "#003087", borderBottom: "3px solid #41B6E6" }}
      >
        <div className="mx-auto flex max-w-content items-center gap-md">
          {/* NHS lozenge */}
          <span
            className="inline-flex items-center justify-center rounded px-3 py-1.5 text-base font-black tracking-tight leading-none"
            style={{ backgroundColor: "#ffffff", color: "#003087" }}
            aria-label="NHS"
          >
            NHS
          </span>
          <div>
            <p className="text-body font-bold leading-tight text-white">CBT Companion</p>
            <p className="text-caption leading-tight" style={{ color: "rgba(255,255,255,0.65)" }}>
              CAMHS digital support tool
            </p>
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center px-md py-xl">
        {/* Progress dots for multi-step onboarding */}
        {step !== undefined && totalSteps !== undefined && (
          <div
            className="mb-lg flex gap-sm"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemax={totalSteps}
          >
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-8 rounded-full transition-colors duration-200 ${
                  i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-border"
                }`}
              />
            ))}
          </div>
        )}

        {/* Card */}
        <div
          className="w-full max-w-content rounded-2xl border bg-card p-xl shadow-card"
          style={{ borderColor: "rgba(65,182,230,0.25)" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
