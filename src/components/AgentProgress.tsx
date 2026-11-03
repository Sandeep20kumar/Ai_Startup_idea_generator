import { Check, Loader2, Circle } from "lucide-react";

export const AGENT_STEPS = [
  "Analyzing User Inputs",
  "Identifying Market Gap",
  "Finding Business Opportunities",
  "Generating Startup Concept",
  "Building Revenue Model",
  "Creating Marketing Strategy",
  "Preparing Final Report",
] as const;

/** Visualises the simulated AI agent pipeline while a plan is generated. */
export function AgentProgress({ activeStep }: { activeStep: number }) {
  const percent = Math.round((activeStep / AGENT_STEPS.length) * 100);

  return (
    <section className="glass-card animate-rise p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">AI Agent Workflow</h2>
          <p className="text-sm text-muted-foreground">
            Seven reasoning passes over your inputs.
          </p>
        </div>
        <span className="gradient-text font-display text-2xl font-bold">{percent}%</span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="gradient-brand h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="space-y-2.5">
        {AGENT_STEPS.map((step, index) => {
          const done = index < activeStep;
          const running = index === activeStep;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-300 ${
                running
                  ? "gradient-soft border-primary/40 shadow-sm"
                  : done
                    ? "border-transparent bg-muted/50"
                    : "border-transparent bg-muted/20 opacity-60"
              }`}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border/70 bg-background/70">
                {done ? (
                  <Check className="size-3.5 text-success" />
                ) : running ? (
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                ) : (
                  <Circle className="size-3 text-muted-foreground" />
                )}
              </span>
              <span className={`text-sm ${running ? "font-semibold" : ""}`}>{step}</span>
              {running && <span className="shimmer-bar ml-auto h-0.5 w-16 rounded-full" />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
