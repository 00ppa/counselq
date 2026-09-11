export type CaseStatus = "Awaited" | "Called Out" | "Passed Over" | "Adjourned" | "Disposed";

export type CauselistItem = {
  id: string;
  serial: number;
  caseNumber: string;
  title: string;
  petitioner: string;
  respondent: string;
  advocates: { petitioner: string; respondent: string };
  section: string;
  stage: string;
  category: "Civil" | "Criminal" | "Writ";
  forumId: string;
  location: string;
  courtroom: string;
  date: string;
  status: CaseStatus;
  outOfOrder: boolean;
  reports: number;
};

// Helper to get today's date in YYYY-MM-DD
export const todayISO = () => new Date().toISOString().slice(0, 10);

const baseCauselist: CauselistItem[] = [
  {
    id: "1",
    serial: 1,
    caseNumber: "WP/1842/2026",
    title: "Kadam v. State of Maharashtra",
    petitioner: "Sunil R. Kadam",
    respondent: "State of Maharashtra & Ors.",
    advocates: { petitioner: "Adv. M. Joshi", respondent: "AGP Ms. R. Pawar" },
    section: "Art. 226 of the Constitution",
    stage: "Final Hearing",
    category: "Writ",
    forumId: "bombay-high-court",
    location: "Principal Seat at Mumbai",
    courtroom: "Court 12",
    date: todayISO(),
    status: "Called Out",
    outOfOrder: false,
    reports: 6,
  },
  {
    id: "2",
    serial: 2,
    caseNumber: "CRA/443/2025",
    title: "State v. Firoz Shaikh",
    petitioner: "State of Maharashtra",
    respondent: "Firoz A. Shaikh",
    advocates: { petitioner: "APP Shri D. Kale", respondent: "Adv. N. Menon" },
    section: "S. 419 BNSS r/w S. 103 BNS",
    stage: "Admission",
    category: "Criminal",
    forumId: "bombay-high-court",
    location: "Principal Seat at Mumbai",
    courtroom: "Court 12",
    date: todayISO(),
    status: "Passed Over",
    outOfOrder: true,
    reports: 3,
  },
  {
    id: "3",
    serial: 3,
    caseNumber: "COMAP/91/2026",
    title: "Vertex Infra Pvt. Ltd. v. Sahyadri Steels",
    petitioner: "Vertex Infra Pvt. Ltd.",
    respondent: "Sahyadri Steels Ltd.",
    advocates: { petitioner: "Adv. K. Bhatt", respondent: "Adv. P. Rane" },
    section: "S. 37 Arbitration & Conciliation Act",
    stage: "For Directions",
    category: "Civil",
    forumId: "bombay-high-court",
    location: "Principal Seat at Mumbai",
    courtroom: "Division Bench I",
    date: todayISO(),
    status: "Awaited",
    outOfOrder: false,
    reports: 0,
  },
  {
    id: "4",
    serial: 4,
    caseNumber: "WP/2211/2026",
    title: "Abhirami Nair v. Union of India",
    petitioner: "Abhirami Nair",
    respondent: "Union of India",
    advocates: { petitioner: "Adv. S. Krishnan", respondent: "ASG Shri V. Rao" },
    section: "Art. 226 — Service Matter",
    stage: "Interim Relief",
    category: "Writ",
    forumId: "bombay-high-court",
    location: "Principal Seat at Mumbai",
    courtroom: "Court 05",
    date: todayISO(),
    status: "Awaited",
    outOfOrder: false,
    reports: 1,
  },
  {
    id: "5",
    serial: 5,
    caseNumber: "SC/778/2024",
    title: "Meher Cooperative Society v. Talathi",
    petitioner: "Meher Coop. Housing Society",
    respondent: "Talathi, Pune Taluka",
    advocates: { petitioner: "Adv. J. Fernandes", respondent: "Adv. H. Salvi" },
    section: "O. 39 R. 1 & 2 CPC",
    stage: "Evidence",
    category: "Civil",
    forumId: "metro-city-civil-and-sessions-court",
    location: "Metropolitan Court Complex",
    courtroom: "Court 3",
    date: todayISO(),
    status: "Adjourned",
    outOfOrder: false,
    reports: 2,
  },
  {
    id: "6",
    serial: 6,
    caseNumber: "BA/1290/2026",
    title: "Rehan Qureshi v. State",
    petitioner: "Rehan Qureshi",
    respondent: "State of Maharashtra",
    advocates: { petitioner: "Adv. T. Gokhale", respondent: "APP Smt. L. Naik" },
    section: "S. 483 BNSS — Bail",
    stage: "Fresh Admission",
    category: "Criminal",
    forumId: "bombay-high-court",
    location: "Principal Seat at Mumbai",
    courtroom: "Court 05",
    date: todayISO(),
    status: "Awaited",
    outOfOrder: true,
    reports: 0,
  },
];

