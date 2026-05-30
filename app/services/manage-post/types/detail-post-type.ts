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
  "NEW",
]);
export type ApplicantStatus = z.infer<typeof ApplicantStatusSchema>;

export const PostingStatusSchema = z.enum([
  // "ACTIVE",
  "DRAFT",
  "CANCELED",
  "FILLED",
  "COMPLETED",
  "IN_PROGRESS",
  "LIVE",
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
  "confirmed",
  "completed",
  "submitted",
  "new",
]);

export type ApplicantStatusAction = z.infer<typeof ApplicantStatusActionSchema>;

export const PostingApplicantFilter = z.enum([
  "all",
  "new",
  "in_review",
  "approved",
  "confirmed",
  "declined",
]);

export type ApplicantFilter = z.infer<typeof PostingApplicantFilter>;

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

export const PrivateNoteSchema = z.object({
  createdAt: z.string(),
  createdBy: z.string(),
  id: z.string(),
  note: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});
export type PrivateNote = z.infer<typeof PrivateNoteSchema>;

export const PrivateNoteInputSchema = z.object({
  note: z.string(),
});
export type PrivateNoteInput = z.infer<typeof PrivateNoteInputSchema>;

export const ProjectSchema = z.object({
  documentKeys: z.array(z.string()),
  documentNames: z.array(z.string()),
  motivation: z.string(),
  portfolio: z.string(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const RoleSchema = z.object({
  applicationId: z.string(),
  appliedAt: z.string(),
  description: z.union([z.null(), z.string()]),
  roleId: z.string(),
  status: ApplicantStatusSchema,
  title: z.string(),
  updatedAt: z.string(),
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
  filled: z.boolean(),
  id: z.string(),
  isEditable: z.boolean(),
  imageKey: z.union([z.null(), z.string()]),
  sourceType: PostingTypeSchema,
  status: PostingStatusSchema,
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

export const SubmissionSchema = z.object({
  appliedAt: z.string(),
  project: ProjectSchema,
  roles: z.array(RoleSchema),
  submissionKey: z.string(),
  topPick: z.union([z.null(), z.string()]),
  updatedAt: z.string(),
  volunteer: VolunteerSchema,
});
export type Submission = z.infer<typeof SubmissionSchema>;

export const StatsSchema = z.object({
  capacity: z.number(),
  pending: z.number(),
  recruited: z.number(),
  statuses: StatusesSchema,
  totalApplicants: z.number(),
});
export type Stats = z.infer<typeof StatsSchema>;

export const ApplicantSchema = z.object({
  candidate: CandidateSchema,
  contact: ContactSchema,
  lastAppliedAt: z.string(),
  overallStatus: ApplicantStatusSchema,
  privateNote: PrivateNoteSchema.nullable(),
  submissionCount: z.number(),
  submissions: z.array(SubmissionSchema),
  totalRoleApplied: z.number(),
  updatedAt: z.string(),
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
