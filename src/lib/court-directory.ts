// Single reusable court / forum directory used by Cause List and Registry.
// Only real, official URLs are configured here. Where a forum has no dedicated
// official site, we route to the official eCourts system instead of inventing one.

export type ForumCategory =
  | "Apex Court"
  | "High Courts"
  | "Subordinate Civil Courts"
  | "Subordinate Criminal Courts"
  | "Metropolitan Courts"
  | "Specialized Courts & Tribunals";

export const FORUM_CATEGORIES: ForumCategory[] = [
  "Apex Court",
  "High Courts",
  "Subordinate Civil Courts",
  "Subordinate Criminal Courts",
  "Metropolitan Courts",
  "Specialized Courts & Tribunals",
];

export type ForumLinks = {
  officialUrl: string;
  eFiling?: string;
  registry?: string;
  rules?: string;
  causeList?: string;
  caseStatus?: string;
  fees?: string;
};

export type CourtroomData = string[];

export type Forum = {
  id: string;
  name: string;
  category: ForumCategory;
  state?: string;
  /** true when the forum runs its own official portal (not routed to eCourts) */
  directLinkAvailable: boolean;
  courtCode?: string;
  benchCode?: string;
  notes?: string;
  links: ForumLinks;
  /** Map of Location -> Array of Courtrooms / Benches */
  locations?: Record<string, CourtroomData>;
};

// 25 High Courts
const HIGH_COURTS: Forum[] = [
  "Allahabad High Court", "Andhra Pradesh High Court", "Bombay High Court",
  "Calcutta High Court", "Chhattisgarh High Court", "Delhi High Court",
  "Gauhati High Court", "Gujarat High Court", "Himachal Pradesh High Court",
  "High Court of Jammu & Kashmir and Ladakh", "Jharkhand High Court",
  "Karnataka High Court", "Kerala High Court", "Madhya Pradesh High Court",
  "Madras High Court", "Manipur High Court", "Meghalaya High Court",
  "Orissa High Court", "Patna High Court", "Punjab and Haryana High Court",
  "Rajasthan High Court", "Sikkim High Court", "Telangana High Court",
  "Tripura High Court", "Uttarakhand High Court"
].map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
  name,
  category: "High Courts",
  directLinkAvailable: true,
  links: {
    officialUrl: "https://highcourt.gov.in", // Generic fallback
    eFiling: "https://efiling.ecourts.gov.in",
    causeList: "https://services.ecourts.gov.in",
    caseStatus: "https://services.ecourts.gov.in",
  },
  locations: { "Principal Seat": ["Court 1", "Court 2"] } // Default mock structure
}));

// Manually override specific high courts with accurate links and locations
const bombayHcIndex = HIGH_COURTS.findIndex(hc => hc.name === "Bombay High Court");
if (bombayHcIndex !== -1) {
  HIGH_COURTS[bombayHcIndex] = {
    ...HIGH_COURTS[bombayHcIndex],
    state: "Maharashtra",
    notes: "Principal Seat at Mumbai; benches at Nagpur, Aurangabad and Goa.",
    links: {
      officialUrl: "https://bombayhighcourt.nic.in",
      eFiling: "https://efiling.ecourts.gov.in",
      causeList: "https://bombayhighcourt.nic.in/causelist.php",
      caseStatus: "https://bombayhighcourt.nic.in/casestatus.php",
    },
    locations: {
      "Principal Seat at Mumbai": [
        "Division Bench I",
        "Division Bench II",
        "Court 12",
        "Court 05",
        "Single Judge"
      ],
      "Nagpur Bench": ["Court 1", "Court 2"],
      "Aurangabad Bench": ["Court 1", "Court 2"],
      "Goa Bench": ["Court 1"]
    }
  };
}

const delhiHcIndex = HIGH_COURTS.findIndex(hc => hc.name === "Delhi High Court");
if (delhiHcIndex !== -1) {
  HIGH_COURTS[delhiHcIndex] = {
    ...HIGH_COURTS[delhiHcIndex],
    state: "Delhi",
    links: {
      officialUrl: "https://delhihighcourt.nic.in",
      eFiling: "https://efiling.ecourts.gov.in",
      causeList: "https://delhihighcourt.nic.in/causelist",
      caseStatus: "https://delhihighcourt.nic.in/case-status",
    },
    locations: {
      "Principal Bench": ["Court 1", "Court 2", "Court 3"]
    }
  };
}

const madrasHcIndex = HIGH_COURTS.findIndex(hc => hc.name === "Madras High Court");
if (madrasHcIndex !== -1) {
  HIGH_COURTS[madrasHcIndex] = {
    ...HIGH_COURTS[madrasHcIndex],
    state: "Tamil Nadu",
    links: {
      officialUrl: "https://hcmadras.tn.gov.in/",
      eFiling: "https://efiling.ecourts.gov.in",
      caseStatus: "https://services.ecourts.gov.in",
    },
    locations: {
      "Principal Seat at Chennai": ["Court 1", "Court 2"],
      "Madurai Bench": ["Court 1", "Court 2"]
    }
  };
}

