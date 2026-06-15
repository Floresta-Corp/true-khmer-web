import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const AuthRegisterRequest = z
  .object({
    firstName: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u),
    lastName: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u),
    gender: z.enum(["male", "female", "other"]),
    occupation: z.string().min(1).max(120),
    phone: z.object({
      country: z.string().min(2).max(2),
      nationalNumber: z.string().min(1),
    }),
    email: z.string().min(1).email(),
    password: z.string().min(8).regex(/^\S+$/),
  })
  .passthrough();
const AuthUserProfile = z
  .object({
    id: z.string(),
    displayName: z.string().optional(),
    avatarKey: z.string().optional(),
    avatarUrl: z.string().optional(),
  })
  .passthrough();
const AuthUser = z
  .object({
    id: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean().optional(),
    role: z.string().optional(),
    name: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    occupation: z.string().nullish(),
    phoneNumber: z.string().nullish(),
    phoneCountry: z.string().nullish(),
    image: z.string().nullish(),
    signupCompletedAt: z
      .union([z.string(), z.string(), z.unknown()])
      .optional(),
    onboardingCompletedAt: z
      .union([z.string(), z.string(), z.unknown()])
      .optional(),
    onboardingStep: z.number().int().optional(),
    profile: AuthUserProfile.optional(),
  })
  .passthrough();
const RegisterSuccessResponse = z
  .object({
    success: z.literal(true),
    message: z.string(),
    otpSent: z.boolean(),
    user: AuthUser,
  })
  .passthrough();
const AuthCompleteSignUpRequest = z
  .object({
    firstName: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u),
    lastName: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u),
    gender: z.enum(["male", "female", "other"]),
    occupation: z.string().min(1).max(120),
    phone: z.object({
      country: z.string().min(2).max(2),
      nationalNumber: z.string().min(1),
    }),
    memberAgreementAccepted: z.literal(true),
  })
  .passthrough();
const AuthAccessState = z.enum([
  "SIGNUP_REQUIRED",
  "ONBOARDING_REQUIRED",
  "ACTIVE"]);
const AuthRequiredAction = z.enum([
  "COMPLETE_SIGNUP",
  "COMPLETE_ONBOARDING"]);
const AuthFlow = z
  .object({
    isNewUser: z.boolean(),
    requiresSignupCompletion: z.boolean(),
    requiresOnboarding: z.boolean(),
    nextStep: z.enum(["COMPLETE_SIGNUP", "ONBOARDING", "APP"]),
    accessState: AuthAccessState,
    requiredAction: AuthRequiredAction.nullable(),
  })
  .passthrough();
const CompleteSignUpResponse = z
  .object({
    success: z.literal(true),
    message: z.string(),
    user: AuthUser,
    authFlow: AuthFlow.optional(),
  })
  .passthrough();
const AuthSessionResponse = z
  .object({ user: AuthUser, authFlow: AuthFlow })
  .passthrough();
const AuthProtectedErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    code: z.string().optional(),
    requiredAction: AuthRequiredAction.nullish(),
    accessState: AuthAccessState.optional(),
  })
  .passthrough();
const AuthGoogleRequest = z
  .object({ idToken: z.string().min(1) })
  .passthrough();
const AuthTokenResponse = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: AuthUser,
    authFlow: AuthFlow.optional(),
  })
  .passthrough();
const AuthVerifyRegisterOtpRequest = z
  .object({ email: z.string().min(1).email(), otp: z.string().min(6).max(6) })
  .passthrough();
const AuthResendRegisterOtpRequest = z
  .object({ email: z.string().min(1).email() })
  .passthrough();
const ResendRegisterOtpResponse = z
  .object({ success: z.boolean(), message: z.string() })
  .passthrough();
const AuthSimpleErrorResponse = z.object({ error: z.string() }).passthrough();
const AuthLoginRequest = z
  .object({ email: z.string().min(1).email(), password: z.string().min(1) })
  .passthrough();
const AuthRefreshRequest = z
  .object({ refreshToken: z.string().min(1) })
  .passthrough();
const RefreshSuccessResponse = z
  .object({ accessToken: z.string(), refreshToken: z.string() })
  .passthrough();
const AuthForgotPasswordRequest = z
  .object({ email: z.string().min(1).email(), resetPageUrl: z.string().min(1) })
  .passthrough();
const ForgotPasswordResponse = z
  .object({ success: z.literal(true), message: z.string() })
  .passthrough();
const AuthResetPasswordRequest = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8).regex(/^\S+$/),
  })
  .passthrough();
const ResetPasswordResponse = z
  .object({ success: z.literal(true), message: z.string() })
  .passthrough();
const AdminLoginRequest = z
  .object({ email: z.string().min(1), password: z.string().min(1) })
  .passthrough();
const AdminUser = z
  .object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().min(1),
    createdAt: z.union([z.string(), z.string()]),
  })
  .passthrough();
const AdminLoginResponse = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiresAt: z.string().datetime({ offset: true }),
    refreshTokenExpiresAt: z.string().datetime({ offset: true }),
    admin: AdminUser,
  })
  .passthrough();
const AdminErrorResponse = z.object({ error: z.string() }).passthrough();
const AdminRefreshRequest = z
  .object({ refreshToken: z.string().min(1) })
  .passthrough();
const AdminRefreshResponse = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiresAt: z.string().datetime({ offset: true }),
    refreshTokenExpiresAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const AdminLogoutResponse = z
  .object({ success: z.boolean(), message: z.string() })
  .passthrough();
const ContentModeratorReportType = z
  .object({ id: z.string(), name: z.string() })
  .passthrough();
const ContentModeratorReportReporter = z
  .object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
  })
  .passthrough();
const ContentModeratorReport = z
  .object({
    id: z.string().uuid(),
    reportId: z.number().int().gt(0),
    type: ContentModeratorReportType,
    contentPreview: z.string(),
    dateTime: z.string().datetime({ offset: true }),
    status: z.enum(["OPEN", "CLOSED"]),
    reportingBy: ContentModeratorReportReporter.nullable(),
  })
  .passthrough();
const CursorPagination = z
  .object({
    limit: z.number().int().gt(0),
    hasMore: z.boolean(),
    nextCursor: z.string().nullable(),
    total: z.number().int().gte(0),
  })
  .passthrough();
const ListContentModeratorReportsResponse = z
  .object({
    ok: z.boolean(),
    reports: z.array(ContentModeratorReport),
    pagination: CursorPagination,
  })
  .passthrough();
const UpdateContentModeratorReportReviewRequest = z
  .object({
    reportUuid: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    status: z.enum(["SAFE", "HIDE"]),
  })
  .passthrough();
const UpdateContentModeratorReportReviewResponse = z
  .object({ ok: z.boolean(), report: ContentModeratorReport })
  .passthrough();
const OnboardingOkResponse = z.record(z.string(), z.unknown().nullable());
const OnboardingErrorResponse = z.record(z.string(), z.unknown().nullable());
const OnboardingProfileStepRequest = z
  .object({
    bio: z.string().max(1000).optional(),
    countryId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    cityId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    avatarKey: z.string().min(1).max(600).optional(),
  })
  .passthrough();
const OnboardingInterestsStepRequest = z
  .object({
    interestIds: z
      .array(
        z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
      )
      .min(2)
      .max(20),
  })
  .passthrough();
const OnboardingContributionsStepRequest = z
  .object({
    community_member: z.boolean(),
    find_volunteers: z.boolean(),
    launch_project: z.boolean(),
    organize_event: z.boolean(),
  })
  .partial();
const PresignAvatarUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(5242880),
  })
  .passthrough();
const PresignAvatarUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      .passthrough(),
    avatarKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  .passthrough();
const PresignAvatarUploadResponse = z
  .object({ ok: z.boolean(), upload: PresignAvatarUploadResult })
  .passthrough();
const CategoryResponse = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    displayOrder: z.number(),
    status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]),
    createdBy: z.string(),
    updatedBy: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    archivedAt: z.string().nullable(),
  })
  .passthrough();
const CategoryWithQuestionCountResponse = CategoryResponse.and(
  z.object({ questionCount: z.number() }).passthrough()
);
const GetCategoriesResponse = z
  .object({
    ok: z.boolean(),
    categories: z.array(CategoryWithQuestionCountResponse),
  })
  .passthrough();
const CreateCategoryRequest = z
  .object({
    name: z.string().min(1).max(120),
    slug: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
  })
  .passthrough();
const CreateCategoryResponse = z
  .object({ ok: z.boolean(), category: CategoryResponse })
  .passthrough();
const isUnanswered = z.union([z.boolean(), z.string()]).optional();
const QuestionTagResponse = z
  .object({ id: z.string(), name: z.string() })
  .passthrough();
const QuestionResponse = z
  .object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    imageKey: z.string().nullable(),
    status: z.enum(["PUBLISHED", "CLOSED", "DELETED"]),
    upvoteCount: z.number().int().gte(0),
    downvoteCount: z.number().int().gte(0),
    answerCount: z.number().int().gte(0),
    viewCount: z.number().int().gte(0),
    bestAnswerId: z.string().nullable(),
    bestAnswerSelectedAt: z.string().datetime({ offset: true }).nullable(),
    score: z.number().int(),
    viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]).nullable(),
    viewerSave: z.boolean(),
    category: z.object({ id: z.string(), name: z.string() }).passthrough(),
    author: z
      .object({
        id: z.string(),
        name: z.string(),
        avatarKey: z.string().nullable(),
      })
      .passthrough(),
    tags: z.array(QuestionTagResponse),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const GetQuestionsResponse = z
  .object({
    ok: z.boolean(),
    questions: z.array(QuestionResponse),
    pagination: z
      .object({
        limit: z.number(),
        hasMore: z.boolean(),
        nextCursor: z.string().nullable(),
        total: z.number().int().gte(0),
      })
      .passthrough(),
  })
  .passthrough();
const CreateQuestionRequest = z
  .object({
    categoryId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    title: z.string().min(1).max(300),
    body: z.string().min(1).max(10000),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    imageKey: z.string().min(1).max(600).nullish(),
    status: z.string().optional(),
  })
  .passthrough();
const CreateQuestionResponse = z
  .object({ ok: z.boolean(), question: QuestionResponse })
  .passthrough();
const TrendingTagResponse = z
  .object({ id: z.string(), name: z.string(), count: z.number() })
  .passthrough();
const GetTrendingTagsResponse = z
  .object({ ok: z.boolean(), tags: z.array(TrendingTagResponse) })
  .passthrough();
const GetMyQuestionsResponse = z
  .object({ ok: z.boolean(), questions: z.array(QuestionResponse) })
  .passthrough();
const GetSavedQuestionsResponse = z
  .object({
    ok: z.boolean(),
    questions: z.array(QuestionResponse),
    pagination: z
      .object({
        limit: z.number(),
        hasMore: z.boolean(),
        nextCursor: z.string().nullable(),
        total: z.number().int().gte(0),
      })
      .passthrough(),
  })
  .passthrough();
const GetQuestionResponse = z
  .object({ ok: z.boolean(), question: QuestionResponse })
  .passthrough();
const PresignForumQuestionImageUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(5242880),
  })
  .passthrough();
const PresignForumQuestionImageUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      .passthrough(),
    imageKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  .passthrough();
const PresignForumQuestionImageUploadResponse = z
  .object({
    ok: z.literal(true),
    upload: PresignForumQuestionImageUploadResult,
  })
  .passthrough();
const EditQuestionRequest = z
  .object({
    categoryId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    title: z.string().min(1).max(300),
    body: z.string().min(1).max(10000),
    tags: z.union([z.array(z.string()), z.string()]),
    imageKey: z.string().min(1).max(600).nullable(),
    status: z.string(),
  })
  .partial()
  .passthrough();
const VoteQuestionRequest = z.object({ voteType: z.string() }).passthrough();
const SaveQuestionResponse = z.object({ ok: z.literal(true) }).passthrough();
const RepliedAnswerResponse = z
  .object({
    id: z.string(),
    body: z.string(),
    author: z
      .object({
        id: z.string(),
        name: z.string(),
        avatarKey: z.string().nullable(),
      })
      .passthrough(),
    upvoteCount: z.number(),
    downvoteCount: z.number(),
    replyCount: z.number(),
    score: z.number(),
    viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    questionId: z.string(),
    status: z.literal("PUBLISHED"),
    replyTo: z.string().nullable(),
  })
  .passthrough();
const AnswerResponse = z
  .object({
    id: z.string(),
    body: z.string(),
    author: z
      .object({
        id: z.string(),
        name: z.string(),
        avatarKey: z.string().nullable(),
      })
      .passthrough(),
    upvoteCount: z.number(),
    downvoteCount: z.number(),
    replyCount: z.number(),
    score: z.number(),
    viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    questionId: z.string(),
    status: z.literal("PUBLISHED"),
    replyTo: z.string().nullable(),
    repliedAnswers: z.array(RepliedAnswerResponse).nullable(),
  })
  .passthrough();
const GetAnswersResponse = z
  .object({
    ok: z.boolean(),
    answers: z
      .object({
        bestAnswer: z.array(AnswerResponse),
        answers: z.array(AnswerResponse),
      })
      .passthrough(),
  })
  .passthrough();
