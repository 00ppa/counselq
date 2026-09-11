import { useSyncExternalStore } from "react";
import { ResearchNote, Highlight, Argument, UploadedDocument } from "./research-types";

export type VerificationStatus = "Verified" | "Partially Verified" | "Not Verified" | "Review Required";

export type Authority = {
  id: string;
  name: string;
  citation: string;
  court: string;
  year: string;
  source: string;
  url?: string;
  status: VerificationStatus;
};

export type ChronologyEvent = {
  id: string;
  date: string;
  event: string;
  source: string;
  page: string;
  status: VerificationStatus;
};

export type CaseSummary = {
  facts: string;
  issues: string;
  proceduralHistory: string;
  arguments: string;
  reliefSought: string;
  keyAuthorities: string;
  openQuestions: string;
  aiGenerated: boolean;
};

export type HearingNotes = {
  opening: string;
  keyArguments: string;
  authorities: string;
  likelyQuestions: string;
  suggestedResponses: string;
  documents: string;
  relief: string;
  aiDraft: boolean;
};

export type HearingOutcome = {
  id: string;
  recordedAt: string;
  status: string;
  whatHappened: string;
  order: string;
  nextDate: string;
  actionRequired: string;
};

export type CaseFile = {
  id: string;
  caseName: string;
  caseNumber: string;
  court: string;
  bench: string;
  client: string;
  opposingParty: string;
  matterType: string;
  nextHearing: string;
  summary: CaseSummary;
  chronology: ChronologyEvent[];
  hearingNotes: HearingNotes;
  authorities: Authority[];
  documents: { id: string; name: string; note: string }[];
  outcomes: HearingOutcome[];
  // Research extensions
  researchNotes: ResearchNote[];
  highlights: Highlight[];
  arguments: Argument[];
  uploadedDocuments: UploadedDocument[];
  updatedAt: string;
};

export type FilingTask = {
  id: string;
  title: string;
  forumId: string;
  forumName: string;
  note: string;
  done: boolean;
};

const emptySummary: CaseSummary = {
  facts: "",
  issues: "",
  proceduralHistory: "",
  arguments: "",
  reliefSought: "",
  keyAuthorities: "",
  openQuestions: "",
  aiGenerated: false,
};

const emptyNotes: HearingNotes = {
  opening: "",
  keyArguments: "",
  authorities: "",
  likelyQuestions: "",
  suggestedResponses: "",
  documents: "",
  relief: "",
  aiDraft: false,
};

const now = () => new Date().toLocaleString();
const uid = () => (globalThis.crypto?.randomUUID?.() ?? String(Math.random()).slice(2));

