export type RegistrationInfo = {
  state: string;
  propertyUrl: string;
  marriageUrl?: string; // if same as property, can be omitted
  reraUrl?: string;
  notes?: string;
  verified?: boolean;
};

export const REGISTRATIONS: RegistrationInfo[] = [
  // Verified – high confidence
  {
    state: "Andhra Pradesh",
    propertyUrl: "https://registration.ap.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.ap.gov.in",
    verified: true,
  },
  {
    state: "Assam",
    propertyUrl: "https://igr.assam.gov.in",
    marriageUrl: "Same as Property",
    notes: "Handled via Assam Urban/GMDA notifications — no single dedicated RERA domain confirmed; verify before hardcoding",
    verified: false,
  },
  {
    state: "Bihar",
    propertyUrl: "https://enibandhan.bihar.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.bihar.gov.in",
    verified: true,
  },
  {
    state: "Chhattisgarh",
    propertyUrl: "https://igrs.cgstate.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.cgstate.gov.in",
    verified: true,
  },
  {
    state: "Delhi (NCT)",
    propertyUrl: "https://doris.delhigovt.nic.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.delhi.gov.in",
    verified: true,
  },
  {
    state: "Goa",
    propertyUrl: "",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.goa.gov.in",
    notes: "Goa IGR portal not independently confirmed — verify",
    verified: false,
  },
  {
    state: "Gujarat",
    propertyUrl: "https://garvi.gujarat.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://gujrera.gujarat.gov.in",
    verified: true,
  },
  {
    state: "Haryana",
    propertyUrl: "",
    marriageUrl: "Same as Property",
    reraUrl: "Panchkula (rest of state): https://haryanarera.gov.in",
    notes: "Gurugram district: https://hareraggm.gov.in",
    verified: false,
  },
  {
    state: "Himachal Pradesh",
    propertyUrl: "",
    marriageUrl: "Same as Property",
    reraUrl: "http://www.hprera.in",
    verified: false,
  },
  {
    state: "Jharkhand",
    propertyUrl: "",
    marriageUrl: "Same as Property",
    reraUrl: "https://jharera.jharkhand.gov.in",
    verified: false,
  },
  {
    state: "Karnataka",
    propertyUrl: "https://kaveri.karnataka.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.karnataka.gov.in",
    verified: true,
  },
  {
    state: "Kerala",
    propertyUrl: "https://www.keralaregistration.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.kerala.gov.in",
    verified: true,
  },
  {
    state: "Madhya Pradesh",
    propertyUrl: "https://mpigr.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.mp.gov.in",
    verified: true,
  },
  {
    state: "Maharashtra",
    propertyUrl: "https://igrmaharashtra.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://maharera.mahaonline.gov.in",
    verified: true,
  },
  {
    state: "Odisha",
    propertyUrl: "https://www.igrodisha.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.odisha.gov.in",
    verified: true,
  },
  {
    state: "Punjab",
    propertyUrl: "https://igrpunjab.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.punjab.gov.in",
    verified: true,
  },
  {
    state: "Rajasthan",
    propertyUrl: "https://igrs.rajasthan.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.rajasthan.gov.in",
    verified: true,
  },
  {
    state: "Tamil Nadu",
    propertyUrl: "https://tnreginet.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.tn.gov.in",
    verified: true,
  },
  {
    state: "Telangana",
    propertyUrl: "",
    marriageUrl: "Same as Property",
    reraUrl: "https://rera.telangana.gov.in",
    notes: "Verify exact IGR URL — commonly cited as registration.telangana.gov.in",
    verified: false,
  },
  {
    state: "Uttar Pradesh",
    propertyUrl: "https://igrsup.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://up-rera.in",
    verified: true,
  },
  {
    state: "Uttarakhand",
    propertyUrl: "",
    marriageUrl: "Same as Property",
    reraUrl: "http://ukrera.org.in",
    notes: "Verify exact IGR URL",
    verified: false,
  },
  {
    state: "West Bengal",
    propertyUrl: "https://wbregistration.gov.in",
    marriageUrl: "Same as Property",
    reraUrl: "https://hira.wb.gov.in",
    notes: "some third‑party lists cite wbrera.gov.in — confirm which is current",
    verified: true,
  },
  // Central NGDRS fallback for states without dedicated portals
  {
    state: "Andaman & Nicobar Islands",
    propertyUrl: "https://ngdrs.gov.in/",
    marriageUrl: "Same as Property",
    verified: false,
  },
  // Add other NGDRS states similarly as needed...
];