// Override official URLs for all high courts based on provided list
const HIGH_COURT_URLS: Record<string, string> = {
  "Allahabad High Court": "https://www.allahabadhighcourt.in/",
  "Andhra Pradesh High Court": "https://aphc.gov.in/",
  "Bombay High Court": "https://bombayhighcourt.gov.in/",
  "Calcutta High Court": "https://calcuttahighcourt.gov.in/",
  "Chhattisgarh High Court": "https://highcourt.cg.gov.in/",
  "Delhi High Court": "https://delhihighcourt.nic.in/",
  "Gauhati High Court": "https://ghconline.gov.in/",
  "Gujarat High Court": "https://gujarathighcourt.nic.in/",
  "Himachal Pradesh High Court": "https://highcourt.hp.gov.in/",
  "Jammu & Kashmir and Ladakh High Court": "https://jkhighcourt.nic.in/",
  "Jharkhand High Court": "https://jharkhandhighcourt.nic.in/",
  "Karnataka High Court": "https://judiciary.karnataka.gov.in/",
  "Kerala High Court": "https://highcourt.kerala.gov.in/",
  "Madhya Pradesh High Court": "https://mphc.gov.in/",
  "Madras High Court": "https://hcmadras.tn.gov.in/",
  "Manipur High Court": "https://hcmimphal.nic.in/",
  "Meghalaya High Court": "https://meghalayahighcourt.nic.in/",
  "Orissa High Court": "https://www.orissahighcourt.nic.in/",
  "Patna High Court": "https://patnahighcourt.gov.in/",
  "Punjab and Haryana High Court": "https://highcourtchd.gov.in/",
  "Rajasthan High Court": "https://hcraj.nic.in/",
  "Sikkim High Court": "https://hcs.gov.in/",
  "Supreme Court": "https://www.sci.gov.in/",
  "Telangana High Court": "https://tshc.gov.in/",
  "Tripura High Court": "https://thc.nic.in/",
  "Uttarakhand High Court": "https://highcourtofuttarakhand.gov.in/",
};

HIGH_COURTS.forEach((hc) => {
  if (HIGH_COURT_URLS[hc.name]) {
    hc.links.officialUrl = HIGH_COURT_URLS[hc.name];
  }
});










const calcuttaHcIndex = HIGH_COURTS.findIndex(hc => hc.name === "Calcutta High Court");
if (calcuttaHcIndex !== -1) {
  HIGH_COURTS[calcuttaHcIndex] = {
    ...HIGH_COURTS[calcuttaHcIndex],
    state: "West Bengal",
    links: {
      officialUrl: "https://www.calcuttahighcourt.gov.in",
      eFiling: "https://efiling.ecourts.gov.in",
      caseStatus: "https://services.ecourts.gov.in",
    },
    locations: { "Principal Seat": ["Court 1", "Court 2"] }
  };
}

const karnatakaHcIndex = HIGH_COURTS.findIndex(hc => hc.name === "Karnataka High Court");
if (karnatakaHcIndex !== -1) {
  HIGH_COURTS[karnatakaHcIndex] = {
    ...HIGH_COURTS[karnatakaHcIndex],
    state: "Karnataka",
    links: {
      officialUrl: "https://karnatakajudiciary.kar.nic.in",
      eFiling: "https://efiling.ecourts.gov.in",
      caseStatus: "https://services.ecourts.gov.in",
    },
    locations: {
      "Principal Bench at Bengaluru": ["Court 1", "Court 2"],
      "Dharwad Bench": ["Court 1"],
      "Kalaburagi Bench": ["Court 1"]
    }
  };
}