let cases: CaseFile[] = [
  {
    id: "c1",
    caseName: "Kadam v. State of Maharashtra",
    caseNumber: "WP/1842/2026",
    court: "High Court of Judicature at Bombay",
    bench: "Court 12 — Hon'ble Justice A. R. Deshmukh",
    client: "Sunil R. Kadam",
    opposingParty: "State of Maharashtra & Ors.",
    matterType: "Writ Petition (Art. 226)",
    nextHearing: "Today, 11:00 AM",
    summary: {
      facts:
        "Acquisition notice issued to the petitioner without affording a personal hearing; possession sought within 14 days.",
      issues: "Whether the notice under S. 11 is void for breach of natural justice.",
      proceduralHistory: "Petition admitted on 12.02.2026; ad-interim protection granted.",
      arguments: "Audi alteram partem is implied in every acquisition proceeding.",
      reliefSought: "Quashing of the impugned notice and remand for fresh hearing.",
      keyAuthorities: "Maneka Gandhi v. Union of India, AIR 1978 SC 597.",
      openQuestions: "Is the alternate statutory remedy efficacious?",
      aiGenerated: false,
    },
    chronology: [
      {
        id: uid(),
        date: "12.02.2026",
        event: "Petition admitted; ad-interim relief granted",
        source: "Order sheet",
        page: "14",
        status: "Verified",
      },
    ],
    hearingNotes: { ...emptyNotes },
    authorities: [
      {
        id: uid(),
        name: "Maneka Gandhi v. Union of India",
        citation: "AIR 1978 SC 597",
        court: "Supreme Court of India",
        year: "1978",
        source: "Reported — AIR",
        url: "https://www.sci.gov.in",
        status: "Verified",
      },
    ],
    documents: [{ id: uid(), name: "Compilation of authorities", note: "To be tendered in court" }],
    outcomes: [],
    updatedAt: now(),
  },
  {
    id: "c2",
    caseName: "Meher Coop. Society v. Talathi",
    caseNumber: "SC/778/2024",
    court: "City Civil & Sessions Court, Mumbai",
    bench: "Court 3",
    client: "Meher Coop. Housing Society",
    opposingParty: "Talathi, Pune Taluka",
    matterType: "Civil Suit",
    nextHearing: "Today, 2:45 PM",
    summary: { ...emptySummary, facts: "Injunction sought against mutation entry." },
    chronology: [],
    hearingNotes: { ...emptyNotes },
    authorities: [],
    documents: [],
    outcomes: [],
    updatedAt: now(),
  },

    // Demo case 3 - Fictional
    {
      id: uid(),
      caseName: "Rohit v. State of Gujarat",
      caseNumber: "WP/2026/002",
      court: "High Court of Gujarat",
      bench: "Bench 5 — Hon'ble Justice S. Patel",
      client: "Rohit Kumar",
      opposingParty: "State of Gujarat",
      matterType: "Writ Petition (Art. 226)",
      nextHearing: "Tomorrow, 10:30 AM",
      summary: { ...emptySummary, facts: "Petitioner challenges illegal land acquisition.", issues: "Whether acquisition under Section 6 is valid.", proceduralHistory: "Petition filed on 01.03.2026.", arguments: "Public interest vs private rights.", reliefSought: "Quash acquisition order.", keyAuthorities: "State of Gujarat v. Supreme Court, AIR 2025 SC 101.", openQuestions: "Impact on development project.", aiGenerated: false },
      chronology: [
        { id: uid(), date: "01.03.2026", event: "Petition filed", source: "Court filing", page: "1", status: "Verified" }
      ],
      hearingNotes: { ...emptyNotes },
      authorities: [],
      documents: [],
      outcomes: [],
      updatedAt: now(),
    },
    // Demo case 4 - Fictional
    {
      id: uid(),
      caseName: "Maya Enterprises v. Tax Authority",
      caseNumber: "SC/2026/018",
      court: "Supreme Court of India",
      bench: "Bench 2 — Hon'ble Justice A. Singh",
      client: "Maya Enterprises Ltd.",
      opposingParty: "Income Tax Department",
      matterType: "Tax Appeal",
      nextHearing: "Next week, 2:00 PM",
      summary: { ...emptySummary, facts: "Dispute over tax liability assessment.", issues: "Interpretation of Section 56.", proceduralHistory: "Appeal filed on 15.04.2026.", arguments: "Late filing justification.", reliefSought: "Reduction of tax demand.", keyAuthorities: "Income Tax v. Supreme Court, AIR 2024 SC 55.", openQuestions: "Precedent applicability.", aiGenerated: false },
      chronology: [
        { id: uid(), date: "15.04.2026", event: "Appeal filed", source: "Court filing", page: "1", status: "Verified" }
      ],
      hearingNotes: { ...emptyNotes },
      authorities: [],
      documents: [],
      outcomes: [],
      updatedAt: now(),
    },
    // Demo case 5 - Fictional
    {
      id: uid(),
      caseName: "Anita vs. Bank of India",
      caseNumber: "CB/2026/045",
      court: "City Civil & Sessions Court, Delhi",
      bench: "Court 3",
      client: "Anita Sharma",
      opposingParty: "Bank of India",
      matterType: "Civil Suit",
      nextHearing: "Friday, 11:00 AM",
      summary: { ...emptySummary, facts: "Claim for wrongful loan recovery.", issues: "Whether repayment terms were breached.", proceduralHistory: "Suit filed on 20.02.2026.", arguments: "Bank failed to follow RBI guidelines.", reliefSought: "Restoration of funds and damages.", keyAuthorities: "Bank of India v. Supreme Court, AIR 2023 SC 212.", openQuestions: "Damages calculation.", aiGenerated: false },
      chronology: [
        { id: uid(), date: "20.02.2026", event: "Suit filed", source: "Court filing", page: "1", status: "Verified" }
      ],
      hearingNotes: { ...emptyNotes },
      authorities: [],
      documents: [],
      outcomes: [],
      updatedAt: now(),
    },
    ];

let filingTasks: FilingTask[] = [
  {
    id: uid(),
    title: "Cure registry objection — index pagination & affidavit notarisation",
    forumId: "bombay-hc",
    forumName: "High Court of Judicature at Bombay",
    note: "Commercial Appeal, diary BHC/EF/20918/2026",
    done: false,
  },
  {
    id: uid(),
    title: "Await scrutiny report",
    forumId: "cat",
    forumName: "Central Administrative Tribunal (CAT)",
    note: "OA CAT/MUM/1147/2026",
    done: false,
  },
];

const listeners = new Set<() => void>();
type Snapshot = { cases: CaseFile[]; filingTasks: FilingTask[]; activeCaseId: string };
let activeCaseId = cases[0]!.id;
let snapshot: Snapshot = { cases, filingTasks, activeCaseId };

function emit() {
  snapshot = { cases, filingTasks, activeCaseId };
  listeners.forEach((l) => l());
}

