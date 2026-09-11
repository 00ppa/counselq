import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ExternalLink,
  Gavel,
  Megaphone,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { DataLabel } from "@/components/data-label";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { FORUMS, FORUM_CATEGORIES, getForum, type ForumCategory } from "@/lib/court-directory";
import {
  caseExtras,
  causelist as seed,
  genericExtras,
  todayISO,
  BENCH_STATUSES,
  type BenchReport,
  type BenchStatus,
  type CaseStatus,
  type CauselistItem,
} from "@/lib/mock-data";
import { caseDeskStore } from "@/lib/case-desk-store";

export const Route = createFileRoute("/causelist")({
  head: () => ({
    meta: [
      { title: "Cause List — CounselQ" },
      {
        name: "description",
        content:
          "Live cause list for Indian courts with bench status, advocate-reported courtroom updates and official portal links.",
      },
    ],
  }),
  component: CauseListPage,
});

const statusTone: Record<CaseStatus, string> = {
  "Called Out": "bg-success/12 text-success border-success/30",
  "Passed Over": "bg-warning/15 text-warning-foreground border-warning/40",
  Awaited: "bg-muted text-muted-foreground border-border",
  Adjourned: "bg-secondary text-secondary-foreground border-border",
  Disposed: "bg-primary/10 text-primary border-primary/25",
};

// Start with tomorrow's date for testing the Tomorrow option
const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

