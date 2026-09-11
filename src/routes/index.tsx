import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, CheckCircle2, FileSignature, FolderLock, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaseDesk } from "@/lib/case-desk-store";

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
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        title="CounselQ Dashboard"
        subtitle="Your courtroom command centre. View today's priorities at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Today's Hearings" 
          value={todayEntries.length} 
          icon={CalendarClock} 
          href="/causelist" 
          actionText="View Cause List"
        />
        <DashboardCard 
          title="Pending Registry Items" 
          value={pendingTasks.length} 
          icon={FileSignature} 
          href="/registry" 
          actionText="Open Registry"
        />
        <DashboardCard 
          title="Active Case Desks" 
          value={cases.length} 
          icon={FolderLock} 
          href="/casedesk" 
          actionText="Open Case Desk"
        />
        <DashboardCard 
          title="Authorities to Verify" 
          value="0" 
          icon={Sparkles} 
          href="/research" 
          actionText="Go to Research"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-panel">
          <CardHeader>
            <CardTitle className="font-serif">Next Hearing</CardTitle>
          </CardHeader>
          <CardContent>
            {todayEntries.length > 0 ? (
              <div className="space-y-1">
                <p className="font-semibold">{todayEntries[0].caseName}</p>
                <p className="text-sm text-muted-foreground">{todayEntries[0].caseNumber} · {todayEntries[0].court}</p>
                <p className="text-sm">Status: {todayEntries[0].status || "Awaited"}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming hearings scheduled today.</p>
            )}
            <Button variant="link" className="mt-2 px-0" asChild>
              <Link to="/casedesk">View all matters <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-panel">
          <CardHeader>
            <CardTitle className="font-serif">Pending Registry Items</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length > 0 ? (
              <ul className="space-y-3">
                {pendingTasks.slice(0, 3).map(task => (
                  <li key={task.id} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span>
                      <span className="font-medium">{task.title}</span>
                      <span className="block text-xs text-muted-foreground">{task.forumName}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">All filing tasks completed.</p>
            )}
            <Button variant="link" className="mt-2 px-0" asChild>
              <Link to="/registry">Manage tasks <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
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
