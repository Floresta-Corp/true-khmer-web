// ── Content Moderator Types ────────────────────────────────────────────────

export type ReportStatus = "open" | "closed";

export type ReportCategory =
  | "Spam"
  | "Harassment"
  | "Misinformation"
  | "Hate Speech"
  | "Irrelevant";

export type ReportSource = "Forum" | "Events" | "Marketplace" | "Profile";

export type ReportType = "post" | "comment" | "profile";

export interface Report {
  id: string;
  type: ReportType;
  category: string;
  source: ReportSource;
  reporter: string;
  reporterAvatar?: string;
  target: {
    author: string;
    preview: string;
    avatar?: string;
  };
  status: ReportStatus;
  result?: string;
  createdAt: string;
  priority?: "Low" | "Medium" | "High";
}

export interface SanctionLog {
  id: string;
  user: string;
  action: string;
  admin: string;
  reason: string;
  date: string;
  expiry: string;
}

export interface Appeal {
  id: string;
  user: string;
  originalAction: string;
  argument: string;
  timeFiled: string;
  status: "pending" | "resolved";
}

// ── Mock Data ───────────────────────────────────────────────────────────────

export const MOCK_REPORTS: Report[] = [
  {
    id: "REP-001",
    type: "post",
    category: "Spam",
    source: "Forum",
    reporter: "Alice Smith",
    reporterAvatar: "AS",
    priority: "High",
    target: {
      author: "risky_trader",
      preview:
        "Yeah, no. I don't know. I can't help you, sorry. Check out my profile for 500% returns guaranteed!! Use code SCAM500 now!!",
    },
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REP-002",
    type: "comment",
    category: "Harassment",
    source: "Forum",
    reporter: "Bob Wilson",
    reporterAvatar: "BW",
    priority: "Medium",
    target: {
      author: "bot_99",
      preview:
        "No idea, but I would love to help you. Sorry for the inconvenience. This user is being repeatedly aggressive in the thread.",
    },
    status: "open",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "REP-003",
    type: "post",
    category: "Misinformation",
    source: "Events",
    reporter: "Charlie Brown",
    reporterAvatar: "CB",
    priority: "Low",
    target: {
      author: "party_planner",
      preview:
        "Hello, how are you doing? Free tickets to my non-existent web3 event!",
    },
    status: "closed",
    result: "Content Removed",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "REP-005",
    type: "post",
    category: "Spam",
    source: "Marketplace",
    reporter: "Eve Online",
    reporterAvatar: "EO",
    priority: "Low",
    target: {
      author: "cheap_deals",
      preview:
        "Answer: C. 81π cm³ \n\nStep-by-step explanation: The volume of the cylinder is Selling 1000 BTC for $100. Limited time offer!!",
    },
    status: "open",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "REP-006",
    type: "post",
    category: "Harassment",
    source: "Forum",
    reporter: "Frank Castle",
    reporterAvatar: "FC",
    priority: "Medium",
    target: {
      author: "troll_master",
      preview:
        "The 15th-18th centuries were an age of exploration. Many people in Europe were searching for a better life with greater opportunities.",
    },
    status: "open",
    createdAt: new Date(Date.now() - 15800000).toISOString(),
  },
  {
    id: "REP-007",
    type: "comment",
    category: "Misinformation",
    source: "Events",
    reporter: "Grace Hopper",
    reporterAvatar: "GH",
    priority: "Low",
    target: {
      author: "fake_news",
      preview: "I have the same question, but I don't know the answer :(",
    },
    status: "closed",
    result: "Dismissed",
    createdAt: new Date(Date.now() - 20800000).toISOString(),
  },
];

export const SANCTIONS_LOG: SanctionLog[] = [
  {
    id: "S-1",
    user: "bot_99",
    action: "Permanent Ban",
    admin: "Sarah Wilson",
    reason: "Repeated spam violations",
    date: "2024-04-28",
    expiry: "Never",
  },
  {
    id: "S-2",
    user: "user_x",
    action: "Warning",
    admin: "Mike Ross",
    reason: "Inappropriate profile banner",
    date: "2024-04-27",
    expiry: "N/A",
  },
  {
    id: "S-3",
    user: "toxic_player",
    action: "30 Day Suspension",
    admin: "Sarah Wilson",
    reason: "Hate speech in comments",
    date: "2024-04-25",
    expiry: "2024-05-25",
  },
];

export const APPEALS: Appeal[] = [
  {
    id: "APP-10",
    user: "toxic_player",
    originalAction: "30 Day Suspension",
    argument:
      "I was just joking, it wasn't meant to be offensive. Please reconsider.",
    timeFiled: "4h ago",
    status: "pending",
  },
];

export const CATEGORIES = [
  "All Types",
  "Spam",
  "Harassment",
  "Misinformation",
  "Hate Speech",
  "Irrelevant",
];

export const STATUSES = [
  { label: "All", value: "All", color: "slate" },
  { label: "Open", value: "open", color: "rose" },
  { label: "Closed", value: "closed", color: "emerald" },
] as const;

// ── Design tokens (matches admin dashboard palette) ────────────────────────
export const STYLES = {
  pageBg: "bg-(--admin-page-bg)",
  cardBg: "bg-(--admin-card-bg)",
  cardHover: "hover:bg-(--admin-card-muted)",
  headerRow: "bg-(--admin-header-bg)",
  border: "border-(--admin-border)",
  divide: "divide-(--admin-border)",
  textPrimary: "text-(--admin-text)",
  textSecondary: "text-(--admin-text-secondary)",
  textMuted: "text-(--admin-text-muted)",
  iconBg: "bg-(--admin-card-muted)",
} as const;