function CauseListPage() {
  const [rows, setRows] = useState<CauselistItem[]>(seed);
  
  // Selection State
  const [category, setCategory] = useState<ForumCategory>("High Courts");
  const [forumId, setForumId] = useState<string>("bombay-high-court");
  const [location, setLocation] = useState<string>("Principal Seat at Mumbai");
  const [courtroom, setCourtroom] = useState<string>("Court 12");
  const [dateType, setDateType] = useState<string>("Today");
  const [customDate, setCustomDate] = useState<string>(todayISO());

  const computedDate = dateType === "Today" ? todayISO() : dateType === "Tomorrow" ? getTomorrow() : customDate;

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CauselistItem | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [wakeRefresh, setWakeRefresh] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Initial dummy reports mapped to the Bombay HC context
  const [reports, setReports] = useState<BenchReport[]>([
    {
      forumId: "bombay-high-court",
      location: "Principal Seat at Mumbai",
      courtroom: "Court 12",
      date: todayISO(),
      status: "Lunch Break",
      expectedReturn: "2:30 PM",
      note: "Bench rose at 1:05 PM.",
      reportedBy: "Adv. K. Bhatt",
      at: new Date(Date.now() - 9 * 60 * 1000),
    },
    {
      forumId: "bombay-high-court",
      location: "Principal Seat at Mumbai",
      courtroom: "Court 12",
      date: todayISO(),
      status: "Lunch Break",
      expectedReturn: "2:30 PM",
      note: "",
      reportedBy: "Adv. N. Menon",
      at: new Date(Date.now() - 4 * 60 * 1000),
    },
  ]);

  const refresh = useCallback((silent = false) => {
    setRefreshing(true);
    window.setTimeout(() => {
      setUpdatedAt(new Date());
      setRefreshing(false);
      setWakeRefresh(false);
      if (!silent) toast.success("Cause list refreshed");
    }, 600);
  }, []);

  // Periodic refresh + immediate refresh when the tab regains focus.
  useEffect(() => {
    refresh(true);
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh(true);
    }, 30000);
    const onWake = () => {
      if (document.visibilityState === "visible") {
        setWakeRefresh(true);
        refresh(true);
      }
    };
    document.addEventListener("visibilitychange", onWake);
    window.addEventListener("focus", onWake);
    return () => {
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onWake);
      window.removeEventListener("focus", onWake);
    };
  }, [refresh]);

  // Derived options based on selections
  const forumsForCategory = useMemo(() => FORUMS.filter((f) => f.category === category), [category]);
  const activeForum = getForum(forumId) ?? forumsForCategory[0];
  
  const locationsOptions = activeForum?.locations ? Object.keys(activeForum.locations) : ["Principal Bench"];
  const safeLocation = locationsOptions.includes(location) ? location : locationsOptions[0] || "Principal Bench";
  
  const courtroomsOptions = activeForum?.locations?.[safeLocation] || ["Court 1"];
  const safeCourtroom = courtroomsOptions.includes(courtroom) ? courtroom : courtroomsOptions[0] || "Court 1";

  // Universal Bench Status - filtered for exact courtroom context
  const currentContextReports = reports.filter(r => 
    r.forumId === forumId &&
    r.location === safeLocation &&
    r.courtroom === safeCourtroom &&
    r.date === computedDate
  );
  
  const latest = currentContextReports[currentContextReports.length - 1] ?? null;
  const sameStatusCount = latest ? currentContextReports.filter((r) => r.status === latest.status).length : 0;

  const report = (item: CauselistItem, status: CaseStatus) => {
    setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, status, reports: r.reports + 1 } : r)));
    toast.success(`Reported "${item.caseNumber}" as ${status} — labelled Advocate Reported`);
  };

  const saveToCaseDesk = (item: CauselistItem) => {
    caseDeskStore.saveFromCauselist({
      caseName: item.title,
      caseNumber: item.caseNumber,
      court: activeForum?.name || "Unknown Court",
      bench: item.courtroom,
      matterType: item.category,
      client: item.petitioner,
      opposingParty: item.respondent,
    });
    toast.success("Saved to Case Desk");
  };

  const visible = rows.filter(
    (r) =>
      r.forumId === forumId &&
      r.location === safeLocation &&
      r.courtroom === safeCourtroom &&
      r.date === computedDate &&
      (query.trim() === "" ||
        `${r.caseNumber} ${r.title} ${r.petitioner} ${r.respondent} ${r.advocates.petitioner} ${r.advocates.respondent}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Cause List"
        subtitle="Find today's matter — official board data and advocate reports, clearly separated."
      />

      <BenchStatusPanel
        latest={latest}
        sameStatusCount={sameStatusCount}
        onReport={() => setReportOpen(true)}
      />

      <Card className="mt-4 p-4 shadow-sm bg-muted/20 border-border">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1">
            <Label className="text-xs uppercase text-muted-foreground">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => {
                const c = v as ForumCategory;
                setCategory(c);
                const firstForum = FORUMS.find(f => f.category === c);
                if (firstForum) {
                  setForumId(firstForum.id);
                  const firstLoc = firstForum.locations ? Object.keys(firstForum.locations)[0] : "Principal Bench";
                  setLocation(firstLoc);
                  setCourtroom(firstForum.locations?.[firstLoc]?.[0] || "Court 1");
                }
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FORUM_CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase text-muted-foreground">Court</Label>
            <Select
              value={forumId}
              onValueChange={(v) => {
                setForumId(v);
                const f = getForum(v);
                if (f) {
                  const firstLoc = f.locations ? Object.keys(f.locations)[0] : "Principal Bench";
                  setLocation(firstLoc);
                  setCourtroom(f.locations?.[firstLoc]?.[0] || "Court 1");
                }
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {forumsForCategory.map((f) => (<SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase text-muted-foreground">Location / Bench</Label>
            <Select
              value={safeLocation}
              onValueChange={(v) => {
                setLocation(v);
                setCourtroom(activeForum?.locations?.[v]?.[0] || "Court 1");
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {locationsOptions.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase text-muted-foreground">Courtroom</Label>
            <Select value={safeCourtroom} onValueChange={setCourtroom}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {courtroomsOptions.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase text-muted-foreground">Date</Label>
            <div className="flex gap-2">
              <Select value={dateType} onValueChange={setDateType}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {dateType === "Custom" && (
                <Input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="w-full" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
           <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by case no., party or advocate..."
              className="pl-9 bg-background"
            />
          </div>
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => refresh()} disabled={refreshing}>
          <RefreshCw className={refreshing ? "animate-spin" : ""} /> Refresh
        </Button>
        <Button size="sm" onClick={() => setReportOpen(true)}>
          <Megaphone /> Report Court Status
        </Button>
        {activeForum && (
          <Button asChild size="sm" variant="ghost">
            <a href={activeForum.links.causeList ?? activeForum.links.officialUrl} target="_blank" rel="noreferrer">
              <ExternalLink /> Open Official Portal
            </a>
          </Button>
        )}
        <DataLabel source="demo" />
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {wakeRefresh
          ? "Refreshing after inactivity…"
          : refreshing
            ? "Refreshing…"
            : updatedAt
              ? `Auto-refreshes every 30s. Last updated ${updatedAt.toLocaleTimeString()}.`
              : "Loading — not yet updated."}
      </p>

      <div className="mt-4 space-y-3">
        {visible.map((item) => {
          const extras = caseExtras[item.caseNumber] ?? genericExtras;
          return (
            <Card key={item.id} className="gap-0 overflow-hidden p-0 shadow-panel">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                  {item.serial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelected(item)}
                      className="font-mono text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {item.caseNumber}
                    </button>
                    <Badge variant="outline" className={statusTone[item.status]}>
                      {item.status}
                    </Badge>
                    {item.reports > 0 ? (
                      <DataLabel source="advocate" />
                    ) : (
                      <DataLabel source="official" />
                    )}
                    {item.outOfOrder && (
                      <Badge variant="outline" className="border-warning/40 bg-warning/15 text-warning-foreground">
                        <AlertTriangle className="mr-1 h-3 w-3" /> Taken out of serial order
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 truncate font-serif text-base font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.category} · {item.stage} · {item.section}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.advocates.petitioner} v. {item.advocates.respondent} · {item.courtroom}
                  </p>
                  {item.reports > 0 && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Users className="h-3 w-3" /> {item.reports} advocates reported this status
                      {updatedAt ? ` · latest ${updatedAt.toLocaleTimeString()}` : ""}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-col">
                  <Button size="sm" variant="secondary" onClick={() => report(item, "Called Out")}>
                    <Megaphone /> Called Out
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => report(item, "Passed Over")}>
                    Passed Over
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => saveToCaseDesk(item)}>
                    Save to Case Desk
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        {visible.length === 0 && (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No matters on this board match your filters.
          </p>
        )}
      </div>

      <CaseDetailDialog 
        item={selected} 
        forumName={activeForum?.name}
        onClose={() => setSelected(null)} 
        onSave={saveToCaseDesk} 
      />

      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={(r) => {
          setReports((prev) => [...prev, { ...r, forumId, location: safeLocation, courtroom: safeCourtroom, date: computedDate }]);
          setReportOpen(false);
          toast.success("Thanks — your report is shown as Advocate Reported for this courtroom.");
        }}
      />
    </div>
  );
}

function BenchStatusPanel({
  latest,
  sameStatusCount,
  onReport,
}: {
  latest: BenchReport | null;
  sameStatusCount: number;
  onReport: () => void;
}) {
  const status: BenchStatus = latest?.status ?? "Unknown";
  const tone =
    status === "Sitting / In Session" || status === "Resumed" || status === "Matter Being Heard"
      ? "border-success/30 bg-success/10"
      : status === "Court Risen"
        ? "border-destructive/30 bg-destructive/10"
        : status === "Unknown"
          ? "border-border bg-muted/40"
          : "border-warning/40 bg-warning/15";

  return (
    <div className={`mt-4 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${tone}`}>
      <Gavel className="h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold uppercase tracking-wide">{status}</p>
          <DataLabel source={latest ? "advocate" : "demo"} />
        </div>
        {latest?.expectedReturn && (
          <p className="text-sm">
            Expected to sit again: <span className="font-semibold">{latest.expectedReturn}</span>
          </p>
        )}
        {latest?.note && <p className="text-xs opacity-80">{latest.note}</p>}
        <p className="mt-1 text-[11px] opacity-80">
          {latest
            ? `${sameStatusCount} advocate${sameStatusCount === 1 ? "" : "s"} reporting this status for this specific courtroom · latest report ${latest.at.toLocaleTimeString()}`
            : "No official live bench status is published for this courtroom. Advocate reports will appear here."}
        </p>
      </div>
      <Button size="sm" onClick={onReport}>
        <Megaphone /> Report Court Status
      </Button>
    </div>
  );
}

function ReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (r: Omit<BenchReport, "forumId" | "location" | "courtroom" | "date">) => void;
}) {
  const [status, setStatus] = useState<BenchStatus>("Lunch Break");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [note, setNote] = useState("");

  const needsTime = status === "On Break" || status === "Lunch Break" || status === "Court Risen";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Report Court Status</DialogTitle>
          <DialogDescription>
            Your report is shared with other advocates and is labelled ADVOCATE REPORTED — it is not official court
            information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as BenchStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BENCH_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ret">Expected return time {needsTime ? "" : "(optional)"}</Label>
            <Input
              id="ret"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="e.g. 2:30 PM"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button
            className="w-full"
            onClick={() =>
              onSubmit({ status, expectedReturn, note, reportedBy: "Adv. M. Joshi", at: new Date() })
            }
          >
            Submit report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CaseDetailDialog({
  item,
  forumName,
  onClose,
  onSave,
}: {
  item: CauselistItem | null;
  forumName?: string;
  onClose: () => void;
  onSave: (i: CauselistItem) => void;
}) {
  const extras = item ? (caseExtras[item.caseNumber] ?? genericExtras) : genericExtras;
  const forum = item ? getForum(item.forumId) : undefined;

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        {item && (
          <>
            <DialogHeader>
              <DialogTitle className="font-mono text-base">{item.caseNumber}</DialogTitle>
              <DialogDescription className="font-serif text-base text-foreground">{item.title}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-2">
              <DataLabel source="official" />
              <DataLabel source="demo" />
            </div>
            <div className="space-y-3 text-sm">
              <Detail label="Court" value={forumName || item.forumId} />
              <Detail label="Location" value={item.location} />
              <Detail label="Courtroom" value={item.courtroom} />
              <Detail label="Judge" value={extras.judge} />
              <Separator />
              <Detail label="Petitioner" value={item.petitioner} />
              <Detail label="Respondent" value={item.respondent} />
              <Detail label="Advocate (Pet.)" value={item.advocates.petitioner} />
              <Detail label="Advocate (Res.)" value={item.advocates.respondent} />
              <Separator />
              <Detail label="Case stage" value={item.stage} />
              <Detail label="Provision" value={item.section} />
              <Detail label="Next hearing" value={extras.nextHearing} />
              <Detail label="Latest order" value={extras.latestOrder} />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Previous hearings</p>
                {extras.previousHearings.length === 0 ? (
                  <p className="mt-1 text-sm text-muted-foreground">Not available from an official source.</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {extras.previousHearings.map((h) => (
                      <li key={h.date} className="text-sm">
                        <span className="font-mono text-xs">{h.date}</span> — {h.what}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {forum && <Detail label="Official source" value={forum.name} />}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {forum && (
                <Button asChild variant="outline">
                  <a href={forum.links.caseStatus ?? forum.links.officialUrl} target="_blank" rel="noreferrer">
                    <ExternalLink /> Open Official Portal
                  </a>
                </Button>
              )}
              <Button onClick={() => onSave(item)}>Save to Case Desk</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
