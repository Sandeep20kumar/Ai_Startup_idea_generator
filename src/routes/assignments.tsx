import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Code2, FileText, LockKeyhole, Network, RefreshCw, ShieldCheck, Sparkles, Terminal, Users, Zap } from "lucide-react";

export const Route = createFileRoute("/assignments")({
  head: () => ({ meta: [{ title: "Assignment Dashboard — AI Startup Idea Generator" }, { name: "description", content: "View and demonstrate Agent Technology assignments 1.1 through 5.2." }] }),
  component: AssignmentsDashboard,
});

const assignments = [
  { id: "1.1", title: "Project Ideation & PEAS", category: "Foundations", icon: BookOpen, summary: "Describe the startup agent's task environment and PEAS model.", output: ["Performance: relevance, completeness, clarity, response time", "Environment: browser, startup inputs, knowledge base, reports", "Actuators: generate, save, export and present a plan", "Sensors: domain, audience, budget, country, goal and technology"], evidence: "Documentation: docs/ASSIGNMENT_MAPPING.md and the Assignment 1.1 report." },
  { id: "1.2", title: "Rule-Based Reasoning", category: "Reasoning", icon: Zap, summary: "Evaluate startup requirements with condition-action rules.", output: ["R1 — Missing inputs: ask the user to complete required fields", "R2 — Low budget: recommend a narrow MVP", "R3 — Social impact: define a measurable impact indicator", "R4 — Unvalidated market: recommend interviews or a pilot"], evidence: "Run the related Python assignment program to show its live rule logs." },
  { id: "2.1", title: "Threads & Background Workers", category: "Concurrency", icon: Activity, summary: "Run independent startup-planning tasks concurrently.", output: ["IdeaAgent: drafts the startup concept", "MarketAgent: recommends customer validation", "BudgetAgent: proposes MVP-first cost planning", "RiskAgent: identifies scope and market risks"], evidence: "Run the Assignment 2.1 Python program; capture worker completion and elapsed time." },
  { id: "2.2", title: "Socket Agent Messaging", category: "Communication", icon: Network, summary: "Demonstrate message exchange between local agents.", output: ["Socket endpoint: 127.0.0.1:8765 (shown by this project's backend)", "Start server.py and observe the socket-agent listening message", "Send a test message using the matching client/program"], evidence: "The socket listener is started by agent_backend/server.py; use the matching client for message exchange." },
  { id: "3.1", title: "Multi-Agent Coordination", category: "Coordination", icon: Users, summary: "Coordinate specialists and merge their startup recommendations.", output: ["RequirementsAgent: validate required startup inputs", "IdeaAgent: propose a concept", "FeasibilityAgent: assess budget fit", "RiskAgent: flag risks and request human review where needed"], evidence: "Run the Assignment 3.1 coordination program and show its blackboard/final records." },
  { id: "3.2", title: "Utility Ranking — 10 Ideas", category: "Optimization", icon: Activity, summary: "Compare startup candidates using utility scores.", output: ["Candidates are scored against the selected constraints", "Results are sorted from highest to lowest utility", "Inspect the top-ranked idea and the full candidate list", "Scores are decision-support estimates, not market guarantees"], evidence: "Generate a plan and open Assignment Agent Evaluation, or run the utility-ranking test." },
  { id: "4.1", title: "BDI Reasoning & Replanning", category: "Reasoning", icon: RefreshCw, summary: "Show beliefs, desires, intentions and a revised plan.", output: ["Beliefs: user constraints and current feasibility/risk observations", "Desire: produce a useful and feasible startup plan", "Intention: pursue an MVP-first plan", "Replanning: revise the intention when constraints or risks change"], evidence: "Run the BDI demonstration/test and capture the original and revised intention." },
  { id: "4.2", title: "Knowledge Base & REST API", category: "Integration", icon: Code2, summary: "Inspect structured startup knowledge and API responses.", output: ["Knowledge source: agent_backend/knowledge_base.json", "API server: http://127.0.0.1:8000", "Check /api/status in a browser while server.py is running", "Use the project's documented API routes for the actual JSON payload"], evidence: "Show knowledge_base.json and a successful REST response. External API integration should only be claimed if configured." },
  { id: "5.1", title: "Message Security", category: "Security", icon: ShieldCheck, summary: "Validate signed messages and reject tampering or unknown senders.", output: ["Trusted sender + valid signature: accept", "Modified message body: reject", "Unknown sender: reject", "Never expose signing secrets in the frontend"], evidence: "Run python -m unittest -v test_agent.py from agent_backend and show security test results." },
  { id: "5.2", title: "Capstone Integration", category: "Capstone", icon: Sparkles, summary: "Demonstrate the React application, Python agents and documentation together.", output: ["Start frontend with npm run dev", "Start backend with python server.py", "Generate a startup plan from the React UI", "Capture the agent evaluation, tests, architecture and limitations"], evidence: "This is the end-to-end demonstration; check the backend status badge before claiming the UI is connected." },
];

