import { Component, type ReactNode } from "react";

interface Props  { children: ReactNode }
interface State  { hasError: boolean; message: string }

/**
 * Top-level error boundary. Catches unexpected render errors and shows a calm
 * recovery screen instead of a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? "An unexpected error occurred." };
  }

  override componentDidCatch() {
    // Errors are intentionally not forwarded to an external service in V1.
  }

  override render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center bg-brand-bg p-md text-center"
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-md space-y-md rounded-xl border border-border bg-card p-xl shadow-sm">
          <h1 className="text-h2 text-foreground">Something went wrong</h1>
          <p className="text-body text-muted-foreground">
            We're sorry — something unexpected happened. Please refresh the page or go back to
            the home screen.
          </p>
          {this.state.message && (
            <p className="rounded bg-muted px-sm py-xs text-left font-mono text-[11px] text-destructive break-all">
              {this.state.message}
            </p>
          )}
          <div className="flex flex-col gap-sm sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="min-h-[44px] rounded-lg border border-border bg-card px-lg text-body text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Refresh page
            </button>
            <a
              href="/home"
              className="min-h-[44px] inline-flex items-center justify-center rounded-lg bg-primary px-lg text-body text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Go to home
            </a>
          </div>
        </div>
      </main>
    );
  }
}