const AnswerQuestionResponse = z
  .object({
    id: z.string(),
    categoryId: z.string(),
    title: z.string(),
    body: z.string(),
    status: z.enum(["PUBLISHED", "CLOSED", "DELETED"]),
    answerCount: z.number().int().gte(0),
    upvoteCount: z.number().int().gte(0),
    downvoteCount: z.number().int().gte(0),
    bestAnswerId: z.string().nullable(),
    bestAnswerSelectedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    category: CategoryResponse,
  })
  .passthrough();
const MyAnswerResponse = z
  .object({
    id: z.string(),
    body: z.string(),
    author: z
      .object({
        id: z.string(),
        name: z.string(),
        avatarKey: z.string().nullable(),
      })
      .passthrough(),
    upvoteCount: z.number(),
    downvoteCount: z.number(),
    replyCount: z.number(),
    score: z.number(),
    viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    status: z.literal("PUBLISHED"),
    replyTo: z.string().nullable(),
    repliedAnswers: z.array(RepliedAnswerResponse).nullable(),
    question: AnswerQuestionResponse,
  })
  .passthrough();
const GetMyAnswersResponse = z
  .object({ ok: z.boolean(), answers: z.array(MyAnswerResponse) })
  .passthrough();
const CreateAnswerRequest = z.object({
  questionId: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
    ),
  replyToAnswer: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
    )
    .nullish(),
  body: z.string().min(1).max(10000),
});
const CreateAnswerResponse = z
  .object({ ok: z.boolean(), answer: AnswerResponse })
  .passthrough();
const UpdateAnswerRequest = z
  .object({ body: z.string().min(1).max(10000) })
  .passthrough();
const EditAnswerResponse = z
  .object({ ok: z.boolean(), answer: AnswerResponse })
  .passthrough();
const AnswerErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const DeleteAnswerResponse = z.object({ ok: z.boolean() }).passthrough();
const VoteAnswerRequest = z.object({ voteType: z.string() }).passthrough();
const VoteAnswerResponse = z
  .object({ ok: z.boolean(), answer: AnswerResponse })
  .passthrough();
const MarkBestAnswerResponse = z
  .object({ ok: z.boolean(), answer: AnswerResponse })
  .passthrough();
const VolunteerCategoryResponse = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    iconKey: z.string().nullable(),
    displayOrder: z.number(),
    status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]),
    createdBy: z.string(),
    updatedBy: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    archivedAt: z.string().nullable(),
  })
  .passthrough();
const VolunteerCategoryWithOpportunityCountResponse =
  VolunteerCategoryResponse.and(
    z.object({ opportunityCount: z.number().int().gte(0) }).passthrough()
  );
const GetVolunteerCategoriesResponse = z
  .object({
    ok: z.literal(true),
    categories: z.array(VolunteerCategoryWithOpportunityCountResponse),
  })
  .passthrough();
const VolunteerOperationErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const CreateVolunteerCategoryRequest = z
  .object({
    name: z.string(),
    slug: z.string(),
    description: z.string().nullish(),
    iconKey: z.string().nullish(),
    status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]).optional(),
  })
  .passthrough();
const CreateVolunteerCategoryResponse = z
  .object({ ok: z.literal(true), category: VolunteerCategoryResponse })
  .passthrough();
const VolunteerCategoryValidationErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    issues: z.array(
      z.object({ path: z.string(), message: z.string() }).passthrough()
    ),
  })
  .passthrough();
const VolunteerLocationResponse = z
  .object({ id: z.string(), name: z.string() })
  .passthrough();
const GetVolunteerLocationsResponse = z
  .object({
    ok: z.literal(true),
    locations: z.array(VolunteerLocationResponse),
  })
  .passthrough();
const PresignVolunteerOpportunityCoverUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(5242880),
  })
  .passthrough();
const PresignVolunteerOpportunityCoverUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      .passthrough(),
    coverImageKey: z.string(),
    expiresInSeconds: z.number(),
  })
  .passthrough();
const PresignVolunteerOpportunityCoverUploadResponse = z
  .object({
    ok: z.literal(true),
    upload: PresignVolunteerOpportunityCoverUploadResult,
  })
  .passthrough();
const PresignVolunteerApplicationDocumentUploadRequest = z
  .object({
    opportunityId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    files: z
      .array(
        z
          .object({
            fileName: z.string().min(1).max(255),
            contentType: z.string(),
            fileSize: z.number().int().gt(0).lte(10485760),
          })
          .passthrough()
      )
      .min(1)
      .max(3),
  })
  .passthrough();
const PresignVolunteerApplicationDocumentUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      .passthrough(),
    supportingDocument: z
      .object({ name: z.string(), key: z.string() })
      .passthrough(),
    expiresInSeconds: z.number(),
  })
  .passthrough();
const PresignVolunteerApplicationDocumentUploadResponse = z
  .object({
    ok: z.literal(true),
    uploads: z.array(PresignVolunteerApplicationDocumentUploadResult),
  })
  .passthrough();
const VolunteerOpportunityReference = z
  .object({ id: z.string(), name: z.string() })
  .passthrough();
const VolunteerOpportunityListItemResponse = z
  .object({
    id: z.string(),
    title: z.string(),
    overview: z.string(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    commitmentLabel: z.string().nullable(),
    commitmentDescription: z.string().nullable(),
    applicationDeadline: z.string(),
    applicationCount: z.number(),
    capacity: z.number(),
    filled: z.boolean(),
    totalView: z.number(),
    coverImageKey: z.string(),
    createdAt: z.string(),
    viewerSave: z.boolean(),
    category: VolunteerOpportunityReference,
    location: VolunteerOpportunityReference,
  })
  .passthrough();
const VolunteerOpportunitiesPaginationResponse = z
  .object({
    limit: z.number(),
    hasMore: z.boolean(),
    nextCursor: z.string().nullable(),
    total: z.number().int().gte(0),
  })
  .passthrough();
const GetVolunteerOpportunitiesResponse = z
  .object({
    ok: z.literal(true),
    opportunities: z.array(VolunteerOpportunityListItemResponse),
    pagination: VolunteerOpportunitiesPaginationResponse,
  })
  .passthrough();
const VolunteerOpportunityContact = z
  .object({
    email: z.string().max(320).email(),
    telegramUsername: z.string().nullish(),
    phone: z.string().nullish(),
    websiteUrl: z.string().nullish(),
  })
  .passthrough();
const VolunteerOpportunityRoleRequest = z
  .object({
    title: z.string(),
    capacity: z.number().int().gte(1).lte(100000),
    responsibilities: z.array(z.string()).max(20).nullish(),
    requirements: z.array(z.string()).max(20).nullish(),
  })
  .passthrough();
const CreateVolunteerOpportunityPayload = z
  .object({
    categoryId: z.string().uuid(),
    locationId: z.string().uuid(),
    title: z.string(),
    overview: z.string(),
    communityImpact: z.string().nullish(),
    startDate: z.string().nullish(),
    endDate: z.string().nullish(),
    commitmentLabel: z.string().nullish(),
    commitmentDescription: z.string().nullish(),
    applicationDeadline: z.string().datetime({ offset: true }),
    benefits: z.array(z.string()).max(12).nullish(),
    contact: VolunteerOpportunityContact,
    roles: z.array(VolunteerOpportunityRoleRequest).min(1).max(20),
  })
  .passthrough();
const CreateVolunteerOpportunityRequest = CreateVolunteerOpportunityPayload.and(
  z.object({ coverImageKey: z.string().min(1).max(600) }).passthrough()
);
const VolunteerOpportunityContactResponse = z
  .object({
    email: z.string(),
    telegramUsername: z.string().nullable(),
    phone: z.string().nullable(),
    websiteUrl: z.string().nullable(),
  })
  .passthrough();
const VolunteerOpportunityOrganizerResponse = z
  .object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
    opportunityCount: z.number(),
    organizerLocation: VolunteerOpportunityReference.and(z.unknown()),
    contact: VolunteerOpportunityContactResponse,
  })
  .passthrough();
const VolunteerOpportunityRoleResponse = z
  .object({
    id: z.string(),
    title: z.string(),
    capacity: z.number(),
    responsibilities: z.array(z.string()),
    requirements: z.array(z.string()),
    displayOrder: z.number(),
    viewerApplied: z.boolean(),
  })
  .passthrough();
const VolunteerOpportunityResponse = z
  .object({
    id: z.string(),
    category: VolunteerOpportunityReference,
    location: VolunteerOpportunityReference,
    title: z.string(),
    overview: z.string(),
    communityImpact: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    commitmentLabel: z.string().nullable(),
    commitmentDescription: z.string().nullable(),
    applicationDeadline: z.string(),
    applicationCount: z.number(),
    capacity: z.number(),
    filled: z.boolean(),
    totalView: z.number(),
    coverImageKey: z.string(),
    benefits: z.array(z.string()),
    status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED"]),
    publishedAt: z.string().nullable(),
    organizer: VolunteerOpportunityOrganizerResponse,
    createdBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    viewerSave: z.boolean(),
    viewerTopPicked: z.string().nullable(),
    viewerBlocked: z.boolean(),
    roles: z.array(VolunteerOpportunityRoleResponse),
  })
  .passthrough();
const CreateVolunteerOpportunityResponse = z
  .object({ ok: z.literal(true), opportunity: VolunteerOpportunityResponse })
  .passthrough();
const GetVolunteerOpportunityResponse = z
  .object({ ok: z.literal(true), opportunity: VolunteerOpportunityResponse })
  .passthrough();
const UpdateVolunteerOpportunityContactRequest = z
  .object({
    email: z.string().max(320).email(),
    telegramUsername: z.string().nullable(),
    phone: z.string().nullable(),
    websiteUrl: z.string().nullable(),
  })
  .partial();
const UpdateVolunteerOpportunityRoleRequest =
  VolunteerOpportunityRoleRequest.and(
    z.object({ id: z.string().uuid() }).partial().passthrough()
  );
const UpdateVolunteerOpportunityRequest = z
  .object({
    categoryId: z.string().uuid(),
    locationId: z.string().uuid(),
    title: z.string(),
    overview: z.string(),
    communityImpact: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    commitmentLabel: z.string().nullable(),
    commitmentDescription: z.string().nullable(),
    applicationDeadline: z.string().datetime({ offset: true }),
    coverImageKey: z.string().min(1).max(600),
    benefits: z.array(z.string()).max(12).nullable(),
    contact: UpdateVolunteerOpportunityContactRequest,
    roles: z.array(UpdateVolunteerOpportunityRoleRequest).min(1).max(20),
  })
  .partial();
const SaveVolunteerOpportunityResponse = z
  .object({ ok: z.literal(true) })
  .passthrough();
const CreateVolunteerApplicationRequest = z
  .object({
    availability: z.string(),
    relevantExperience: z.string(),
    supportingDocuments: z
      .array(
        z
          .object({
            name: z.string().min(1).max(255),
            key: z.string().min(1).max(600),
          })
          .passthrough()
      )
      .max(3)
      .optional()
      .default([]),
    topPickRoleId: z.string().uuid().nullish(),
    roleId: z.string().uuid(),
  })
  .passthrough();
const VolunteerApplicationOpportunity = z
  .object({
    id: z.string(),
    title: z.string(),
    coverImageKey: z.string(),
    status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED"]),
    applicationDeadline: z.string(),
    filled: z.boolean(),
    category: VolunteerOpportunityReference,
    location: VolunteerOpportunityReference,
  })
  .passthrough();
const VolunteerApplicationRoleResponse = z
  .object({ id: z.string(), title: z.string() })
  .passthrough();
