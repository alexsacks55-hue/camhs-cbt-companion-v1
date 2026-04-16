import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/app/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { ROUTES } from "@/config/routes";

/**
 * Slim top bar — visible on md and up alongside the sidebar.
 * Contains only theme toggle and sign out. Branding + nav are in SideNav.
 */
export function TopNav() {
  const { signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/auth/sign-in", { replace: true });
  }

  return (
    <header
      className="hidden md:flex h-14 items-center justify-end gap-md px-lg shrink-0"
      style={{ backgroundColor: "#003087", borderBottom: "3px solid #41B6E6" }}
    >
      <button
        onClick={toggle}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-white/70 transition-colors duration-micro hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

    </header>
  );
}
