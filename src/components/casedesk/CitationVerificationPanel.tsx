import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { caseDeskStore, useActiveCase } from "@/lib/case-desk-store";
import { CITATION_VERIFICATION_SOURCES } from "@/lib/citation-verification-sources";

export function CitationVerificationPanel() {
  const activeCase = useActiveCase();
  const [citation, setCitation] = useState("");
  const [normalized, setNormalized] = useState("");

  const handleVerify = () => {
    // Simple normalization: trim whitespace
    const norm = citation.trim();
    setNormalized(norm);
  };

  const handleClear = () => {
    setCitation("");
    setNormalized("");
  };

  const handleSave = () => {
    if (!activeCase) return;
    const authority = {
      name: "",
      citation: citation.trim(),
      court: "",
      year: "",
      source: "Manual verification",
      status: "Review Required" as const,
    };
    caseDeskStore.addAuthority(activeCase.id, authority);
  };

  const openSource = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const renderSourceButton = (src: typeof CITATION_VERIFICATION_SOURCES[0]) => {
    let url = src.url;
    if (src.searchUrlTemplate) {
      const encoded = encodeURIComponent(citation.trim());
      url = src.searchUrlTemplate.replace("{citation}", encoded);
    }
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => openSource(url)}
        className="ml-2"
      >
        VERIFY ON SOURCE
      </Button>
    );
  };

  return (
    <Card className="shadow-panel">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Citation Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Enter citation, case name or neutral citation</Label>
          <Input
            placeholder="(2020) 5 SCC 1, AIR 2019 SC 100, etc."
            value={citation}
            onChange={e => setCitation(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleVerify}>VERIFY CITATION</Button>
          <Button variant="ghost" onClick={handleClear}>CLEAR</Button>
        </div>
        {normalized && (
          <div className="text-sm text-muted-foreground">
            Normalized citation: <span className="font-mono">{normalized}</span>
          </div>
        )}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Verification Sources</h3>
          <ul className="space-y-2">
            {CITATION_VERIFICATION_SOURCES.map(src => (
              <li key={src.id} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <span className="font-semibold">{src.name}</span> {" "}
                  <span className="text-xs text-muted-foreground">(Tier {src.tier})</span>
                </div>
                {renderSourceButton(src)}
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={handleSave} className="mt-4" disabled={!citation.trim()}>
          SAVE TO CASE
        </Button>
      </CardContent>
    </Card>
  );
}
