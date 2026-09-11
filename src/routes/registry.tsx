import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, FileSignature, ListPlus, Trash2 } from "lucide-react";

import { DataLabel } from "@/components/data-label";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FORUM_CATEGORIES,
  LINK_LABELS,
  forumsByCategory,
  type ForumCategory,
  type ForumLinks,
} from "@/lib/court-directory";
import { caseDeskStore, useCaseDesk } from "@/lib/case-desk-store";
import { REGISTRATIONS } from "@/lib/registration-data";

export const Route = createFileRoute("/registry")({
  head: () => ({
    meta: [
      { title: "Registry — CounselQ" },
      {
        name: "description",
        content:
          "Where do I file, and what official source do I use? Forum-wise official portals, e-filing, rules and registry links for Indian courts.",
      },
      { property: "og:title", content: "Registry — CounselQ" },
      {
        property: "og:description",
        content: "Official filing portals by forum, filing tasks and quick drafting templates for Indian advocates.",
      },
    ],
  }),
  component: RegistryPage,
});

function RegistryPage() {
  const [category, setCategory] = useState<ForumCategory>("High Courts");
  const forums = useMemo(() => forumsByCategory(category), [category]);
  const [forumId, setForumId] = useState<string>(forumsByCategory("High Courts")[0]!.id);
  const forum = forums.find((f) => f.id === forumId) ?? forums[0]!;
  const { filingTasks } = useCaseDesk();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="Registry"
        subtitle="Where do I file, and what official source do I use?"
      />

      <Tabs defaultValue="forums">
        <TabsList>
          <TabsTrigger value="forums">Filing & Official Sources</TabsTrigger>
          <TabsTrigger value="tasks">Filing Tasks</TabsTrigger>
          <TabsTrigger value="draft">Drafting</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
        </TabsList>

        <TabsContent value="forums" className="mt-4 space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Forum category</Label>
              <Select
                value={category}
                onValueChange={(v) => {
                  const c = v as ForumCategory;
                  setCategory(c);
                  setForumId(forumsByCategory(c)[0]!.id);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORUM_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Forum</Label>
              <Select value={forum.id} onValueChange={setForumId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {forums.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="shadow-panel">
            <CardHeader>
              <CardTitle className="font-serif">{forum.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <DataLabel source="official" text="OFFICIAL SOURCE LINKS" />
                {forum.state && <Badge variant="outline">{forum.state}</Badge>}
                {forum.courtCode && <Badge variant="outline">Court code: {forum.courtCode}</Badge>}
                {forum.benchCode && <Badge variant="outline">Bench code: {forum.benchCode}</Badge>}
                {!forum.directLinkAvailable && (
                  <Badge variant="outline" className="border-warning/40 bg-warning/15 text-warning-foreground">
                    Routed to official eCourts
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {forum.notes && <p className="text-sm text-muted-foreground">{forum.notes}</p>}
              <div className="grid gap-2 sm:grid-cols-2">
                {LINK_LABELS.filter(({ key }) => forum.links[key as keyof ForumLinks]).map(({ key, label }) => (
                  <a
                    key={key}
                    href={forum.links[key as keyof ForumLinks]}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                  >
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {key === "officialUrl" ? "Open Official Portal" : label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {forum.links[key as keyof ForumLinks]}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  caseDeskStore.addFilingTask({
                    title: `Prepare filing — ${forum.name}`,
                    forumId: forum.id,
                    forumName: forum.name,
                    note: forum.links.eFiling ? `E-file at ${forum.links.eFiling}` : "Physical filing at registry",
                  });
                  toast.success("Filing task added");
                }}
              >
                <ListPlus /> Add Filing Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <Card className="shadow-panel">
            <CardHeader>
              <CardTitle className="font-serif">Pending registry items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filingTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No filing tasks yet.</p>
              )}
              {filingTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <Checkbox checked={t.done} onCheckedChange={() => caseDeskStore.toggleFilingTask(t.id)} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${t.done ? "line-through opacity-60" : ""}`}>{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.forumName}
                      {t.note ? ` · ${t.note}` : ""}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => caseDeskStore.removeFilingTask(t.id)}>
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft" className="mt-4">
          <Drafting />
        </TabsContent>
          <TabsContent value="registrations" className="mt-4 space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {REGISTRATIONS.map((reg) => (
                <Card key={reg.state} className="shadow-panel">
                  <CardHeader>
                    <CardTitle className="font-serif">{reg.state}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <a href={reg.propertyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary underline">
                      Property Registration
                    </a>
                    {reg.marriageUrl && (
                      <span>Marriage: {reg.marriageUrl}</span>
                    )}
                    {reg.reraUrl && (
                      <a href={reg.reraUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary underline">
                        RERA
                      </a>
                    )}
                    {reg.notes && <p className="text-sm text-muted-foreground">{reg.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          </Tabs>
    </div>
  );
}

function Drafting() {
  const [form, setForm] = useState({
    petitioner: "",
    respondent: "",
    court: "In the High Court of Judicature at Bombay",
    facts: "",
    relief: "",
    type: "Writ Petition",
  });
  const [output, setOutput] = useState("");

  const generate = () => {
    const p = form.petitioner || "[PETITIONER]";
    const r = form.respondent || "[RESPONDENT]";
    const text =
      form.type === "Vakalatnama"
        ? `${form.court.toUpperCase()}

VAKALATNAMA

${p}                                                  ... Petitioner
                    VERSUS
${r}                                                  ... Respondent

I/We, ${p}, do hereby appoint and retain Adv. M. Joshi (Enrl. No. MAH/1234/2015) to appear, plead and act for me/us in the above matter, and to do all acts necessary for the conduct and prosecution thereof, including filing and receiving documents, receiving monies, and engaging counsel.

Dated this ____ day of __________, 20____ at Mumbai.

ACCEPTED                                        (Signature of Client)
Adv. M. Joshi`
        : `${form.court.toUpperCase()}

${form.type.toUpperCase()} NO. ______ OF 20____
(Under Article 226 of the Constitution of India)

${p}
Residing at ____________________                       ... Petitioner

                    VERSUS

${r}
Through the Government Pleader                          ... Respondent

TO,
THE HON'BLE THE CHIEF JUSTICE AND THE OTHER HON'BLE PUISNE JUDGES OF THIS HON'BLE COURT.

THE HUMBLE PETITION OF THE PETITIONER ABOVE-NAMED
MOST RESPECTFULLY SHEWETH:

1. FACTS OF THE CASE:
${form.facts || "[Insert the material facts in chronological order.]"}

2. GROUNDS:
(a) The impugned action is arbitrary and violative of Articles 14 and 21 of the Constitution of India.
(b) The Respondent has acted in breach of the principles of natural justice.
(c) The Petitioner has no other equally efficacious alternate remedy.

3. PRAYERS:
The Petitioner therefore prays that this Hon'ble Court be pleased to:
(a) ${form.relief || "[State the substantive relief sought.]"}
(b) grant ad-interim and interim reliefs in terms of prayer (a);
(c) pass such other and further orders as this Hon'ble Court deems fit.

AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL EVER PRAY.

                                                      Advocate for the Petitioner`;
    setOutput(text);
    toast.success("Draft generated");
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-panel">
        <CardHeader>
          <CardTitle className="font-serif">Draft inputs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Document type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Writ Petition">Writ Petition</SelectItem>
                <SelectItem value="Vakalatnama">Vakalatnama</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pet">Petitioner</Label>
            <Input id="pet" value={form.petitioner} onChange={(e) => setForm({ ...form, petitioner: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="res">Respondent</Label>
            <Input id="res" value={form.respondent} onChange={(e) => setForm({ ...form, respondent: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="facts">Facts</Label>
            <Textarea id="facts" value={form.facts} onChange={(e) => setForm({ ...form, facts: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="relief">Relief sought</Label>
            <Input id="relief" value={form.relief} onChange={(e) => setForm({ ...form, relief: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={generate}>
              <FileSignature /> Generate draft
            </Button>
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card className="shadow-panel">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-serif">Formatted draft</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                void navigator.clipboard.writeText(output);
                toast.success("Draft copied");
              }}
            >
              <Copy /> Copy
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="font-reading overflow-x-auto whitespace-pre-wrap rounded-lg border bg-muted/40 p-4 text-sm">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
