import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, FileUp, Loader2, ShieldAlert, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/research/SearchBar";
import { RESEARCH_SOURCES } from "@/lib/research-sources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { citationDb, extractedJudgments } from "@/lib/mock-data";
import { caseDeskStore, useActiveCase } from "@/lib/case-desk-store";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research — CounselQ" },
      {
        name: "description",
        content: "Verify citations against reported judgments, catch fake AI citations, and pull every judgment cited in a brief.",
      },
      { property: "og:title", content: "Research — CounselQ" },
      {
        property: "og:description",
        content: "Flag hallucinated citations in red, verified ones in green, and download cited judgments instantly.",
      },
    ],
  }),
  component: ResearchPage,
});

type Result = { name?: string; citation?: string; court?: string; year?: string; source?: string; url?: string; verified: boolean; note: string; query: string } | null;

function ResearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const activeCase = useActiveCase();

  const verify = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      const hit = citationDb[query.trim().toLowerCase()];
      setResult(
        hit
          ? { ...hit, query }
          : {
              verified: false,
              note: "Not traced in SCC OnLine, Manupatra or the reported-judgments index. Treat as unverified before citing.",
              query,
            },
      );
      setLoading(false);
    }, 1400);
  };

  const scan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1600);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="AI Research & Verification"
        subtitle="Never cite a judgment that doesn't exist. Verify, extract and download in seconds."
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="civil">Civil</TabsTrigger>
          <TabsTrigger value="criminal">Criminal</TabsTrigger>
          <TabsTrigger value="bnss">BNSS</TabsTrigger>
        </TabsList>
        {["all", "civil", "criminal", "bnss"].map((v) => (
          <TabsContent key={v} value={v} className="mt-4 space-y-4">
            <Card className="shadow-panel">
              <CardHeader>
                <CardTitle className="font-serif">Citation Verifier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row">
        <SearchBar query={query} setQuery={setQuery} onSearch={verify} />
        {/* Source Filters */}
        <div className="flex gap-2 mt-4">
          {Array.from(new Set(RESEARCH_SOURCES.map(s => s.category))).map((cat) => (
            <Button
              key={cat}
              variant={"outline"}
              size={"sm"}
              onClick={() => {/* toggle logic placeholder */}}
            >
              {cat}
            </Button>
          ))}
        </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Filter applied: {v === "all" ? "All subjects" : v.toUpperCase()}. Try “(2019) 7 SCC 992” to see a fake citation flagged.
                </p>

                {loading && (
                  <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cross-checking reporters and court registries…
                  </div>
                )}

                {result && !loading && (
                  <div className="space-y-3">
                    <div
                      className={`rounded-lg border p-4 ${
                        result.verified
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                      }`}
                    >
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        {result.verified ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                        {result.verified ? "Citation Verified" : "Fake / Unverified Citation"}
                      </p>
                      <p className="font-reading mt-1 text-sm text-foreground">{result.note}</p>
                    </div>
                    {result.verified && activeCase && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          caseDeskStore.addAuthority(activeCase.id, {
                            name: result.name || result.query,
                            citation: result.citation || result.query,
                            court: result.court || "Unknown Court",
                            year: result.year || "Unknown Year",
                            source: result.source || "SCC OnLine",
                            status: "Verified",
                          });
                          toast.success("Saved authority to active Case Desk");
                        }}
                      >
                        Save to Case Desk ({activeCase.caseName})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-panel">
              <CardHeader>
                <CardTitle className="font-serif">Auto-Pull Judgments from a Brief</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={scan} disabled={scanning}>
                  {scanning ? <Loader2 className="animate-spin" /> : <FileUp />}
                  {scanning ? "Extracting citations…" : "Upload case document (PDF)"}
                </Button>
                {scanned && (
                  <div className="space-y-2">
                    {extractedJudgments.map((j) => (
                      <div
                        key={j.cite}
                        className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-sm font-semibold">{j.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {j.cite} · {j.court}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            j.verified
                              ? "border-success/30 bg-success/10 text-success"
                              : "border-destructive/30 bg-destructive/10 text-destructive"
                          }
                        >
                          {j.verified ? "Verified" : "Unverified"}
                        </Badge>
                        <Button size="sm" variant="secondary" disabled={!j.verified}>
                          <Download /> Download
                        </Button>
                        {j.verified && activeCase && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              caseDeskStore.addAuthority(activeCase.id, {
                                name: j.name,
                                citation: j.cite,
                                court: j.court,
                                year: "Unknown Year",
                                source: "Extracted",
                                status: "Verified",
                              });
                              toast.success(`Saved ${j.name} to Case Desk`);
                            }}
                          >
                            Save to Case Desk
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
