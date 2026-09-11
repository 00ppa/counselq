import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2, Download, FileUp, Loader2, ShieldAlert,
  Search, Bookmark, Highlighter, StickyNote, FileText,
  ExternalLink, Plus, Trash2, Edit3, CheckSquare, Square,
  Save, Sparkles
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/research/SearchBar";
import { RESEARCH_SOURCES } from "@/lib/research-sources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { citationDb } from "@/lib/mock-data";
import { CONSTITUTION_INDEX, STATUTORY_INDEX, CONCEPT_INDEX, IndexEntry } from "@/lib/mock-indexes";
import { caseDeskStore, useActiveCase } from "@/lib/case-desk-store";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research — CounselQ" },
      { name: "description", content: "Search, verify, annotate and build from legal authorities." },
    ],
  }),
  component: ResearchPage,
});

type CitationResult = { name?: string; citation?: string; court?: string; year?: string; source?: string; verified: boolean; note: string; query: string } | null;

type GroupedResults = {
  constitution: IndexEntry[];
  statutory: IndexEntry[];
  caseLaw: IndexEntry[];
  concepts: IndexEntry[];
};

// Expanded mock extractions
const mockExtractions = [
  { id: "e1", type: "Case Name", text: "Kesavananda Bharati v. State of Kerala", verified: true },
  { id: "e2", type: "Citation", text: "(1973) 4 SCC 225", verified: true },
  { id: "e3", type: "Act", text: "Constitution of India", verified: true },
  { id: "e4", type: "Section", text: "Article 368", verified: true },
  { id: "e5", type: "Legal Issue", text: "Basic Structure Doctrine", verified: false },
];

