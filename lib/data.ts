export type RequestStatus = "NEW" | "TRANSFER" | "PENDING_ACCOUNT_CREATION" | "COMPLETED";

export interface DealerOrg {
  bpId: string;
  name: string;
  city: string;
  state: string;
  currentBpId?: string;  // for transfer requests
  currentName?: string;  // for transfer requests
}

export interface PendingRequest {
  id: string;
  userName: string;
  email: string;
  org: DealerOrg;
  requestDate: string;
  requestTime: string;
  status: "NEW" | "TRANSFER";
}

export interface AccountRecord {
  id: string;
  userName: string;
  email: string;
  org: DealerOrg;
  requestDate: string;
  status: "PENDING_ACCOUNT_CREATION" | "COMPLETED";
  gacId?: string;
  isAdmin?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  administrator: string;
  administratorName: string;
  event: "APPROVE_REGISTRATION" | "REJECT_REGISTRATION" | "APPROVE_TRANSFER" | "REJECT_TRANSFER" | "COMPLETE_ACCOUNT";
  details: string;
  targetName: string;
  targetId: string;
  targetEmail: string;
  ip: string;
  userAgent: string;
}

export const initialPendingRequests: PendingRequest[] = [
  {
    id: "req-001",
    userName: "BCT",
    email: "bct@123.com",
    org: { bpId: "BP1002", name: "Portland Cycle Hub", city: "Portland", state: "OR" },
    requestDate: "2026-04-08",
    requestTime: "10:37",
    status: "NEW",
  },
  {
    id: "req-002",
    userName: "YCC",
    email: "ycc@giantseattle.com",
    org: { bpId: "BP1001", name: "Giant Bicycles Seattle", city: "Seattle", state: "WA", currentBpId: "BP1003", currentName: "Bay Area Bikes" },
    requestDate: "2026-04-08",
    requestTime: "09:14",
    status: "TRANSFER",
  },
  {
    id: "req-003",
    userName: "Alex Morgan",
    email: "alex.m@rideworks.com",
    org: { bpId: "BP1005", name: "CycleWorks Austin", city: "Austin", state: "TX" },
    requestDate: "2026-04-09",
    requestTime: "14:22",
    status: "NEW",
  },
  {
    id: "req-004",
    userName: "Sara Lin",
    email: "sara.lin@bikehub.com",
    org: { bpId: "BP1007", name: "Ride LA", city: "Los Angeles", state: "CA", currentBpId: "BP1004", currentName: "Denver Mountain Sports" },
    requestDate: "2026-04-09",
    requestTime: "11:05",
    status: "TRANSFER",
  },
  {
    id: "req-005",
    userName: "David Park",
    email: "d.park@giantseattle.com",
    org: { bpId: "BP1001", name: "Giant Bicycles Seattle", city: "Seattle", state: "WA" },
    requestDate: "2026-04-10",
    requestTime: "08:49",
    status: "NEW",
  },
];

