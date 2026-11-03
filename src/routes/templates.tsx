import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutTemplate, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StartupInput } from "@/lib/startup-generator";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Startup Templates — AI Startup Idea Generator" },
      {
        name: "description",
        content:
          "Start from a curated template: AI edtech, health assistant, agri intelligence, fintech co-pilot and more.",
      },
      { property: "og:title", content: "Startup Templates" },
      {
        property: "og:description",
        content: "Curated input presets that jump-start your startup plan generation.",
      },
    ],
  }),
  component: TemplatesPage,
});

/** Curated presets — each one pre-fills the generator form. */
const TEMPLATES: { title: string; description: string; input: StartupInput }[] = [
  {
    title: "AI Study Companion",
    description: "Adaptive learning for students on a lean budget.",
    input: {
      domain: "Education",
      audience: "Students",
      budget: "Low (< ₹50,000)",
      country: "India",
      goal: "Improve Productivity",
      technology: "AI",
    },
  },
  {
    title: "Clinic Copilot",
    description: "Documentation and triage automation for hospitals.",
    input: {
      domain: "Healthcare",
      audience: "Hospitals",
      budget: "High (> ₹5 Lakhs)",
      country: "India",
      goal: "Automation",
      technology: "Machine Learning",
    },
  },
  {
    title: "Farm Intelligence",
    description: "Satellite and sensor advisories for smallholder farmers.",
    input: {
      domain: "Agriculture",
      audience: "Farmers",
      budget: "Medium (₹50,000–₹5 Lakhs)",
      country: "India",
      goal: "Social Impact",
      technology: "IoT",
    },
  },
  {
    title: "SMB Money Copilot",
    description: "Cash-flow forecasting for small businesses.",
    input: {
      domain: "Finance",
      audience: "Businesses",
      budget: "Medium (₹50,000–₹5 Lakhs)",
      country: "United States",
      goal: "Reduce Cost",
      technology: "AI",
    },
  },
  {
    title: "Zero-Team Security",
    description: "Autonomous security analyst for lean teams.",
    input: {
      domain: "Cyber Security",
      audience: "Businesses",
      budget: "High (> ₹5 Lakhs)",
      country: "Singapore",
      goal: "Automation",
      technology: "Cloud",
    },
  },
  {
    title: "Immersive Retail",
    description: "AR try-on and styling for fashion shoppers.",
    input: {
      domain: "Fashion",
      audience: "Everyone",
      budget: "Medium (₹50,000–₹5 Lakhs)",
      country: "United Kingdom",
      goal: "Innovation",
      technology: "AR/VR",
    },
  },
];

function TemplatesPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-8 sm:py-12">
      <header className="animate-rise">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          Startup <span className="gradient-text">templates</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Proven input combinations — open one and generate in a single click.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => (
          <article
            key={template.title}
            className="glass-card animate-rise p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="gradient-brand grid size-10 place-items-center rounded-xl">
              <LayoutTemplate className="size-5 text-primary-foreground" />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold">{template.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[template.input.domain, template.input.audience, template.input.technology].map((tag) => (
                <span
                  key={tag}
                  className="gradient-soft rounded-full border border-border/50 px-2.5 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Button
              className="gradient-brand mt-5 w-full rounded-full text-primary-foreground"
              onClick={() => {
                // Hand the preset to the generator page via sessionStorage.
                sessionStorage.setItem("aisig-template", JSON.stringify(template.input));
                void navigate({ to: "/generate" });
              }}
            >
              Use template <ArrowRight className="ml-2 size-4" />
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
