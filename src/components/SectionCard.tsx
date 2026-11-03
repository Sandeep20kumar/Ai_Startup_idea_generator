import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Reusable glass section card used across the report and marketing pages. */
export function SectionCard({
  index,
  title,
  icon: Icon,
  children,
  className = "",
}: {
  index?: number;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass-card animate-rise p-5 sm:p-6 ${className}`}>
      <header className="mb-4 flex items-center gap-3">
        <span className="gradient-soft grid size-9 shrink-0 place-items-center rounded-xl border border-border/50">
          <Icon className="size-4.5 text-primary" />
        </span>
        <h3 className="font-display text-base font-bold sm:text-lg">
          {index !== undefined && <span className="mr-1.5 text-muted-foreground">{index}.</span>}
          {title}
        </h3>
      </header>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

/** Small pill used for tags such as business models and technologies. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="gradient-soft inline-flex items-center rounded-full border border-border/50 px-3 py-1 text-xs font-medium text-foreground">
      {children}
    </span>
  );
}

/** Simple bulleted list with themed markers. */
export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="gradient-brand mt-2 size-1.5 shrink-0 rounded-full" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
