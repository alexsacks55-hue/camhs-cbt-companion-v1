import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/app/AuthContext";
import { OnboardingProvider } from "@/app/OnboardingContext";
import { ThemeProvider } from "@/app/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ROUTES } from "@/config/routes";

// Home
import HomePage from "@/pages/home/HomePage";

// Phase 5 — Resource library & admin
import ResourcesPage from "@/pages/resources/ResourcesPage";
import ResourceCategoryPage from "@/pages/resources/ResourceCategoryPage";
import ResourceDetailPage from "@/pages/resources/ResourceDetailPage";
import AdminResourcesPage from "@/pages/admin/AdminResourcesPage";
import AdminResourceFormPage from "@/pages/admin/AdminResourceFormPage";

// Phase 6 — Mood Check-In
import MoodCheckinPage from "@/pages/checkin/MoodCheckinPage";

// Phase 7 — Review
import ReviewPage from "@/pages/review/ReviewPage";


// Phase 10 — Session Companion
import SessionCompanionPage from "@/pages/session/SessionCompanionPage";
import StartSessionPage from "@/pages/session/StartSessionPage";
import JoinSessionPage from "@/pages/session/JoinSessionPage";
import ActiveSessionPage from "@/pages/session/ActiveSessionPage";

// Phase 11 — Service Insights
import ServiceInsightsPage from "@/pages/insights/ServiceInsightsPage";

// Phase 12 — Help & Support
import SupportPage from "@/pages/support/SupportPage";

// Trainee practitioner — Training
import TrainingPage from "@/pages/training/TrainingPage";


// Auth & onboarding pages
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import RoleSelectionPage from "@/pages/onboarding/RoleSelectionPage";
import AgeBandPage from "@/pages/onboarding/AgeBandPage";
import ParentalAwarenessPage from "@/pages/onboarding/ParentalAwarenessPage";
import TreatmentSelectionPage from "@/pages/onboarding/TreatmentSelectionPage";
import Under11Page from "@/pages/onboarding/Under11Page";

/** App root. All providers wrap the router so every page has access to auth state. */
export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <OnboardingProvider>
        <Routes>
          {/* ── Auth & onboarding (public) ─────────────────────────────────── */}
          <Route path={ROUTES.signIn} element={<SignInPage />} />
          <Route path={ROUTES.signUp} element={<SignUpPage />} />
          <Route
            path={ROUTES.changePassword}
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.onboardingRole} element={<RoleSelectionPage />} />
          <Route path={ROUTES.onboardingAge} element={<AgeBandPage />} />
          <Route
            path={ROUTES.onboardingParentalAwareness}
            element={<ParentalAwarenessPage />}
          />
          <Route path="/onboarding/treatment" element={<TreatmentSelectionPage />} />
          <Route path="/onboarding/under-11" element={<Under11Page />} />

          {/* ── Protected app routes ───────────────────────────────────────── */}
          <Route
            path={ROUTES.home}
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.checkIn}
            element={
              <ProtectedRoute feature="mood_checkin">
                <MoodCheckinPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.review}
            element={
              <ProtectedRoute feature="review">
                <ReviewPage />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.patterns} element={<Navigate to={ROUTES.review} replace />} />
          <Route
            path={ROUTES.resources}
            element={
              <ProtectedRoute feature="resources">
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.resourceCategory}
            element={
              <ProtectedRoute feature="resources">
                <ResourceCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.resourceSection}
            element={
              <ProtectedRoute feature="resources">
                <ResourceCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.resourceDetail}
            element={
              <ProtectedRoute feature="resources">
                <ResourceDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.sessionCompanion}
            element={
              <ProtectedRoute>
                <SessionCompanionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.sessionCompanionStart}
            element={
              <ProtectedRoute feature="session_companion_manage">
                <StartSessionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.sessionCompanionJoin}
            element={
              <ProtectedRoute feature="session_companion_join">
                <JoinSessionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.sessionCompanionActive}
            element={
              <ProtectedRoute>
                <ActiveSessionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.support}
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.serviceInsights}
            element={
              <ProtectedRoute feature="service_insights">
                <ServiceInsightsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.training}
            element={
              <ProtectedRoute feature="training">
                <TrainingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.admin}
            element={
              <ProtectedRoute feature="admin">
                <AdminResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.adminResources}
            element={
              <ProtectedRoute feature="admin">
                <AdminResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.adminResourceNew}
            element={
              <ProtectedRoute feature="admin">
                <AdminResourceFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.adminResourceEdit}
            element={
              <ProtectedRoute feature="admin">
                <AdminResourceFormPage />
              </ProtectedRoute>
            }
          />

          {/* ── Default redirects ──────────────────────────────────────────── */}
          <Route path="/" element={<Navigate to={ROUTES.signIn} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </OnboardingProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg p-md">
      <div className="content-width w-full rounded-lg border border-border bg-card p-xl text-center shadow-sm">
        <h1 className="text-h2 text-foreground">Page not found</h1>
        <p className="mt-md text-body text-muted-foreground">
          We couldn't find this page. Please check the address and try again.
        </p>
        <a href="/home" className="mt-lg inline-block text-primary underline-offset-2 hover:underline">
          Go to home
        </a>
      </div>
    </main>
  );
}