const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

let demoIdCounter = 1000;

const generateDemoCases = (forumId: string, location: string, courtroom: string, date: string, count: number = 3): CauselistItem[] => {
  const cases: CauselistItem[] = [];
  const fakeParties = [
    ["Meridian Tech Pvt. Ltd.", "State Authority"],
    ["Orion Infrastructure LLP", "Municipal Board"],
    ["Apex Holdings", "Union of India"],
    ["Zenith Corp", "Registrar of Companies"],
    ["Nexus Builders", "Department of Revenue"]
  ];
  
  for (let i = 0; i < count; i++) {
    demoIdCounter++;
    const [pet, res] = fakeParties[i % fakeParties.length]!;
    cases.push({
      id: `demo-${demoIdCounter}`,
      serial: i + 1,
      caseNumber: `DEMO/${demoIdCounter}/2026`,
      title: `${pet} v. ${res} [DEMO DATA]`,
      petitioner: pet,
      respondent: res,
      advocates: { petitioner: "Adv. Demo", respondent: "Adv. Demo Res" },
      section: "Demo Section",
      stage: "Hearing",
      category: "Civil",
      forumId,
      location,
      courtroom,
      date,
      status: "Awaited",
      outOfOrder: false,
      reports: 0,
    });
  }
  return cases;
};

const generateConfigs = () => {
  const configs = [
    { f: "bombay-high-court", l: "Nagpur Bench", c: "Court 1" },
    { f: "bombay-high-court", l: "Aurangabad Bench", c: "Court 1" },
    { f: "madras-high-court", l: "Principal Seat at Chennai", c: "Court 1" },
    { f: "madras-high-court", l: "Madurai Bench", c: "Court 1" },
    { f: "kerala-high-court", l: "Principal Seat", c: "Court 1" },
    { f: "delhi-high-court", l: "Principal Bench", c: "Court 1" },
    { f: "karnataka-high-court", l: "Principal Bench at Bengaluru", c: "Court 1" },
    { f: "allahabad-high-court", l: "Principal Seat", c: "Court 1" },
    { f: "allahabad-high-court", l: "Lucknow Bench", c: "Court 1" },
    { f: "rajasthan-high-court", l: "Jodhpur", c: "Court 1" },
    { f: "rajasthan-high-court", l: "Jaipur Bench", c: "Court 1" },
    { f: "sub-civil-district-judge-court", l: "District Court Complex", c: "Court 1" },
    { f: "sub-crim-sessions-court", l: "Sessions Court Complex", c: "Court 1" },
    { f: "tribunal-nclt", l: "Mumbai Bench", c: "Court 1" },
    { f: "tribunal-nclat", l: "Principal Bench (Delhi)", c: "Court 1" },
    { f: "tribunal-cat", l: "Principal Bench (Delhi)", c: "Court 1" }
  ];
  
  let all: CauselistItem[] = [];
  const today = todayISO();
  const tomorrow = getTomorrow();
  
  configs.forEach(({ f, l, c }) => {
    all = all.concat(generateDemoCases(f, l, c, today));
  });

  const tomorrowConfigs = [
    { f: "bombay-high-court", l: "Principal Seat at Mumbai", c: "Court 12" },
    { f: "madras-high-court", l: "Principal Seat at Chennai", c: "Court 1" },
    { f: "kerala-high-court", l: "Principal Seat", c: "Court 1" },
    { f: "delhi-high-court", l: "Principal Bench", c: "Court 1" },
    { f: "tribunal-nclt", l: "Mumbai Bench", c: "Court 1" }
  ];
  tomorrowConfigs.forEach(({ f, l, c }) => {
    all = all.concat(generateDemoCases(f, l, c, tomorrow, 2));
  });
  
  return all;
};

export const causelist: CauselistItem[] = [
  ...baseCauselist,
  ...generateConfigs()
];

