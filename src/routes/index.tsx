import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  LayoutGrid,
  LineChart,
  Coins,
  Cpu,
  Megaphone,
  Presentation,
  ArrowRight,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Startup Idea Generator — Build Your Startup Plan in Seconds" },
      {
        name: "description",
        content:
          "An AI business consultant that turns six inputs into a complete startup plan: idea, market analysis, revenue model, roadmap and investor pitch.",
      },
      { property: "og:title", content: "AI Startup Idea Generator" },
      {
        property: "og:description",
        content:
          "Generate innovative startup ideas, business models, revenue plans and growth strategies using AI.",
      },
    ],
  }),
  component: Home,
});

/** The seven headline capabilities shown as feature cards. */
const FEATURES = [
  { icon: Sparkles, title: "AI Idea Generation", text: "Unique, domain-aware startup concepts with names and taglines." },
  { icon: LayoutGrid, title: "Business Model Canvas", text: "B2B, B2C, SaaS, marketplace or freemium — matched to your audience." },
  { icon: LineChart, title: "Market Analysis", text: "Five real competitors with strengths, weaknesses and a full SWOT." },
  { icon: Coins, title: "Revenue Prediction", text: "Revenue streams, budget split and a modelled break-even month." },
  { icon: Cpu, title: "Technology Recommendation", text: "Languages, frameworks, database, cloud and deployment stack." },
  { icon: Megaphone, title: "Marketing Strategy", text: "Six channels with concrete first campaigns to run." },
  { icon: Presentation, title: "Investor Pitch Generator", text: "A crisp 30-second pitch you can deliver from memory." },
];

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-16">
      {/* -------------------- HERO -------------------- */}
      <section className="animate-rise text-center">
        <span className="gradient-soft inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1.5 text-xs font-semibold">
          <Zap className="size-3.5 text-primary" />
          Your AI Business Consultant
        </span>

        <h1 className="mt-6 font-display text-4xl leading-[1.05] font-extrabold sm:text-6xl lg:text-7xl">
          <span className="gradient-text">AI Startup</span>
          <br />
          Idea Generator
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Generate innovative startup ideas, business models, revenue plans, and growth strategies
          using Artificial Intelligence.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/generate"
            className="gradient-brand glow-ring inline-flex h-12 w-full items-center justify-center rounded-full px-8 font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Generate Startup
            <ArrowRight className="ml-2 size-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-background/60 px-8 font-semibold backdrop-blur transition-colors hover:bg-accent/10 sm:w-auto"
          >
            View Features
          </a>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["18", "Report sections"],
            ["7", "AI agent steps"],
            ["14", "Domains covered"],
            ["0", "APIs required"],
          ].map(([value, label]) => (
            <div key={label} className="glass-card p-4">
              <p className="gradient-text font-display text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------- FEATURES -------------------- */}
      <section id="features" className="mt-20 scroll-mt-24">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
          Everything a founder needs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          One prompt in, an investor-ready business plan out.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="glass-card group p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="gradient-brand grid size-11 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-110">
                <feature.icon className="size-5 text-primary-foreground" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* -------------------- CTA -------------------- */}
      <section className="glass-card mt-20 overflow-hidden">
        <div className="gradient-brand flex flex-col items-center gap-5 px-6 py-12 text-center sm:px-10">
          <h2 className="font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            Ready to meet your next startup?
          </h2>
          <p className="max-w-xl text-primary-foreground/90">
            Answer six questions and watch the AI agent build your full business plan, live.
          </p>
          <Link
            to="/generate"
            className="inline-flex h-12 items-center justify-center rounded-full bg-background px-8 font-semibold text-foreground transition-transform hover:scale-[1.03]"
          >
            Start generating
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
