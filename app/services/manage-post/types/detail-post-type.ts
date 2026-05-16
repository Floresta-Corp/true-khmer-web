import * as z from "zod";
import { PostingTypeSchema, StatusSchema } from "./post-type";

export const ApplicantStatusSchema = z.enum([
  "APPROVED",
  "COMPLETED",
  "CONFIRMED",
  "DECLINED",
  "SUBMITTED",
  "UNDER_REVIEW",
  "WITHDRAWN",
]);
export type ApplicantStatus = z.infer<typeof ApplicantStatusSchema>;

// export const SourceTypeSchema = z.enum(["PROJECT", "VOLUNTEER"]);
// export type SourceType = z.infer<typeof SourceTypeSchema>;

export const PostingStatusSchema = z.enum([
  "ACTIVE",
  "DRAFT",
  "ENDED",
  "FILLED",
]);
export type PostingStatus = z.infer<typeof PostingStatusSchema>;

export const DetailSourceTypeSchema = z.enum(["project", "volunteer"]);
export type DetailSourceType = z.infer<typeof DetailSourceTypeSchema>;

export const ApplicationStatusSchema = z.enum([
  "approved",
  "completed",
  "confirmed",
  "declined",
  "submitted",
  "under_review",
  "withdrawn",
]);

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const ApplicantStatusActionSchema = z.enum([
  "under_review",
  "approve",
  "decline",
  "submitted",
]);

export type ApplicantStatusAction = z.infer<typeof ApplicantStatusActionSchema>;

export const PostingApplicantRange = z.enum(["today", "this_week", "all_time"]);

export type ApplicantRange = z.infer<typeof PostingApplicantRange>;

export const PostingSourceSchema = z.enum(["volunteer", "projects"]);

export type PostSourceType = z.infer<typeof PostingSourceSchema>;

export const CandidateSchema = z.object({
  avatarKey: z.union([z.null(), z.string()]),
  avatarUrl: z.union([z.null(), z.string()]),
  email: z.string(),
  id: z.string(),
  name: z.string(),
  phoneNumber: z.union([z.null(), z.string()]),
  telegramUsername: z.union([z.null(), z.string()]),
});
export type Candidate = z.infer<typeof CandidateSchema>;

export const ContactSchema = z.object({
  email: z.string(),
  phoneNumber: z.union([z.null(), z.string()]),
  telegramUsername: z.union([z.null(), z.string()]),
});
export type Contact = z.infer<typeof ContactSchema>;

export const ProjectSchema = z.object({
  documentKeys: z.array(z.string()),
  documentNames: z.array(z.string()),
  motivation: z.string(),
  portfolio: z.string(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const RoleSchema = z.object({
  id: z.string(),
  title: z.string(),
});
export type Role = z.infer<typeof RoleSchema>;

export const SupportingDocumentSchema = z.object({
  key: z.string(),
  name: z.string(),
});
export type SupportingDocument = z.infer<typeof SupportingDocumentSchema>;

export const DetailPaginationSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type PostDetailPagination = z.infer<typeof DetailPaginationSchema>;

export const PostingSchema = z.object({
  applicantCount: z.number(),
  capacity: z.number(),
  createdAt: z.string(),
  deadline: z.union([z.null(), z.string()]),
  description: z.union([z.null(), z.string()]),
  id: z.string(),
  imageKey: z.union([z.null(), z.string()]),
  sourceType: PostingTypeSchema,
  status: StatusSchema,
  title: z.string(),
  views: z.number(),
});
export type Posting = z.infer<typeof PostingSchema>;

export const StatusesSchema = z.object({
  APPROVED: z.number(),
  COMPLETED: z.number(),
  CONFIRMED: z.number(),
  DECLINED: z.number(),
  SUBMITTED: z.number(),
  UNDER_REVIEW: z.number(),
  WITHDRAWN: z.number(),
});
export type Statuses = z.infer<typeof StatusesSchema>;

export const VolunteerSchema = z.object({
  availability: z.string(),
  relevantExperience: z.string(),
  supportingDocuments: z.array(SupportingDocumentSchema),
});
export type ManageVolunteer = z.infer<typeof VolunteerSchema>;

export const StatsSchema = z.object({
  capacity: z.number(),
  pending: z.number(),
  recruited: z.number(),
  statuses: StatusesSchema,
  totalApplicants: z.number(),
});
export type Stats = z.infer<typeof StatsSchema>;

export const ApplicantSchema = z.object({
  appliedAt: z.string(),
  candidate: CandidateSchema,
  contact: ContactSchema,
  id: z.string(),
  project: ProjectSchema,
  role: RoleSchema,
  status: ApplicantStatusActionSchema,
  updatedAt: z.string(),
  volunteer: VolunteerSchema,
});
export type Applicant = z.infer<typeof ApplicantSchema>;

export const DetailSchema = z.object({
  applicants: z.array(ApplicantSchema),
  pagination: DetailPaginationSchema,
  posting: PostingSchema,
  stats: StatsSchema,
});
export type PostingDetail = z.infer<typeof DetailSchema>;

export const ManagePostDetailSchema = z.object({
  detail: DetailSchema,
  ok: z.boolean(),
});
export type ManagePostDetailResponse = z.infer<typeof ManagePostDetailSchema>;