function ResearchPage() {
  const activeCase = useActiveCase();
  
  // Tab 1: Search state
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("all");
  
  // Results
  const [citationResult, setCitationResult] = useState<CitationResult>(null);
  const [groupedResults, setGroupedResults] = useState<GroupedResults | null>(null);
  const [noResult, setNoResult] = useState(false);

  // Tab 2: Uploads state
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedUploads, setSelectedUploads] = useState<Set<string>>(new Set());

  // Tab 3: Highlights state
  const [highlights, setHighlights] = useState<{ id: string; doc: string; text: string; note: string; color: string; date: string }[]>([]);
  const [highlightNote, setHighlightNote] = useState("");

  // Tab 4: Notes state
  const [notes, setNotes] = useState<{ id: string; title: string; content: string; tag: string; source: string }[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", tag: "", source: "" });

  // Tab 5: Saved items
  const [savedItems, setSavedItems] = useState<{ type: string; title: string; subtitle: string; date: string }[]>([]);

  // Argument Builder state
  const [argIssue, setArgIssue] = useState("");
  const [argFacts, setArgFacts] = useState("");
  const [argAuth, setArgAuth] = useState("");
  const [argGen, setArgGen] = useState<any>(null);
  const [argGenerating, setArgGenerating] = useState(false);
  const [argError, setArgError] = useState("");

  // --- Search Logic ---

  const classifyAndSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    setLoading(true);
    setCitationResult(null);
    setGroupedResults(null);
    setNoResult(false);

    window.setTimeout(() => {
      // 1. Is it a Citation? (Check citationDb first or basic regex)
      const isCitationRegex = /^(\(|\[)?\d{4}(\)|\])?\s+\d*\s*[a-zA-Z]+\s+\d+/i.test(q);
      const isKnownCitation = citationDb[q];

      if (isCitationRegex || isKnownCitation) {
        const hit = citationDb[q];
        setCitationResult(hit ? { ...hit, query: q } : {
          verified: false,
          note: "No reported judgment traced at this citation. Likely AI-hallucinated or incorrect.",
          query: q,
        });
        setLoading(false);
        return;
      }

      // 2. Not a citation, classify into groups
      const results: GroupedResults = { constitution: [], statutory: [], caseLaw: [], concepts: [] };
      let found = false;

      // Check Constitution
      const artMatch = q.match(/article\s+(\d+[a-z]?)/i) || q.match(/art\.\s*(\d+[a-z]?)/i);
      if (artMatch) {
        const artNum = artMatch[1].toLowerCase();
        if (CONSTITUTION_INDEX[artNum]) {
          results.constitution.push(CONSTITUTION_INDEX[artNum]!);
          found = true;
        }
      } else if (q.includes("constitution")) {
        // Just return article 21 as a demo if they search "constitution privacy" etc and it matches a concept
        Object.values(CONSTITUTION_INDEX).forEach(item => {
          if (item.title.toLowerCase().includes(q.replace("constitution", "").trim())) {
            results.constitution.push(item);
            found = true;
          }
        });
      }

      // Check Statutory
      Object.keys(STATUTORY_INDEX).forEach(key => {
        if (q.includes(key.toLowerCase()) || STATUTORY_INDEX[key]!.title.toLowerCase().includes(q)) {
          results.statutory.push(STATUTORY_INDEX[key]!);
          found = true;
        }
      });

      // Check Concepts / Case Names
      Object.keys(CONCEPT_INDEX).forEach(key => {
        if (q.includes(key.toLowerCase())) {
          const item = CONCEPT_INDEX[key]!;
          if (item.type === "Case Name") results.caseLaw.push(item);
          else results.concepts.push(item);
          found = true;
        }
      });

      if (!found) {
        setNoResult(true);
      } else {
        setGroupedResults(results);
      }
      setLoading(false);
    }, 1000);
  };

  const saveToDesk = (item: any, type: string) => {
    if (!activeCase) {
      toast.error("No active case desk");
      return;
    }
    caseDeskStore.addAuthority(activeCase.id, {
      name: item.name || item.title || item.query,
      citation: item.citation || item.source || item.query,
      court: item.court || "Unknown",
      year: item.year || "Unknown",
      source: item.source || "CounselQ Research",
      status: item.verified === false ? "Review Required" : "Verified",
    });
    setSavedItems(prev => [...prev, { type, title: item.name || item.title || item.query, subtitle: item.citation || item.source || "", date: new Date().toLocaleDateString() }]);
    toast.success(`Saved to Case Desk: ${activeCase.caseName}`);
  };

  const handleScan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      setScanned(true);
      const preselected = new Set<string>();
      mockExtractions.forEach(j => { if (j.verified) preselected.add(j.id); });
      setSelectedUploads(preselected);
    }, 1600);
  };

  const toggleUploadSelection = (id: string) => {
    const next = new Set(selectedUploads);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUploads(next);
  };

  const saveSelectedUploads = () => {
    if (!activeCase) {
      toast.error("No active case desk selected.");
      return;
    }
    let count = 0;
    mockExtractions.forEach(j => {
      if (selectedUploads.has(j.id)) {
        caseDeskStore.addAuthority(activeCase.id, {
          name: j.text,
          citation: j.type,
          court: "Extracted",
          year: "Unknown Year",
          source: "Extracted Document",
          status: j.verified ? "Verified" : "Review Required",
        });
        setSavedItems(prev => [...prev, { type: j.type, title: j.text, subtitle: "Extracted from document", date: new Date().toLocaleDateString() }]);
        count++;
      }
    });
    toast.success(`Saved ${count} items to Case Desk`);
  };

  const handleSaveHighlight = () => {
    if (!highlightNote.trim()) return;
    const newH = {
      id: Math.random().toString(36).substr(2, 9),
      doc: "Appellant_Written_Submissions.pdf",
      text: "The High Court erred in its interpretation of Section 138 of the NI Act by not considering the rebuttal of presumption...",
      note: highlightNote,
      color: "yellow",
      date: new Date().toLocaleDateString()
    };
    setHighlights([newH, ...highlights]);
    setSavedItems(prev => [{ type: "Highlight", title: newH.doc, subtitle: newH.text.substring(0, 40) + "...", date: newH.date }, ...prev]);
    setHighlightNote("");
    toast.success("Highlight saved");
  };

  const handleSaveNote = () => {
    if (!newNote.title || !newNote.content) return;
    const note = { ...newNote, id: Math.random().toString(36).substr(2, 9) };
    setNotes([note, ...notes]);
    setSavedItems(prev => [{ type: "Note", title: note.title, subtitle: note.tag, date: new Date().toLocaleDateString() }, ...prev]);
    setNewNote({ title: "", content: "", tag: "", source: "" });
    toast.success("Note saved");
  };

  const handleGenerateArgument = () => {
    setArgError("");
    setArgGen(null);

    if (!argIssue.trim() || !argFacts.trim() || !argAuth.trim()) {
      setArgError("Add a clear legal issue, relevant facts, and at least one verified/configured authority or legal provision.");
      return;
    }

    if (argIssue.trim().split(/\s+/).length < 3 || argFacts.trim().split(/\s+/).length < 3) {
      setArgError("Please enter a clear legal issue and relevant facts before generating an argument.");
      return;
    }

    const authQuery = argAuth.trim().toLowerCase();
    let matchedAuthority: string | null = null;

    if (citationDb[authQuery]?.verified) {
      matchedAuthority = argAuth;
    } else {
      const artMatch = authQuery.match(/article\s+(\d+[a-z]?)/i) || authQuery.match(/art\.\s*(\d+[a-z]?)/i);
      if (artMatch && CONSTITUTION_INDEX[artMatch[1].toLowerCase()]) {
        matchedAuthority = CONSTITUTION_INDEX[artMatch[1].toLowerCase()]!.title;
      }
    }

    if (!matchedAuthority) {
      Object.keys(STATUTORY_INDEX).forEach(key => {
        if (authQuery.includes(key) || STATUTORY_INDEX[key]!.title.toLowerCase().includes(authQuery)) {
          matchedAuthority = STATUTORY_INDEX[key]!.title;
        }
      });
    }

    if (!matchedAuthority) {
      Object.keys(CONCEPT_INDEX).forEach(key => {
        if (authQuery.includes(key) || CONCEPT_INDEX[key]!.title.toLowerCase().includes(authQuery)) {
          matchedAuthority = CONCEPT_INDEX[key]!.title;
        }
      });
    }

    if (!matchedAuthority) {
      const extracted = mockExtractions.find(j => j.text.toLowerCase().includes(authQuery) || j.type.toLowerCase().includes(authQuery));
      if (extracted && extracted.verified) {
        matchedAuthority = extracted.text;
      }
    }

    if (!matchedAuthority) {
      setArgError("Authority could not be matched to CounselQ's research data.");
      return;
    }
    
    setArgGenerating(true);
    window.setTimeout(() => {
      setArgGen({
        issue: argIssue,
        rule: `Based on ${matchedAuthority}, the general rule is established.`,
        authority: matchedAuthority,
        application: `Applying the rule to the facts: "${argFacts.substring(0, 150)}...", it is evident that the standard is met.`,
        counterargument: `The opposing party may dispute the application of ${matchedAuthority} to these facts.`,
        response: `However, a strict interpretation of ${matchedAuthority} as applied in recent jurisprudence defeats this exception.`,
        conclusion: `Therefore, the present claim is maintainable and satisfies the legal threshold.`
      });
      setArgGenerating(false);
      toast.success("Argument draft generated");
    }, 1500);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        title="Research"
        subtitle="Search, verify, annotate and build from legal authorities."
      />

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="search" className="flex items-center gap-2"><Search className="h-4 w-4" /> SEARCH</TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2"><Bookmark className="h-4 w-4" /> SAVED</TabsTrigger>
          <TabsTrigger value="highlights" className="flex items-center gap-2"><Highlighter className="h-4 w-4" /> HIGHLIGHTS</TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2"><StickyNote className="h-4 w-4" /> NOTES</TabsTrigger>
          <TabsTrigger value="uploads" className="flex items-center gap-2"><FileUp className="h-4 w-4" /> UPLOADS</TabsTrigger>
        </TabsList>

        {/* --- SEARCH TAB --- */}
        <TabsContent value="search" className="space-y-6">
          <Card className="shadow-panel">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-lg">Legal Research & Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <SearchBar query={query} setQuery={setQuery} onSearch={classifyAndSearch} />
              </div>
              <div className="flex flex-wrap gap-2">
                {["All Subjects", "Civil", "Criminal", "BNSS", "Constitutional"].map((cat) => (
                  <Button
                    key={cat}
                    variant={searchFilter === cat.toLowerCase() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchFilter(cat.toLowerCase())}
                    className="h-7 text-xs"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {loading && (
                <div className="flex items-center gap-2 rounded-lg border border-dashed p-6 text-sm text-muted-foreground justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching configured indices...
                </div>
              )}

              {/* Strict No Result Fallback */}
              {noResult && !loading && (
                <div className="rounded-lg border border-dashed border-destructive/50 p-6 text-center">
                  <ShieldAlert className="h-8 w-8 text-destructive/50 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-destructive">No CounselQ research result configured.</p>
                  <p className="text-xs text-muted-foreground mt-1">We do not invent judgments or statutory text. Please check your query or consult the official portals.</p>
                </div>
              )}

              {/* Citation Verification Result */}
              {citationResult && !loading && (
                <div className="mt-4 space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Citation Verification</h3>
                  <div className={`rounded-lg border p-4 ${
                    citationResult.verified ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-lg">{citationResult.name || citationResult.query}</h4>
                        <p className="text-sm font-mono text-muted-foreground">{citationResult.citation || ""} {citationResult.court ? `· ${citationResult.court}` : ""}</p>
                        <p className="flex items-center gap-2 text-sm font-semibold mt-2">
                          {citationResult.verified ? <CheckCircle2 className="h-4 w-4 text-success" /> : <ShieldAlert className="h-4 w-4 text-destructive" />}
                          <span className={citationResult.verified ? "text-success" : "text-destructive"}>
                            {citationResult.verified ? "VERIFIED CITATION" : "UNVERIFIED / REVIEW REQUIRED"}
                          </span>
                        </p>
                        <p className="text-sm mt-2">{citationResult.note}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {citationResult.verified && (
                          <Button size="sm" variant="default" onClick={() => saveToDesk(citationResult, "Citation")}>
                            <Save className="h-4 w-4 mr-2" /> SAVE
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grouped Results */}
              {groupedResults && !loading && (
                <div className="mt-4 space-y-6">
                  {Object.entries(groupedResults).map(([groupName, items]) => {
                    if (items.length === 0) return null;
                    return (
                      <div key={groupName} className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{groupName.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <div className="grid gap-3">
                          {items.map(item => (
                            <div key={item.id} className="rounded-lg border p-4 hover:bg-muted/10 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <Badge variant="secondary" className="mb-1">{item.type}</Badge>
                                  <h4 className="font-serif font-semibold">{item.title}</h4>
                                  <p className="text-xs text-muted-foreground">{item.source}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="default" onClick={() => saveToDesk(item, item.type)}>
                                    <Save className="h-4 w-4 mr-2" /> SAVE
                                  </Button>
                                  {item.officialUrl && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={item.officialUrl} target="_blank" rel="noreferrer">OPEN OFFICIAL SOURCE</a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Argument Builder inside Search */}
          <Card className="shadow-panel border-primary/20">
            <CardHeader className="pb-3 bg-primary/5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="font-serif text-lg">BUILD ARGUMENT</CardTitle>
              </div>
              <CardDescription>Draft a structured argument based on your legal research.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {argError && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> {argError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Legal Issue</Label>
                  <Input placeholder="e.g., Maintainability of writ under Article 226..." value={argIssue} onChange={(e) => setArgIssue(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Relevant Facts</Label>
                  <Textarea placeholder="Brief facts of the present case..." value={argFacts} onChange={(e) => setArgFacts(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Selected Authorities / Provisions</Label>
                  <Input placeholder="e.g., Article 226, (2018) 10 SCC 1" value={argAuth} onChange={(e) => setArgAuth(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleGenerateArgument} disabled={argGenerating} className="w-full">
                {argGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                GENERATE DRAFT
              </Button>

              {argGen && (
                <div className="mt-4 rounded-md border p-4 bg-muted/30 space-y-3 text-sm">
                  <Badge variant="outline" className="text-xs border-primary/50 text-primary mb-2">AI-GENERATED — LAWYER REVIEW REQUIRED</Badge>
                  <div><span className="font-semibold">Issue:</span> {argGen.issue}</div>
                  <div><span className="font-semibold">Rule:</span> {argGen.rule}</div>
                  <div><span className="font-semibold">Authority:</span> {argGen.authority}</div>
                  <div><span className="font-semibold">Application:</span> {argGen.application}</div>
                  <div><span className="font-semibold">Counterargument:</span> {argGen.counterargument}</div>
                  <div><span className="font-semibold">Response:</span> {argGen.response}</div>
                  <div><span className="font-semibold">Conclusion:</span> {argGen.conclusion}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Source Directory */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Source Directory</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {RESEARCH_SOURCES.map((src, i) => (
                <a key={i} href={src.officialUrl} target="_blank" rel="noreferrer" className="block group">
                  <Card className="h-full shadow-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          {src.name} <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs line-clamp-2">{src.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Badge variant="secondary" className="text-[10px] uppercase">{src.category}</Badge>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {src.name.includes("India Code") || src.name.includes("eCourts") ? "OFFICIAL" : "PUBLIC / FREE"}
                      </Badge>
                    </CardFooter>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* --- UPLOADS TAB --- */}
        <TabsContent value="uploads" className="space-y-6">
          <Card className="shadow-panel text-center">
            <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-muted m-4 rounded-lg bg-muted/10">
              <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">UPLOAD CASE DOCUMENT (PDF)</h3>
              <p className="text-sm text-muted-foreground mb-4">Extract authorities, citations, and sections automatically.</p>
              <Button onClick={handleScan} disabled={scanning} size="lg">
                {scanning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> EXTRACTING...</> : "SELECT FILE"}
              </Button>
            </CardContent>
          </Card>

          {scanned && (
            <Card className="shadow-panel">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-lg">AUTHORITY REVIEW</CardTitle>
                  <CardDescription>Extracted {mockExtractions.length} items from document.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedUploads(new Set())}>CLEAR ALL</Button>
                  <Button size="sm" onClick={saveSelectedUploads}>SAVE SELECTED</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockExtractions.map((j) => {
                  const isSelected = selectedUploads.has(j.id);
                  return (
                    <div key={j.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4 transition-colors ${isSelected ? 'bg-primary/5 border-primary/30' : ''}`}>
                      <button onClick={() => toggleUploadSelection(j.id)} className="flex-shrink-0 focus:outline-none">
                        {isSelected ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <Badge variant="secondary" className="mb-1 text-[10px] uppercase">{j.type}</Badge>
                        <p className="font-serif text-sm font-semibold">{j.text}</p>
                      </div>
                      <Badge variant="outline" className={j.verified ? "border-success/30 bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive"}>
                        {j.verified ? "VERIFIED" : "REVIEW REQUIRED"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">ADD NOTE</Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* --- HIGHLIGHTS TAB --- */}
        <TabsContent value="highlights" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-panel">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Document Reader</CardTitle>
                <CardDescription>Select text to highlight</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-muted/20 text-sm leading-relaxed font-reading h-[300px] overflow-y-auto relative selection:bg-yellow-200">
                  <p>IN THE HIGH COURT OF JUDICATURE...</p>
                  <br />
                  <p>...It is the case of the appellant that the courts below failed to appreciate that the blank cheque was issued only as security and not towards discharge of any legally enforceable debt.</p>
                  <br />
                  <p className="bg-yellow-100 rounded px-1">The High Court erred in its interpretation of Section 138 of the NI Act by not considering the rebuttal of presumption as laid down in various apex court judgments.</p>
                  <br />
                  <p>Therefore, the conviction is liable to be set aside...</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Input placeholder="Add a note to this highlight..." value={highlightNote} onChange={(e) => setHighlightNote(e.target.value)} />
                  <Button onClick={handleSaveHighlight}>SAVE HIGHLIGHT</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-panel">
              <CardHeader>
                <CardTitle className="font-serif text-lg">SAVED HIGHLIGHTS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlights.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No highlights saved yet.</p>
                ) : (
                  highlights.map(h => (
                    <div key={h.id} className="border-l-4 border-yellow-400 pl-4 py-2 space-y-1">
                      <p className="text-sm italic">"{h.text}"</p>
                      <p className="text-xs font-semibold text-primary">{h.note}</p>
                      <p className="text-xs text-muted-foreground flex justify-between">
                        <span>{h.doc}</span>
                        <span>{h.date}</span>
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- NOTES TAB --- */}
        <TabsContent value="notes" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-panel md:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="font-serif text-lg">+ New Research Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} placeholder="e.g. Limitation Argument" />
                </div>
                <div className="space-y-2">
                  <Label>Note Content</Label>
                  <Textarea value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} className="min-h-[120px]" placeholder="Type your note here..." />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Tag</Label>
                    <Input value={newNote.tag} onChange={e => setNewNote({...newNote, tag: e.target.value})} placeholder="e.g. Important" />
                  </div>
                  <div className="space-y-2">
                    <Label>Source Link</Label>
                    <Input value={newNote.source} onChange={e => setNewNote({...newNote, source: e.target.value})} placeholder="Citation or URL" />
                  </div>
                </div>
                <Button className="w-full" onClick={handleSaveNote}>SAVE NOTE</Button>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-4">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] border border-dashed rounded-lg text-muted-foreground">
                  <StickyNote className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No notes created yet.</p>
                </div>
              ) : (
                notes.map(note => (
                  <Card key={note.id} className="shadow-sm">
                    <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-md">{note.title}</CardTitle>
                        {note.tag && <Badge variant="secondary" className="text-[10px]">{note.tag}</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit3 className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      {note.source && <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><ExternalLink className="h-3 w-3" /> {note.source}</p>}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* --- SAVED TAB --- */}
        <TabsContent value="saved" className="space-y-6">
          <Card className="shadow-panel">
            <CardHeader>
              <CardTitle className="font-serif text-lg">SAVED RESEARCH</CardTitle>
              <CardDescription>All authorities, notes, and highlights saved during this session.</CardDescription>
            </CardHeader>
            <CardContent>
              {savedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Your saved items will appear here.</p>
              ) : (
                <div className="space-y-3">
                  {savedItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {item.type}
                          </Badge>
                          <span className="font-semibold text-sm">{item.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <p>{item.date}</p>
                        <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-[10px]">VIEW DETAILS</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