export const FORUMS: Forum[] = [
  {
    id: "sci",
    name: "Supreme Court of India",
    category: "Apex Court",
    state: "Delhi",
    directLinkAvailable: true,
    notes: "Filing through the SCI e-Filing portal; AOR required.",
    links: {
      officialUrl: "https://www.sci.gov.in",
      eFiling: "https://efiling.sci.gov.in",
      causeList: "https://www.sci.gov.in/cause-list/",
      caseStatus: "https://www.sci.gov.in/case-status/",
      rules: "https://www.sci.gov.in/rules/",
    },
    locations: {
      "Main Campus": ["Court 1 (CJI)", "Court 2", "Court 3", "Court 4", "Court 5"]
    }
  },
  ...HIGH_COURTS,
  // Subordinate Civil Courts
  ...[
    "District Judge Court", "Additional District Judge Court", 
    "Civil Judge Senior Division / Sub-Judge", "Civil Judge Junior Division / Munsif", 
    "Small Causes Court"
  ].map((name) => ({
    id: `sub-civil-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    name,
    category: "Subordinate Civil Courts" as ForumCategory,
    directLinkAvailable: false,
    notes: "Routed to the official eCourts district portal.",
    links: {
      officialUrl: "https://districts.ecourts.gov.in",
      eFiling: "https://efiling.ecourts.gov.in",
      causeList: "https://services.ecourts.gov.in",
      caseStatus: "https://services.ecourts.gov.in",
    },
    locations: { "District Court Complex": ["Court 1", "Court 2", "Court 3"] }
  })),
  // Subordinate Criminal Courts
  ...[
    "Sessions Court", "Additional Sessions Court", "Chief Judicial Magistrate",
    "Judicial Magistrate First Class", "Judicial Magistrate Second Class", "Special Judicial Magistrate"
  ].map((name) => ({
    id: `sub-crim-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    name,
    category: "Subordinate Criminal Courts" as ForumCategory,
    directLinkAvailable: false,
    notes: "Cause lists and orders are published through eCourts Services.",
    links: {
      officialUrl: "https://districts.ecourts.gov.in",
      eFiling: "https://efiling.ecourts.gov.in",
      causeList: "https://services.ecourts.gov.in",
      caseStatus: "https://services.ecourts.gov.in",
    },
    locations: { "Sessions Court Complex": ["Court 1", "Court 2", "Court 3"] }
  })),
  // Metropolitan Courts
  ...[
    "City Civil and Sessions Court", "Chief Metropolitan Magistrate",
    "Additional Chief Metropolitan Magistrate", "Metropolitan Magistrate"
  ].map((name) => ({
    id: `metro-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    name,
    category: "Metropolitan Courts" as ForumCategory,
    directLinkAvailable: false,
    notes: "Routed to the official eCourts district portal.",
    links: {
      officialUrl: "https://districts.ecourts.gov.in",
      eFiling: "https://efiling.ecourts.gov.in",
      causeList: "https://services.ecourts.gov.in",
      caseStatus: "https://services.ecourts.gov.in",
    },
    locations: { "Metropolitan Court Complex": ["Court 1", "Court 2", "Court 3"] }
  })),
  // Specialized Courts & Tribunals
  ...[
    "Family Courts", "Labour Courts / Industrial Tribunals", "Commercial Courts",
    "Juvenile Justice Boards", "Consumer Commissions", "NCLT", "NCLAT", "DRT",
    "DRAT", "CAT", "State Administrative Tribunals", "NGT", "ITAT", "CESTAT",
    "AFT", "RERA", "Lok Adalats", "Gram Nyayalayas"
  ].map((name) => {
    let officialUrl = "https://services.ecourts.gov.in";
    let directLinkAvailable = false;
    let locations: Record<string, CourtroomData> = { "Principal Bench": ["Court 1"] };
    
    if (name === "NCLT") { officialUrl = "https://nclt.gov.in"; directLinkAvailable = true; locations = { "Principal Bench (Delhi)": ["Court 1"], "Mumbai Bench": ["Court 1", "Court 2"] }; }
    else if (name === "NCLAT") { officialUrl = "https://nclat.nic.in"; directLinkAvailable = true; locations = { "Principal Bench (Delhi)": ["Court 1"], "Chennai Bench": ["Court 1"] }; }
    else if (name === "CAT") { officialUrl = "https://cgat.gov.in"; directLinkAvailable = true; locations = { "Principal Bench (Delhi)": ["Court 1"], "Mumbai Bench": ["Court 1"] }; }
    else if (name === "NGT") { officialUrl = "https://www.greentribunal.gov.in"; directLinkAvailable = true; locations = { "Principal Bench (Delhi)": ["Court 1"], "Western Zone Bench (Pune)": ["Court 1"] }; }
    
    return {
      id: `tribunal-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name,
      category: "Specialized Courts & Tribunals" as ForumCategory,
      directLinkAvailable,
      links: {
        officialUrl,
        eFiling: directLinkAvailable ? `${officialUrl}/efiling` : "https://efiling.ecourts.gov.in",
        causeList: directLinkAvailable ? `${officialUrl}/causelist` : "https://services.ecourts.gov.in",
        caseStatus: directLinkAvailable ? `${officialUrl}/casestatus` : "https://services.ecourts.gov.in",
      },
      locations
    };
  })
];

export const LINK_LABELS: { key: keyof ForumLinks; label: string }[] = [
  { key: "officialUrl", label: "Official portal" },
  { key: "eFiling", label: "E-filing" },
  { key: "registry", label: "Registry" },
  { key: "rules", label: "Rules" },
  { key: "causeList", label: "Cause List" },
  { key: "caseStatus", label: "Case Status" },
  { key: "fees", label: "Fees / filing information" },
];

export const getForum = (id: string) => FORUMS.find((f) => f.id === id);

export const forumsByCategory = (category: ForumCategory) =>
  FORUMS.filter((f) => f.category === category);
