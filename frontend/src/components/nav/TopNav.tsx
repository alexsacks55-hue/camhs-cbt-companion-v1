import { useTheme } from "@/app/ThemeContext";
import { Sun, Moon } from "lucide-react";

/**
 * Slim top bar — visible on md and up alongside the sidebar.
 * Contains only the theme toggle. Sign out and change password are in SideNav.
 */
export function TopNav() {
  const { theme, toggle } = useTheme();

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
