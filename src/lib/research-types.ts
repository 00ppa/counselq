export interface ResearchSource {
  id: string;
  name: string;
  category: string;
  description: string;
  officialUrl: string;
  accessType: "free" | "subscription" | "restricted";
  sourceType: "bare-act" | "case-law" | "commentary" | "academic" | "specialized";
  enabled: boolean;
}

export interface ResearchResult {
  id: string;
  title: string;
  snippet: string;
  source: ResearchSource;
  url?: string;
  verified: boolean;
}

export interface ResearchNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  documentId: string;
  text: string;
  color: string;
}

export interface Argument {
  id: string;
  issue: string;
  facts: string;
  position: string;
  authorities: string[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  content: string;
  extractedAuthorities: ResearchResult[];
}