const VolunteerApplicationResponse = z
  .object({
    id: z.string(),
    opportunity: VolunteerApplicationOpportunity,
    role: VolunteerApplicationRoleResponse,
    availability: z.string(),
    relevantExperience: z.string(),
    supportingDocuments: z.array(
      z.object({ name: z.string(), key: z.string() }).passthrough()
    ),
    status: z.enum([
      "SUBMITTED",
      "UNDER_REVIEW",
      "APPROVED",
      "DECLINED",
      "CONFIRMED",
      "COMPLETED",
      "WITHDRAWN"]),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
const CreateVolunteerApplicationResponse = z
  .object({ ok: z.literal(true), application: VolunteerApplicationResponse })
  .passthrough();
const CreateVolunteerApplicationBatchRequest = z
  .object({
    availability: z.string(),
    relevantExperience: z.string(),
    supportingDocuments: z
      .array(
        z
          .object({
            name: z.string().min(1).max(255),
            key: z.string().min(1).max(600),
          })
          .passthrough()
      )
      .max(3)
      .optional()
      .default([]),
    topPickRoleId: z.string().uuid().nullish(),
    roleIds: z.array(z.string().uuid()).min(1).max(20),
  })
  .passthrough();
const CreateVolunteerApplicationBatchResponse = z
  .object({
    ok: z.literal(true),
    applications: z.array(VolunteerApplicationResponse),
  })
  .passthrough();
const PublicVolunteerOpportunityResponse = z
  .object({
    id: z.string(),
    category: VolunteerOpportunityReference,
    location: VolunteerOpportunityReference,
    title: z.string(),
    overview: z.string(),
    communityImpact: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    commitmentLabel: z.string().nullable(),
    commitmentDescription: z.string().nullable(),
    applicationDeadline: z.string(),
    applicationCount: z.number(),
    capacity: z.number(),
    filled: z.boolean(),
    totalView: z.number(),
    coverImageKey: z.string(),
    benefits: z.array(z.string()),
    status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED"]),
    publishedAt: z.string().nullable(),
    organizer: VolunteerOpportunityOrganizerResponse,
    createdAt: z.string(),
    updatedAt: z.string(),
    viewerSave: z.boolean(),
    viewerTopPicked: z.string().nullable(),
    viewerBlocked: z.boolean(),
    roles: z.array(VolunteerOpportunityRoleResponse),
  })
  .passthrough();
const GetPublicVolunteerOpportunityResponse = z
  .object({
    ok: z.literal(true),
    opportunity: PublicVolunteerOpportunityResponse,
  })
  .passthrough();
const ReportingTypeResponse = z
  .object({ id: z.string(), type: z.string() })
  .passthrough();
const GetReportingTypesResponse = z
  .object({ ok: z.boolean(), reportingTypes: z.array(ReportingTypeResponse) })
  .passthrough();
const CreateReportingRequest = z
  .object({
    questionId: z.string(),
    answerId: z.string(),
    typeId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    description: z.string().max(10000).optional(),
  })
  .passthrough();
const CreateReportingResponse = z
  .object({ ok: z.boolean(), reportingId: z.string().uuid() })
  .passthrough();
const LaunchpadCategoryResponse = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    iconKey: z.string(),
    displayOrder: z.number(),
    status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]),
    totalLaunchpad: z.number(),
    createdBy: z.string(),
    updatedBy: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
const GetLaunchpadCategoriesResponse = z
  .object({ ok: z.boolean(), categories: z.array(LaunchpadCategoryResponse) })
  .passthrough();
const PresignLaunchpadImageUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(5242880),
  })
  .passthrough();
const PresignLaunchpadLogoUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      .passthrough(),
    logoImageKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  .passthrough();
const PresignLaunchpadLogoUploadResponse = z
  .object({ ok: z.literal(true), upload: PresignLaunchpadLogoUploadResult })
  .passthrough();
const LaunchpadLogoValidationErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    issues: z.array(
      z.object({ path: z.string(), message: z.string() }).passthrough()
    ),
  })
  .passthrough();
const LaunchpadOperationErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const PresignLaunchpadCoverUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      .passthrough(),
    coverImageKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  .passthrough();
const PresignLaunchpadCoverUploadResponse = z
  .object({ ok: z.literal(true), upload: PresignLaunchpadCoverUploadResult })
  .passthrough();
const PresignLaunchpadDocumentUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(10485760),
  })
  .passthrough();
const PresignLaunchpadDocumentUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      .passthrough(),
    documentKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  .passthrough();
const PresignLaunchpadDocumentUploadResponse = z
  .object({ ok: z.literal(true), upload: PresignLaunchpadDocumentUploadResult })
  .passthrough();
const GetSavedLaunchpadsResponse = z
  .object({
    ok: z.literal(true),
    launchpads: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullable(),
          deadline: z.string().datetime({ offset: true }).nullable(),
          status: z.enum([
            "DRAFT",
            "LIVE",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELED"]),
          logoKey: z.string().nullable(),
          coverKey: z.string().nullable(),
          documentKeys: z.array(z.string()),
          documentNames: z.array(z.string()),
          phoneNumber: z.string().nullable(),
          email: z.string().nullable(),
          telegramUsername: z.string().nullable(),
          createdBy: z
            .object({
              id: z.string(),
              name: z.string(),
              avatarKey: z.string().nullable(),
              launchpadCount: z.number(),
            })
            .passthrough(),
          createdAt: z.string().datetime({ offset: true }),
          category: z
            .object({ id: z.string(), name: z.string() })
            .passthrough()
            .optional(),
          city: z
            .object({ id: z.string(), name: z.string() })
            .passthrough()
            .optional(),
          totalRoles: z.number(),
          totalView: z.number(),
          isSaved: z.literal(true),
          savedAt: z.string().datetime({ offset: true }),
        })
        .passthrough()
    ),
    nextCursor: z.string().nullable(),
  })
  .passthrough();
const SaveLaunchpadResponse = z.object({ ok: z.literal(true) }).passthrough();
const CreateLaunchpadRequest = z
  .object({
    name: z.string().min(1).max(120),
    description: z.string().nullish(),
    categoryId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    cityId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    deadline: z.string().datetime({ offset: true }),
    logoKey: z.string().min(1).max(255),
    coverKey: z.string().min(1).max(255),
    role: z
      .array(
        z
          .object({
            name: z.string().min(1).max(100),
            description: z.string().nullish(),
            capacity: z.number().int().gt(0).lte(1000).optional().default(1),
          })
          .passthrough()
      )
      .min(1),
    materialDocumentKey: z.array(z.string().min(1).max(255)).min(1).max(5),
    materialDocumentName: z.array(z.string().min(1).max(255)).min(1).max(5),
    phoneNumber: z.string(),
    email: z.string().max(255).email(),
    telegramUsername: z.string().nullish(),
  })
  .passthrough();
const CreateLaunchpadResponse = z
  .object({
    ok: z.literal(true),
    launchpad: z
      .object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        deadline: z.string().datetime({ offset: true }).nullable(),
        status: z.enum([
          "DRAFT",
          "LIVE",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELED"]),
        logoKey: z.string().nullable(),
        coverKey: z.string().nullable(),
        documentKeys: z.array(z.string()),
        documentNames: z.array(z.string()),
        phoneNumber: z.string().nullable(),
        email: z.string().nullable(),
        telegramUsername: z.string().nullable(),
        totalView: z.number(),
        createdBy: z
          .object({
            id: z.string(),
            name: z.string(),
            avatarKey: z.string().nullable(),
            launchpadCount: z.number(),
          })
          .passthrough(),
        createdAt: z.string().datetime({ offset: true }),
        category: z
          .object({ id: z.string(), name: z.string() })
          .passthrough()
          .optional(),
        city: z
          .object({ id: z.string(), name: z.string() })
          .passthrough()
          .optional(),
        roles: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              capacity: z.number(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
  })
  .passthrough();
const GetLaunchpadsResponse = z
  .object({
    ok: z.literal(true),
    launchpads: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullable(),
          deadline: z.string().datetime({ offset: true }).nullable(),
          status: z.enum([
            "DRAFT",
            "LIVE",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELED"]),
          logoKey: z.string().nullable(),
          coverKey: z.string().nullable(),
          documentKeys: z.array(z.string()),
          documentNames: z.array(z.string()),
          phoneNumber: z.string().nullable(),
          email: z.string().nullable(),
          telegramUsername: z.string().nullable(),
          createdBy: z
            .object({
              id: z.string(),
              name: z.string(),
              avatarKey: z.string().nullable(),
              launchpadCount: z.number(),
            })
            .passthrough(),
          createdAt: z.string().datetime({ offset: true }),
          category: z
            .object({ id: z.string(), name: z.string() })
            .passthrough()
            .optional(),
          city: z
            .object({ id: z.string(), name: z.string() })
            .passthrough()
            .optional(),
          totalRoles: z.number(),
          totalView: z.number(),
          isSaved: z.boolean(),
        })
        .passthrough()
    ),
    nextCursor: z.string().nullable(),
  })
  .passthrough();
const UpdateLaunchpadRoleRequest = z
  .object({
    id: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      )
      .optional(),
    name: z.string().min(1).max(100),
    description: z.string().nullish(),
    capacity: z.number().int().gt(0).lte(1000).optional().default(1),
  })
  .passthrough();
const UpdateLaunchpadRequest = z
  .object({
    name: z.string(),
    description: z.string().nullable(),
    categoryId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    cityId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    deadline: z.string().datetime({ offset: true }),
    logoKey: z.string().min(1).max(255),
    coverKey: z.string().min(1).max(255),
    role: z.array(UpdateLaunchpadRoleRequest).min(1),
    materialDocumentKey: z.array(z.string().min(1).max(255)).min(1).max(5),
    materialDocumentName: z.array(z.string().min(1).max(255)).min(1).max(5),
    phoneNumber: z.string(),
    email: z.string().max(255).email(),
    telegramUsername: z.string().nullable(),
  })
  .partial();
const GetLaunchpadByIdResponse = z
  .object({
    ok: z.literal(true),
    launchpad: z
      .object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        deadline: z.string().datetime({ offset: true }).nullable(),
        status: z.enum([
          "DRAFT",
          "LIVE",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELED"]),
        logoKey: z.string().nullable(),
        coverKey: z.string().nullable(),
        documentKeys: z.array(z.string()),
        documentNames: z.array(z.string()),
        phoneNumber: z.string().nullable(),
        email: z.string().nullable(),
        telegramUsername: z.string().nullable(),
        createdBy: z
          .object({
            id: z.string(),
            name: z.string(),
            avatarKey: z.string().nullable(),
            launchpadCount: z.number(),
          })
          .passthrough(),
        createdAt: z.string().datetime({ offset: true }),
        category: z
          .object({ id: z.string(), name: z.string() })
          .passthrough()
          .optional(),
        city: z
          .object({ id: z.string(), name: z.string() })
          .passthrough()
          .optional(),
        roles: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              capacity: z.number(),
            })
            .passthrough()
        ),
        viewerBlocked: z.boolean(),
        totalView: z.number(),
      })
      .passthrough(),
  })
  .passthrough();
const PresignLaunchpadApplicationDocumentUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(10485760),
  })
  .passthrough();
const PresignLaunchpadApplicationDocumentUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      .passthrough(),
    documentKey: z.string(),
    expiresInSeconds: z.number(),
  })
  .passthrough();
const PresignLaunchpadApplicationDocumentUploadResponse = z
  .object({
    ok: z.literal(true),
    upload: PresignLaunchpadApplicationDocumentUploadResult,
  })
  .passthrough();
const LaunchpadApplicationValidationErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    issues: z.array(
      z.object({ path: z.string(), message: z.string() }).passthrough()
    ),
  })
  .passthrough();
const LaunchpadApplicationOperationErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const CreateLaunchpadApplicationRequest = z
  .object({
    motivation: z.string().min(5).max(2000),
    portfolio: z.string().max(255).url().optional(),
    documentKeys: z.array(z.string().min(1).max(500)).max(5).optional(),
    documentNames: z.array(z.string().min(1).max(255)).max(5).optional(),
    topPickRoleId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      )
      .nullish(),
    launchpadRoleId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    relevantExperience: z.string().min(1).max(5000).optional().default(""),
  })
  .passthrough();
const LaunchpadApplicationLog = z
  .object({
    id: z.string(),
    status: z.enum([
      "SUBMITTED",
      "UNDER_REVIEW",
      "APPROVED",
      "DECLINED",
      "CONFIRMED",
      "COMPLETED",
      "WITHDRAWN"]),
    declinedBy: z.enum(["POSTER", "APPLICANT", "SYSTEM"]).nullable(),
    createdBy: z.string(),
    createdAt: z.string(),
  })
  .passthrough();
const LaunchpadApplication = z
  .object({
    id: z.string(),
    launchpadId: z.string(),
    launchpadRoleId: z.string(),
    motivation: z.string(),
    relevantExperience: z.string(),
    portfolio: z.string().nullable(),
    topPick: z.boolean(),
    status: z.enum([
      "SUBMITTED",
      "UNDER_REVIEW",
      "APPROVED",
      "DECLINED",
      "CONFIRMED",
      "COMPLETED",
      "WITHDRAWN"]),
    documentKeys: z.array(z.string()),
    documentNames: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
    logs: z.array(LaunchpadApplicationLog),
  })
  .passthrough();
const CreateLaunchpadApplicationResponse = z
  .object({ ok: z.literal(true), application: LaunchpadApplication })
  .passthrough();
const CreateLaunchpadApplicationBatchRequest = z
  .object({
    motivation: z.string().min(5).max(2000),
    portfolio: z.string().max(255).url().optional(),
    documentKeys: z.array(z.string().min(1).max(500)).max(5).optional(),
    documentNames: z.array(z.string().min(1).max(255)).max(5).optional(),
    topPickRoleId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      )
      .nullish(),
    relevantExperience: z.string().min(1).max(5000),
    launchpadRoleIds: z
      .array(
        z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
      )
      .min(1)
      .max(20),
  })
  .passthrough();
const CreateLaunchpadApplicationBatchResponse = z
  .object({ ok: z.literal(true), applications: z.array(LaunchpadApplication) })
  .passthrough();
const LaunchpadApplicationBatchErrorResponse = z.union([
  LaunchpadApplicationValidationErrorResponse,
  LaunchpadApplicationOperationErrorResponse,
]);
const GetLaunchpadApplicationResponse = z
  .object({ ok: z.literal(true), application: LaunchpadApplication })
  .passthrough();
