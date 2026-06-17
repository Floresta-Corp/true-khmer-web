export type UserStatus = "active" | "suspended" | "banned";
export type UserTier = 1 | 2 | 3;
export type UserRole = "user" | "partner";
export type ConfirmationAction = "reset" | "suspend" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  legacyPoints: number;
  activePoints: number;
  totalSpent: number;
  totalEarned: number;
  joinDate: string;
  lastActive: string;
  status: UserStatus;
  location: string;
  avatar?: string;
}

export interface PointTransaction {
  id: string;
  date: string;
  amount: number;
  reason: string;
  adminName?: string;
  type: "earned" | "spent" | "adjustment";
}