export const initialAccounts: AccountRecord[] = [
  { id: "acc-001", userName: "Charles",       email: "charles2@gmail.com",           org: { bpId: "BP1001", name: "Giant Bicycles Seattle",  city: "Seattle",       state: "WA" }, requestDate: "2026-04-08", status: "PENDING_ACCOUNT_CREATION" },
  { id: "acc-002", userName: "Mia Tanaka",    email: "mia.tanaka@gmail.com",          org: { bpId: "BP1003", name: "Bay Area Bikes",           city: "San Francisco", state: "CA" }, requestDate: "2026-04-07", status: "PENDING_ACCOUNT_CREATION" },
  { id: "acc-003", userName: "Store 1 user",  email: "user@store1.com",               org: { bpId: "BP1001", name: "Giant Bicycles Seattle",  city: "Seattle",       state: "WA" }, requestDate: "2026-03-23", status: "COMPLETED",               gacId: "760282" },
  { id: "acc-004", userName: "Jordan Rivera", email: "jordan.r@denversports.com",     org: { bpId: "BP1004", name: "Denver Mountain Sports",  city: "Denver",        state: "CO" }, requestDate: "2026-03-23", status: "PENDING_ACCOUNT_CREATION" },
  { id: "acc-005", userName: "Alison Wu",     email: "alison.wu@cycleworks.com",      org: { bpId: "BP1005", name: "CycleWorks Austin",        city: "Austin",        state: "TX" }, requestDate: "2026-03-20", status: "COMPLETED",               gacId: "483910" },
  { id: "acc-006", userName: "Brady Cheng",   email: "brady.cheng@giantcycles.com",   org: { bpId: "BP1002", name: "Portland Cycle Hub",      city: "Portland",      state: "OR" }, requestDate: "2026-03-18", status: "COMPLETED",               gacId: "391024", isAdmin: true },
  { id: "acc-007", userName: "Sophie Martin", email: "sophie.m@bikehaven.com",        org: { bpId: "BP1006", name: "Bike Haven Chicago",       city: "Chicago",       state: "IL" }, requestDate: "2026-03-17", status: "PENDING_ACCOUNT_CREATION" },
  { id: "acc-008", userName: "Kevin Park",    email: "kevin.park@ridela.com",         org: { bpId: "BP1007", name: "Ride LA",                  city: "Los Angeles",   state: "CA" }, requestDate: "2026-03-15", status: "COMPLETED",               gacId: "582741" },
  { id: "acc-009", userName: "Nadia Hassan",  email: "nadia.h@giantny.com",           org: { bpId: "BP1008", name: "Giant NYC",                city: "New York",      state: "NY" }, requestDate: "2026-03-14", status: "COMPLETED",               gacId: "203847" },
  { id: "acc-010", userName: "Tom Ellis",     email: "tom.ellis@sunrider.com",        org: { bpId: "BP1009", name: "Sun Rider Miami",          city: "Miami",         state: "FL" }, requestDate: "2026-03-12", status: "COMPLETED",               gacId: "104839" },
  { id: "acc-011", userName: "Yuki Sato",     email: "yuki.sato@cyclehub.com",        org: { bpId: "BP1010", name: "Cycle Hub Boston",         city: "Boston",        state: "MA" }, requestDate: "2026-03-10", status: "COMPLETED",               gacId: "394821" },
  { id: "acc-012", userName: "Laura Kim",     email: "laura.k@pedalworks.com",        org: { bpId: "BP1011", name: "Pedal Works Phoenix",      city: "Phoenix",       state: "AZ" }, requestDate: "2026-03-08", status: "COMPLETED",               gacId: "673920" },
  { id: "acc-013", userName: "Marco Rossi",   email: "marco.r@veloce.com",            org: { bpId: "BP1012", name: "Veloce San Diego",         city: "San Diego",     state: "CA" }, requestDate: "2026-03-06", status: "COMPLETED",               gacId: "471092" },
  { id: "acc-014", userName: "Anna Li",       email: "anna.li@chainreact.com",        org: { bpId: "BP1013", name: "Chain Reaction Dallas",    city: "Dallas",        state: "TX" }, requestDate: "2026-03-04", status: "COMPLETED",               gacId: "294710" },
  { id: "acc-015", userName: "Sam Torres",    email: "sam.torres@rideon.com",         org: { bpId: "BP1003", name: "Bay Area Bikes",           city: "San Francisco", state: "CA" }, requestDate: "2026-03-02", status: "PENDING_ACCOUNT_CREATION" },
  { id: "acc-016", userName: "Grace Huang",   email: "grace.h@spinworks.com",         org: { bpId: "BP1014", name: "SpinWorks Minneapolis",    city: "Minneapolis",   state: "MN" }, requestDate: "2026-02-28", status: "COMPLETED",               gacId: "837462" },
  { id: "acc-017", userName: "Ethan Brown",   email: "ethan.b@gearup.com",            org: { bpId: "BP1015", name: "Gear Up Portland",         city: "Portland",      state: "OR" }, requestDate: "2026-02-25", status: "COMPLETED",               gacId: "562384" },
  { id: "acc-018", userName: "Chloe Dupont",  email: "chloe.d@velo.com",              org: { bpId: "BP1016", name: "Vélo Atlanta",             city: "Atlanta",       state: "GA" }, requestDate: "2026-02-22", status: "COMPLETED",               gacId: "519384" },
  { id: "acc-019", userName: "Oscar Nguyen",  email: "oscar.n@bikestreet.com",        org: { bpId: "BP1004", name: "Denver Mountain Sports",   city: "Denver",        state: "CO" }, requestDate: "2026-02-20", status: "COMPLETED",               gacId: "683910" },
  { id: "acc-020", userName: "Iris Chen",     email: "iris.chen@ridehub.com",         org: { bpId: "BP1017", name: "Ride Hub Nashville",       city: "Nashville",     state: "TN" }, requestDate: "2026-02-18", status: "COMPLETED",               gacId: "746201" },
  { id: "acc-021", userName: "Felix Wagner",  email: "felix.w@cyclicity.com",         org: { bpId: "BP1018", name: "Cyclicity Detroit",        city: "Detroit",       state: "MI" }, requestDate: "2026-02-15", status: "COMPLETED",               gacId: "714829" },
  { id: "acc-022", userName: "Priya Patel",   email: "priya.p@bikepoint.com",         org: { bpId: "BP1019", name: "Bike Point Houston",       city: "Houston",       state: "TX" }, requestDate: "2026-02-12", status: "COMPLETED",               gacId: "382910" },
  { id: "acc-023", userName: "Leo Fernandez", email: "leo.f@rideseattle.com",         org: { bpId: "BP1001", name: "Giant Bicycles Seattle",   city: "Seattle",       state: "WA" }, requestDate: "2026-02-10", status: "COMPLETED",               gacId: "825016" },
  { id: "acc-024", userName: "Nina Johansson",email: "nina.j@nordicbike.com",         org: { bpId: "BP1020", name: "Nordic Bike Minneapolis",  city: "Minneapolis",   state: "MN" }, requestDate: "2026-02-08", status: "COMPLETED",               gacId: "619473" },
  { id: "acc-025", userName: "Ryan O'Brien",  email: "ryan.ob@greenwheel.com",        org: { bpId: "BP1005", name: "CycleWorks Austin",        city: "Austin",        state: "TX" }, requestDate: "2026-02-05", status: "COMPLETED",               gacId: "936742" },
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "log-001",
    timestamp: "2026-04-08 06:13:21",
    administrator: "candace@giant.com",
    administratorName: "Candace Cheng",
    event: "REJECT_REGISTRATION",
    details: "User selected a dealer that does not match their account.",
    targetName: "Tina",
    targetId: "20410C47",
    targetEmail: "tina@example.com",
    ip: "172.24.8.192",
    userAgent: "Mozilla/5.0 (Macintosh;...",
  },
  {
    id: "log-002",
    timestamp: "2026-04-08 05:43:29",
    administrator: "candace@giant.com",
    administratorName: "Candace Cheng",
    event: "REJECT_REGISTRATION",
    details: "",
    targetName: "grgergdg",
    targetId: "20BADBF8",
    targetEmail: "grgergdg@example.com",
    ip: "172.24.8.192",
    userAgent: "Mozilla/5.0 (Macintosh;...",
  },
  {
    id: "log-003",
    timestamp: "2026-04-08 05:42:34",
    administrator: "brady.cheng@giant.com",
    administratorName: "Brady Cheng",
    event: "APPROVE_REGISTRATION",
    details: "",
    targetName: "YCC",
    targetId: "0F4D83CC",
    targetEmail: "ycc@giantseattle.com",
    ip: "172.24.8.192",
    userAgent: "Mozilla/5.0 (Macintosh;...",
  },
  {
    id: "log-004",
    timestamp: "2026-04-08 05:33:12",
    administrator: "brady.cheng@giant.com",
    administratorName: "Brady Cheng",
    event: "APPROVE_REGISTRATION",
    details: "",
    targetName: "Charles",
    targetId: "6EFC5E3E",
    targetEmail: "charles2@gmail.com",
    ip: "172.24.8.192",
    userAgent: "Mozilla/5.0 (Macintosh;...",
  },
  {
    id: "log-005",
    timestamp: "2026-04-07 14:21:05",
    administrator: "sophia.lee@giant.com",
    administratorName: "Sophia Lee",
    event: "APPROVE_TRANSFER",
    details: "",
    targetName: "Kevin Park",
    targetId: "A3F812C1",
    targetEmail: "kevin.park@ridela.com",
    ip: "172.24.9.44",
    userAgent: "Mozilla/5.0 (Macintosh;...",
  },
  {
    id: "log-006",
    timestamp: "2026-04-07 11:08:47",
    administrator: "sophia.lee@giant.com",
    administratorName: "Sophia Lee",
    event: "REJECT_TRANSFER",
    details: "Organization transfer failed verification — BP ID mismatch with submitted documents.",
    targetName: "Alison Wu",
    targetId: "B7D94E20",
    targetEmail: "alison.wu@cycleworks.com",
    ip: "172.24.9.44",
    userAgent: "Mozilla/5.0 (Macintosh;...",
  },
  {
    id: "log-007",
    timestamp: "2026-04-06 09:55:33",
    administrator: "sophia.lee@giant.com",
    administratorName: "Sophia Lee",
    event: "APPROVE_REGISTRATION",
    details: "",
    targetName: "Laura Kim",
    targetId: "C2A17F39",
    targetEmail: "laura.k@pedalworks.com",
    ip: "172.24.9.44",
    userAgent: "Mozilla/5.0 (Macintosh;...",
  },
  {
    id: "log-008",
    timestamp: "2026-04-05 16:44:18",
    administrator: "candace@giant.com",
    administratorName: "Candace Cheng",
    event: "REJECT_REGISTRATION",
    details: "Registration details could not be verified against the dealer record.",
    targetName: "Felix Wagner",
    targetId: "D9E03B55",
    targetEmail: "felix.w@cyclicity.com",
    ip: "172.24.8.192",
    userAgent: "Mozilla/5.0 (Macintosh;...",
  },
];
