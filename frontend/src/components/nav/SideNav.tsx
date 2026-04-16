import type React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Home,
  Heart,
  BarChart2,
  BookOpen,
  HelpCircle,
  Users,
  LayoutDashboard,
  Shield,
  TrendingUp,
  NotebookPen,
  KeyRound,
  LogOut,
} from "lucide-react";
import { ROUTES } from "@/config/routes";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>> = {
  "/home":              Home,
  "/check-in":          Heart,
  "/diary":             NotebookPen,
  "/review":            BarChart2,
  "/patterns":          TrendingUp,
  "/resources":         BookOpen,
  "/session-companion": Users,
  "/service-insights":  LayoutDashboard,
  "/admin":             Shield,
  "/support":           HelpCircle,
};

/**
 * Left sidebar navigation — visible on md and up.
 * Fixed position, full height, NHS Blue background.
 */
export function SideNav() {
  const { navItems } = usePermissions();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/auth/sign-in", { replace: true });
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden md:flex w-56 flex-col"
      style={{ backgroundColor: "#003087", borderRight: "3px solid #41B6E6" }}
      aria-label="Sidebar navigation"
    >
      {/* Branding */}
      <div className="flex items-center gap-sm px-lg py-5 shrink-0">
        <span
          className="inline-flex items-center justify-center rounded px-2.5 py-1 text-sm font-black tracking-tight leading-none shrink-0"
          style={{ backgroundColor: "white", color: "#003087" }}
          aria-label="NHS"
        >
          NHS
        </span>
        <span className="text-body font-bold tracking-tight text-white leading-tight">
          CBT Companion
        </span>
      </div>

      {/* Divider */}
      <div className="mx-lg mb-md h-px" style={{ backgroundColor: "#41B6E6", opacity: 0.4 }} aria-hidden="true" />

      {/* Nav links */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-sm">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.path] ?? Home;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-sm rounded-lg px-md py-2.5 text-caption font-medium",
                      "transition-colors duration-micro",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60",
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/65 hover:bg-white/10 hover:text-white"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-white/65 group-hover:text-white")}
                        aria-hidden={true}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="ml-auto h-4 w-0.5 rounded-full"
                          style={{ backgroundColor: "#41B6E6" }}
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 px-sm pb-md pt-sm space-y-0.5" style={{ borderTop: "1px solid rgba(65,182,230,0.2)" }}>
        <button
          onClick={() => navigate(ROUTES.changePassword)}
          className={cn(
            "group flex w-full items-center gap-sm rounded-lg px-md py-2.5 text-caption font-medium",
            "text-white/65 transition-colors duration-micro hover:bg-white/10 hover:text-white",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
          )}
        >
          <KeyRound className="h-4 w-4 shrink-0 text-white/65 group-hover:text-white" aria-hidden={true} />
          <span>Change password</span>
        </button>
        <button
          onClick={handleSignOut}
          className={cn(
            "group flex w-full items-center gap-sm rounded-lg px-md py-2.5 text-caption font-medium",
            "text-white/65 transition-colors duration-micro hover:bg-white/10 hover:text-white",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0 text-white/65 group-hover:text-white" aria-hidden={true} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
