import { BadgeCheck, Bot, FlaskConical, Megaphone } from "lucide-react";

import { cn } from "@/lib/utils";

export type DataSource = "official" | "advocate" | "ai" | "demo";

const CONFIG: Record<DataSource, { text: string; className: string; Icon: typeof BadgeCheck }> = {
  official: {
    text: "OFFICIAL COURT DATA",
    className: "border-primary/30 bg-primary/10 text-primary",
    Icon: BadgeCheck,
  },
  advocate: {
    text: "ADVOCATE REPORTED",
    className: "border-warning/40 bg-warning/15 text-warning-foreground",
    Icon: Megaphone,
  },
  ai: {
    text: "AI-GENERATED",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    Icon: Bot,
  },
  demo: {
    text: "DEMO DATA",
    className: "border-border bg-muted text-muted-foreground",
    Icon: FlaskConical,
  },
};

export function DataLabel({
  source,
  text,
  className,
}: {
  source: DataSource;
  text?: string;
  className?: string;
}) {
  const { text: defaultText, className: tone, Icon } = CONFIG[source];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        tone,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {text ?? defaultText}
    </span>
  );
}

export function AiReviewNotice({ children }: { children?: string }) {
  return (
    <p className="rounded border border-destructive/30 bg-destructive/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-destructive">
      {children ?? "AI-GENERATED — LAWYER REVIEW REQUIRED"}
    </p>
  );
}