const MyApplicationStatusGroup = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "DECLINED",
  "CONFIRMED",
  "COMPLETED",
  "WITHDRAWN"]);
const MyApplicationReference = z
  .object({ id: z.string(), name: z.string() })
  .passthrough();
const MyApplicationTimeline = z
  .object({
    submitted: z.string().nullable(),
    underReview: z.string().nullable(),
    approved: z.string().nullable(),
    declined: z
      .object({
        at: z.string().nullable(),
        by: z.enum(["POSTER", "APPLICANT", "SYSTEM"]).nullable(),
      })
      .passthrough(),
    confirmed: z.string().nullable(),
    completed: z.string().nullable(),
    withdrawn: z.string().nullable(),
  })
  .passthrough();
const MyApplicationRole = z
  .object({
    applicationId: z.string(),
    roleId: z.string(),
    title: z.string(),
    status: MyApplicationStatusGroup,
    appliedAt: z.string(),
    timeline: MyApplicationTimeline,
  })
  .passthrough();
const MyApplicationItem = z
  .object({
    opportunityId: z.string(),
    opportunityTitle: z.string(),
    sourceType: z.enum(["VOLUNTEER", "PROJECT"]),
    imageKey: z.string().nullable(),
    appliedAt: z.string(),
    deadline: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    status: MyApplicationStatusGroup,
    needAttention: z.boolean(),
    totalRoleApplied: z.number().int().gte(0),
    canArchive: z.boolean(),
    filled: z.boolean(),
    archivedAt: z.string().nullable(),
    category: MyApplicationReference.nullable(),
    location: MyApplicationReference.nullable(),
    roles: z.array(MyApplicationRole),
    approvedRole: MyApplicationRole.and(z.unknown()),
  })
  .passthrough();
const MyApplicationsSummary = z
  .object({
    PENDING: z.number().int().gte(0),
    APPROVED: z.number().int().gte(0),
    DECLINED: z.number().int().gte(0),
    ACTIVE: z.number().int().gte(0),
    COMPLETED: z.number().int().gte(0),
    WITHDRAWN: z.number().int().gte(0),
    ARCHIVED: z.number().int().gte(0),
  })
  .passthrough();
const MyApplicationsResponse = z
  .object({
    ok: z.literal(true),
    applications: z.array(MyApplicationItem).nullable(),
    summary: MyApplicationsSummary,
  })
  .passthrough();
const MyApplicationsErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const MyApplicationRoleDetail = z
  .object({
    applicationId: z.string(),
    roleId: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    responsibilities: z.array(z.string()),
    requirements: z.array(z.string()),
    status: MyApplicationStatusGroup,
    appliedAt: z.string(),
    archived: z.boolean(),
    archivedAt: z.string().nullable(),
    actions: z
      .object({
        canConfirm: z.boolean(),
        canDecline: z.boolean(),
        canWithdraw: z.boolean(),
      })
      .passthrough(),
    timeline: MyApplicationTimeline,
  })
  .passthrough();
