import type { StartupPlan } from "./startup-generator";

/** LocalStorage-backed store for generated reports (no backend required). */

const KEY = "aisig-saved-reports";

export function loadReports(): StartupPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StartupPlan[]) : [];
  } catch {
    return [];
  }
}

export function saveReport(plan: StartupPlan): StartupPlan[] {
  const all = [plan, ...loadReports().filter((p) => p.id !== plan.id)].slice(0, 30);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export function deleteReport(id: string): StartupPlan[] {
  const all = loadReports().filter((p) => p.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export function clearReports() {
  window.localStorage.removeItem(KEY);
}
