export type CitationVerificationSource = {
  id: string;
  name: string;
  tier: number; // 1,2,3
  category: string;
  url: string; // base URL
  searchUrlTemplate?: string; // where to insert encoded citation
  description: string;
  accessType: "free" | "subscription" | "restricted";
};

export const CITATION_VERIFICATION_SOURCES: CitationVerificationSource[] = [
  {
    id: "escr",
    name: "eSCR — Electronic Supreme Court Reports",
    tier: 1,
    category: "Official",
    url: "https://digiscr.sci.gov.in/",
    description: "Official Supreme Court judgments",
    accessType: "free",
  },
  {
    id: "njsp",
    name: "National Judgment Search Portal",
    tier: 1,
    category: "Official",
    url: "https://judgments.ecourts.gov.in/pdfsearch/index.php",
    description: "All Indian courts",
    accessType: "free",
  },
  {
    id: "sci",
    name: "Supreme Court of India — Judgments",
    tier: 1,
    category: "Official",
    url: "https://www.sci.gov.in/judgements/",
    description: "Supreme Court judgments",
    accessType: "free",
  },
  {
    id: "indiankanoon",
    name: "Indian Kanoon",
    tier: 2,
    category: "Public",
    url: "https://indiankanoon.org/",
    searchUrlTemplate: "https://indiankanoon.org/search/?formInput={citation}",
    description: "Public case law search",
    accessType: "free",
  },
  {
    id: "casemine",
    name: "CaseMine",
    tier: 2,
    category: "Public",
    url: "https://www.casemine.com/",
    description: "Case law database",
    accessType: "free",
  },
  {
    id: "google-scholar",
    name: "Google Scholar Indian Case Law",
    tier: 2,
    category: "Public",
    url: "https://scholar.google.co.in/",
    description: "Scholar search",
    accessType: "free",
  },
  {
    id: "sconline",
    name: "SCC Online",
    tier: 3,
    category: "Subscription",
    url: "https://www.scconline.com/",
    description: "Subscription based judgments",
    accessType: "subscription",
  },
  {
    id: "manupatra",
    name: "Manupatra",
    tier: 3,
    category: "Subscription",
    url: "https://www.manupatra.com/",
    description: "Subscription based legal database",
    accessType: "subscription",
  },
  {
    id: "westlaw",
    name: "Westlaw India",
    tier: 3,
    category: "Subscription",
    url: "https://www.westlawindia.com/",
    description: "Subscription based legal research",
    accessType: "subscription",
  },
];