const MyApplicationDetail = z
  .object({
    id: z.string(),
    sourceType: z.enum(["VOLUNTEER", "PROJECT"]),
    title: z.string(),
    imageKey: z.string().nullable(),
    status: MyApplicationStatusGroup,
    appliedAt: z.string(),
    deadline: z.string().nullable(),
    archived: z.boolean(),
    archivedAt: z.string().nullable(),
    needAttention: z.boolean(),
    totalRoleApplied: z.number().int().gte(0),
    canArchive: z.boolean(),
    opportunity: z
      .object({
        id: z.string(),
        title: z.string(),
        overview: z.string().nullable(),
        category: MyApplicationReference.nullable(),
        location: MyApplicationReference.nullable(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        commitmentLabel: z.string().nullable(),
        commitmentDescription: z.string().nullable(),
        filled: z.boolean(),
        impactRewardPoints: z.number().int().gte(0).nullable(),
      })
      .passthrough(),
    owner: z
      .object({
        id: z.string(),
        name: z.string(),
        avatarUrl: z.string().nullable(),
        avatarKey: z.string().nullable(),
        postedCount: z.number().int().gte(0),
        contact: z
          .object({
            email: z.string(),
            phoneNumber: z.string().nullable(),
            telegramUsername: z.string().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    roles: z.array(MyApplicationRoleDetail),
    approvedRole: MyApplicationRole.and(z.unknown()),
  })
  .passthrough();
const MyApplicationDetailResponse = z
  .object({ ok: z.literal(true), application: MyApplicationDetail })
  .passthrough();
const MyApplicationStatusActionResponse = z
  .object({ ok: z.literal(true), application: MyApplicationItem })
  .passthrough();
const MyApplicationArchiveActionResponse = z
  .object({
    ok: z.literal(true),
    application: MyApplicationItem.and(
      z.object({ archived: z.boolean() }).passthrough()
    ),
  })
  .passthrough();
const ProfileResponse = z
  .object({
    ok: z.literal(true),
    profile: z
      .object({
        user: z
          .object({
            id: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            displayName: z.string().nullable(),
            email: z.string(),
            gender: z.enum(["male", "female", "other"]),
            dateOfBirth: z.string().nullable(),
            occupation: z.string().nullable(),
            phone: z
              .object({ country: z.string(), nationalNumber: z.string() })
              .passthrough()
              .nullable(),
            telegramUsername: z.string().nullable(),
          })
          .passthrough(),
        profile: z
          .object({
            avatarKey: z.string().nullable(),
            avatarUrl: z.string().nullable(),
            bio: z.string().nullable(),
            country: z
              .object({
                id: z.string(),
                name: z.string(),
                iso2: z.string().nullable(),
              })
              .passthrough()
              .nullable(),
            city: z
              .object({ id: z.string(), name: z.string() })
              .passthrough()
              .nullable(),
            visibility: z
              .object({
                profile: z.enum(["public", "members", "private"]),
                contact: z.enum(["public", "members", "private"]),
                socialLinks: z.enum(["public", "members", "private"]),
                contributions: z.enum(["public", "members", "private"]),
              })
              .passthrough(),
          })
          .passthrough(),
        skills: z.array(
          z.object({ id: z.string(), name: z.string() }).passthrough()
        ),
        socialLinks: z
          .object({
            website: z.string().nullable(),
            linkedin: z.string().nullable(),
            twitter: z.string().nullable(),
            facebook: z.string().nullable(),
          })
          .passthrough(),
        progress: z
          .object({
            totalPoints: z.number(),
            rank: z.number().nullable(),
            tier: z
              .object({
                id: z.string(),
                slug: z.string(),
                name: z.string(),
                rankOrder: z.number(),
                minPoints: z.number(),
              })
              .passthrough()
              .nullable(),
            nextTier: z
              .object({
                id: z.string(),
                slug: z.string(),
                name: z.string(),
                rankOrder: z.number(),
                minPoints: z.number(),
              })
              .passthrough()
              .nullable(),
            pointsUntilNextTier: z.number(),
          })
          .passthrough(),
        badges: z.array(
          z
            .object({
              slug: z.string(),
              name: z.string(),
              description: z.string(),
              category: z.enum([
                "ONBOARDING",
                "COLLABORATION",
                "KNOWLEDGE",
                "VOLUNTEER",
                "LAUNCHPAD"]),
              awardedAt: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
  })
  .passthrough();
const ProfileErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    issues: z.array(z.string()).optional(),
  })
  .passthrough();
const UpdateProfileRequest = z
  .object({
    firstName: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u),
    lastName: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.union([z.string(), z.unknown()]),
    occupation: z.union([z.string(), z.unknown()]),
    phone: z.union([
      z.object({
        country: z.string().min(2).max(2),
        nationalNumber: z.string().min(1),
      }),
      z.unknown(),
    ]),
    telegramUsername: z.union([z.string(), z.unknown()]),
    bio: z.union([z.string(), z.unknown()]),
    countryId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    cityId: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    avatarKey: z.union([z.string(), z.unknown()]),
    skills: z.array(z.string()).max(20),
    socialLinks: z
      .object({
        website: z.union([z.string(), z.string(), z.unknown()]),
        linkedin: z.union([z.string(), z.string(), z.unknown()]),
        twitter: z.union([z.string(), z.string(), z.unknown()]),
        facebook: z.union([z.string(), z.string(), z.unknown()]),
      })
      .partial(),
    visibility: z
      .object({
        profile: z.enum(["public", "members", "private"]),
        contact: z.enum(["public", "members", "private"]),
        socialLinks: z.enum(["public", "members", "private"]),
        contributions: z.enum(["public", "members", "private"]),
      })
      .partial(),
  })
  .partial();
const UpdateProfileResponse = z
  .object({
    ok: z.literal(true),
    profile: z
      .object({
        user: z
          .object({
            id: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            displayName: z.string().nullable(),
            email: z.string(),
            gender: z.enum(["male", "female", "other"]),
            dateOfBirth: z.string().nullable(),
            occupation: z.string().nullable(),
            phone: z
              .object({ country: z.string(), nationalNumber: z.string() })
              .passthrough()
              .nullable(),
            telegramUsername: z.string().nullable(),
          })
          .passthrough(),
        profile: z
          .object({
            avatarKey: z.string().nullable(),
            avatarUrl: z.string().nullable(),
            bio: z.string().nullable(),
            country: z
              .object({
                id: z.string(),
                name: z.string(),
                iso2: z.string().nullable(),
              })
              .passthrough()
              .nullable(),
            city: z
              .object({ id: z.string(), name: z.string() })
              .passthrough()
              .nullable(),
            visibility: z
              .object({
                profile: z.enum(["public", "members", "private"]),
                contact: z.enum(["public", "members", "private"]),
                socialLinks: z.enum(["public", "members", "private"]),
                contributions: z.enum(["public", "members", "private"]),
              })
              .passthrough(),
          })
          .passthrough(),
        skills: z.array(
          z.object({ id: z.string(), name: z.string() }).passthrough()
        ),
        socialLinks: z
          .object({
            website: z.string().nullable(),
            linkedin: z.string().nullable(),
            twitter: z.string().nullable(),
            facebook: z.string().nullable(),
          })
          .passthrough(),
        progress: z
          .object({
            totalPoints: z.number(),
            rank: z.number().nullable(),
            tier: z
              .object({
                id: z.string(),
                slug: z.string(),
                name: z.string(),
                rankOrder: z.number(),
                minPoints: z.number(),
              })
              .passthrough()
              .nullable(),
            nextTier: z
              .object({
                id: z.string(),
                slug: z.string(),
                name: z.string(),
                rankOrder: z.number(),
                minPoints: z.number(),
              })
              .passthrough()
              .nullable(),
            pointsUntilNextTier: z.number(),
          })
          .passthrough(),
        badges: z.array(
          z
            .object({
              slug: z.string(),
              name: z.string(),
              description: z.string(),
              category: z.enum([
                "ONBOARDING",
                "COLLABORATION",
                "KNOWLEDGE",
                "VOLUNTEER",
                "LAUNCHPAD"]),
              awardedAt: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
  })
  .passthrough();
const RecentActivity = z
  .object({
    id: z.string(),
    userId: z.string(),
    type: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    targetType: z.string(),
    targetId: z.string(),
    referenceType: z.string(),
    referenceId: z.string(),
    data: z.record(z.string(), z.unknown().nullable()),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
const GetRecentActivitiesResponse = z
  .object({ ok: z.literal(true), activities: z.array(RecentActivity) })
  .passthrough();
const RecentActivityErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const GetSavedItemsResponse = z
  .object({
    ok: z.literal(true),
    items: z.array(
      z.union([
        z
          .object({
            type: z.literal("project"),
            savedAt: z.string().datetime({ offset: true }),
            item: z
              .object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                deadline: z.string().datetime({ offset: true }).nullable(),
                status: z.enum([
                  "DRAFT",
                  "LIVE",
                  "IN_PROGRESS",
                  "COMPLETED",
                  "CANCELED"]),
                logoKey: z.string().nullable(),
                coverKey: z.string().nullable(),
                documentKeys: z.array(z.string()),
                documentNames: z.array(z.string()),
                phoneNumber: z.string().nullable(),
                email: z.string().nullable(),
                telegramUsername: z.string().nullable(),
                createdBy: z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    avatarKey: z.string().nullable(),
                    launchpadCount: z.number(),
                  })
                  .passthrough(),
                createdAt: z.string().datetime({ offset: true }),
                category: z
                  .object({ id: z.string(), name: z.string() })
                  .passthrough()
                  .optional(),
                city: z
                  .object({ id: z.string(), name: z.string() })
                  .passthrough()
                  .optional(),
                totalRoles: z.number(),
                totalView: z.number(),
                isSaved: z.literal(true),
                savedAt: z.string().datetime({ offset: true }),
              })
              .passthrough(),
          })
          .passthrough(),
        z
          .object({
            type: z.literal("volunteer"),
            savedAt: z.string().datetime({ offset: true }),
            item: VolunteerOpportunityListItemResponse,
          })
          .passthrough(),
        z
          .object({
            type: z.literal("forum"),
            savedAt: z.string().datetime({ offset: true }),
            item: QuestionResponse,
          })
          .passthrough(),
      ])
    ),
    pagination: z
      .object({
        limit: z.number(),
        hasMore: z.boolean(),
        nextCursor: z.string().nullable(),
        total: z.number().int().gte(0),
      })
      .passthrough(),
    counts: z
      .object({
        all: z.number().int().gte(0),
        project: z.number().int().gte(0),
        volunteer: z.number().int().gte(0),
        forum: z.number().int().gte(0),
      })
      .passthrough(),
  })
  .passthrough();
const SavedItemsErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const PublicProfileResponse = z
  .object({
    ok: z.literal(true),
    profile: z
      .object({
        user: z
          .object({
            id: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            displayName: z.string().nullable(),
            occupation: z.string().nullable(),
            email: z.string().nullable(),
            phone: z
              .object({ country: z.string(), nationalNumber: z.string() })
              .passthrough()
              .nullable(),
            telegramUsername: z.string().nullable(),
          })
          .passthrough(),
        profile: z
          .object({
            avatarKey: z.string().nullable(),
            avatarUrl: z.string().nullable(),
            bio: z.string().nullable(),
            country: z
              .object({
                id: z.string(),
                name: z.string(),
                iso2: z.string().nullable(),
              })
              .passthrough()
              .nullable(),
            city: z
              .object({ id: z.string(), name: z.string() })
              .passthrough()
              .nullable(),
          })
          .passthrough(),
        skills: z.array(
          z.object({ id: z.string(), name: z.string() }).passthrough()
        ),
        socialLinks: z
          .object({
            website: z.string().nullable(),
            linkedin: z.string().nullable(),
            twitter: z.string().nullable(),
            facebook: z.string().nullable(),
          })
          .passthrough(),
        tier: z
          .object({
            id: z.string(),
            slug: z.string(),
            name: z.string(),
            rankOrder: z.number(),
            minPoints: z.number(),
          })
          .passthrough()
          .nullable(),
        postedCounts: z
          .object({
            forum: z.number().int().gte(0),
            volunteer: z.number().int().gte(0),
            project: z.number().int().gte(0),
          })
          .passthrough()
          .nullable(),
      })
      .passthrough(),
  })
  .passthrough();
const GetMyPostedResponse = z.union([
  z
    .object({
      ok: z.literal(true),
      sourceType: z.literal("forum"),
      questions: z.array(QuestionResponse),
      pagination: z
        .object({
          limit: z.number(),
          hasMore: z.boolean(),
          nextCursor: z.string().nullable(),
          total: z.number().int().gte(0),
        })
        .passthrough(),
    })
    .passthrough(),
  z
    .object({
      ok: z.literal(true),
      sourceType: z.literal("volunteer"),
      opportunities: z.array(VolunteerOpportunityListItemResponse),
      pagination: VolunteerOpportunitiesPaginationResponse,
    })
    .passthrough(),
  z
    .object({
      ok: z.literal(true),
      sourceType: z.literal("project"),
      launchpads: z.array(
        z
          .object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            deadline: z.string().datetime({ offset: true }).nullable(),
            status: z.enum([
              "DRAFT",
              "LIVE",
              "IN_PROGRESS",
              "COMPLETED",
              "CANCELED"]),
            logoKey: z.string().nullable(),
            coverKey: z.string().nullable(),
            documentKeys: z.array(z.string()),
            documentNames: z.array(z.string()),
            phoneNumber: z.string().nullable(),
            email: z.string().nullable(),
            telegramUsername: z.string().nullable(),
            createdBy: z
              .object({
                id: z.string(),
                name: z.string(),
                avatarKey: z.string().nullable(),
                launchpadCount: z.number(),
              })
              .passthrough(),
            createdAt: z.string().datetime({ offset: true }),
            category: z
              .object({ id: z.string(), name: z.string() })
              .passthrough()
              .optional(),
            city: z
              .object({ id: z.string(), name: z.string() })
              .passthrough()
              .optional(),
            totalRoles: z.number(),
            totalView: z.number(),
            isSaved: z.boolean(),
          })
          .passthrough()
      ),
      nextCursor: z.string().nullable(),
    })
    .passthrough(),
]);
const MyPostedErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const ManagePostingStatus = z.enum([
  "DRAFT",
  "LIVE",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
  "DELETED"]);
const ManagePostingItem = z
  .object({
    id: z.string(),
    sourceType: z.enum(["VOLUNTEER", "PROJECT"]),
    title: z.string(),
    description: z.string().nullable(),
    imageKey: z.string().nullable(),
    status: ManagePostingStatus,
    filled: z.boolean(),
    roleCount: z.number().int().gte(0),
    applicantCount: z.number().int().gte(0),
    confirmedCount: z.number().int().gte(0),
    capacity: z.number().int().gte(0),
    views: z.number().int().gte(0),
    deadline: z.string().nullable(),
    isEditable: z.boolean(),
    createdAt: z.string(),
  })
  .passthrough();
const ManagePostingsPagination = z
  .object({
    page: z.number().int().gt(0),
    limit: z.number().int().gt(0),
    total: z.number().int().gte(0),
    totalPages: z.number().int().gte(0),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  })
  .passthrough();
const ManagePostingsResponse = z
  .object({
    ok: z.literal(true),
    postings: z.array(ManagePostingItem),
    pagination: ManagePostingsPagination,
  })
  .passthrough();
const ManagePostingsErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  .passthrough();
const ManagePostingApplicantStatus = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "DECLINED",
  "CONFIRMED",
  "COMPLETED",
  "WITHDRAWN"]);
const ManagePostingApplicationRole = z
  .object({
    applicationId: z.string(),
    roleId: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    status: ManagePostingApplicantStatus,
    appliedAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
const ManagePostingSubmission = z
  .object({
    submissionKey: z.string(),
    roles: z.array(ManagePostingApplicationRole),
    topPick: z.string().nullable(),
    appliedAt: z.string(),
    updatedAt: z.string(),
    volunteer: z
      .object({
        availability: z.string(),
        relevantExperience: z.string(),
        supportingDocuments: z.array(
          z.object({ name: z.string(), key: z.string() }).passthrough()
        ),
      })
      .passthrough()
      .nullable(),
    project: z
      .object({
        motivation: z.string(),
        portfolio: z.string(),
        documentKeys: z.array(z.string()),
        documentNames: z.array(z.string()),
      })
      .passthrough()
      .nullable(),
  })
  .passthrough();
const ManagePostingApplicantPrivateNote = z
  .object({
    id: z.string(),
    note: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();
const ManagePostingApplicant = z
  .object({
    candidate: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phoneNumber: z.string().nullable(),
        telegramUsername: z.string().nullable(),
        avatarUrl: z.string().nullable(),
        avatarKey: z.string().nullable(),
      })
      .passthrough(),
    submissions: z.array(ManagePostingSubmission),
    submissionCount: z.number().int().gte(0),
    totalRoleApplied: z.number().int().gte(0),
    overallStatus: ManagePostingApplicantStatus,
    lastAppliedAt: z.string(),
    updatedAt: z.string(),
    contact: z
      .object({
        email: z.string(),
        phoneNumber: z.string().nullable(),
        telegramUsername: z.string().nullable(),
      })
      .passthrough(),
    privateNote: ManagePostingApplicantPrivateNote.nullable(),
  })
  .passthrough();
const ManagePostingCandidateDetailResponse = z
  .object({ ok: z.literal(true), applicant: ManagePostingApplicant })
  .passthrough();
const UpsertManagePostingCandidateNoteRequest = z
  .object({ note: z.string().max(5000) })
  .passthrough();
const UpsertManagePostingCandidateNoteResponse = z
  .object({ ok: z.literal(true), applicant: ManagePostingApplicant })
  .passthrough();
const UpdateManagePostingActionResponse = z
  .object({ ok: z.literal(true), posting: ManagePostingItem })
  .passthrough();
const ExtendManagePostingDeadlineRequest = z
  .object({ deadline: z.string().datetime({ offset: true }) })
  .passthrough();
const ExtendManagePostingDeadlineResponse = z
  .object({ ok: z.literal(true), posting: ManagePostingItem })
  .passthrough();
const ManagePostingApplicationActionResponse = z
  .object({ ok: z.literal(true), applicant: ManagePostingApplicant })
  .passthrough();
const ManagePostingDetail = z
  .object({
    posting: ManagePostingItem,
    stats: z
      .object({
        pending: z.number().int().gte(0),
        totalApplicants: z.number().int().gte(0),
        recruited: z.number().int().gte(0),
        capacity: z.number().int().gte(0),
        statuses: z
          .object({
            SUBMITTED: z.number().int().gte(0),
            UNDER_REVIEW: z.number().int().gte(0),
            APPROVED: z.number().int().gte(0),
            DECLINED: z.number().int().gte(0),
            CONFIRMED: z.number().int().gte(0),
            COMPLETED: z.number().int().gte(0),
            WITHDRAWN: z.number().int().gte(0),
          })
          .passthrough(),
        filterCounts: z
          .object({
            all: z.number().int().gte(0),
            new: z.number().int().gte(0),
            in_review: z.number().int().gte(0),
            approved: z.number().int().gte(0),
            confirmed: z.number().int().gte(0),
            declined: z.number().int().gte(0),
          })
          .passthrough(),
      })
      .passthrough(),
    applicants: z.array(ManagePostingApplicant),
    pagination: z
      .object({
        page: z.number().int().gt(0),
        limit: z.number().int().gt(0),
        total: z.number().int().gte(0),
        totalPages: z.number().int().gte(0),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean(),
      })
      .passthrough(),
  })
  .passthrough();
const ManagePostingDetailResponse = z
  .object({ ok: z.literal(true), detail: ManagePostingDetail })
  .passthrough();
const postV1notificationstokens_Body = z
  .object({
    token: z.string().min(1),
    platform: z.enum(["web", "android", "ios"]).optional().default("web"),
  })
  .passthrough();
const postV1notificationssenduser_Body = z
  .object({
    userId: z.string().uuid(),
    title: z.string().min(1),
    body: z.string().min(1),
    data: z.record(z.string(), z.string()).optional(),
    imageUrl: z.string().optional(),
    type: z
      .enum([
        "forum",
        "profile_view",
        "new_message",
        "achievement",
        "event_reminder",
        "application",
        "launchpad_update",
        "points",
        "system",
      ])
      .optional()
      .default("system"),
    archived: z.boolean().optional(),
    webRoute: z.string().optional(),
    mobileRoute: z.string().optional(),
  })
  .passthrough();
const postV1notificationsbroadcast_Body = z
  .object({
    title: z.string().min(1),
    body: z.string().min(1),
    data: z.record(z.string(), z.string()).optional(),
    imageUrl: z.string().optional(),
    type: z
      .enum([
        "forum",
        "profile_view",
        "new_message",
        "achievement",
        "event_reminder",
        "application",
        "launchpad_update",
        "points",
        "system",
      ])
      .optional()
      .default("system"),
    archived: z.boolean().optional(),
    webRoute: z.string().optional(),
    mobileRoute: z.string().optional(),
  })
  .passthrough();
const patchV1notificationsread_Body = z
  .object({ notificationIds: z.array(z.string().uuid()).min(1) })
  .passthrough();

export const schemas = {
  AuthRegisterRequest,
  AuthUserProfile,
  AuthUser,
  RegisterSuccessResponse,
  AuthCompleteSignUpRequest,
  AuthAccessState,
  AuthRequiredAction,
  AuthFlow,
  CompleteSignUpResponse,
  AuthSessionResponse,
  AuthProtectedErrorResponse,
  AuthGoogleRequest,
  AuthTokenResponse,
  AuthVerifyRegisterOtpRequest,
  AuthResendRegisterOtpRequest,
  ResendRegisterOtpResponse,
  AuthSimpleErrorResponse,
  AuthLoginRequest,
  AuthRefreshRequest,
  RefreshSuccessResponse,
  AuthForgotPasswordRequest,
  ForgotPasswordResponse,
  AuthResetPasswordRequest,
  ResetPasswordResponse,
  AdminLoginRequest,
  AdminUser,
  AdminLoginResponse,
  AdminErrorResponse,
  AdminRefreshRequest,
  AdminRefreshResponse,
  AdminLogoutResponse,
  ContentModeratorReportType,
  ContentModeratorReportReporter,
  ContentModeratorReport,
  CursorPagination,
  ListContentModeratorReportsResponse,
  UpdateContentModeratorReportReviewRequest,
  UpdateContentModeratorReportReviewResponse,
  OnboardingOkResponse,
  OnboardingErrorResponse,
  OnboardingProfileStepRequest,
  OnboardingInterestsStepRequest,
  OnboardingContributionsStepRequest,
  PresignAvatarUploadRequest,
  PresignAvatarUploadResult,
  PresignAvatarUploadResponse,
  CategoryResponse,
  CategoryWithQuestionCountResponse,
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  isUnanswered,
  QuestionTagResponse,
  QuestionResponse,
  GetQuestionsResponse,
  CreateQuestionRequest,
  CreateQuestionResponse,
  TrendingTagResponse,
  GetTrendingTagsResponse,
  GetMyQuestionsResponse,
  GetSavedQuestionsResponse,
  GetQuestionResponse,
  PresignForumQuestionImageUploadRequest,
  PresignForumQuestionImageUploadResult,
  PresignForumQuestionImageUploadResponse,
  EditQuestionRequest,
  VoteQuestionRequest,
  SaveQuestionResponse,
  RepliedAnswerResponse,
  AnswerResponse,
  GetAnswersResponse,
  AnswerQuestionResponse,
  MyAnswerResponse,
  GetMyAnswersResponse,
  CreateAnswerRequest,
  CreateAnswerResponse,
  UpdateAnswerRequest,
  EditAnswerResponse,
  AnswerErrorResponse,
  DeleteAnswerResponse,
  VoteAnswerRequest,
  VoteAnswerResponse,
  MarkBestAnswerResponse,
  VolunteerCategoryResponse,
  VolunteerCategoryWithOpportunityCountResponse,
  GetVolunteerCategoriesResponse,
  VolunteerOperationErrorResponse,
  CreateVolunteerCategoryRequest,
  CreateVolunteerCategoryResponse,
  VolunteerCategoryValidationErrorResponse,
  VolunteerLocationResponse,
  GetVolunteerLocationsResponse,
  PresignVolunteerOpportunityCoverUploadRequest,
  PresignVolunteerOpportunityCoverUploadResult,
  PresignVolunteerOpportunityCoverUploadResponse,
  PresignVolunteerApplicationDocumentUploadRequest,
  PresignVolunteerApplicationDocumentUploadResult,
  PresignVolunteerApplicationDocumentUploadResponse,
  VolunteerOpportunityReference,
  VolunteerOpportunityListItemResponse,
  VolunteerOpportunitiesPaginationResponse,
  GetVolunteerOpportunitiesResponse,
  VolunteerOpportunityContact,
  VolunteerOpportunityRoleRequest,
  CreateVolunteerOpportunityPayload,
  CreateVolunteerOpportunityRequest,
  VolunteerOpportunityContactResponse,
  VolunteerOpportunityOrganizerResponse,
  VolunteerOpportunityRoleResponse,
  VolunteerOpportunityResponse,
  CreateVolunteerOpportunityResponse,
  GetVolunteerOpportunityResponse,
  UpdateVolunteerOpportunityContactRequest,
  UpdateVolunteerOpportunityRoleRequest,
  UpdateVolunteerOpportunityRequest,
  SaveVolunteerOpportunityResponse,
  CreateVolunteerApplicationRequest,
  VolunteerApplicationOpportunity,
  VolunteerApplicationRoleResponse,
  VolunteerApplicationResponse,
  CreateVolunteerApplicationResponse,
  CreateVolunteerApplicationBatchRequest,
  CreateVolunteerApplicationBatchResponse,
  PublicVolunteerOpportunityResponse,
  GetPublicVolunteerOpportunityResponse,
  ReportingTypeResponse,
  GetReportingTypesResponse,
  CreateReportingRequest,
  CreateReportingResponse,
  LaunchpadCategoryResponse,
  GetLaunchpadCategoriesResponse,
  PresignLaunchpadImageUploadRequest,
  PresignLaunchpadLogoUploadResult,
  PresignLaunchpadLogoUploadResponse,
  LaunchpadLogoValidationErrorResponse,
  LaunchpadOperationErrorResponse,
  PresignLaunchpadCoverUploadResult,
  PresignLaunchpadCoverUploadResponse,
  PresignLaunchpadDocumentUploadRequest,
  PresignLaunchpadDocumentUploadResult,
  PresignLaunchpadDocumentUploadResponse,
  GetSavedLaunchpadsResponse,
  SaveLaunchpadResponse,
  CreateLaunchpadRequest,
  CreateLaunchpadResponse,
  GetLaunchpadsResponse,
  UpdateLaunchpadRoleRequest,
  UpdateLaunchpadRequest,
  GetLaunchpadByIdResponse,
  PresignLaunchpadApplicationDocumentUploadRequest,
  PresignLaunchpadApplicationDocumentUploadResult,
  PresignLaunchpadApplicationDocumentUploadResponse,
  LaunchpadApplicationValidationErrorResponse,
  LaunchpadApplicationOperationErrorResponse,
  CreateLaunchpadApplicationRequest,
  LaunchpadApplicationLog,
  LaunchpadApplication,
  CreateLaunchpadApplicationResponse,
  CreateLaunchpadApplicationBatchRequest,
  CreateLaunchpadApplicationBatchResponse,
  LaunchpadApplicationBatchErrorResponse,
  GetLaunchpadApplicationResponse,
  MyApplicationStatusGroup,
  MyApplicationReference,
  MyApplicationTimeline,
  MyApplicationRole,
  MyApplicationItem,
  MyApplicationsSummary,
  MyApplicationsResponse,
  MyApplicationsErrorResponse,
  MyApplicationRoleDetail,
  MyApplicationDetail,
  MyApplicationDetailResponse,
  MyApplicationStatusActionResponse,
  MyApplicationArchiveActionResponse,
  ProfileResponse,
  ProfileErrorResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  RecentActivity,
  GetRecentActivitiesResponse,
  RecentActivityErrorResponse,
  GetSavedItemsResponse,
  SavedItemsErrorResponse,
  PublicProfileResponse,
  GetMyPostedResponse,
  MyPostedErrorResponse,
  ManagePostingStatus,
  ManagePostingItem,
  ManagePostingsPagination,
  ManagePostingsResponse,
  ManagePostingsErrorResponse,
  ManagePostingApplicantStatus,
  ManagePostingApplicationRole,
  ManagePostingSubmission,
  ManagePostingApplicantPrivateNote,
  ManagePostingApplicant,
  ManagePostingCandidateDetailResponse,
  UpsertManagePostingCandidateNoteRequest,
  UpsertManagePostingCandidateNoteResponse,
  UpdateManagePostingActionResponse,
  ExtendManagePostingDeadlineRequest,
  ExtendManagePostingDeadlineResponse,
  ManagePostingApplicationActionResponse,
  ManagePostingDetail,
  ManagePostingDetailResponse,
  postV1notificationstokens_Body,
  postV1notificationssenduser_Body,
  postV1notificationsbroadcast_Body,
  patchV1notificationsread_Body,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/v1/admin/content-moderator",
    alias: "getV1admincontentModerator",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(50).optional().default(20),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: ListContentModeratorReportsResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Super admin role required`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/admin/content-moderator",
    alias: "postV1admincontentModerator",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateContentModeratorReportReviewRequest,
      },
    ],
    response: UpdateContentModeratorReportReviewResponse,
    errors: [
      {
        status: 400,
        description: `Invalid request data`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 403,
        description: `Super admin role required`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Report or reported content not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/admin/login",
    alias: "postV1adminlogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AdminLoginRequest,
      },
    ],
    response: AdminLoginResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Invalid credentials`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too many requests or account locked`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Session creation failed`,
        schema: z.object({ error: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/admin/logout",
    alias: "postV1adminlogout",
    requestFormat: "json",
    response: AdminLogoutResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/admin/me",
    alias: "getV1adminme",
    requestFormat: "json",
    response: AdminUser,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/admin/refresh",
    alias: "postV1adminrefresh",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ refreshToken: z.string().min(1) }).passthrough(),
      },
    ],
    response: AdminRefreshResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Invalid or expired refresh token`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/forgot-password",
    alias: "postV1authforgotPassword",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthForgotPasswordRequest,
      },
    ],
    response: ForgotPasswordResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.object({ error: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/google",
    alias: "postV1authgoogle",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ idToken: z.string().min(1) }).passthrough(),
      },
    ],
    response: AuthTokenResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Google authentication failed`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/login",
    alias: "postV1authlogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthLoginRequest,
      },
    ],
    response: AuthTokenResponse,
    errors: [
      {
        status: 401,
        description: `Invalid credentials`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/refresh",
    alias: "postV1authrefresh",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ refreshToken: z.string().min(1) }).passthrough(),
      },
    ],
    response: RefreshSuccessResponse,
    errors: [
      {
        status: 401,
        description: `Invalid refresh token`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/register",
    alias: "postV1authregister",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthRegisterRequest,
      },
    ],
    response: RegisterSuccessResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/register/complete",
    alias: "postV1authregistercomplete",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthCompleteSignUpRequest,
      },
    ],
    response: CompleteSignUpResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/register/resend-otp",
    alias: "postV1authregisterresendOtp",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string().min(1).email() }).passthrough(),
      },
    ],
    response: ResendRegisterOtpResponse,
    errors: [
      {
        status: 400,
        description: `Invalid email`,
        schema: z.object({ error: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/register/verify-otp",
    alias: "postV1authregisterverifyOtp",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthVerifyRegisterOtpRequest,
      },
    ],
    response: AuthTokenResponse,
    errors: [
      {
        status: 400,
        description: `Invalid OTP`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/reset-password",
    alias: "postV1authresetPassword",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthResetPasswordRequest,
      },
    ],
    response: ResetPasswordResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed or token is invalid`,
        schema: z.object({ error: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/auth/session",
    alias: "getV1authsession",
    requestFormat: "json",
    response: AuthSessionResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/forum/answer/create-answer",
    alias: "postV1forumanswercreateAnswer",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateAnswerRequest,
      },
    ],
    response: CreateAnswerResponse,
  },
  {
    method: "delete",
    path: "/v1/forum/answer/delete-answer/:answerId",
    alias: "deleteV1forumanswerdeleteAnswerAnswerId",
    requestFormat: "json",
    parameters: [
      {
        name: "answerId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: z.object({ ok: z.boolean() }).passthrough(),
    errors: [
      {
        status: 403,
        description: `Not authorized`,
        schema: AnswerErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/forum/answer/edit-answer/:answerId",
    alias: "patchV1forumanswereditAnswerAnswerId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ body: z.string().min(1).max(10000) }).passthrough(),
      },
      {
        name: "answerId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: EditAnswerResponse,
    errors: [
      {
        status: 403,
        description: `Not authorized`,
        schema: AnswerErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/answer/get-answers/:questionId",
    alias: "getV1forumanswergetAnswersQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum(["popular", "newest", "oldest"])
          .optional()
          .default("popular"),
      },
    ],
    response: GetAnswersResponse,
  },
  {
    method: "post",
    path: "/v1/forum/answer/mark-best-answer/:answerId",
    alias: "postV1forumanswermarkBestAnswerAnswerId",
    requestFormat: "json",
    parameters: [
      {
        name: "answerId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: MarkBestAnswerResponse,
    errors: [
      {
        status: 403,
        description: `Not authorized`,
        schema: AnswerErrorResponse,
      },
      {
        status: 404,
        description: `Answer not found`,
        schema: AnswerErrorResponse,
      },
      {
        status: 409,
        description: `Answer cannot be marked as best answer`,
        schema: AnswerErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/answer/my-answers",
    alias: "getV1forumanswermyAnswers",
    requestFormat: "json",
    response: GetMyAnswersResponse,
  },
  {
    method: "post",
    path: "/v1/forum/answer/vote-answer/:answerId",
    alias: "postV1forumanswervoteAnswerAnswerId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ voteType: z.string() }).passthrough(),
      },
      {
        name: "answerId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: VoteAnswerResponse,
  },
  {
    method: "get",
    path: "/v1/forum/category",
    alias: "getV1forumcategory",
    requestFormat: "json",
    response: GetCategoriesResponse,
  },
  {
    method: "post",
    path: "/v1/forum/category",
    alias: "postV1forumcategory",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateCategoryRequest,
      },
    ],
    response: CreateCategoryResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
      {
        status: 409,
        description: `Category already exists`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/public/answer/get-answers/:questionId",
    alias: "getV1forumpublicanswergetAnswersQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum(["popular", "newest", "oldest"])
          .optional()
          .default("popular"),
      },
    ],
    response: GetAnswersResponse,
  },
  {
    method: "get",
    path: "/v1/forum/public/category",
    alias: "getV1forumpubliccategory",
    requestFormat: "json",
    response: GetCategoriesResponse,
  },
  {
    method: "get",
    path: "/v1/forum/public/questions",
    alias: "getV1forumpublicquestions",
    requestFormat: "json",
    parameters: [
      {
        name: "categoryId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "tagId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(300).optional(),
      },
      {
        name: "isUnanswered",
        type: "Query",
        schema: isUnanswered,
      },
      {
        name: "isTrending",
        type: "Query",
        schema: isUnanswered,
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(50).optional().default(10),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum([
            "mostRelevant",
            "newest",
            "oldest",
            "mostVoted",
            "mostAnswered",
          ])
          .optional()
          .default("newest"),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetQuestionsResponse,
  },
  {
    method: "get",
    path: "/v1/forum/public/questions/:questionId",
    alias: "getV1forumpublicquestionsQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: GetQuestionResponse,
    errors: [
      {
        status: 404,
        description: `Question not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/public/questions/trending-tags",
    alias: "getV1forumpublicquestionstrendingTags",
    requestFormat: "json",
    parameters: [
      {
        name: "categoryId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
    ],
    response: GetTrendingTagsResponse,
    errors: [
      {
        status: 404,
        description: `Category not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/public/reporting-type",
    alias: "getV1forumpublicreportingType",
    requestFormat: "json",
    response: GetReportingTypesResponse,
    errors: [
      {
        status: 404,
        description: `No reporting types found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/questions",
    alias: "getV1forumquestions",
    requestFormat: "json",
    parameters: [
      {
        name: "categoryId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "tagId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(300).optional(),
      },
      {
        name: "isUnanswered",
        type: "Query",
        schema: isUnanswered,
      },
      {
        name: "isTrending",
        type: "Query",
        schema: isUnanswered,
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(50).optional().default(10),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum([
            "mostRelevant",
            "newest",
            "oldest",
            "mostVoted",
            "mostAnswered",
          ])
          .optional()
          .default("newest"),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetQuestionsResponse,
  },
  {
    method: "post",
    path: "/v1/forum/questions",
    alias: "postV1forumquestions",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateQuestionRequest,
      },
    ],
    response: CreateQuestionResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Category not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/questions/:questionId",
    alias: "getV1forumquestionsQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: GetQuestionResponse,
    errors: [
      {
        status: 404,
        description: `Question not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/v1/forum/questions/delete-question/:questionId",
    alias: "deleteV1forumquestionsdeleteQuestionQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: z.object({ ok: z.boolean() }).passthrough(),
    errors: [
      {
        status: 404,
        description: `Question not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/forum/questions/edit-question/:questionId",
    alias: "patchV1forumquestionseditQuestionQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: EditQuestionRequest,
      },
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: CreateQuestionResponse,
    errors: [
      {
        status: 404,
        description: `Question not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/forum/questions/image/presign",
    alias: "postV1forumquestionsimagepresign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PresignForumQuestionImageUploadRequest,
      },
    ],
    response: PresignForumQuestionImageUploadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/questions/my-questions",
    alias: "getV1forumquestionsmyQuestions",
    requestFormat: "json",
    response: GetMyQuestionsResponse,
  },
  {
    method: "post",
    path: "/v1/forum/questions/save-question/:questionId",
    alias: "postV1forumquestionssaveQuestionQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: SaveQuestionResponse,
    errors: [
      {
        status: 404,
        description: `Question not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/v1/forum/questions/save-question/:questionId",
    alias: "deleteV1forumquestionssaveQuestionQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: SaveQuestionResponse,
    errors: [
      {
        status: 404,
        description: `Question not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/forum/questions/saved",
    alias: "getV1forumquestionssaved",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(50).optional().default(10),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetSavedQuestionsResponse,
  },
  {
    method: "get",
    path: "/v1/forum/questions/trending-tags",
    alias: "getV1forumquestionstrendingTags",
    requestFormat: "json",
    parameters: [
      {
        name: "categoryId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
    ],
    response: GetTrendingTagsResponse,
    errors: [
      {
        status: 404,
        description: `Category not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/forum/questions/vote-question/:questionId",
    alias: "postV1forumquestionsvoteQuestionQuestionId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ voteType: z.string() }).passthrough(),
      },
      {
        name: "questionId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: CreateQuestionResponse,
    errors: [
      {
        status: 404,
        description: `Question not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/forum/reporting",
    alias: "postV1forumreporting",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateReportingRequest,
      },
    ],
    response: CreateReportingResponse,
    errors: [
      {
        status: 400,
        description: `Invalid request data`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Reported entity not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/launchpad",
    alias: "postV1launchpad",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateLaunchpadRequest,
      },
    ],
    response: CreateLaunchpadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: LaunchpadLogoValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 409,
        description: `Launchpad with this name already exists`,
        schema: LaunchpadOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/launchpad",
    alias: "getV1launchpad",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(50).optional().default(20),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum(["newest", "oldest", "startingSoon", "mostSpotsAvailable"])
          .optional()
          .default("newest"),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "categoryId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "cityId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().min(1).max(120).optional(),
      },
    ],
    response: GetLaunchpadsResponse,
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/launchpad/:launchpadId",
    alias: "patchV1launchpadLaunchpadId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateLaunchpadRequest,
      },
      {
        name: "launchpadId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: CreateLaunchpadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: LaunchpadLogoValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Launchpad or related record not found`,
        schema: LaunchpadOperationErrorResponse,
      },
      {
        status: 409,
        description: `Launchpad edit conflict`,
        schema: LaunchpadOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/launchpad/:launchpadId",
    alias: "getV1launchpadLaunchpadId",
    requestFormat: "json",
    parameters: [
      {
        name: "launchpadId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: GetLaunchpadByIdResponse,
    errors: [
      {
        status: 404,
        description: `Launchpad not found`,
        schema: LaunchpadOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/launchpad/:launchpadId/applications",
    alias: "postV1launchpadLaunchpadIdapplications",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateLaunchpadApplicationRequest,
      },
      {
        name: "launchpadId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: CreateLaunchpadApplicationResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: LaunchpadApplicationValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Launchpad or role not found`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
      {
        status: 409,
        description: `Already applied for this role`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/launchpad/:launchpadId/applications/:applicationId",
    alias: "getV1launchpadLaunchpadIdapplicationsApplicationId",
    requestFormat: "json",
    parameters: [
      {
        name: "launchpadId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "applicationId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: GetLaunchpadApplicationResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Application not found`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/launchpad/:launchpadId/applications/batch",
    alias: "postV1launchpadLaunchpadIdapplicationsbatch",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateLaunchpadApplicationBatchRequest,
      },
      {
        name: "launchpadId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: CreateLaunchpadApplicationBatchResponse,
    errors: [
      {
        status: 400,
        description: `Validation or business rule failed`,
        schema: LaunchpadApplicationBatchErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Launchpad or role not found`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
      {
        status: 409,
        description: `Already applied for one or more roles`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/launchpad/:launchpadId/applications/document/presign",
    alias: "postV1launchpadLaunchpadIdapplicationsdocumentpresign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PresignLaunchpadApplicationDocumentUploadRequest,
      },
      {
        name: "launchpadId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: PresignLaunchpadApplicationDocumentUploadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: LaunchpadApplicationValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadApplicationOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/launchpad/cover/presign",
    alias: "postV1launchpadcoverpresign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PresignLaunchpadImageUploadRequest,
      },
    ],
    response: PresignLaunchpadCoverUploadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: LaunchpadLogoValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/launchpad/document/presign",
    alias: "postV1launchpaddocumentpresign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PresignLaunchpadDocumentUploadRequest,
      },
    ],
    response: PresignLaunchpadDocumentUploadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: LaunchpadLogoValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/launchpad/logo/presign",
    alias: "postV1launchpadlogopresign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PresignLaunchpadImageUploadRequest,
      },
    ],
    response: PresignLaunchpadLogoUploadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: LaunchpadLogoValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/launchpad/public/category",
    alias: "getV1launchpadpubliccategory",
    requestFormat: "json",
    response: GetLaunchpadCategoriesResponse,
  },
  {
    method: "get",
    path: "/v1/launchpad/public/category/:categoryId",
    alias: "getV1launchpadpubliccategoryCategoryId",
    requestFormat: "json",
    parameters: [
      {
        name: "categoryId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: GetLaunchpadCategoriesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid request parameters`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Launchpad category not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/launchpad/save/:launchpadId",
    alias: "postV1launchpadsaveLaunchpadId",
    requestFormat: "json",
    parameters: [
      {
        name: "launchpadId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: SaveLaunchpadResponse,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: LaunchpadLogoValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Launchpad not found`,
        schema: LaunchpadOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/v1/launchpad/save/:launchpadId",
    alias: "deleteV1launchpadsaveLaunchpadId",
    requestFormat: "json",
    parameters: [
      {
        name: "launchpadId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: SaveLaunchpadResponse,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: LaunchpadLogoValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Launchpad not found`,
        schema: LaunchpadOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/launchpad/saved",
    alias: "getV1launchpadsaved",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(50).optional().default(20),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetSavedLaunchpadsResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: LaunchpadLogoValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: LaunchpadOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/me",
    alias: "getV1me",
    requestFormat: "json",
    response: ProfileResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: ProfileErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ProfileErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/me",
    alias: "patchV1me",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateProfileRequest,
      },
    ],
    response: UpdateProfileResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: ProfileErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: ProfileErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ProfileErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/me/recent-activity",
    alias: "getV1merecentActivity",
    requestFormat: "json",
    response: GetRecentActivitiesResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: RecentActivityErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/me/saved",
    alias: "getV1mesaved",
    requestFormat: "json",
    parameters: [
      {
        name: "filter",
        type: "Query",
        schema: z
          .enum(["all", "project", "volunteer", "forum"])
          .optional()
          .default("all"),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(50).optional().default(20),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetSavedItemsResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: SavedItemsErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: SavedItemsErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/my-application",
    alias: "getV1myApplication",
    requestFormat: "json",
    parameters: [
      {
        name: "type",
        type: "Query",
        schema: z
          .enum(["all", "volunteer", "projects"])
          .optional()
          .default("all"),
      },
      {
        name: "filter",
        type: "Query",
        schema: z
          .enum([
            "all",
            "pending",
            "approved",
            "active",
            "completed",
            "archived",
          ])
          .optional()
          .default("all"),
      },
    ],
    response: MyApplicationsResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: MyApplicationsErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/my-application/:sourceType/:applicationId/change-status/:statusAction",
    alias: "postV1myApplicationSourceTypeApplicationIdchangeStatusStatusAction",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "applicationId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "statusAction",
        type: "Path",
        schema: z.enum(["confirm", "decline", "withdraw"]),
      },
    ],
    response: MyApplicationStatusActionResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Application not found`,
        schema: MyApplicationsErrorResponse,
      },
      {
        status: 409,
        description: `Application status cannot be changed with this action`,
        schema: MyApplicationsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: MyApplicationsErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/my-application/:sourceType/:opportunityId/archive/:archiveAction",
    alias: "postV1myApplicationSourceTypeOpportunityIdarchiveArchiveAction",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "opportunityId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "archiveAction",
        type: "Path",
        schema: z.enum(["archive", "unarchive"]),
      },
    ],
    response: MyApplicationArchiveActionResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Opportunity application group not found`,
        schema: MyApplicationsErrorResponse,
      },
      {
        status: 409,
        description: `Only completed groups or groups containing only declined/withdrawn roles can be archived`,
        schema: MyApplicationsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: MyApplicationsErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/my-application/:sourceType/:postingId",
    alias: "getV1myApplicationSourceTypePostingId",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "postingId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: MyApplicationDetailResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Posting application not found`,
        schema: MyApplicationsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: MyApplicationsErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/notifications",
    alias: "getV1notifications",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gt(0).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(20),
      },
      {
        name: "unreadOnly",
        type: "Query",
        schema: z.enum(["true", "false"]).optional(),
      },
      {
        name: "type",
        type: "Query",
        schema: z
          .enum([
            "forum",
            "profile_view",
            "new_message",
            "achievement",
            "event_reminder",
            "application",
            "launchpad_update",
            "points",
            "system",
          ])
          .optional(),
      },
      {
        name: "archived",
        type: "Query",
        schema: z.enum(["true", "false"]).optional(),
      },
    ],
    response: z
      .object({
        ok: z.literal(true),
        notifications: z.array(
          z
            .object({
              id: z.string().uuid(),
              title: z.string(),
              body: z.string(),
              imageUrl: z.string().nullish(),
              icon: z.string(),
              type: z.string(),
              eventType: z.string().nullish(),
              dedupeKey: z.string().nullish(),
              aggregateCount: z.number().int().gt(0).optional(),
              data: z.record(z.string(), z.string()).nullable(),
              isRead: z.boolean(),
              readAt: z.string().datetime({ offset: true }).nullable(),
              archived: z.boolean(),
              createdAt: z.string().datetime({ offset: true }),
              updatedAt: z.string().datetime({ offset: true }).optional(),
              webRoute: z.string().nullish(),
              mobileRoute: z.string().nullish(),
            })
            .passthrough()
        ),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        unreadCounts: z.record(z.string(), z.number()),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/notifications/broadcast",
    alias: "postV1notificationsbroadcast",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1notificationsbroadcast_Body,
      },
    ],
    response: z
      .object({
        ok: z.boolean(),
        successCount: z.number(),
        failureCount: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          .passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/notifications/read",
    alias: "patchV1notificationsread",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchV1notificationsread_Body,
      },
    ],
    response: z
      .object({
        ok: z.boolean(),
        message: z.string(),
        platform: z.enum(["web", "android", "ios"]).optional().default("web"),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          .passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/notifications/read/all",
    alias: "patchV1notificationsreadall",
    requestFormat: "json",
    parameters: [
      {
        name: "archived",
        type: "Query",
        schema: z.enum(["true", "false"]).optional(),
      },
      {
        name: "type",
        type: "Query",
        schema: z
          .enum([
            "forum",
            "profile_view",
            "new_message",
            "achievement",
            "event_reminder",
            "application",
            "launchpad_update",
            "points",
            "system",
          ])
          .optional(),
      },
    ],
    response: z
      .object({
        ok: z.boolean(),
        message: z.string(),
        platform: z.enum(["web", "android", "ios"]).optional().default("web"),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/notifications/send/user",
    alias: "postV1notificationssenduser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1notificationssenduser_Body,
      },
    ],
    response: z
      .object({
        ok: z.boolean(),
        successCount: z.number(),
        failureCount: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/notifications/tokens",
    alias: "postV1notificationstokens",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postV1notificationstokens_Body,
      },
    ],
    response: z
      .object({
        ok: z.boolean(),
        message: z.string(),
        platform: z.enum(["web", "android", "ios"]).optional().default("web"),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/v1/notifications/tokens",
    alias: "deleteV1notificationstokens",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ token: z.string().min(1) }).passthrough(),
      },
    ],
    response: z
      .object({
        ok: z.boolean(),
        message: z.string(),
        platform: z.enum(["web", "android", "ios"]).optional().default("web"),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/onboarding/contributions",
    alias: "getV1onboardingcontributions",
    requestFormat: "json",
    response: z.record(z.string(), z.unknown().nullable()),
  },
  {
    method: "get",
    path: "/v1/onboarding/interests",
    alias: "getV1onboardinginterests",
    requestFormat: "json",
    response: z.record(z.string(), z.unknown().nullable()),
  },
  {
    method: "get",
    path: "/v1/onboarding/locations/cities",
    alias: "getV1onboardinglocationscities",
    requestFormat: "json",
    response: z.record(z.string(), z.unknown().nullable()),
    errors: [
      {
        status: 400,
        description: `countryId or countryName missing`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/onboarding/locations/countries",
    alias: "getV1onboardinglocationscountries",
    requestFormat: "json",
    response: z.record(z.string(), z.unknown().nullable()),
  },
  {
    method: "get",
    path: "/v1/onboarding/options",
    alias: "getV1onboardingoptions",
    requestFormat: "json",
    response: z.record(z.string(), z.unknown().nullable()),
  },
  {
    method: "get",
    path: "/v1/onboarding/state",
    alias: "getV1onboardingstate",
    requestFormat: "json",
    response: z.record(z.string(), z.unknown().nullable()),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
    ],
  },
  {
    method: "put",
    path: "/v1/onboarding/step-1-profile",
    alias: "putV1onboardingstep1Profile",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: OnboardingProfileStepRequest,
      },
    ],
    response: z.record(z.string(), z.unknown().nullable()),
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
    ],
  },
  {
    method: "put",
    path: "/v1/onboarding/step-2-interests",
    alias: "putV1onboardingstep2Interests",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: OnboardingInterestsStepRequest,
      },
    ],
    response: z.record(z.string(), z.unknown().nullable()),
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
    ],
  },
  {
    method: "put",
    path: "/v1/onboarding/step-3-contributions",
    alias: "putV1onboardingstep3Contributions",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: OnboardingContributionsStepRequest,
      },
    ],
    response: z.record(z.string(), z.unknown().nullable()),
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
    ],
  },
  {
    method: "put",
    path: "/v1/onboarding/step-4-complete",
    alias: "putV1onboardingstep4Complete",
    requestFormat: "json",
    response: z.record(z.string(), z.unknown().nullable()),
    errors: [
      {
        status: 400,
        description: `Onboarding prerequisites not complete`,
        schema: z.record(z.string(), z.unknown().nullable()),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/profile/:userId",
    alias: "getV1profileUserId",
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: PublicProfileResponse,
    errors: [
      {
        status: 404,
        description: `User not found`,
        schema: ProfileErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ProfileErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/profile/:userId/posted",
    alias: "getV1profileUserIdposted",
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "sourceType",
        type: "Query",
        schema: z.enum(["forum", "volunteer", "project"]),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(50).optional().default(20),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetMyPostedResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: MyPostedErrorResponse,
      },
      {
        status: 404,
        description: `User not found`,
        schema: MyPostedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: MyPostedErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/uploads/avatar/presign",
    alias: "postV1uploadsavatarpresign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PresignAvatarUploadRequest,
      },
    ],
    response: PresignAvatarUploadResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameters`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/volunteer/applications",
    alias: "postV1volunteerapplications",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateVolunteerApplicationRequest,
      },
    ],
    response: CreateVolunteerApplicationResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Volunteer role not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 409,
        description: `Duplicate volunteer application`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/volunteer/applications/batch",
    alias: "postV1volunteerapplicationsbatch",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateVolunteerApplicationBatchRequest,
      },
    ],
    response: CreateVolunteerApplicationBatchResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Volunteer role not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 409,
        description: `Duplicate volunteer application`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/volunteer/applications/document/presign",
    alias: "postV1volunteerapplicationsdocumentpresign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PresignVolunteerApplicationDocumentUploadRequest,
      },
    ],
    response: PresignVolunteerApplicationDocumentUploadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Volunteer opportunity not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 409,
        description: `Volunteer application already exists`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/categories",
    alias: "getV1volunteercategories",
    requestFormat: "json",
    response: GetVolunteerCategoriesResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/volunteer/categories",
    alias: "postV1volunteercategories",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateVolunteerCategoryRequest,
      },
    ],
    response: CreateVolunteerCategoryResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 409,
        description: `Category already exists`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/locations",
    alias: "getV1volunteerlocations",
    requestFormat: "json",
    response: GetVolunteerLocationsResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/opportunities",
    alias: "getV1volunteeropportunities",
    requestFormat: "json",
    parameters: [
      {
        name: "categoryId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "locationId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(300).optional(),
      },
      {
        name: "filter",
        type: "Query",
        schema: z
          .enum(["recentlyAdded", "startingSoon", "mostSpotsAvailable"])
          .optional()
          .default("recentlyAdded"),
      },
      {
        name: "timeCommitment",
        type: "Query",
        schema: z.enum(["Light", "Regular", "Intensive"]).optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(10),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetVolunteerOpportunitiesResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Related volunteer records were not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/volunteer/opportunities",
    alias: "postV1volunteeropportunities",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateVolunteerOpportunityRequest,
      },
    ],
    response: CreateVolunteerOpportunityResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Related volunteer records were not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/opportunities/:opportunityId",
    alias: "getV1volunteeropportunitiesOpportunityId",
    requestFormat: "json",
    parameters: [
      {
        name: "opportunityId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: GetVolunteerOpportunityResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request - invalid opportunityId`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Volunteer opportunity not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/volunteer/opportunities/:opportunityId",
    alias: "patchV1volunteeropportunitiesOpportunityId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateVolunteerOpportunityRequest,
      },
      {
        name: "opportunityId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: CreateVolunteerOpportunityResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Volunteer opportunity or related record not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 409,
        description: `Volunteer opportunity edit conflict`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/volunteer/opportunities/cover-image/presign",
    alias: "postV1volunteeropportunitiescoverImagepresign",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: PresignVolunteerOpportunityCoverUploadRequest,
      },
    ],
    response: PresignVolunteerOpportunityCoverUploadResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/public/categories",
    alias: "getV1volunteerpubliccategories",
    requestFormat: "json",
    response: GetVolunteerCategoriesResponse,
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/public/locations",
    alias: "getV1volunteerpubliclocations",
    requestFormat: "json",
    response: GetVolunteerLocationsResponse,
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/public/opportunities",
    alias: "getV1volunteerpublicopportunities",
    requestFormat: "json",
    parameters: [
      {
        name: "categoryId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "locationId",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          )
          .optional(),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(300).optional(),
      },
      {
        name: "filter",
        type: "Query",
        schema: z
          .enum(["recentlyAdded", "startingSoon", "mostSpotsAvailable"])
          .optional()
          .default("recentlyAdded"),
      },
      {
        name: "timeCommitment",
        type: "Query",
        schema: z.enum(["Light", "Regular", "Intensive"]).optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(10),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetVolunteerOpportunitiesResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 404,
        description: `Related volunteer records were not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/public/opportunities/:opportunityId",
    alias: "getV1volunteerpublicopportunitiesOpportunityId",
    requestFormat: "json",
    parameters: [
      {
        name: "opportunityId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: GetPublicVolunteerOpportunityResponse,
    errors: [
      {
        status: 400,
        description: `Invalid request`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 404,
        description: `Volunteer opportunity not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/volunteer/save-opportunity/:opportunityId",
    alias: "postV1volunteersaveOpportunityOpportunityId",
    requestFormat: "json",
    parameters: [
      {
        name: "opportunityId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: SaveVolunteerOpportunityResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request - invalid opportunityId`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Volunteer opportunity not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/v1/volunteer/save-opportunity/:opportunityId",
    alias: "deleteV1volunteersaveOpportunityOpportunityId",
    requestFormat: "json",
    parameters: [
      {
        name: "opportunityId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: SaveVolunteerOpportunityResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request - invalid opportunityId`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Volunteer opportunity not found`,
        schema: VolunteerOperationErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/volunteer/saved",
    alias: "getV1volunteersaved",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(10),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: GetVolunteerOpportunitiesResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: VolunteerCategoryValidationErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Forbidden`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: VolunteerOperationErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/workspace/manage-posting",
    alias: "getV1workspacemanagePosting",
    requestFormat: "json",
    parameters: [
      {
        name: "type",
        type: "Query",
        schema: z
          .enum(["all", "volunteer", "projects"])
          .optional()
          .default("all"),
      },
      {
        name: "filter",
        type: "Query",
        schema: z
          .enum([
            "all",
            "live",
            "draft",
            "in_progress",
            "completed",
            "canceled",
            "filled",
          ])
          .optional()
          .default("all"),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(6),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(300).optional(),
      },
    ],
    response: ManagePostingsResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ManagePostingsErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/workspace/manage-posting/:sourceType/:postingId",
    alias: "getV1workspacemanagePostingSourceTypePostingId",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "postingId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "filter",
        type: "Query",
        schema: z
          .enum([
            "all",
            "new",
            "in_review",
            "approved",
            "confirmed",
            "declined",
          ])
          .optional()
          .default("all"),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().max(300).optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(10),
      },
    ],
    response: ManagePostingDetailResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Posting not found`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ManagePostingsErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/workspace/manage-posting/:sourceType/:postingId/:applicationId/change-status/:statusAction",
    alias:
      "postV1workspacemanagePostingSourceTypePostingIdApplicationIdchangeStatusStatusAction",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "postingId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "applicationId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "statusAction",
        type: "Path",
        schema: z.enum(["under_review", "approve"]),
      },
    ],
    response: ManagePostingApplicationActionResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Application not found`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 409,
        description: `Application is no longer pending review`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ManagePostingsErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/workspace/manage-posting/:sourceType/:postingId/:applicationId/decline",
    alias:
      "postV1workspacemanagePostingSourceTypePostingIdApplicationIddecline",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "postingId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "applicationId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "declineAll",
        type: "Query",
        schema: z.boolean().nullish().default(false),
      },
      {
        name: "blockFutureApply",
        type: "Query",
        schema: z.boolean().nullish().default(false),
      },
    ],
    response: ManagePostingApplicationActionResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Application not found`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 409,
        description: `Application cannot be declined from the current state`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ManagePostingsErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/workspace/manage-posting/:sourceType/:postingId/:candidateId",
    alias: "getV1workspacemanagePostingSourceTypePostingIdCandidateId",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "postingId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "candidateId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: ManagePostingCandidateDetailResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Candidate not found`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ManagePostingsErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/workspace/manage-posting/:sourceType/:postingId/:candidateId/note",
    alias: "postV1workspacemanagePostingSourceTypePostingIdCandidateIdnote",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ note: z.string().max(5000) }).passthrough(),
      },
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "postingId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "candidateId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: UpsertManagePostingCandidateNoteResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Candidate not found`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ManagePostingsErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/workspace/manage-posting/:sourceType/:postingId/action/:postingAction",
    alias: "postV1workspacemanagePostingSourceTypePostingIdactionPostingAction",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "postingId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
      {
        name: "postingAction",
        type: "Path",
        schema: z.enum(["cancel", "close", "delete", "mark_complete"]),
      },
    ],
    response: UpdateManagePostingActionResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Posting not found`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 409,
        description: `Posting action is not allowed for the current state`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ManagePostingsErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/workspace/manage-posting/:sourceType/:postingId/extend-application-deadline",
    alias:
      "postV1workspacemanagePostingSourceTypePostingIdextendApplicationDeadline",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z
          .object({ deadline: z.string().datetime({ offset: true }) })
          .passthrough(),
      },
      {
        name: "sourceType",
        type: "Path",
        schema: z.enum(["volunteer", "projects"]),
      },
      {
        name: "postingId",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: ExtendManagePostingDeadlineResponse,
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 403,
        description: `Onboarding required`,
        schema: AuthProtectedErrorResponse,
      },
      {
        status: 404,
        description: `Posting not found`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 409,
        description: `Posting deadline cannot be extended from the current state`,
        schema: ManagePostingsErrorResponse,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: ManagePostingsErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
