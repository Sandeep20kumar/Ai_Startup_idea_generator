import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, Cpu, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AI Startup Idea Generator" },
      {
        name: "description",
        content:
          "How the AI Startup Idea Generator works: a structured reasoning engine that writes complete startup plans offline.",
      },
      { property: "og:title", content: "About the AI Startup Idea Generator" },
      {
        property: "og:description",
        content: "A structured AI business consultant that runs entirely in your browser.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-8 sm:py-12">
      <header className="animate-rise">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          About <span className="gradient-text">this app</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          An AI business consultant that turns six inputs into an 18-section startup plan.
        </p>
      </header>

      {[
        {
          icon: Info,
          title: "What it does",
          body: "You describe your domain, audience, budget, country, goal and preferred technology. A simulated AI agent runs seven reasoning passes and produces the idea, problem, solution, business model, revenue streams, tech stack, competitors, SWOT, marketing plan, team, budget, six-month roadmap, risks, future scope and an investor pitch.",
        },
        {
          icon: Cpu,
          title: "How it works",
          body: "A structured generation engine combines your inputs with a curated knowledge base for each domain and audience. Everything runs locally — no external API is required. The engine returns a single typed StartupPlan object, so swapping in a real LLM later means replacing one function while every screen keeps working.",
        },
        {
          icon: ShieldCheck,
          title: "Your data",
          body: "Nothing is uploaded. Saved reports and your theme preference live in this browser's local storage and can be cleared any time from Settings.",
        },
      ].map((item) => (
        <section key={item.title} className="glass-card animate-rise p-6">
          <div className="flex items-center gap-3">
            <item.icon className="size-5 text-primary" />
            <h2 className="font-display text-lg font-bold">{item.title}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        </section>
      ))}

      <div className="glass-card animate-rise flex flex-col items-start gap-3 p-6">
        <p className="text-sm text-muted-foreground">Built with React, TypeScript and Tailwind CSS · v1.0.0</p>
        <Link
          to="/generate"
          className="gradient-brand inline-flex h-11 items-center rounded-full px-6 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <Sparkles className="mr-2 size-4" /> Generate a startup
        </Link>
      </div>
    </div>
  );
}
