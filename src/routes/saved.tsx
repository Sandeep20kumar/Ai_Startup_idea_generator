import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookmarkCheck, Trash2, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ReportView } from "@/components/ReportView";
import { Button } from "@/components/ui/button";
import { deleteReport, loadReports } from "@/lib/saved-reports";
import type { StartupPlan } from "@/lib/startup-generator";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Reports — AI Startup Idea Generator" },
      {
        name: "description",
        content: "Revisit, export and manage every startup plan you have generated and saved.",
      },
      { property: "og:title", content: "Saved Startup Reports" },
      { property: "og:description", content: "Your library of generated startup business plans." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const [reports, setReports] = useState<StartupPlan[]>([]);
  const [active, setActive] = useState<StartupPlan | null>(null);

  // Reports live in localStorage, so they can only be read after hydration.
  useEffect(() => setReports(loadReports()), []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-8 sm:py-12">
      <header className="animate-rise">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          Saved <span className="gradient-text">reports</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {reports.length} report{reports.length === 1 ? "" : "s"} stored on this device.
        </p>
      </header>

      {reports.length === 0 ? (
        <div className="glass-card animate-rise flex flex-col items-center gap-4 p-12 text-center">
          <BookmarkCheck className="size-10 text-primary" />
          <p className="text-muted-foreground">No saved reports yet.</p>
          <Button asChild className="gradient-brand rounded-full text-primary-foreground">
            <Link to="/generate">
              <Sparkles className="mr-2 size-4" /> Generate your first startup
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <article key={report.id} className="glass-card animate-rise p-5">
              <p className="text-xs text-muted-foreground">
                {new Date(report.createdAt).toLocaleDateString()} · {report.input.domain}
              </p>
              <h2 className="mt-1 font-display text-lg font-bold">{report.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{report.tagline}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setActive(report)}>
                  <Eye className="mr-1.5 size-3.5" /> View
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-destructive"
                  onClick={() => {
                    setReports(deleteReport(report.id));
                    if (active?.id === report.id) setActive(null);
                    toast.success("Report deleted");
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {active && <ReportView plan={active} />}
    </div>
  );
}
