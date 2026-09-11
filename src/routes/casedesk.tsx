import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Plus, Save, Trash2 } from "lucide-react";

import { AiReviewNotice, DataLabel } from "@/components/data-label";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { CitationVerificationPanel } from "@/components/casedesk/CitationVerificationPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { caseDeskStore, useActiveCase, useCaseDesk, type ChronologyEvent } from "@/lib/case-desk-store";

export const Route = createFileRoute("/casedesk")({
  head: () => ({
    meta: [
      { title: "Case Desk — CounselQ" },
      { name: "description", content: "A dedicated workspace for your matters." },
    ],
  }),
  component: CaseDeskPage,
});

function CaseDeskPage() {
  const { cases } = useCaseDesk();
  const activeCase = useActiveCase();
  const [draftOutcome, setDraftOutcome] = useState({ status: "Heard", whatHappened: "", order: "", nextDate: "", actionRequired: "" });
  const [draftEvent, setDraftEvent] = useState({ date: "", event: "", source: "", page: "" });

  if (!activeCase) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <PageHeader title="Case Desk" subtitle="A dedicated workspace for your matters." />
        <Card className="shadow-panel p-8 text-center text-muted-foreground">
          No cases in your desk yet. Add them from the Cause List.
        </Card>
      </div>
    );
  }

  const handleSaveOutcome = () => {
    caseDeskStore.addOutcome(activeCase.id, draftOutcome);
    setDraftOutcome({ status: "Heard", whatHappened: "", order: "", nextDate: "", actionRequired: "" });
    toast.success("Hearing outcome recorded and chronology updated.");
  };

  const handleAddEvent = () => {
    if (!draftEvent.event) return;
    caseDeskStore.addChronology(activeCase.id, { ...draftEvent, status: "Review Required" });
    setDraftEvent({ date: "", event: "", source: "", page: "" });
    toast.success("Chronology updated.");
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Case Desk" subtitle="Workspace for one legal matter." />
        <Select value={activeCase.id} onValueChange={caseDeskStore.setActive}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a case" />
          </SelectTrigger>
          <SelectContent>
            {cases.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.caseNumber} - {c.caseName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-panel mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-xl">{activeCase.caseName}</CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="font-mono">{activeCase.caseNumber}</span>
            <span>·</span>
            <span>{activeCase.court}</span>
            {activeCase.bench && <><span>·</span><span>{activeCase.bench}</span></>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground block text-xs">Client</span>{activeCase.client || "—"}</div>
            <div><span className="text-muted-foreground block text-xs">Opposing Party</span>{activeCase.opposingParty || "—"}</div>
            <div><span className="text-muted-foreground block text-xs">Matter Type</span>{activeCase.matterType || "—"}</div>
            <div><span className="text-muted-foreground block text-xs">Next Hearing</span>{activeCase.nextHearing || "—"}</div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview & Summary</TabsTrigger>
          <TabsTrigger value="chronology">Chronology</TabsTrigger>
          <TabsTrigger value="notes">Hearing Notes</TabsTrigger>
          <TabsTrigger value="authorities">Authorities</TabsTrigger>
<TabsTrigger value="verification">Citation Verification</TabsTrigger>
          <TabsTrigger value="outcome">Record Outcome</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="shadow-panel">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">Case Summary</CardTitle>
              {activeCase.summary.aiGenerated && <AiReviewNotice />}
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(activeCase.summary).filter(([k]) => k !== "aiGenerated").map(([key, value]) => (
                <div key={key}>
                  <Label className="uppercase text-xs text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</Label>
                  <Textarea 
                    value={value as string} 
                    onChange={(e) => caseDeskStore.updateSummary(activeCase.id, { [key]: e.target.value })} 
                    className="mt-1 font-reading min-h-[60px]"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chronology" className="space-y-4">
          <Card className="shadow-panel">
            <CardHeader><CardTitle className="font-serif">Case Chronology</CardTitle></CardHeader>
            <CardContent className="px-0 sm:px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCase.chronology.map(ev => (
                    <TableRow key={ev.id}>
                      <TableCell>{ev.date}</TableCell>
                      <TableCell className="font-reading">{ev.event}</TableCell>
                      <TableCell>{ev.source}</TableCell>
                      <TableCell>{ev.page}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-semibold ${ev.status === "Verified" ? "text-success" : "text-warning-foreground"}`}>
                          {ev.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => caseDeskStore.removeChronology(activeCase.id, ev.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {activeCase.chronology.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">No events recorded.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="shadow-panel">
            <CardHeader><CardTitle className="font-serif">Add Event</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Date</Label><Input value={draftEvent.date} onChange={e => setDraftEvent(prev => ({...prev, date: e.target.value}))} placeholder="DD.MM.YYYY" /></div>
              <div className="space-y-1.5"><Label>Source</Label><Input value={draftEvent.source} onChange={e => setDraftEvent(prev => ({...prev, source: e.target.value}))} placeholder="e.g. Order sheet" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Event Description</Label><Input value={draftEvent.event} onChange={e => setDraftEvent(prev => ({...prev, event: e.target.value}))} /></div>
              <div className="space-y-1.5"><Label>Page</Label><Input value={draftEvent.page} onChange={e => setDraftEvent(prev => ({...prev, page: e.target.value}))} /></div>
              <div className="sm:col-span-2"><Button onClick={handleAddEvent}><Plus className="mr-2 h-4 w-4" /> Add to Chronology</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card className="shadow-panel">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">Hearing Notes</CardTitle>
              {activeCase.hearingNotes.aiDraft && <AiReviewNotice />}
            </CardHeader>
            <CardContent className="space-y-4">
               {Object.entries(activeCase.hearingNotes).filter(([k]) => k !== "aiDraft").map(([key, value]) => (
                <div key={key}>
                  <Label className="uppercase text-xs text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</Label>
                  <Textarea 
                    value={value as string} 
                    onChange={(e) => caseDeskStore.updateNotes(activeCase.id, { [key]: e.target.value })} 
                    className="mt-1 font-reading min-h-[80px]"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authorities" className="space-y-4">

        </TabsContent>
        <TabsContent value="verification" className="space-y-4">
          <CitationVerificationPanel />
        </TabsContent>
        <TabsContent value="authorities" className="space-y-4">
          <Card className="shadow-panel">
            <CardHeader><CardTitle className="font-serif">Authorities</CardTitle></CardHeader>
            <CardContent>
              {activeCase.authorities.length > 0 ? (
                <ul className="space-y-3">
                  {activeCase.authorities.map(auth => (
                    <li key={auth.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between gap-2">
                      <div>
                        <p className="font-serif font-semibold">{auth.name}</p>
                        <p className="font-mono text-sm text-muted-foreground">{auth.citation} · {auth.court} ({auth.year})</p>
                        <p className="text-xs text-muted-foreground mt-1">Source: {auth.source}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-start sm:items-end">
                         <span className={`text-xs font-semibold px-2 py-1 rounded ${auth.status === 'Verified' ? 'bg-success/10 text-success' : 'bg-warning/15 text-warning-foreground'}`}>{auth.status}</span>
                         <Button variant="ghost" size="sm" onClick={() => caseDeskStore.removeAuthority(activeCase.id, auth.id)}><Trash2 className="h-4 w-4 text-destructive" /> Remove</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No authorities saved yet. Use the Research tab to verify and save authorities.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcome" className="space-y-4">
          <Card className="shadow-panel">
            <CardHeader><CardTitle className="font-serif">Record Hearing Outcome</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Hearing Status</Label><Input value={draftOutcome.status} onChange={e => setDraftOutcome(prev => ({...prev, status: e.target.value}))} placeholder="e.g. Heard, Adjourned" /></div>
              <div className="space-y-1.5"><Label>Next Date</Label><Input value={draftOutcome.nextDate} onChange={e => setDraftOutcome(prev => ({...prev, nextDate: e.target.value}))} placeholder="e.g. 24.11.2026" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>What Happened</Label><Textarea value={draftOutcome.whatHappened} onChange={e => setDraftOutcome(prev => ({...prev, whatHappened: e.target.value}))} className="min-h-[80px]" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Order / Remarks</Label><Textarea value={draftOutcome.order} onChange={e => setDraftOutcome(prev => ({...prev, order: e.target.value}))} className="min-h-[80px]" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Action Required</Label><Input value={draftOutcome.actionRequired} onChange={e => setDraftOutcome(prev => ({...prev, actionRequired: e.target.value}))} /></div>
              <div className="sm:col-span-2"><Button onClick={handleSaveOutcome}><Save className="mr-2 h-4 w-4" /> Save Outcome</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