export const citationDb: Record<string, { verified: boolean; note: string }> = {
  "(1973) 4 scc 225": { verified: true, note: "Kesavananda Bharati v. State of Kerala — reported, AIR 1973 SC 1461." },
  "air 1978 sc 597": { verified: true, note: "Maneka Gandhi v. Union of India — reported." },
  "(2017) 10 scc 1": { verified: true, note: "K.S. Puttaswamy v. Union of India — reported." },
  "(2019) 7 scc 992": { verified: false, note: "No reported judgment traced at this citation. Likely AI-hallucinated." },
  "air 2021 sc 3390": { verified: false, note: "Volume/page mismatch in SCC OnLine and Manupatra indexes." },
};

export const extractedJudgments = [
  { cite: "(1973) 4 SCC 225", name: "Kesavananda Bharati v. State of Kerala", court: "Supreme Court", verified: true },
  { cite: "AIR 1978 SC 597", name: "Maneka Gandhi v. Union of India", court: "Supreme Court", verified: true },
  { cite: "(2019) 7 SCC 992", name: "Ramesh Traders v. Collector, Nashik", court: "Unverified", verified: false },
  { cite: "2024 SCC OnLine Bom 1120", name: "Sahyadri Steels v. MSEDCL", court: "Bombay High Court", verified: true },
];

export const ADVOCATES = [
  "Adv. M. Joshi",
  "Adv. N. Menon",
  "Adv. K. Bhatt",
  "Adv. S. Krishnan",
  "Adv. J. Fernandes",
  "Adv. T. Gokhale",
] as const;

export type FilingStage = "Drafted" | "E-Filed" | "Scrutiny" | "Objections" | "Numbered" | "Listed";

export const FILING_STAGES: FilingStage[] = [
  "Drafted",
  "E-Filed",
  "Scrutiny",
  "Objections",
  "Numbered",
  "Listed",
];

export type Filing = {
  id: string;
  title: string;
  type: string;
  diaryNo: string;
  forum: string;
  portal: string;
  stage: FilingStage;
  updated: string;
  note: string;
};

// ---------------------------------------------------------------------------
// CounselQ additions — bench status vocabulary + demo case detail extras.
// ---------------------------------------------------------------------------

export const BENCH_STATUSES = [
  "Sitting / In Session",
  "On Break",
  "Lunch Break",
  "Court Risen",
  "Resumed",
  "Matter Being Heard",
  "Matter Passed Over",
  "Matter Taken Out of Serial Order",
  "Unknown",
] as const;

export type BenchStatus = (typeof BENCH_STATUSES)[number];

export type BenchReport = {
  forumId: string;
  location: string;
  courtroom: string;
  date: string;
  status: BenchStatus;
  expectedReturn: string;
  note: string;
  reportedBy: string;
  at: Date;
};

export type CaseExtras = {
  judge: string;
  bench: string;
  previousHearings: { date: string; what: string }[];
  nextHearing: string;
  latestOrder: string;
};

export const caseExtras: Record<string, CaseExtras> = {
  "WP/1842/2026": {
    judge: "Hon'ble Justice A. R. Deshmukh",
    bench: "Single Judge",
    previousHearings: [
      { date: "12.02.2026", what: "Admitted; ad-interim relief granted" },
      { date: "04.06.2026", what: "Affidavit-in-reply filed by State" },
    ],
    nextHearing: "Listed today at Sr. No. 1",
    latestOrder: "Ad-interim relief continued till the next date.",
  },
  "CRA/443/2025": {
    judge: "Hon'ble Justice A. R. Deshmukh",
    bench: "Single Judge",
    previousHearings: [{ date: "18.11.2025", what: "Notice issued to the respondent" }],
    nextHearing: "Listed today at Sr. No. 2",
    latestOrder: "Records of the trial court called for.",
  },
  "COMAP/91/2026": {
    judge: "Hon'ble Justice A. R. Deshmukh",
    bench: "Division Bench I",
    previousHearings: [{ date: "22.05.2026", what: "For directions; time granted" }],
    nextHearing: "Listed today at Sr. No. 3",
    latestOrder: "Parties to complete pleadings within four weeks.",
  },
};

export const genericExtras: CaseExtras = {
  judge: "Not configured",
  bench: "Not configured",
  previousHearings: [],
  nextHearing: "Listed today",
  latestOrder: "Not available from an official source.",
};
