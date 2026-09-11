import { useSyncExternalStore } from "react";

export type VaultEntry = {
  id: string;
  caseName: string;
  caseNumber: string;
  advocate: string;
  time: string;
  status: string;
  remarks: string;
  notes: string;
};

const listeners = new Set<() => void>();

let entries: VaultEntry[] = [
  {
    id: "v1",
    caseName: "Kadam v. State of Maharashtra",
    caseNumber: "WP/1842/2026",
    advocate: "Adv. M. Joshi",
    time: "11:00 AM",
    status: "Part-heard",
    remarks: "Compilation to be tendered",
    notes: "",
  },
  {
    id: "v2",
    caseName: "Meher Coop. Society v. Talathi",
    caseNumber: "SC/778/2024",
    advocate: "Adv. J. Fernandes",
    time: "2:45 PM",
    status: "Evidence",
    remarks: "PW-3 cross to continue",
    notes: "",
  },
];

function emit() {
  entries = [...entries];
  listeners.forEach((l) => l());
}

export const vaultStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: () => entries,
  add(entry: Omit<VaultEntry, "id">) {
    entries.push({ ...entry, id: crypto.randomUUID() });
    emit();
  },
  update(id: string, patch: Partial<VaultEntry>) {
    entries = entries.map((e) => (e.id === id ? { ...e, ...patch } : e));
    emit();
  },
  remove(id: string) {
    entries = entries.filter((e) => e.id !== id);
    emit();
  },
};

export function useVault() {
  return useSyncExternalStore(
    vaultStore.subscribe,
    vaultStore.get,
    vaultStore.get,
  );
}
