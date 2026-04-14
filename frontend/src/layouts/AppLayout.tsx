import { TopNav } from "@/components/nav/TopNav";
import { SideNav } from "@/components/nav/SideNav";
import { BottomNav } from "@/components/nav/BottomNav";
import { useTheme } from "@/app/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main app shell — wraps all authenticated pages.
 *
 * Desktop (md+):
 *   - SideNav: fixed left sidebar (w-56) with branding + nav links
 *   - TopNav: slim top bar right-aligned with theme toggle + sign out
 *   - Content scrolls in the remaining space
 *
 * Mobile (<md):
 *   - BottomNav: tab bar fixed at bottom
 *   - Floating dark-mode toggle above bottom nav
 *   - No sidebar or top bar
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-md focus:py-sm focus:text-primary-foreground focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Sidebar — desktop only */}
      <SideNav />

      {/* Right-hand column: top bar + scrollable content */}
      <div className="flex min-h-screen flex-col md:pl-56">
        <TopNav />

        <main
          id="main-content"
          className="flex-1 mx-auto w-full max-w-4xl px-md py-lg sm:px-lg
                     pb-24 md:pb-lg"
        >
          {children}
        </main>
      </div>

      {/* Mobile dark-mode toggle — sits above bottom nav */}
      <button
        onClick={toggle}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="fixed bottom-[72px] right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-card text-muted-foreground transition-colors hover:text-foreground md:hidden"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  );
}
