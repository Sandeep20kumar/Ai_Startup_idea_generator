import { Link } from "@tanstack/react-router";
import { Moon, Sun, Github, Mail, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/use-theme";

/** Toggle button that switches between the light and dark design tokens. */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle colour theme"
      className="rounded-full transition-transform hover:scale-105"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-border/60 px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Developed by <span className="font-semibold text-foreground">Team Nova Labs</span> · Version
          1.0.0
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <a className="transition-colors hover:text-primary" href="mailto:hello@aistartupgen.app">
            <Mail className="mr-1.5 inline size-4" />
            Contact
          </a>
          <a
            className="transition-colors hover:text-primary"
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Github className="mr-1.5 inline size-4" />
            GitHub
          </a>
          <Link className="transition-colors hover:text-primary" to="/about">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}

/** App chrome: collapsible sidebar, sticky header and footer around page content. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="aurora flex min-w-0 flex-1 flex-col">
          {/* Ambient gradient blobs for the premium background feel */}
          <div className="aurora-blob animate-float -top-24 left-1/4 size-72 opacity-25" aria-hidden />
          <div className="aurora-blob animate-float top-1/3 -right-20 size-80 opacity-20" aria-hidden />

          <header className="no-print sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-3 backdrop-blur-xl sm:px-6">
            <SidebarTrigger className="shrink-0" />
            <div className="flex min-w-0 items-center gap-2">
              <Sparkles className="size-4 shrink-0 text-primary" />
              <span className="truncate font-display text-sm font-semibold sm:text-base">
                AI Startup Idea Generator
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="default" className="hidden rounded-full sm:inline-flex">
                <Link to="/generate">Generate</Link>
              </Button>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
