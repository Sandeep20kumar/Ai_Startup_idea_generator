import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Trash2, Database, Palette } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { clearReports, loadReports } from "@/lib/saved-reports";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Startup Idea Generator" },
      {
        name: "description",
        content: "Switch between light and dark mode and manage the reports stored on this device.",
      },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Theme and local data preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [count, setCount] = useState(0);

  useEffect(() => setCount(loadReports().length), []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-8 sm:py-12">
      <header className="animate-rise">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Personalise the workspace.</p>
      </header>

      <section className="glass-card animate-rise p-6">
        <div className="flex items-center gap-3">
          <Palette className="size-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Appearance</h2>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <Label htmlFor="theme-switch" className="flex items-center gap-2 text-sm">
            {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </Label>
          <Switch id="theme-switch" checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </section>

      <section className="glass-card animate-rise p-6">
        <div className="flex items-center gap-3">
          <Database className="size-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Local data</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {count} report{count === 1 ? "" : "s"} are stored in this browser. Nothing leaves your
          device.
        </p>
        <Button
          variant="outline"
          className="mt-4 rounded-full text-destructive"
          onClick={() => {
            clearReports();
            setCount(0);
            toast.success("All saved reports cleared");
          }}
        >
          <Trash2 className="mr-2 size-4" /> Clear all saved reports
        </Button>
      </section>
    </div>
  );
}
