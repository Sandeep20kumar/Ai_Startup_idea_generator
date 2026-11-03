import { useState } from "react";
import {
  Lightbulb,
  Quote,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  Briefcase,
  Coins,
  Cpu,
  Swords,
  Grid2x2,
  Megaphone,
  UsersRound,
  Wallet,
  CalendarRange,
  ShieldAlert,
  TrendingUp,
  Mic,
  Copy,
  FileDown,
  FileType2,
  Printer,
  RefreshCcw,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import { toast } from "sonner";

import { Bullets, Pill, SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { copyPlan, downloadDocx, printPlan, sharePlan } from "@/lib/report-export";
import { saveReport } from "@/lib/saved-reports";
import type { StartupPlan } from "@/lib/startup-generator";

interface Props {
  plan: StartupPlan;
  onRegenerate?: () => void;
}

/** Full 18-section startup report with export actions. */
export function ReportView({ plan, onRegenerate }: Props) {
  const [saved, setSaved] = useState(false);
  const t = plan.technologies;

  const actions = [
    {
      label: "Copy Report",
      icon: Copy,
      run: async () => {
        await copyPlan(plan);
        toast.success("Report copied to clipboard");
      },
    },
    { label: "Download PDF", icon: FileDown, run: async () => printPlan(plan) },
    {
      label: "Download DOCX",
      icon: FileType2,
      run: async () => {
        downloadDocx(plan);
        toast.success("DOCX downloaded");
      },
    },
    { label: "Print", icon: Printer, run: async () => printPlan(plan) },
    {
      label: "Share",
      icon: Share2,
      run: async () => {
        const result = await sharePlan(plan);
        toast.success(result === "shared" ? "Shared" : "Pitch copied to clipboard");
      },
    },
  ];

  return (
    <div className="space-y-5">
      {/* -------- Hero header of the report -------- */}
      <section className="glass-card animate-rise overflow-hidden">
        <div className="gradient-brand px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/80 uppercase">
            Startup Plan · {plan.input.domain}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            {plan.name}
          </h2>
          <p className="mt-2 max-w-2xl text-primary-foreground/90">{plan.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[plan.input.audience, plan.input.budget, plan.input.country, plan.input.goal, plan.input.technology].map(
              (chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-primary-foreground/30 bg-primary-foreground/15 px-3 py-1 text-xs font-medium text-primary-foreground"
                >
                  {chip}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 divide-border/60 border-t border-border/60 lg:grid-cols-4 lg:divide-x">
          {plan.metrics.map((metric) => (
            <div key={metric.label} className="p-4 sm:p-5">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="gradient-text font-display text-xl font-bold sm:text-2xl">{metric.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{metric.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------- Action bar -------- */}
      <div className="no-print flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="rounded-full transition-transform hover:scale-[1.03]"
            onClick={() => void action.run()}
          >
            <action.icon className="mr-2 size-4" />
            {action.label}
          </Button>
        ))}
        <Button
          variant="outline"
          className="rounded-full transition-transform hover:scale-[1.03]"
          onClick={() => {
            saveReport(plan);
            setSaved(true);
            toast.success("Saved to your reports");
          }}
        >
          <BookmarkPlus className="mr-2 size-4" />
          {saved ? "Saved" : "Save Report"}
        </Button>
        {onRegenerate && (
          <Button
            className="gradient-brand ml-auto rounded-full text-primary-foreground transition-transform hover:scale-[1.03]"
            onClick={onRegenerate}
          >
            <RefreshCcw className="mr-2 size-4" />
            Regenerate Startup
          </Button>
        )}
      </div>

      {/* -------- 18 report sections -------- */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard index={3} title="Startup Idea" icon={Lightbulb} className="lg:col-span-2">
          <p>{plan.idea}</p>
        </SectionCard>

        <SectionCard index={4} title="Problem Statement" icon={AlertTriangle}>
          <p>{plan.problem}</p>
        </SectionCard>

        <SectionCard index={5} title="Proposed Solution" icon={CheckCircle2}>
          <p>{plan.solution}</p>
        </SectionCard>

        <SectionCard index={6} title="Target Customers" icon={Users}>
          <Bullets items={plan.targetCustomers} />
        </SectionCard>

        <SectionCard index={7} title="Business Model" icon={Briefcase}>
          <div className="flex flex-wrap gap-2">
            {plan.businessModel.map((model) => (
              <Pill key={model}>{model}</Pill>
            ))}
          </div>
        </SectionCard>

        <SectionCard index={8} title="Revenue Sources" icon={Coins} className="lg:col-span-2">
          <Bullets items={plan.revenueSources} />
        </SectionCard>

        <SectionCard index={9} title="Required Technologies" icon={Cpu} className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ["Programming Languages", t.languages],
                ["Frameworks", t.frameworks],
                ["Database", t.database],
                ["Cloud Platform", t.cloud],
                ["AI Frameworks", t.aiFrameworks],
                ["Deployment", t.deployment],
              ] as const
            ).map(([label, values]) => (
              <div key={label}>
                <p className="mb-2 text-xs font-semibold tracking-wide text-foreground uppercase">
                  {label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {values.map((v) => (
                    <Pill key={v}>{v}</Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard index={10} title="Competitor Analysis" icon={Swords} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {plan.competitors.map((c) => (
              <div key={c.name} className="rounded-xl border border-border/60 bg-background/40 p-4">
                <p className="font-semibold text-foreground">{c.name}</p>
                <p className="mt-2 text-xs">
                  <span className="font-semibold text-success">Strength: </span>
                  {c.strength}
                </p>
                <p className="mt-1 text-xs">
                  <span className="font-semibold text-destructive">Weakness: </span>
                  {c.weakness}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard index={11} title="SWOT Analysis" icon={Grid2x2} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["Strengths", plan.swot.strengths],
                ["Weaknesses", plan.swot.weaknesses],
                ["Opportunities", plan.swot.opportunities],
                ["Threats", plan.swot.threats],
              ] as const
            ).map(([label, values]) => (
              <div key={label} className="rounded-xl border border-border/60 bg-background/40 p-4">
                <p className="mb-2 font-semibold text-foreground">{label}</p>
                <Bullets items={[...values]} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard index={12} title="Marketing Strategy" icon={Megaphone}>
          <ul className="space-y-3">
            {plan.marketing.map((m) => (
              <li key={m.channel}>
                <p className="font-semibold text-foreground">{m.channel}</p>
                <p>{m.plan}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard index={13} title="Estimated Team" icon={UsersRound}>
          <ul className="space-y-3">
            {plan.team.map((member) => (
              <li key={member.role} className="flex gap-3">
                <span className="gradient-soft grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-foreground">
                  {member.role.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold text-foreground">{member.role}</span>
                  {member.responsibility}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard index={14} title="Budget Estimation" icon={Wallet}>
          <p className="mb-4 text-foreground">
            Total six-month budget: <span className="font-bold">{plan.budget.total}</span>
          </p>
          <div className="space-y-3">
            {plan.budget.lines.map((line) => (
              <div key={line.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-foreground">{line.label}</span>
                  <span>
                    {line.amount} · {line.share}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="gradient-brand h-full rounded-full" style={{ width: `${line.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard index={15} title="Development Roadmap" icon={CalendarRange}>
          <ol className="relative space-y-4 border-l border-border/70 pl-5">
            {plan.roadmap.map((item) => (
              <li key={item.month} className="relative">
                <span className="gradient-brand absolute top-1.5 -left-[26px] size-3 rounded-full ring-4 ring-background" />
                <p className="font-semibold text-foreground">
                  {item.month} — {item.focus}
                </p>
                <p>{item.deliverables.join(" · ")}</p>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard index={16} title="Risk Analysis" icon={ShieldAlert}>
          <ul className="space-y-3">
            {plan.risks.map((r) => (
              <li key={r.risk}>
                <p className="font-semibold text-foreground">{r.risk}</p>
                <p>
                  <span className="font-medium text-success">Mitigation: </span>
                  {r.mitigation}
                </p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard index={17} title="Future Scope" icon={TrendingUp}>
          <Bullets items={plan.futureScope} />
        </SectionCard>

        <SectionCard index={18} title="Investor Pitch (30 seconds)" icon={Mic} className="lg:col-span-2">
          <div className="gradient-soft rounded-xl border border-border/50 p-5">
            <Quote className="mb-2 size-5 text-primary" />
            <p className="text-base leading-relaxed text-foreground italic">{plan.investorPitch}</p>
          </div>
        </SectionCard>

        <SectionCard index={1} title="Report Summary" icon={FileText} className="lg:col-span-2">
          <p>
            <span className="font-semibold text-foreground">{plan.name}</span> — {plan.tagline} Generated
            on {new Date(plan.createdAt).toLocaleString()} from your {plan.input.domain} inputs.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