function patchCase(id: string, fn: (c: CaseFile) => CaseFile) {
  cases = cases.map((c) => (c.id === id ? { ...fn(c), updatedAt: now() } : c));
  emit();
}

export const caseDeskStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: () => snapshot,
  setActive(id: string) {
    activeCaseId = id;
    emit();
  },
  addCase(input: Partial<CaseFile> & { caseName: string }) {
    const id = uid();
    cases = [
      ...cases,
      {
        id,
        caseName: input.caseName,
        caseNumber: input.caseNumber ?? "",
        court: input.court ?? "",
        bench: input.bench ?? "",
        client: input.client ?? "",
        opposingParty: input.opposingParty ?? "",
        matterType: input.matterType ?? "",
        nextHearing: input.nextHearing ?? "",
        summary: { ...emptySummary, ...input.summary },
        chronology: input.chronology ?? [],
        hearingNotes: { ...emptyNotes, ...input.hearingNotes },
        authorities: input.authorities ?? [],
        documents: input.documents ?? [],
        outcomes: [],
        updatedAt: now(),
      },
    ];
    activeCaseId = id;
    emit();
    return id;
  },
  /** Save a cause-list matter into the Case Desk, or return the existing one. */
  saveFromCauselist(input: { caseName: string; caseNumber: string; court: string; bench?: string; matterType?: string; client?: string; opposingParty?: string }) {
    const existing = cases.find((c) => c.caseNumber === input.caseNumber);
    if (existing) {
      activeCaseId = existing.id;
      emit();
      return existing.id;
    }
    return caseDeskStore.addCase(input);
  },
  updateCase(id: string, patch: Partial<Omit<CaseFile, "id">>) {
    patchCase(id, (c) => ({ ...c, ...patch }));
  },
  updateSummary(id: string, patch: Partial<CaseSummary>) {
    patchCase(id, (c) => ({ ...c, summary: { ...c.summary, ...patch } }));
  },
  updateNotes(id: string, patch: Partial<HearingNotes>) {
    patchCase(id, (c) => ({ ...c, hearingNotes: { ...c.hearingNotes, ...patch } }));
  },
  removeCase(id: string) {
    cases = cases.filter((c) => c.id !== id);
    if (activeCaseId === id) activeCaseId = cases[0]?.id ?? "";
    emit();
  },
  addChronology(id: string, ev: Omit<ChronologyEvent, "id">) {
    patchCase(id, (c) => ({ ...c, chronology: [...c.chronology, { ...ev, id: uid() }] }));
  },
  updateChronology(id: string, evId: string, patch: Partial<ChronologyEvent>) {
    patchCase(id, (c) => ({
      ...c,
      chronology: c.chronology.map((e) => (e.id === evId ? { ...e, ...patch } : e)),
    }));
  },
  removeChronology(id: string, evId: string) {
    patchCase(id, (c) => ({ ...c, chronology: c.chronology.filter((e) => e.id !== evId) }));
  },
  addAuthority(id: string, a: Omit<Authority, "id">) {
    patchCase(id, (c) => ({ ...c, authorities: [...c.authorities, { ...a, id: uid() }] }));
  },
  removeAuthority(id: string, aId: string) {
    patchCase(id, (c) => ({ ...c, authorities: c.authorities.filter((a) => a.id !== aId) }));
  },
  addOutcome(id: string, o: Omit<HearingOutcome, "id" | "recordedAt">) {
    patchCase(id, (c) => ({
      ...c,
      outcomes: [...c.outcomes, { ...o, id: uid(), recordedAt: now() }],
      // Recording an outcome always writes the event into the chronology.
      chronology: [
        ...c.chronology,
        {
          id: uid(),
          date: new Date().toLocaleDateString(),
          event: `${o.status}${o.whatHappened ? ` — ${o.whatHappened}` : ""}${o.order ? ` | Order: ${o.order}` : ""}`,
          source: "Hearing outcome (recorded by advocate)",
          page: "—",
          status: "Review Required",
        },
      ],
      nextHearing: o.nextDate || c.nextHearing,
    }));
  },
  addFilingTask(task: Omit<FilingTask, "id" | "done">) {
    filingTasks = [...filingTasks, { ...task, id: uid(), done: false }];
    emit();
  },
  toggleFilingTask(id: string) {
    filingTasks = filingTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    emit();
  },
  removeFilingTask(id: string) {
    filingTasks = filingTasks.filter((t) => t.id !== id);
    emit();
  },
};

export function useCaseDesk() {
  return useSyncExternalStore(caseDeskStore.subscribe, caseDeskStore.get, caseDeskStore.get);
}

export function useActiveCase() {
  const s = useCaseDesk();
  return s.cases.find((c) => c.id === s.activeCaseId) ?? s.cases[0] ?? null;
}
