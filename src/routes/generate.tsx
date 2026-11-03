import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { AGENT_STEPS, AgentProgress } from "@/components/AgentProgress";
import { ReportView } from "@/components/ReportView";
import { StartupForm } from "@/components/StartupForm";
import { generateStartupPlan, type StartupInput, type StartupPlan } from "@/lib/startup-generator";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate a Startup Plan — AI Startup Idea Generator" },
      {
        name: "description",
        content:
          "Choose your domain, audience, budget and technology, then watch the AI agent build an 18-section startup plan.",
      },
      { property: "og:title", content: "Generate a Startup Plan" },
      {
        property: "og:description",
        content: "Watch a simulated AI agent research, model and write your startup business plan.",
      },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const [step, setStep] = useState(-1); // -1 = idle, 0..6 = running step
  const [plan, setPlan] = useState<StartupPlan | null>(null);
  const [lastInput, setLastInput] = useState<StartupInput | null>(null);
  const [agentAudit, setAgentAudit] = useState<any>(null);
  const [agentApiStatus, setAgentApiStatus] = useState<"idle" | "connected" | "offline">("idle");
  const variation = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up pending timers if the user navigates away mid-run.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Pick up a preset chosen on the Templates page.
  useEffect(() => {
    const raw = sessionStorage.getItem("aisig-template");
    if (!raw) return;
    sessionStorage.removeItem("aisig-template");
    try {
      setLastInput(JSON.parse(raw) as StartupInput);
    } catch {
      /* ignore malformed presets */
    }
  }, []);

  const run = useCallback((input: StartupInput) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlan(null);
    setAgentAudit(null);
    setAgentApiStatus("idle");
    setLastInput(input);
    setStep(0);

    // Simulate the agent thinking through each stage.
    AGENT_STEPS.forEach((_, index) => {
      timers.current.push(setTimeout(() => setStep(index + 1), (index + 1) * 620));
    });

    timers.current.push(
      setTimeout(
        () => {
          setPlan(generateStartupPlan(input, variation.current));
          setStep(-1);
          // Run the assignment-integrated Python agent in parallel with the plan generator.
          fetch(`http://127.0.0.1:8000${lastInput ? "/api/replan" : "/api/generate"}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lastInput ? { ...input, previous: lastInput } : input),
          }).then(async (response) => {
            if (!response.ok) throw new Error("Agent API returned an error");
            setAgentAudit(await response.json()); setAgentApiStatus("connected");
          }).catch(() => setAgentApiStatus("offline"));
        },
        AGENT_STEPS.length * 620 + 300,
      ),
    );
  }, [lastInput]);

  const running = step >= 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-8 sm:py-12">
      <header className="animate-rise">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          Generate <span className="gradient-text">your startup</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          The AI agent analyses your inputs and writes a complete, investor-ready plan.
        </p>
      </header>

      <StartupForm
        key={lastInput ? JSON.stringify(lastInput) : "default"}
        loading={running}
        onGenerate={run}
        initial={lastInput ?? undefined}
      />

      {running && <AgentProgress activeStep={step} />}

      {agentApiStatus !== "idle" && (
        <section className="glass-card space-y-3 p-5" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">Assignment Agent Evaluation</h2>
            <span className="rounded-full border px-3 py-1 text-xs font-semibold">
              {agentApiStatus === "connected" ? "Python agents connected" : "Python backend offline — local plan still available"}
            </span>
          </div>
          {agentAudit && (
            <>
              <p className="text-sm text-muted-foreground">Top utility-ranked idea: <strong className="text-foreground">{agentAudit.top_recommendation?.name}</strong> · Utility score: <strong className="text-foreground">{agentAudit.top_recommendation?.score}/100</strong></p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border p-3"><p className="text-xs text-muted-foreground">Candidates evaluated</p><p className="text-2xl font-bold">{agentAudit.ranked_candidates?.length ?? 0}</p></div>
                <div className="rounded-xl border p-3"><p className="text-xs text-muted-foreground">Specialist agents</p><p className="text-2xl font-bold">{agentAudit.agent_negotiation?.agents?.length ?? 0}</p></div>
                <div className="rounded-xl border p-3"><p className="text-xs text-muted-foreground">Agent consensus</p><p className="text-lg font-bold">{agentAudit.agent_negotiation?.consensus_reached ? "Reached" : "Pending"}</p></div>
                <div className="rounded-xl border p-3"><p className="text-xs text-muted-foreground">BDI plan revision</p><p className="text-lg font-bold">{agentAudit.bdi?.revision ?? 0}</p></div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border p-4"><h3 className="font-semibold">Specialist agent reports</h3><div className="mt-3 space-y-3">{Object.entries(agentAudit.top_recommendation?.agents ?? {}).map(([agent, report]: [string, any]) => <div key={agent} className="rounded-lg bg-muted/40 p-3"><div className="font-medium">{agent.replaceAll("_", " ")}</div><p className="mt-1 text-xs text-muted-foreground">{Object.entries(report).map(([k,v]) => `${k.replaceAll("_", " ")}: ${String(v)}`).join(" · ")}</p></div>)}</div></div>
                <div className="rounded-xl border p-4"><h3 className="font-semibold">Utility score breakdown</h3><div className="mt-3 space-y-3">{Object.entries(agentAudit.top_recommendation?.components ?? {}).map(([label,value]) => <div key={label}><div className="mb-1 flex justify-between gap-2 text-sm"><span>{label.replaceAll("_", " ")}</span><strong>{String(value)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:`${Math.min(100,Number(value))}%`}} /></div></div>)}</div><p className="mt-3 text-xs text-muted-foreground">Heuristic scores based on curated examples, not verified market measurements.</p></div>
              </div>
              {agentAudit.replanning && <div className="rounded-xl border border-primary/30 bg-primary/5 p-4"><h3 className="font-semibold">Dynamic replanning</h3><p className="mt-1 text-sm">{agentAudit.replanning.reason}</p>{agentAudit.replanning.changes?.length > 0 && <ul className="mt-2 list-disc pl-5 text-sm">{agentAudit.replanning.changes.map((change:any) => <li key={change.field}>{change.field}: {change.from} → {change.to}</li>)}</ul>}</div>}
              <details className="text-sm"><summary className="cursor-pointer font-semibold">View rules, BDI intentions and ranked candidates</summary>
                <p className="mt-2 font-semibold">Rules fired</p><ul className="list-disc space-y-1 pl-5">{agentAudit.rules_fired?.map((rule: string) => <li key={rule}>{rule}</li>)}</ul>
                <p className="mt-3 font-semibold">Current intentions</p><ul className="list-disc space-y-1 pl-5">{agentAudit.bdi?.intentions?.map((item: string) => <li key={item}>{item}</li>)}</ul>
                <p className="mt-3 font-semibold">Top 10 ranking</p><ol className="list-decimal space-y-1 pl-5">{agentAudit.ranked_candidates?.map((item: any) => <li key={item.name}>{item.name} — {item.score}/100</li>)}</ol>
                <p className="mt-3 font-semibold">Knowledge representation</p><p className="text-muted-foreground">{agentAudit.knowledge_representation?.source}. {agentAudit.knowledge_representation?.triples?.length ?? 0} subject–predicate–object triples.</p><ul className="mt-2 list-disc space-y-1 pl-5">{agentAudit.knowledge_representation?.triples?.slice(0,6).map((t:any,i:number)=><li key={`${t.subject}-${i}`}>{t.subject} — {t.predicate} → {t.object}</li>)}</ul>
                <p className="mt-3 text-muted-foreground">Market context source: {agentAudit.market_context?.source}. {agentAudit.market_context?.note ?? ""}</p><p className="mt-2 text-muted-foreground">Message security: {agentAudit.security?.message_authentication}; trusted senders: {agentAudit.security?.trusted_senders?.join(", ")}.</p>
              </details>
            </>
          )}
        </section>
      )}

      {plan && (
        <ReportView
          plan={plan}
          onRegenerate={() => {
            variation.current += 1;
            if (lastInput) run(lastInput);
          }}
        />
      )}
    </div>
  );
}
