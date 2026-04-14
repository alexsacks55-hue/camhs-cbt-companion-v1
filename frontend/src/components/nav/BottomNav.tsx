import { NavLink } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
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
} from "lucide-react";

/** Maps route paths to Lucide icons for the bottom nav. */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>> = {
  "/home":            Home,
  "/check-in":        Heart,
  "/diary":           NotebookPen,
  "/review":          BarChart2,
  "/patterns":        TrendingUp,
  "/resources":       BookOpen,
  "/session-companion": Users,
  "/service-insights": LayoutDashboard,
  "/admin":           Shield,
  "/support":         HelpCircle,
};

/**
 * Bottom tab bar — shown on mobile only (<640px).
 * Matches TopNav dark NHS Blue aesthetic.
 * Max 5 visible items.
 */
export function BottomNav() {
  const { navItems } = usePermissions();
  const visibleItems = navItems.slice(0, 5);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 block md:hidden"
      style={{ backgroundColor: "#003087", borderTop: "2px solid #41B6E6" }}
    >
      <ul className="flex h-16 items-stretch">
        {visibleItems.map((item) => {
          const Icon = ICON_MAP[item.path] ?? Home;
          return (
            <li key={item.path} className="flex flex-1">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex flex-1 flex-col items-center justify-center gap-0.5 px-xs",
                    "transition-colors duration-micro",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60",
                    isActive
                      ? "text-white"
                      : "text-white/50"
                  )
                }
                aria-label={item.label}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn("h-5 w-5", isActive ? "text-white" : "text-white/50")}
                      aria-hidden={true}
                    />
                    <span className={cn(
                      "text-[10px] font-medium leading-none",
                      isActive ? "text-white" : "text-white/50"
                    )}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 h-0.5 w-8 rounded-full"
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
  );
}
