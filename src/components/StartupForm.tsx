import { useState } from "react";
import { Rocket, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AUDIENCES,
  BUDGETS,
  COUNTRIES,
  DOMAINS,
  GOALS,
  TECHNOLOGIES,
  type StartupInput,
} from "@/lib/startup-generator";

interface Props {
  initial?: StartupInput | undefined;
  loading?: boolean | undefined;
  onGenerate: (input: StartupInput) => void;
}

const DEFAULTS: StartupInput = {
  domain: "Artificial Intelligence",
  audience: "Students",
  budget: "Medium (₹50,000–₹5 Lakhs)",
  country: "India",
  goal: "Solve a Problem",
  technology: "AI",
};

/** Small reusable labelled dropdown built on the shadcn Select primitive. */
function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full rounded-xl bg-background/60">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** The main input form that feeds the AI agent. */
export function StartupForm({ initial, loading, onGenerate }: Props) {
  const [form, setForm] = useState<StartupInput>(initial ?? DEFAULTS);
  const [customCountry, setCustomCountry] = useState("");

  const update = <K extends keyof StartupInput>(key: K, value: StartupInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      className="glass-card p-5 sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        onGenerate({ ...form, country: customCountry.trim() || form.country });
      }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold sm:text-2xl">Tell the AI about your startup</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Six quick inputs — the agent builds an 18-section business plan from them.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Startup Domain"
          value={form.domain}
          options={DOMAINS}
          onChange={(v) => update("domain", v as StartupInput["domain"])}
        />
        <Field
          label="Target Audience"
          value={form.audience}
          options={AUDIENCES}
          onChange={(v) => update("audience", v as StartupInput["audience"])}
        />
        <Field
          label="Budget"
          value={form.budget}
          options={BUDGETS}
          onChange={(v) => update("budget", v as StartupInput["budget"])}
        />
        <Field
          label="Country"
          value={form.country}
          options={COUNTRIES}
          onChange={(v) => {
            update("country", v);
            setCustomCountry("");
          }}
        />
        <Field
          label="Startup Goal"
          value={form.goal}
          options={GOALS}
          onChange={(v) => update("goal", v as StartupInput["goal"])}
        />
        <Field
          label="Preferred Technology"
          value={form.technology}
          options={TECHNOLOGIES}
          onChange={(v) => update("technology", v as StartupInput["technology"])}
        />

        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Other country (optional)
          </Label>
          <Input
            value={customCountry}
            onChange={(e) => setCustomCountry(e.target.value)}
            placeholder="Type a country if it isn't in the list"
            className="h-11 rounded-xl bg-background/60"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="gradient-brand glow-ring mt-7 h-12 w-full rounded-xl text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" /> AI Agent is working…
          </>
        ) : (
          <>
            <Rocket className="mr-2 size-5" /> Generate Startup Plan
          </>
        )}
      </Button>
    </form>
  );
}
