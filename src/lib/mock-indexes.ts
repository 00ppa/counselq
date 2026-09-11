export type IndexEntry = {
  id: string;
  type: "Constitution" | "Statutory Provision" | "Legal Concept" | "Case Name";
  title: string;
  source: string;
  officialUrl: string;
};

export const CONSTITUTION_INDEX: Record<string, IndexEntry> = {
  "12": { id: "art12", type: "Constitution", title: "Article 12: Definition of State", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "13": { id: "art13", type: "Constitution", title: "Article 13: Laws inconsistent with or in derogation of the fundamental rights", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "14": { id: "art14", type: "Constitution", title: "Article 14: Equality before law", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "19": { id: "art19", type: "Constitution", title: "Article 19: Protection of certain rights regarding freedom of speech, etc.", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "21": { id: "art21", type: "Constitution", title: "Article 21: Protection of life and personal liberty", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "32": { id: "art32", type: "Constitution", title: "Article 32: Remedies for enforcement of rights conferred by this Part", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "39a": { id: "art39a", type: "Constitution", title: "Article 39A: Equal justice and free legal aid", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "51a": { id: "art51a", type: "Constitution", title: "Article 51A: Fundamental duties", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "72": { id: "art72", type: "Constitution", title: "Article 72: Power of President to grant pardons, etc.", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "136": { id: "art136", type: "Constitution", title: "Article 136: Special leave to appeal by the Supreme Court", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "141": { id: "art141", type: "Constitution", title: "Article 141: Law declared by Supreme Court to be binding on all courts", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "142": { id: "art142", type: "Constitution", title: "Article 142: Enforcement of decrees and orders of Supreme Court and orders as to discovery, etc.", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "143": { id: "art143", type: "Constitution", title: "Article 143: Power of President to consult Supreme Court", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "226": { id: "art226", type: "Constitution", title: "Article 226: Power of High Courts to issue certain writs", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "227": { id: "art227", type: "Constitution", title: "Article 227: Power of superintendence over all courts by the High Court", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "324": { id: "art324", type: "Constitution", title: "Article 324: Superintendence, direction and control of elections to be vested in an Election Commission", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "356": { id: "art356", type: "Constitution", title: "Article 356: Provisions in case of failure of constitutional machinery in States", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
  "368": { id: "art368", type: "Constitution", title: "Article 368: Power of Parliament to amend the Constitution and procedure therefor", source: "Constitution of India", officialUrl: "https://www.indiacode.nic.in/" },
};

export const STATUTORY_INDEX: Record<string, IndexEntry> = {
  "ni act 138": { id: "ni138", type: "Statutory Provision", title: "Section 138: Dishonour of cheque for insufficiency, etc., of funds in the account", source: "Negotiable Instruments Act, 1881", officialUrl: "https://www.indiacode.nic.in/" },
  "ni act 139": { id: "ni139", type: "Statutory Provision", title: "Section 139: Presumption in favour of holder", source: "Negotiable Instruments Act, 1881", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc 9": { id: "cpc9", type: "Statutory Provision", title: "Section 9: Courts to try all civil suits unless barred", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc 10": { id: "cpc10", type: "Statutory Provision", title: "Section 10: Stay of suit", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc 11": { id: "cpc11", type: "Statutory Provision", title: "Section 11: Res judicata", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc 80": { id: "cpc80", type: "Statutory Provision", title: "Section 80: Notice", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc 89": { id: "cpc89", type: "Statutory Provision", title: "Section 89: Settlement of disputes outside the Court", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc 96": { id: "cpc96", type: "Statutory Provision", title: "Section 96: Appeal from original decree", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc 100": { id: "cpc100", type: "Statutory Provision", title: "Section 100: Second appeal", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc 115": { id: "cpc115", type: "Statutory Provision", title: "Section 115: Revision", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "cpc order 7 rule 11": { id: "cpc_o7r11", type: "Statutory Provision", title: "Order VII Rule 11: Rejection of plaint", source: "Civil Procedure Code, 1908", officialUrl: "https://www.indiacode.nic.in/" },
  "limitation 3": { id: "lim3", type: "Statutory Provision", title: "Section 3: Bar of limitation", source: "Limitation Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "limitation 5": { id: "lim5", type: "Statutory Provision", title: "Section 5: Extension of prescribed period in certain cases", source: "Limitation Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "limitation 14": { id: "lim14", type: "Statutory Provision", title: "Section 14: Exclusion of time of proceeding bona fide in court without jurisdiction", source: "Limitation Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "limitation 18": { id: "lim18", type: "Statutory Provision", title: "Section 18: Effect of acknowledgment in writing", source: "Limitation Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "arbitration 8": { id: "arb8", type: "Statutory Provision", title: "Section 8: Power to refer parties to arbitration where there is an arbitration agreement", source: "Arbitration and Conciliation Act, 1996", officialUrl: "https://www.indiacode.nic.in/" },
  "arbitration 9": { id: "arb9", type: "Statutory Provision", title: "Section 9: Interim measures, etc. by Court", source: "Arbitration and Conciliation Act, 1996", officialUrl: "https://www.indiacode.nic.in/" },
  "arbitration 11": { id: "arb11", type: "Statutory Provision", title: "Section 11: Appointment of arbitrators", source: "Arbitration and Conciliation Act, 1996", officialUrl: "https://www.indiacode.nic.in/" },
  "arbitration 16": { id: "arb16", type: "Statutory Provision", title: "Section 16: Competence of arbitral tribunal to rule on its jurisdiction", source: "Arbitration and Conciliation Act, 1996", officialUrl: "https://www.indiacode.nic.in/" },
  "arbitration 34": { id: "arb34", type: "Statutory Provision", title: "Section 34: Application for setting aside arbitral award", source: "Arbitration and Conciliation Act, 1996", officialUrl: "https://www.indiacode.nic.in/" },
  "arbitration 37": { id: "arb37", type: "Statutory Provision", title: "Section 37: Appealable orders", source: "Arbitration and Conciliation Act, 1996", officialUrl: "https://www.indiacode.nic.in/" },
  "specific relief 6": { id: "sra6", type: "Statutory Provision", title: "Section 6: Suit by person dispossessed of immovable property", source: "Specific Relief Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "specific relief 10": { id: "sra10", type: "Statutory Provision", title: "Section 10: Specific performance in respect of contracts", source: "Specific Relief Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "specific relief 14": { id: "sra14", type: "Statutory Provision", title: "Section 14: Contracts not specifically enforceable", source: "Specific Relief Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "specific relief 16": { id: "sra16", type: "Statutory Provision", title: "Section 16: Personal bars to relief", source: "Specific Relief Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "specific relief 34": { id: "sra34", type: "Statutory Provision", title: "Section 34: Discretion of court as to declaration of status or right", source: "Specific Relief Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "specific relief 38": { id: "sra38", type: "Statutory Provision", title: "Section 38: Perpetual injunction when granted", source: "Specific Relief Act, 1963", officialUrl: "https://www.indiacode.nic.in/" },
  "it act 43": { id: "it43", type: "Statutory Provision", title: "Section 43: Penalty and compensation for damage to computer, computer system, etc.", source: "Information Technology Act, 2000", officialUrl: "https://www.indiacode.nic.in/" },
  "it act 43a": { id: "it43a", type: "Statutory Provision", title: "Section 43A: Compensation for failure to protect data", source: "Information Technology Act, 2000", officialUrl: "https://www.indiacode.nic.in/" },
  "it act 66": { id: "it66", type: "Statutory Provision", title: "Section 66: Computer related offences", source: "Information Technology Act, 2000", officialUrl: "https://www.indiacode.nic.in/" },
  "it act 67": { id: "it67", type: "Statutory Provision", title: "Section 67: Punishment for publishing or transmitting obscene material in electronic form", source: "Information Technology Act, 2000", officialUrl: "https://www.indiacode.nic.in/" },
};

// Also adding a conceptual index for known Concepts / Case names
export const CONCEPT_INDEX: Record<string, IndexEntry> = {
  "natural justice": { id: "con_nj", type: "Legal Concept", title: "Principles of Natural Justice (Audi Alteram Partem, Nemo Judex in Causa Sua)", source: "Constitutional & Administrative Law", officialUrl: "" },
  "arbitrariness": { id: "con_arb", type: "Legal Concept", title: "Test of Arbitrariness under Article 14", source: "Constitutional Law", officialUrl: "" },
  "navtej singh johar": { id: "case_nsj", type: "Case Name", title: "Navtej Singh Johar v. Union of India", source: "(2018) 10 SCC 1", officialUrl: "" },
  "writ maintainability": { id: "con_wm", type: "Legal Concept", title: "Maintainability of Writ Petition (Article 226/32)", source: "Constitutional Law", officialUrl: "" },
};
