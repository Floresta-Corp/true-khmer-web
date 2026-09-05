import { z } from "zod";
import type {
  MyClassCountsResponse,
  MyClassesStatsResponse,
  MyClassResponse,
  MyClassStatus,
  MyClassTab,
} from "~/api/education/my-classes.server";

export const MyClassTabSchema = z.enum([
  "learning",
  "in-progress",
  "saved",
  "completed",
]);

export type { MyClassStatus, MyClassTab };

export type MyClass = MyClassResponse;

export type MyClassCounts = MyClassCountsResponse;

export type MyClassesStats = MyClassesStatsResponse;

export interface MyClassesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const TAB_LABELS: Record<MyClassTab, string> = {
  learning: "My learning",
  "in-progress": "In-progress",
  saved: "Saved",
  completed: "Completed",
};

export const MyClassIntentSchema = z.enum(["save", "unsave", "leave"]);

export type MyClassIntent = z.infer<typeof MyClassIntentSchema>;
