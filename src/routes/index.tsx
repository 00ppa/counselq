import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, CheckCircle2, FileSignature, FolderLock, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaseDesk } from "@/lib/case-desk-store";
import { LandingPage } from "./-landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CounselQ" },
      { name: "description", content: "CounselQ Dashboard: Your courtroom command centre." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { cases, filingTasks } = useCaseDesk();
  
  const todayEntries = cases ?? []; // Ensure array
  const pendingTasks = (filingTasks ?? []).filter((t) => !t.done);

  return (
    <LandingPage />
  );
}

function DashboardCard({ title, value, icon: Icon, href, actionText }: { title: string; value: number | string; icon: any; href: string; actionText: string }) {
  return (
    <Card className="shadow-panel flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
      <div className="border-t bg-muted/20 px-6 py-3">
        <Link to={href} className="text-xs font-medium flex items-center text-primary hover:underline">
          {actionText} <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </Card>
  );
}