function AssignmentsDashboard() {
  const [expanded, setExpanded] = useState<string | null>("1.1");
  const [backendStatus, setBackendStatus] = useState("Not checked");
  const [checking, setChecking] = useState(false);
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(assignments.map((a) => a.category)))];
  const visible = filter === "All" ? assignments : assignments.filter((a) => a.category === filter);

  async function checkBackend() {
    setChecking(true); setBackendStatus("Checking…");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/status", { signal: AbortSignal.timeout(4000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      setBackendStatus(`Online — ${body.status ?? "response received"}`);
    } catch {
      setBackendStatus("Offline / unreachable — verify server.py and browser CORS settings");
    } finally { setChecking(false); }
  }

  return <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" /> AGENT TECHNOLOGY · CAPSTONE</div><h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Assignment Dashboard</h1><p className="mt-2 max-w-2xl text-muted-foreground">A dedicated place to review and demonstrate assignments 1.1–5.2. Open each card for the expected evidence and practical demo guidance.</p></div>
      <Link to="/generate" className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Open Startup Generator</Link>
    </div>
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Assignment modules</p><p className="mt-1 text-3xl font-bold">10</p><p className="mt-1 text-xs text-muted-foreground">From 1.1 through 5.2</p></div>
      <div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Frontend</p><p className="mt-1 text-xl font-bold">React + TypeScript</p><p className="mt-1 text-xs text-muted-foreground">Current app route</p></div>
      <div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Python backend</p><p className="mt-1 text-sm font-semibold">{backendStatus}</p><button onClick={checkBackend} disabled={checking} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"><RefreshCw className={`size-4 ${checking ? "animate-spin" : ""}`} /> Check connection</button></div>
    </div>
    <div className="mb-5 flex flex-wrap gap-2">{categories.map((c) => <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-3 py-1.5 text-sm ${filter === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>{c}</button>)}</div>
    <div className="space-y-3">{visible.map((a) => { const Icon = a.icon; const isOpen = expanded === a.id; return <section key={a.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <button onClick={() => setExpanded(isOpen ? null : a.id)} aria-expanded={isOpen} className="flex w-full items-center gap-4 p-4 text-left sm:p-5"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold">{a.id}</span><span className="font-semibold">{a.title}</span></span><span className="mt-1 block text-sm text-muted-foreground">{a.summary}</span></span><span className="hidden rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground sm:inline">{a.category}</span>{isOpen ? <ChevronUp className="size-5 shrink-0" /> : <ChevronDown className="size-5 shrink-0" />}</button>
      {isOpen && <div className="border-t border-border px-5 py-5 sm:pl-[5.5rem]"><h3 className="mb-3 flex items-center gap-2 font-semibold"><Terminal className="size-4 text-primary" /> Expected output / demo checklist</h3><ul className="space-y-2">{a.output.map((line) => <li key={line} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" /><span>{line}</span></li>)}</ul><div className="mt-4 rounded-xl bg-muted/60 p-3 text-sm"><p className="mb-1 flex items-center gap-2 font-semibold"><FileText className="size-4" /> Evidence to capture</p><p className="text-muted-foreground">{a.evidence}</p></div></div>}
    </section>; })}</div>
    <div className="mt-7 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm"><LockKeyhole className="mt-0.5 size-5 shrink-0 text-amber-600" /><p><strong>Demonstration note:</strong> This dashboard organizes assignment evidence and offers a backend connectivity check. It does not fabricate live assignment results. For assignments that are separate Python exercises, run the corresponding program and show its real console output. Mark sample expectations as examples, not measured results.</p></div>
  </div>;
}
