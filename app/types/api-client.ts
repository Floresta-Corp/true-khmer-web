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
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    occupation: z.string().min(1).max(120),
    phone: z.object({
      country: z.string().min(2).max(2),
      nationalNumber: z.string().min(1),
    }),
    email: z.string().min(1).email(),
    password: z.string().min(8).regex(/^\S+$/),
    waitlistId: z.string().uuid().optional(),
  })
  ;
const AuthUserProfile = z
  .object({
    id: z.string(),
    displayName: z.string().optional(),
    avatarKey: z.string().optional(),
  })
  ;
const AuthUser = z
  .object({
    id: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean().optional(),
    twoFactorEnabled: z.boolean().optional(),
    twoFactorTotpEnabled: z.boolean().optional(),
    twoFactorEmailEnabled: z.boolean().optional(),
    role: z.string().optional(),
    name: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    dateOfBirth: z.string().nullish(),
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
  ;
const RegisterSuccessResponse = z
  .object({
    success: z.literal(true),
    message: z.string(),
    otpSent: z.boolean(),
    user: AuthUser,
  })
  ;
const AuthPhoneForm = z
  .object({ country: z.string(), nationalNumber: z.string() })
  ;
const AuthWaitlistPrefill = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    phone: AuthPhoneForm,
    email: z.string().email(),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string(),
    occupation: z.string(),
  })
  ;
const AuthWaitlistContextResponse = z
  .object({
    found: z.boolean(),
    eligibleForEarlyFounder: z.boolean(),
    waitlistId: z.string().uuid().nullable(),
    prefill: AuthWaitlistPrefill.nullable(),
  })
  ;
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
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    occupation: z.string().min(1).max(120),
    phone: z.object({
      country: z.string().min(2).max(2),
      nationalNumber: z.string().min(1),
    }),
    memberAgreementAccepted: z.literal(true),
  })
  ;
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
  ;
const CompleteSignUpResponse = z
  .object({
    success: z.literal(true),
    message: z.string(),
    user: AuthUser,
    authFlow: AuthFlow.optional(),
  })
  ;
const AuthSessionResponse = z
  .object({ user: AuthUser, authFlow: AuthFlow })
  ;
const AuthProtectedErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    code: z.string().optional(),
    requiredAction: AuthRequiredAction.nullish(),
    accessState: AuthAccessState.optional(),
  })
  ;
const AuthGoogleRequest = z
  .object({
    idToken: z.string().min(1),
    waitlistId: z.string().uuid().optional(),
  })
  ;
const AuthTokenResponse = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: AuthUser,
    authFlow: AuthFlow.optional(),
  })
  ;
const AuthVerifyRegisterOtpRequest = z
  .object({ email: z.string().min(1).email(), otp: z.string().min(6).max(6) })
  ;
const AuthResendRegisterOtpRequest = z
  .object({ email: z.string().min(1).email() })
  ;
const ResendRegisterOtpResponse = z
  .object({ success: z.boolean(), message: z.string() })
  ;

const AuthSimpleErrorResponse = z.object({ error: z.string() });
const AuthLoginRequest = z
  .object({ email: z.string().min(1).email(), password: z.string().min(1) })
  ;
const AuthTwoFactorRequiredResponse = z
  .object({
    twoFactorRequired: z.literal(true),
    twoFactorRedirect: z.literal(true),
    twoFactorMethods: z.array(z.string()),
    twoFactorToken: z.string(),
    expiresIn: z.number().int().gt(0),
  })
  ;
const AuthRefreshRequest = z
  .object({ refreshToken: z.string().min(1) })
  ;
const RefreshSuccessResponse = z
  .object({ accessToken: z.string(), refreshToken: z.string() })
  ;
const AuthTwoFactorSettingsResponse = z
  .object({
    twoFactorEnabled: z.boolean(),
    methods: z
      .object({
        authenticatorApp: z.object({ enabled: z.boolean() }),
        emailOtp: z
          .object({ enabled: z.boolean(), email: z.string().email() })
          ,
      })
      ,
  })
  ;
const AuthTwoFactorTotpSetupRequest = z
  .object({ password: z.string().min(1) })
  ;
const AuthTwoFactorTotpSetupResponse = z
  .object({ totpURI: z.string(), backupCodes: z.array(z.string()) })
  ;

const AuthTwoFactorSessionRequest = z.object({}).partial();
const AuthTwoFactorTotpVerifyRequest = AuthTwoFactorSessionRequest.and(
  z
    .object({
      code: z.string().min(6).max(6),
      trustDevice: z.boolean().optional(),
    })
    
);
const AuthLoginTwoFactorSessionRequest = z
  .object({ twoFactorToken: z.string().min(1) })
  ;
const AuthLoginTwoFactorTotpVerifyRequest =
  AuthLoginTwoFactorSessionRequest.and(
    z
      .object({
        code: z.string().min(6).max(6),
        trustDevice: z.boolean().optional(),
      })
      
  );

const AuthStatusResponse = z.object({ status: z.boolean() });
const AuthTwoFactorEmailVerifyRequest = AuthTwoFactorSessionRequest.and(
  z
    .object({
      code: z.string().min(6).max(6),
      trustDevice: z.boolean().optional(),
    })
    
);
const AuthLoginTwoFactorEmailVerifyRequest =
  AuthLoginTwoFactorSessionRequest.and(
    z
      .object({
        code: z.string().min(6).max(6),
        trustDevice: z.boolean().optional(),
      })
      
  );
const AuthForgotPasswordRequest = z
  .object({ email: z.string().min(1).email(), resetPageUrl: z.string().min(1) })
  ;
const ForgotPasswordResponse = z
  .object({ success: z.literal(true), message: z.string() })
  ;
const AuthResetPasswordRequest = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8).regex(/^\S+$/),
  })
  ;
const ResetPasswordResponse = z
  .object({ success: z.literal(true), message: z.string() })
  ;
const AdminLoginRequest = z
  .object({ email: z.string().min(1), password: z.string().min(1) })
  ;
const AdminLoginOtpChallengeResponse = z
  .object({
    otpRequired: z.literal(true),
    challengeId: z.string().uuid(),
    expiresAt: z.string().datetime({ offset: true }),
    message: z.string(),
  })
  ;

const AdminErrorResponse = z.object({ error: z.string() });
const AdminVerifyLoginOtpRequest = z
  .object({ challengeId: z.string().uuid(), otp: z.string().regex(/^\d{6}$/) })
  ;
const AdminUser = z
  .object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    avatarKey: z.string().nullable(),
    createdAt: z.union([z.string(), z.string()]),
  })
  ;
const AdminLoginResponse = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiresAt: z.string().datetime({ offset: true }),
    refreshTokenExpiresAt: z.string().datetime({ offset: true }),
    admin: AdminUser,
  })
  ;
const AdminRefreshRequest = z
  .object({ refreshToken: z.string().min(1) })
  ;
const AdminRefreshResponse = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiresAt: z.string().datetime({ offset: true }),
    refreshTokenExpiresAt: z.string().datetime({ offset: true }),
  })
  ;
const AdminPresignAvatarUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(5242880),
  })
  ;
const AdminPresignAvatarUploadResponse = z
  .object({
    ok: z.boolean(),
    upload: z
      .object({
        uploadUrl: z.string().url(),
        method: z.literal("PUT"),
        requiredHeaders: z.record(z.string(), z.string()),
        avatarKey: z.string(),
        expiresInSeconds: z.number(),
      })
      ,
  })
  ;
const AdminUpdateProfileRequest = z
  .object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    avatarKey: z.string().nullable(),
  })
  .partial()
  ;
const AdminUpdateProfileResponse = z
  .object({
    ok: z.boolean(),
    admin: z
      .object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        avatarKey: z.string().nullable(),
      })
      ,
  })
  ;
const AdminLogoutResponse = z
  .object({ success: z.boolean(), message: z.string() })
  ;
const ContentModeratorReportType = z
  .object({ id: z.string(), name: z.string() })
  ;
const ContentModeratorReportReporter = z
  .object({
    id: z.string(),
    name: z.string(),
    avatarKey: z.string().nullable(),
  })
  ;
const ContentModeratorReportSolver = z
  .object({
    id: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
  })
  ;
const ContentModeratorReport = z
  .object({
    id: z.string().uuid(),
    reportId: z.number().int().gt(0),
    type: ContentModeratorReportType,
    reportType: z.literal("FORUM"),
    reportSubType: z.enum(["QUESTION", "ANSWER"]).nullable(),
    contentPreview: z.string(),
    sourceLink: z.string(),
    dateTime: z.string().datetime({ offset: true }),
    status: z.enum(["OPEN", "CLOSED"]),
    confirmStatus: z.enum(["CONTENT HIDDEN", "DISMISSED"]).nullable(),
    reportingBy: ContentModeratorReportReporter.nullable(),
    solvedBy: ContentModeratorReportSolver.nullable(),
    solvedAt: z.string().datetime({ offset: true }).nullable(),
  })
  ;
const CursorPagination = z
  .object({
    limit: z.number().int().gt(0),
    hasMore: z.boolean(),
    nextCursor: z.string().nullable(),
    total: z.number().int().gte(0),
  })
  ;
const ListContentModeratorReportsResponse = z
  .object({
    ok: z.boolean(),
    reports: z.array(ContentModeratorReport),
    pagination: CursorPagination,
  })
  ;
const UpdateContentModeratorReportReviewRequest = z
  .object({
    reportUuid: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
      ),
    status: z.enum(["SAFE", "HIDE"]),
  })
  ;
const UpdateContentModeratorReportReviewResponse = z
  .object({ ok: z.boolean(), report: ContentModeratorReport })
  ;
const AdminDashboardResponse = z
  .object({
    ok: z.literal(true),
    dashboard: z
      .object({
        summary: z
          .object({
            totalUsers: z.number().int().gte(0),
            totalPartners: z.unknown().nullable(),
            openReports: z.number().int().gte(0),
          })
          ,
        newRegistrations: z
          .object({
            days: z.number().int().gt(0),
            changePercent: z.number().nullable(),
            trend: z.array(
              z
                .object({
                  label: z.string(),
                  count: z.number().int().gte(0),
                  date: z.string(),
                })
                
            ),
          })
          ,
        activeUsers: z
          .object({
            countLast24Hours: z.number().int().gte(0),
            windowHours: z.literal(24),
            liveNow: z.boolean(),
            trend: z.array(
              z
                .object({
                  label: z.string(),
                  count: z.number().int().gte(0),
                  hour: z.string(),
                })
                
            ),
          })
          ,
        demographics: z
          .object({
            genderBreakdown: z.array(
              z
                .object({ label: z.string(), count: z.number().int().gte(0) })
                
            ),
            ageGroups: z.array(
              z
                .object({ label: z.string(), count: z.number().int().gte(0) })
                
            ),
          })
          ,
        partners: z
          .object({
            total: z.unknown().nullable(),
            sectors: z.unknown().nullable(),
          })
          ,
      })
      ,
  })
  ;
const AdminDashboardErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;
const AcceptModeratorInviteRequest = z
  .object({
    token: z.string().min(1),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    password: z.string().min(8),
  })
  ;

const InviteModeratorResponse = z.object({ ok: z.boolean() });
const Moderator = z
  .object({
    id: z.string().uuid(),
    email: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    role: z.literal("MODERATOR"),
    status: z.enum(["PENDING", "ACTIVE"]),
    lastActive: z.string().nullable(),
    createdAt: z.string().datetime({ offset: true }),
  })
  ;
const ListModeratorsResponse = z
  .object({
    ok: z.boolean(),
    moderators: z.array(Moderator),
    pagination: CursorPagination,
  })
  ;
const CreateModeratorRequest = z
  .object({ email: z.string().min(1) })
  ;
const ModeratorResponse = z
  .object({ ok: z.boolean(), moderator: Moderator })
  ;
const UpdateModeratorRequest = z
  .object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    password: z.string().min(8),
  })
  .partial()
  ;

const DeleteModeratorResponse = z.object({ ok: z.boolean() });
const AdminUserManagementTier = z
  .object({
    id: z.string().uuid(),
    slug: z.string(),
    name: z.string(),
    rankOrder: z.number().int(),
    minPoints: z.number().int(),
  })
  ;
const AdminUserManagementUser = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    displayName: z.string().nullable(),
    avatarKey: z.string().nullable(),
    email: z.string().email(),
    emailVerified: z.boolean(),
    phoneNumber: z.string().nullable(),
    phoneCountry: z.string().nullable(),
    role: z.string(),
    status: z.enum([
      "SIGNUP_REQUIRED",
      "ONBOARDING_REQUIRED",
      "ACTIVE",
      "SUSPENDED"]),
    tier: AdminUserManagementTier.nullable(),
    totalPoints: z.number().int(),
    signupCompletedAt: z.string().datetime({ offset: true }).nullable(),
    onboardingStep: z.number().int(),
    onboardingCompletedAt: z.string().datetime({ offset: true }).nullable(),
    lastActive: z.string().nullable(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  ;
const AdminUserManagementListResponse = z
  .object({
    ok: z.literal(true),
    users: z.array(AdminUserManagementUser),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
  })
  ;
const AdminUserManagementPoints = z
  .object({
    activePoints: z.number().int(),
    tierPoints: z.number().int(),
    legacyPoints: z.number().int(),
    totalPoints: z.number().int(),
  })
  ;
const AdminUserManagementActivity = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    actionType: z.string(),
    points: z.number().int(),
    pool: z.string(),
    mode: z.string(),
    referenceType: z.string().nullable(),
    referenceId: z.string().uuid().nullable(),
    createdAt: z.string(),
  })
  ;
const AdminUserManagementDetailUser = AdminUserManagementUser.and(
  z
    .object({
      dateOfBirth: z.string().nullable(),
      occupation: z.string().nullable(),
      telegramUsername: z.string().nullable(),
      location: z
        .object({ city: z.string().nullable(), country: z.string().nullable() })
        
        .nullable(),
      points: AdminUserManagementPoints,
      recentActivity: z.array(AdminUserManagementActivity),
    })
    
);
const AdminUserManagementDetailResponse = z
  .object({ ok: z.literal(true), user: AdminUserManagementDetailUser })
  ;

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
  ;
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
  ;
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
  ;
const PresignAvatarUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      ,
    avatarKey: z.string(),
    expiresInSeconds: z.number(),
  })
  ;
const PresignAvatarUploadResponse = z
  .object({ ok: z.boolean(), upload: PresignAvatarUploadResult })
  ;
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
  ;
const CategoryWithQuestionCountResponse = CategoryResponse.and(
  z.object({ questionCount: z.number() })
);
const GetCategoriesResponse = z
  .object({
    ok: z.boolean(),
    categories: z.array(CategoryWithQuestionCountResponse),
  })
  ;
const CreateCategoryRequest = z
  .object({
    name: z.string().min(1).max(120),
    slug: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
  })
  ;
const CreateCategoryResponse = z
  .object({ ok: z.boolean(), category: CategoryResponse })
  ;

const isUnanswered = z.union([z.boolean(), z.string()]).optional();
const QuestionTagResponse = z
  .object({ id: z.string(), name: z.string() })
  ;
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
    category: z.object({ id: z.string(), name: z.string() }),
    author: z
      .object({
        id: z.string(),
        name: z.string(),
        avatarKey: z.string().nullable(),
      })
      ,
    tags: z.array(QuestionTagResponse),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  ;
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
      ,
  })
  ;
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
  ;
const CreateQuestionResponse = z
  .object({ ok: z.boolean(), question: QuestionResponse })
  ;
const TrendingTagResponse = z
  .object({ id: z.string(), name: z.string(), count: z.number() })
  ;
const GetTrendingTagsResponse = z
  .object({ ok: z.boolean(), tags: z.array(TrendingTagResponse) })
  ;
const GetMyQuestionsResponse = z
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
      ,
  })
  ;
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
      ,
  })
  ;
const GetQuestionResponse = z
  .object({ ok: z.boolean(), question: QuestionResponse })
  ;
const PresignForumQuestionImageUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(5242880),
  })
  ;
const PresignForumQuestionImageUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      ,
    imageKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  ;
const PresignForumQuestionImageUploadResponse = z
  .object({
    ok: z.literal(true),
    upload: PresignForumQuestionImageUploadResult,
  })
  ;
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
  ;

const VoteQuestionRequest = z.object({ voteType: z.string() });

const SaveQuestionResponse = z.object({ ok: z.literal(true) });
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
      ,
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
  ;
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
      ,
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
  ;
const GetAnswersResponse = z
  .object({
    ok: z.boolean(),
    answers: z
      .object({
        bestAnswer: z.array(AnswerResponse),
        answers: z.array(AnswerResponse),
      })
      ,
  })
  ;
const AnswerQuestionResponse = z
  .object({
    id: z.string(),
    categoryId: z.string(),
    title: z.string(),
    body: z.string(),
    imageKey: z.string().nullable(),
    status: z.enum(["PUBLISHED", "CLOSED", "DELETED"]),
    answerCount: z.number().int().gte(0),
    upvoteCount: z.number().int().gte(0),
    downvoteCount: z.number().int().gte(0),
    viewCount: z.number().int().gte(0),
    bestAnswerId: z.string().nullable(),
    bestAnswerSelectedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    author: z
      .object({
        id: z.string(),
        name: z.string(),
        avatarKey: z.string().nullable(),
      })
      ,
    category: CategoryResponse,
  })
  ;
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
      ,
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
    isBestAnswer: z.boolean(),
  })
  ;
const MyAnswerDiscussionResponse = z
  .object({
    question: AnswerQuestionResponse,
    answers: z.array(MyAnswerResponse),
    myAnswerCount: z.number().int().gt(0),
    lastActivityAt: z.string(),
  })
  ;
const MyAnswersPaginationResponse = z
  .object({
    limit: z.number().int().gt(0),
    hasMore: z.boolean(),
    nextCursor: z.string().nullable(),
    total: z.number().int().gte(0),
  })
  ;
const GetMyAnswersResponse = z
  .object({
    ok: z.boolean(),
    discussions: z.array(MyAnswerDiscussionResponse),
    totalAnswers: z.number().int().gte(0),
    pagination: MyAnswersPaginationResponse,
  })
  ;

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
  ;
const UpdateAnswerRequest = z
  .object({ body: z.string().min(1).max(10000) })
  ;
const EditAnswerResponse = z
  .object({ ok: z.boolean(), answer: AnswerResponse })
  ;
const AnswerErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;

const DeleteAnswerResponse = z.object({ ok: z.boolean() });

const VoteAnswerRequest = z.object({ voteType: z.string() });
const VoteAnswerResponse = z
  .object({ ok: z.boolean(), answer: AnswerResponse })
  ;
const MarkBestAnswerResponse = z
  .object({ ok: z.boolean(), answer: AnswerResponse })
  ;
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
  ;
const VolunteerCategoryWithOpportunityCountResponse =
  VolunteerCategoryResponse.and(
    z.object({ opportunityCount: z.number().int().gte(0) })
  );
const GetVolunteerCategoriesResponse = z
  .object({
    ok: z.literal(true),
    categories: z.array(VolunteerCategoryWithOpportunityCountResponse),
  })
  ;
const VolunteerOperationErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;
const CreateVolunteerCategoryRequest = z
  .object({
    name: z.string(),
    slug: z.string(),
    description: z.string().nullish(),
    iconKey: z.string().nullish(),
    status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]).optional(),
  })
  ;
const CreateVolunteerCategoryResponse = z
  .object({ ok: z.literal(true), category: VolunteerCategoryResponse })
  ;
const VolunteerCategoryValidationErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    issues: z.array(
      z.object({ path: z.string(), message: z.string() })
    ),
  })
  ;
const VolunteerLocationResponse = z
  .object({ id: z.string(), name: z.string() })
  ;
const GetVolunteerLocationsResponse = z
  .object({
    ok: z.literal(true),
    locations: z.array(VolunteerLocationResponse),
  })
  ;
const PresignVolunteerOpportunityCoverUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(5242880),
  })
  ;
const PresignVolunteerOpportunityCoverUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      ,
    coverImageKey: z.string(),
    expiresInSeconds: z.number(),
  })
  ;
const PresignVolunteerOpportunityCoverUploadResponse = z
  .object({
    ok: z.literal(true),
    upload: PresignVolunteerOpportunityCoverUploadResult,
  })
  ;
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
          
      )
      .min(1)
      .max(3),
  })
  ;
const PresignVolunteerApplicationDocumentUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      ,
    supportingDocument: z
      .object({ name: z.string(), key: z.string() })
      ,
    expiresInSeconds: z.number(),
  })
  ;
const PresignVolunteerApplicationDocumentUploadResponse = z
  .object({
    ok: z.literal(true),
    uploads: z.array(PresignVolunteerApplicationDocumentUploadResult),
  })
  ;
const VolunteerOpportunityReference = z
  .object({ id: z.string(), name: z.string() })
  ;
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
  ;
const VolunteerOpportunitiesPaginationResponse = z
  .object({
    limit: z.number(),
    hasMore: z.boolean(),
    nextCursor: z.string().nullable(),
    total: z.number().int().gte(0),
  })
  ;
const GetVolunteerOpportunitiesResponse = z
  .object({
    ok: z.literal(true),
    opportunities: z.array(VolunteerOpportunityListItemResponse),
    pagination: VolunteerOpportunitiesPaginationResponse,
  })
  ;
const VolunteerOpportunityContact = z
  .object({
    email: z.string().max(320).email(),
    telegramUsername: z.string().nullish(),
    phone: z.string().nullish(),
    websiteUrl: z.string().nullish(),
  })
  ;
const VolunteerOpportunityRoleRequest = z
  .object({
    title: z.string(),
    capacity: z.number().int().gte(1).lte(100000),
    responsibilities: z.array(z.string()).max(20).nullish(),
    requirements: z.array(z.string()).max(20).nullish(),
  })
  ;
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
  ;
const CreateVolunteerOpportunityRequest = CreateVolunteerOpportunityPayload.and(
  z.object({ coverImageKey: z.string().min(1).max(600) })
);
const VolunteerOpportunityContactResponse = z
  .object({
    email: z.string(),
    telegramUsername: z.string().nullable(),
    phone: z.string().nullable(),
    websiteUrl: z.string().nullable(),
  })
  ;
const VolunteerOpportunityOrganizerResponse = z
  .object({
    id: z.string(),
    name: z.string(),
    avatarKey: z.string().nullable(),
    opportunityCount: z.number(),
    organizerLocation: VolunteerOpportunityReference.and(z.unknown()),
    contact: VolunteerOpportunityContactResponse,
  })
  ;
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
  ;
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
  ;
const CreateVolunteerOpportunityResponse = z
  .object({ ok: z.literal(true), opportunity: VolunteerOpportunityResponse })
  ;
const GetVolunteerOpportunityResponse = z
  .object({ ok: z.literal(true), opportunity: VolunteerOpportunityResponse })
  ;
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
    z.object({ id: z.string().uuid() }).partial()
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
  ;
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
          
      )
      .max(3)
      .optional()
      .default([]),
    topPickRoleId: z.string().uuid().nullish(),
    roleId: z.string().uuid(),
  })
  ;
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
  ;
const VolunteerApplicationRoleResponse = z
  .object({ id: z.string(), title: z.string() })
  ;
const VolunteerApplicationResponse = z
  .object({
    id: z.string(),
    opportunity: VolunteerApplicationOpportunity,
    role: VolunteerApplicationRoleResponse,
    availability: z.string(),
    relevantExperience: z.string(),
    supportingDocuments: z.array(
      z.object({ name: z.string(), key: z.string() })
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
  ;
const CreateVolunteerApplicationResponse = z
  .object({ ok: z.literal(true), application: VolunteerApplicationResponse })
  ;
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
          
      )
      .max(3)
      .optional()
      .default([]),
    topPickRoleId: z.string().uuid().nullish(),
    roleIds: z.array(z.string().uuid()).min(1).max(20),
  })
  ;
const CreateVolunteerApplicationBatchResponse = z
  .object({
    ok: z.literal(true),
    applications: z.array(VolunteerApplicationResponse),
  })
  ;
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
  ;
const GetPublicVolunteerOpportunityResponse = z
  .object({
    ok: z.literal(true),
    opportunity: PublicVolunteerOpportunityResponse,
  })
  ;
const ReportingTypeResponse = z
  .object({ id: z.string(), type: z.string() })
  ;
const GetReportingTypesResponse = z
  .object({ ok: z.boolean(), reportingTypes: z.array(ReportingTypeResponse) })
  ;
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
  ;
const CreateReportingResponse = z
  .object({ ok: z.boolean(), reportingId: z.string().uuid() })
  ;
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
  ;
const GetLaunchpadCategoriesResponse = z
  .object({ ok: z.boolean(), categories: z.array(LaunchpadCategoryResponse) })
  ;
const PresignLaunchpadImageUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(5242880),
  })
  ;
const PresignLaunchpadLogoUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      ,
    logoImageKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  ;
const PresignLaunchpadLogoUploadResponse = z
  .object({ ok: z.literal(true), upload: PresignLaunchpadLogoUploadResult })
  ;
const LaunchpadLogoValidationErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    issues: z.array(
      z.object({ path: z.string(), message: z.string() })
    ),
  })
  ;
const LaunchpadOperationErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;
const PresignLaunchpadCoverUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      ,
    coverImageKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  ;
const PresignLaunchpadCoverUploadResponse = z
  .object({ ok: z.literal(true), upload: PresignLaunchpadCoverUploadResult })
  ;
const PresignLaunchpadDocumentUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(10485760),
  })
  ;
const PresignLaunchpadDocumentUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      ,
    documentKey: z.string(),
    publicUrl: z.string().nullable(),
    expiresInSeconds: z.number(),
  })
  ;
const PresignLaunchpadDocumentUploadResponse = z
  .object({ ok: z.literal(true), upload: PresignLaunchpadDocumentUploadResult })
  ;
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
            ,
          createdAt: z.string().datetime({ offset: true }),
          category: z
            .object({ id: z.string(), name: z.string() })
            
            .optional(),
          city: z
            .object({ id: z.string(), name: z.string() })
            
            .optional(),
          totalRoles: z.number(),
          totalView: z.number(),
          isSaved: z.literal(true),
          savedAt: z.string().datetime({ offset: true }),
        })
        
    ),
    nextCursor: z.string().nullable(),
  })
  ;

const SaveLaunchpadResponse = z.object({ ok: z.literal(true) });
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
          
      )
      .min(1),
    materialDocumentKey: z.array(z.string().min(1).max(255)).min(1).max(5),
    materialDocumentName: z.array(z.string().min(1).max(255)).min(1).max(5),
    phoneNumber: z.string(),
    email: z.string().max(255).email(),
    telegramUsername: z.string().nullish(),
  })
  ;
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
          ,
        createdAt: z.string().datetime({ offset: true }),
        category: z
          .object({ id: z.string(), name: z.string() })
          
          .optional(),
        city: z
          .object({ id: z.string(), name: z.string() })
          
          .optional(),
        roles: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              capacity: z.number(),
            })
            
        ),
      })
      ,
  })
  ;
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
            ,
          createdAt: z.string().datetime({ offset: true }),
          category: z
            .object({ id: z.string(), name: z.string() })
            
            .optional(),
          city: z
            .object({ id: z.string(), name: z.string() })
            
            .optional(),
          totalRoles: z.number(),
          totalView: z.number(),
          isSaved: z.boolean(),
        })
        
    ),
    nextCursor: z.string().nullable(),
  })
  ;
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
  ;
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
          ,
        createdAt: z.string().datetime({ offset: true }),
        category: z
          .object({ id: z.string(), name: z.string() })
          
          .optional(),
        city: z
          .object({ id: z.string(), name: z.string() })
          
          .optional(),
        roles: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              capacity: z.number(),
            })
            
        ),
        viewerBlocked: z.boolean(),
        totalView: z.number(),
      })
      ,
  })
  ;
const PresignLaunchpadApplicationDocumentUploadRequest = z
  .object({
    contentType: z.string(),
    fileSize: z.number().int().gt(0).lte(10485760),
  })
  ;
const PresignLaunchpadApplicationDocumentUploadResult = z
  .object({
    uploadUrl: z.string(),
    method: z.literal("PUT"),
    requiredHeaders: z
      .object({ "Content-Length": z.string(), "Content-Type": z.string() })
      ,
    documentKey: z.string(),
    expiresInSeconds: z.number(),
  })
  ;
const PresignLaunchpadApplicationDocumentUploadResponse = z
  .object({
    ok: z.literal(true),
    upload: PresignLaunchpadApplicationDocumentUploadResult,
  })
  ;
const LaunchpadApplicationValidationErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    issues: z.array(
      z.object({ path: z.string(), message: z.string() })
    ),
  })
  ;
const LaunchpadApplicationOperationErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;
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
  ;
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
  ;
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
  ;
const CreateLaunchpadApplicationResponse = z
  .object({ ok: z.literal(true), application: LaunchpadApplication })
  ;
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
  ;
const CreateLaunchpadApplicationBatchResponse = z
  .object({ ok: z.literal(true), applications: z.array(LaunchpadApplication) })
  ;

const LaunchpadApplicationBatchErrorResponse = z.union([
  LaunchpadApplicationValidationErrorResponse,
  LaunchpadApplicationOperationErrorResponse,
]);
const GetLaunchpadApplicationResponse = z
  .object({ ok: z.literal(true), application: LaunchpadApplication })
  ;

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
  ;
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
      ,
    confirmed: z.string().nullable(),
    completed: z.string().nullable(),
    withdrawn: z.string().nullable(),
  })
  ;
const MyApplicationRole = z
  .object({
    applicationId: z.string(),
    roleId: z.string(),
    title: z.string(),
    status: MyApplicationStatusGroup,
    appliedAt: z.string(),
    timeline: MyApplicationTimeline,
  })
  ;
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
  ;
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
  ;
const MyApplicationsResponse = z
  .object({
    ok: z.literal(true),
    applications: z.array(MyApplicationItem).nullable(),
    summary: MyApplicationsSummary,
  })
  ;
const MyApplicationsErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;
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
      ,
    timeline: MyApplicationTimeline,
  })
  ;
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
      ,
    owner: z
      .object({
        id: z.string(),
        name: z.string(),
        avatarKey: z.string().nullable(),
        postedCount: z.number().int().gte(0),
        contact: z
          .object({
            email: z.string(),
            phoneNumber: z.string().nullable(),
            telegramUsername: z.string().nullable(),
          })
          ,
      })
      ,
    roles: z.array(MyApplicationRoleDetail),
    approvedRole: MyApplicationRole.and(z.unknown()),
  })
  ;
const MyApplicationDetailResponse = z
  .object({ ok: z.literal(true), application: MyApplicationDetail })
  ;
const MyApplicationStatusActionResponse = z
  .object({ ok: z.literal(true), application: MyApplicationItem })
  ;
const MyApplicationArchiveActionResponse = z
  .object({
    ok: z.literal(true),
    application: MyApplicationItem.and(
      z.object({ archived: z.boolean() })
    ),
  })
  ;
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
              
              .nullable(),
            telegramUsername: z.string().nullable(),
          })
          ,
        profile: z
          .object({
            avatarKey: z.string().nullable(),
            bio: z.string().nullable(),
            country: z
              .object({
                id: z.string(),
                name: z.string(),
                iso2: z.string().nullable(),
              })
              
              .nullable(),
            city: z
              .object({ id: z.string(), name: z.string() })
              
              .nullable(),
            visibility: z
              .object({
                profile: z.enum(["public", "members", "private"]),
                contact: z.enum(["public", "members", "private"]),
                socialLinks: z.enum(["public", "members", "private"]),
                contributions: z.enum(["public", "members", "private"]),
              })
              ,
          })
          ,
        skills: z.array(
          z.object({ id: z.string(), name: z.string() })
        ),
        socialLinks: z
          .object({
            website: z.string().nullable(),
            linkedin: z.string().nullable(),
            twitter: z.string().nullable(),
            facebook: z.string().nullable(),
          })
          ,
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
              
              .nullable(),
            nextTier: z
              .object({
                id: z.string(),
                slug: z.string(),
                name: z.string(),
                rankOrder: z.number(),
                minPoints: z.number(),
              })
              
              .nullable(),
            pointsUntilNextTier: z.number(),
          })
          ,
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
            
        ),
      })
      ,
  })
  ;
const ProfileErrorResponse = z
  .object({
    ok: z.literal(false),
    error: z.string(),
    issues: z.array(z.string()).optional(),
  })
  ;
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
              
              .nullable(),
            telegramUsername: z.string().nullable(),
          })
          ,
        profile: z
          .object({
            avatarKey: z.string().nullable(),
            bio: z.string().nullable(),
            country: z
              .object({
                id: z.string(),
                name: z.string(),
                iso2: z.string().nullable(),
              })
              
              .nullable(),
            city: z
              .object({ id: z.string(), name: z.string() })
              
              .nullable(),
            visibility: z
              .object({
                profile: z.enum(["public", "members", "private"]),
                contact: z.enum(["public", "members", "private"]),
                socialLinks: z.enum(["public", "members", "private"]),
                contributions: z.enum(["public", "members", "private"]),
              })
              ,
          })
          ,
        skills: z.array(
          z.object({ id: z.string(), name: z.string() })
        ),
        socialLinks: z
          .object({
            website: z.string().nullable(),
            linkedin: z.string().nullable(),
            twitter: z.string().nullable(),
            facebook: z.string().nullable(),
          })
          ,
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
              
              .nullable(),
            nextTier: z
              .object({
                id: z.string(),
                slug: z.string(),
                name: z.string(),
                rankOrder: z.number(),
                minPoints: z.number(),
              })
              
              .nullable(),
            pointsUntilNextTier: z.number(),
          })
          ,
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
            
        ),
      })
      ,
  })
  ;
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
  ;
const GetRecentActivitiesResponse = z
  .object({ ok: z.literal(true), activities: z.array(RecentActivity) })
  ;
const RecentActivityErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;
const SearchSkillsResponse = z
  .object({
    ok: z.literal(true),
    skills: z.array(
      z.object({ id: z.string(), name: z.string() })
    ),
  })
  ;
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
                  ,
                createdAt: z.string().datetime({ offset: true }),
                category: z
                  .object({ id: z.string(), name: z.string() })
                  
                  .optional(),
                city: z
                  .object({ id: z.string(), name: z.string() })
                  
                  .optional(),
                totalRoles: z.number(),
                totalView: z.number(),
                isSaved: z.literal(true),
                savedAt: z.string().datetime({ offset: true }),
              })
              ,
          })
          ,
        z
          .object({
            type: z.literal("volunteer"),
            savedAt: z.string().datetime({ offset: true }),
            item: VolunteerOpportunityListItemResponse,
          })
          ,
        z
          .object({
            type: z.literal("forum"),
            savedAt: z.string().datetime({ offset: true }),
            item: QuestionResponse,
          })
          ,
      ])
    ),
    pagination: z
      .object({
        limit: z.number(),
        hasMore: z.boolean(),
        nextCursor: z.string().nullable(),
        total: z.number().int().gte(0),
      })
      ,
    counts: z
      .object({
        all: z.number().int().gte(0),
        project: z.number().int().gte(0),
        volunteer: z.number().int().gte(0),
        forum: z.number().int().gte(0),
      })
      ,
  })
  ;
const SavedItemsErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;
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
              
              .nullable(),
            telegramUsername: z.string().nullable(),
          })
          ,
        profile: z
          .object({
            avatarKey: z.string().nullable(),
            bio: z.string().nullable(),
            country: z
              .object({
                id: z.string(),
                name: z.string(),
                iso2: z.string().nullable(),
              })
              
              .nullable(),
            city: z
              .object({ id: z.string(), name: z.string() })
              
              .nullable(),
          })
          ,
        skills: z.array(
          z.object({ id: z.string(), name: z.string() })
        ),
        socialLinks: z
          .object({
            website: z.string().nullable(),
            linkedin: z.string().nullable(),
            twitter: z.string().nullable(),
            facebook: z.string().nullable(),
          })
          ,
        tier: z
          .object({
            id: z.string(),
            slug: z.string(),
            name: z.string(),
            rankOrder: z.number(),
            minPoints: z.number(),
          })
          
          .nullable(),
        postedCounts: z
          .object({
            forum: z.number().int().gte(0),
            volunteer: z.number().int().gte(0),
            project: z.number().int().gte(0),
          })
          
          .nullable(),
      })
      ,
  })
  ;

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
        ,
    })
    ,
  z
    .object({
      ok: z.literal(true),
      sourceType: z.literal("volunteer"),
      opportunities: z.array(VolunteerOpportunityListItemResponse),
      pagination: VolunteerOpportunitiesPaginationResponse,
    })
    ,
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
              ,
            createdAt: z.string().datetime({ offset: true }),
            category: z
              .object({ id: z.string(), name: z.string() })
              
              .optional(),
            city: z
              .object({ id: z.string(), name: z.string() })
              
              .optional(),
            totalRoles: z.number(),
            totalView: z.number(),
            isSaved: z.boolean(),
          })
          
      ),
      nextCursor: z.string().nullable(),
    })
    ,
]);
const MyPostedErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;

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
  ;
const ManagePostingsPagination = z
  .object({
    page: z.number().int().gt(0),
    limit: z.number().int().gt(0),
    total: z.number().int().gte(0),
    totalPages: z.number().int().gte(0),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  })
  ;
const ManagePostingsResponse = z
  .object({
    ok: z.literal(true),
    postings: z.array(ManagePostingItem),
    pagination: ManagePostingsPagination,
  })
  ;
const ManagePostingsErrorResponse = z
  .object({ ok: z.literal(false), error: z.string() })
  ;

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
  ;
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
          z.object({ name: z.string(), key: z.string() })
        ),
      })
      
      .nullable(),
    project: z
      .object({
        motivation: z.string(),
        portfolio: z.string(),
        documentKeys: z.array(z.string()),
        documentNames: z.array(z.string()),
      })
      
      .nullable(),
  })
  ;
const ManagePostingApplicantPrivateNote = z
  .object({
    id: z.string(),
    note: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  ;
const ManagePostingApplicant = z
  .object({
    candidate: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phoneNumber: z.string().nullable(),
        telegramUsername: z.string().nullable(),
        avatarKey: z.string().nullable(),
      })
      ,
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
      ,
    privateNote: ManagePostingApplicantPrivateNote.nullable(),
  })
  ;
const ManagePostingCandidateDetailResponse = z
  .object({ ok: z.literal(true), applicant: ManagePostingApplicant })
  ;
const UpsertManagePostingCandidateNoteRequest = z
  .object({ note: z.string().max(5000) })
  ;
const UpsertManagePostingCandidateNoteResponse = z
  .object({ ok: z.literal(true), applicant: ManagePostingApplicant })
  ;
const UpdateManagePostingActionResponse = z
  .object({ ok: z.literal(true), posting: ManagePostingItem })
  ;
const ExtendManagePostingDeadlineRequest = z
  .object({ deadline: z.string().datetime({ offset: true }) })
  ;
const ExtendManagePostingDeadlineResponse = z
  .object({ ok: z.literal(true), posting: ManagePostingItem })
  ;
const ManagePostingApplicationActionResponse = z
  .object({ ok: z.literal(true), applicant: ManagePostingApplicant })
  ;
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
          ,
        filterCounts: z
          .object({
            all: z.number().int().gte(0),
            new: z.number().int().gte(0),
            in_review: z.number().int().gte(0),
            approved: z.number().int().gte(0),
            confirmed: z.number().int().gte(0),
            declined: z.number().int().gte(0),
          })
          ,
      })
      ,
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
      ,
  })
  ;
const ManagePostingDetailResponse = z
  .object({ ok: z.literal(true), detail: ManagePostingDetail })
  ;
const postV1notificationstokens_Body = z
  .object({
    token: z.string().min(1),
    platform: z.enum(["web", "android", "ios"]).optional().default("web"),
  })
  ;
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
  ;
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
  ;
const patchV1notificationsread_Body = z
  .object({ notificationIds: z.array(z.string().uuid()).min(1) })
  ;


export const schemas = {
  AuthRegisterRequest,
  AuthUserProfile,
  AuthUser,
  RegisterSuccessResponse,
  AuthPhoneForm,
  AuthWaitlistPrefill,
  AuthWaitlistContextResponse,
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
  AuthTwoFactorRequiredResponse,
  AuthRefreshRequest,
  RefreshSuccessResponse,
  AuthTwoFactorSettingsResponse,
  AuthTwoFactorTotpSetupRequest,
  AuthTwoFactorTotpSetupResponse,
  AuthTwoFactorSessionRequest,
  AuthTwoFactorTotpVerifyRequest,
  AuthLoginTwoFactorSessionRequest,
  AuthLoginTwoFactorTotpVerifyRequest,
  AuthStatusResponse,
  AuthTwoFactorEmailVerifyRequest,
  AuthLoginTwoFactorEmailVerifyRequest,
  AuthForgotPasswordRequest,
  ForgotPasswordResponse,
  AuthResetPasswordRequest,
  ResetPasswordResponse,
  AdminLoginRequest,
  AdminLoginOtpChallengeResponse,
  AdminErrorResponse,
  AdminVerifyLoginOtpRequest,
  AdminUser,
  AdminLoginResponse,
  AdminRefreshRequest,
  AdminRefreshResponse,
  AdminPresignAvatarUploadRequest,
  AdminPresignAvatarUploadResponse,
  AdminUpdateProfileRequest,
  AdminUpdateProfileResponse,
  AdminLogoutResponse,
  ContentModeratorReportType,
  ContentModeratorReportReporter,
  ContentModeratorReportSolver,
  ContentModeratorReport,
  CursorPagination,
  ListContentModeratorReportsResponse,
  UpdateContentModeratorReportReviewRequest,
  UpdateContentModeratorReportReviewResponse,
  AdminDashboardResponse,
  AdminDashboardErrorResponse,
  AcceptModeratorInviteRequest,
  InviteModeratorResponse,
  Moderator,
  ListModeratorsResponse,
  CreateModeratorRequest,
  ModeratorResponse,
  UpdateModeratorRequest,
  DeleteModeratorResponse,
  AdminUserManagementTier,
  AdminUserManagementUser,
  AdminUserManagementListResponse,
  AdminUserManagementPoints,
  AdminUserManagementActivity,
  AdminUserManagementDetailUser,
  AdminUserManagementDetailResponse,
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
  MyAnswerDiscussionResponse,
  MyAnswersPaginationResponse,
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
  SearchSkillsResponse,
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
        schema: z.number().int().gte(1).optional().default(20),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z.enum(["OPEN", "CLOSED"]).optional(),
      },
      {
        name: "typeId",
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
    method: "get",
    path: "/v1/admin/dashboard",
    alias: "getV1admindashboard",
    requestFormat: "json",
    response: AdminDashboardResponse,
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
        schema: AdminDashboardErrorResponse,
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
    response: AdminLoginOtpChallengeResponse,
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
        description: `OTP delivery failed`,
        schema: z.object({ error: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/admin/login/verify-otp",
    alias: "postV1adminloginverifyOtp",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AdminVerifyLoginOtpRequest,
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
        description: `Invalid or expired OTP challenge`,
        schema: z.void(),
      },
      {
        status: 429,
        description: `Too many OTP attempts`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Session creation failed`,
        schema: z.object({ error: z.string() }),
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
    method: "get",
    path: "/v1/admin/moderator",
    alias: "getV1adminmoderator",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(20),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: ListModeratorsResponse,
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
    path: "/v1/admin/moderator",
    alias: "postV1adminmoderator",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string().min(1) }),
      },
    ],
    response: z.object({ ok: z.boolean() }),
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
      {
        status: 409,
        description: `Email already in use`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/admin/moderator/:id",
    alias: "getV1adminmoderatorId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: ModeratorResponse,
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
      {
        status: 404,
        description: `Moderator not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/admin/moderator/:id",
    alias: "patchV1adminmoderatorId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateModeratorRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: ModeratorResponse,
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
        description: `Moderator not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/v1/admin/moderator/:id",
    alias: "deleteV1adminmoderatorId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$\/i/
          ),
      },
    ],
    response: z.object({ ok: z.boolean() }),
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
      {
        status: 404,
        description: `Moderator not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/admin/moderator/accept-invite",
    alias: "postV1adminmoderatoracceptInvite",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AcceptModeratorInviteRequest,
      },
    ],
    response: z.object({ ok: z.boolean() }),
    errors: [
      {
        status: 400,
        description: `Invalid or expired invite link`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/admin/presign-avatar",
    alias: "postV1adminpresignAvatar",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AdminPresignAvatarUploadRequest,
      },
    ],
    response: AdminPresignAvatarUploadResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Failed to generate upload URL`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/v1/admin/profile",
    alias: "patchV1adminprofile",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AdminUpdateProfileRequest,
      },
    ],
    response: AdminUpdateProfileResponse,
    errors: [
      {
        status: 400,
        description: `Invalid avatarKey`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Admin not found`,
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
        schema: z.object({ refreshToken: z.string().min(1) }),
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
    method: "get",
    path: "/v1/admin/user-management",
    alias: "getV1adminuserManagement",
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
        name: "status",
        type: "Query",
        schema: z
          .enum([
            "all",
            "SIGNUP_REQUIRED",
            "ONBOARDING_REQUIRED",
            "ACTIVE",
            "SUSPENDED",
          ])
          .optional(),
      },
      {
        name: "tier",
        type: "Query",
        schema: z
          .enum(["all", "neary", "yothea", "reach", "preah", "indra"])
          .optional(),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().min(1).max(100).optional(),
      },
    ],
    response: AdminUserManagementListResponse,
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
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          ,
      },
    ],
  },
  {
    method: "get",
    path: "/v1/admin/user-management/:userId",
    alias: "getV1adminuserManagementUserId",
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: AdminUserManagementDetailResponse,
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
        description: `User not found`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          ,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          ,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/admin/user-management/:userId/:action",
    alias: "postV1adminuserManagementUserIdAction",
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "action",
        type: "Path",
        schema: z.enum(["suspend", "unsuspend"]),
      },
    ],
    response: z
      .object({ ok: z.literal(true), user: AdminUserManagementDetailUser })
      ,
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
        description: `User not found`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          ,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z
          .object({ ok: z.literal(false), error: z.string() })
          ,
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/2fa/email/disable",
    alias: "postV1auth2faemaildisable",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial(),
      },
    ],
    response: z.object({ status: z.boolean() }),
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
    ],
  },
  {
    method: "post",
    path: "/v1/auth/2fa/email/send",
    alias: "postV1auth2faemailsend",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial(),
      },
    ],
    response: z.object({ status: z.boolean() }),
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
        status: 409,
        description: `Email OTP already enabled`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/2fa/email/verify",
    alias: "postV1auth2faemailverify",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthTwoFactorEmailVerifyRequest,
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
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 409,
        description: `Email OTP already enabled`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/v1/auth/2fa/settings",
    alias: "getV1auth2fasettings",
    requestFormat: "json",
    response: AuthTwoFactorSettingsResponse,
    errors: [
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
    path: "/v1/auth/2fa/totp/disable",
    alias: "postV1auth2fatotpdisable",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({}).partial(),
      },
    ],
    response: z.object({ status: z.boolean() }),
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
    ],
  },
  {
    method: "post",
    path: "/v1/auth/2fa/totp/setup",
    alias: "postV1auth2fatotpsetup",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ password: z.string().min(1) }),
      },
    ],
    response: AuthTwoFactorTotpSetupResponse,
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
        status: 409,
        description: `Authenticator app already enabled`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/2fa/totp/verify",
    alias: "postV1auth2fatotpverify",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthTwoFactorTotpVerifyRequest,
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
        description: `Unauthorized`,
        schema: z.void(),
      },
      {
        status: 409,
        description: `Authenticator app already enabled`,
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
        schema: z.object({ error: z.string() }),
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
        schema: AuthGoogleRequest,
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
    response: z.union([AuthTokenResponse, AuthTwoFactorRequiredResponse]),
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
    path: "/v1/auth/login/2fa/email/send",
    alias: "postV1authlogin2faemailsend",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ twoFactorToken: z.string().min(1) }),
      },
    ],
    response: z.object({ status: z.boolean() }),
    errors: [
      {
        status: 400,
        description: `Validation failed`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Invalid or expired two-factor challenge`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/login/2fa/email/verify",
    alias: "postV1authlogin2faemailverify",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthLoginTwoFactorEmailVerifyRequest,
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
        description: `Invalid or expired two-factor challenge`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/v1/auth/login/2fa/totp/verify",
    alias: "postV1authlogin2fatotpverify",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AuthLoginTwoFactorTotpVerifyRequest,
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
        description: `Invalid or expired two-factor challenge`,
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
        schema: z.object({ refreshToken: z.string().min(1) }),
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
        schema: z.object({ email: z.string().min(1).email() }),
      },
    ],
    response: ResendRegisterOtpResponse,
    errors: [
      {
        status: 400,
        description: `Invalid email`,
        schema: z.object({ error: z.string() }),
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
    method: "get",
    path: "/v1/auth/register/waitlist-context",
    alias: "getV1authregisterwaitlistContext",
    requestFormat: "json",
    parameters: [
      {
        name: "waitlistId",
        type: "Query",
        schema: z.string().uuid(),
      },
    ],
    response: AuthWaitlistContextResponse,
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
        schema: z.object({ error: z.string() }),
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
    response: z.object({ ok: z.boolean() }),
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
        schema: z.object({ body: z.string().min(1).max(10000) }),
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
    parameters: [
      {
        name: "search",
        type: "Query",
        schema: z.string().max(300).optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(20),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum(["lastActivity", "mostReplies", "category"])
          .optional()
          .default("lastActivity"),
      },
      {
        name: "cursor",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
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
        schema: z.object({ voteType: z.string() }),
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
        schema: z.number().int().gte(1).optional().default(10),
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
            "byCategory",
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
        schema: z.number().int().gte(1).optional().default(10),
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
            "byCategory",
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
    response: z.object({ ok: z.boolean() }),
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
    parameters: [
      {
        name: "search",
        type: "Query",
        schema: z.string().max(300).optional(),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum(["newest", "mostVoted", "mostAnswered", "byCategory"])
          .optional()
          .default("newest"),
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
        schema: z.number().int().gte(1).optional().default(10),
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
        schema: z.object({ voteType: z.string() }),
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
        schema: z.number().int().gte(1).optional().default(20),
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
        schema: z.number().int().gte(1).optional().default(20),
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
        schema: z.number().int().gte(1).optional().default(20),
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
    path: "/v1/me/skills/search",
    alias: "getV1meskillssearch",
    requestFormat: "json",
    parameters: [
      {
        name: "search",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(20).optional().default(10),
      },
    ],
    response: SearchSkillsResponse,
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
        status: 500,
        description: `Internal server error`,
        schema: ProfileErrorResponse,
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
        schema: z.number().int().gte(1).optional().default(20),
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
            
        ),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        unreadCounts: z.record(z.string(), z.number()),
      })
      ,
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
          ,
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
      ,
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
          ,
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
      ,
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
          ,
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
      ,
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
          ,
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
      ,
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
          ,
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
      ,
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
          ,
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
        schema: z.object({ token: z.string().min(1) }),
      },
    ],
    response: z
      .object({
        ok: z.boolean(),
        message: z.string(),
        platform: z.enum(["web", "android", "ios"]).optional().default("web"),
      })
      ,
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
          ,
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
        schema: z.number().int().gte(1).optional().default(20),
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
        schema: z.object({ note: z.string().max(5000) }),
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
          ,
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


// Generated API schema types
export type AuthRegisterRequest = z.infer<typeof schemas.AuthRegisterRequest>;
export type AuthUserProfile = z.infer<typeof schemas.AuthUserProfile>;
export type AuthUser = z.infer<typeof schemas.AuthUser>;
export type RegisterSuccessResponse = z.infer<typeof schemas.RegisterSuccessResponse>;
export type AuthPhoneForm = z.infer<typeof schemas.AuthPhoneForm>;
export type AuthWaitlistPrefill = z.infer<typeof schemas.AuthWaitlistPrefill>;
export type AuthWaitlistContextResponse = z.infer<typeof schemas.AuthWaitlistContextResponse>;
export type AuthCompleteSignUpRequest = z.infer<typeof schemas.AuthCompleteSignUpRequest>;
export type AuthAccessState = z.infer<typeof schemas.AuthAccessState>;
export type AuthRequiredAction = z.infer<typeof schemas.AuthRequiredAction>;
export type AuthFlow = z.infer<typeof schemas.AuthFlow>;
export type CompleteSignUpResponse = z.infer<typeof schemas.CompleteSignUpResponse>;
export type AuthSessionResponse = z.infer<typeof schemas.AuthSessionResponse>;
export type AuthProtectedErrorResponse = z.infer<typeof schemas.AuthProtectedErrorResponse>;
export type AuthGoogleRequest = z.infer<typeof schemas.AuthGoogleRequest>;
export type AuthTokenResponse = z.infer<typeof schemas.AuthTokenResponse>;
export type AuthVerifyRegisterOtpRequest = z.infer<typeof schemas.AuthVerifyRegisterOtpRequest>;
export type AuthResendRegisterOtpRequest = z.infer<typeof schemas.AuthResendRegisterOtpRequest>;
export type ResendRegisterOtpResponse = z.infer<typeof schemas.ResendRegisterOtpResponse>;
export type AuthSimpleErrorResponse = z.infer<typeof schemas.AuthSimpleErrorResponse>;
export type AuthLoginRequest = z.infer<typeof schemas.AuthLoginRequest>;
export type AuthTwoFactorRequiredResponse = z.infer<typeof schemas.AuthTwoFactorRequiredResponse>;
export type AuthRefreshRequest = z.infer<typeof schemas.AuthRefreshRequest>;
export type RefreshSuccessResponse = z.infer<typeof schemas.RefreshSuccessResponse>;
export type AuthTwoFactorSettingsResponse = z.infer<typeof schemas.AuthTwoFactorSettingsResponse>;
export type AuthTwoFactorTotpSetupRequest = z.infer<typeof schemas.AuthTwoFactorTotpSetupRequest>;
export type AuthTwoFactorTotpSetupResponse = z.infer<typeof schemas.AuthTwoFactorTotpSetupResponse>;
export type AuthTwoFactorSessionRequest = z.infer<typeof schemas.AuthTwoFactorSessionRequest>;
export type AuthTwoFactorTotpVerifyRequest = z.infer<typeof schemas.AuthTwoFactorTotpVerifyRequest>;
export type AuthLoginTwoFactorSessionRequest = z.infer<typeof schemas.AuthLoginTwoFactorSessionRequest>;
export type AuthLoginTwoFactorTotpVerifyRequest = z.infer<typeof schemas.AuthLoginTwoFactorTotpVerifyRequest>;
export type AuthStatusResponse = z.infer<typeof schemas.AuthStatusResponse>;
export type AuthTwoFactorEmailVerifyRequest = z.infer<typeof schemas.AuthTwoFactorEmailVerifyRequest>;
export type AuthLoginTwoFactorEmailVerifyRequest = z.infer<typeof schemas.AuthLoginTwoFactorEmailVerifyRequest>;
export type AuthForgotPasswordRequest = z.infer<typeof schemas.AuthForgotPasswordRequest>;
export type ForgotPasswordResponse = z.infer<typeof schemas.ForgotPasswordResponse>;
export type AuthResetPasswordRequest = z.infer<typeof schemas.AuthResetPasswordRequest>;
export type ResetPasswordResponse = z.infer<typeof schemas.ResetPasswordResponse>;
export type AdminLoginRequest = z.infer<typeof schemas.AdminLoginRequest>;
export type AdminLoginOtpChallengeResponse = z.infer<typeof schemas.AdminLoginOtpChallengeResponse>;
export type AdminErrorResponse = z.infer<typeof schemas.AdminErrorResponse>;
export type AdminVerifyLoginOtpRequest = z.infer<typeof schemas.AdminVerifyLoginOtpRequest>;
export type AdminUser = z.infer<typeof schemas.AdminUser>;
export type AdminLoginResponse = z.infer<typeof schemas.AdminLoginResponse>;
export type AdminRefreshRequest = z.infer<typeof schemas.AdminRefreshRequest>;
export type AdminRefreshResponse = z.infer<typeof schemas.AdminRefreshResponse>;
export type AdminPresignAvatarUploadRequest = z.infer<typeof schemas.AdminPresignAvatarUploadRequest>;
export type AdminPresignAvatarUploadResponse = z.infer<typeof schemas.AdminPresignAvatarUploadResponse>;
export type AdminUpdateProfileRequest = z.infer<typeof schemas.AdminUpdateProfileRequest>;
export type AdminUpdateProfileResponse = z.infer<typeof schemas.AdminUpdateProfileResponse>;
export type AdminLogoutResponse = z.infer<typeof schemas.AdminLogoutResponse>;
export type ContentModeratorReportType = z.infer<typeof schemas.ContentModeratorReportType>;
export type ContentModeratorReportReporter = z.infer<typeof schemas.ContentModeratorReportReporter>;
export type ContentModeratorReportSolver = z.infer<typeof schemas.ContentModeratorReportSolver>;
export type ContentModeratorReport = z.infer<typeof schemas.ContentModeratorReport>;
export type CursorPagination = z.infer<typeof schemas.CursorPagination>;
export type ListContentModeratorReportsResponse = z.infer<typeof schemas.ListContentModeratorReportsResponse>;
export type UpdateContentModeratorReportReviewRequest = z.infer<typeof schemas.UpdateContentModeratorReportReviewRequest>;
export type UpdateContentModeratorReportReviewResponse = z.infer<typeof schemas.UpdateContentModeratorReportReviewResponse>;
export type AdminDashboardResponse = z.infer<typeof schemas.AdminDashboardResponse>;
export type AdminDashboardErrorResponse = z.infer<typeof schemas.AdminDashboardErrorResponse>;
export type AcceptModeratorInviteRequest = z.infer<typeof schemas.AcceptModeratorInviteRequest>;
export type InviteModeratorResponse = z.infer<typeof schemas.InviteModeratorResponse>;
export type Moderator = z.infer<typeof schemas.Moderator>;
export type ListModeratorsResponse = z.infer<typeof schemas.ListModeratorsResponse>;
export type CreateModeratorRequest = z.infer<typeof schemas.CreateModeratorRequest>;
export type ModeratorResponse = z.infer<typeof schemas.ModeratorResponse>;
export type UpdateModeratorRequest = z.infer<typeof schemas.UpdateModeratorRequest>;
export type DeleteModeratorResponse = z.infer<typeof schemas.DeleteModeratorResponse>;
export type AdminUserManagementTier = z.infer<typeof schemas.AdminUserManagementTier>;
export type AdminUserManagementUser = z.infer<typeof schemas.AdminUserManagementUser>;
export type AdminUserManagementListResponse = z.infer<typeof schemas.AdminUserManagementListResponse>;
export type AdminUserManagementPoints = z.infer<typeof schemas.AdminUserManagementPoints>;
export type AdminUserManagementActivity = z.infer<typeof schemas.AdminUserManagementActivity>;
export type AdminUserManagementDetailUser = z.infer<typeof schemas.AdminUserManagementDetailUser>;
export type AdminUserManagementDetailResponse = z.infer<typeof schemas.AdminUserManagementDetailResponse>;
export type OnboardingOkResponse = z.infer<typeof schemas.OnboardingOkResponse>;
export type OnboardingErrorResponse = z.infer<typeof schemas.OnboardingErrorResponse>;
export type OnboardingProfileStepRequest = z.infer<typeof schemas.OnboardingProfileStepRequest>;
export type OnboardingInterestsStepRequest = z.infer<typeof schemas.OnboardingInterestsStepRequest>;
export type OnboardingContributionsStepRequest = z.infer<typeof schemas.OnboardingContributionsStepRequest>;
export type PresignAvatarUploadRequest = z.infer<typeof schemas.PresignAvatarUploadRequest>;
export type PresignAvatarUploadResult = z.infer<typeof schemas.PresignAvatarUploadResult>;
export type PresignAvatarUploadResponse = z.infer<typeof schemas.PresignAvatarUploadResponse>;
export type CategoryResponse = z.infer<typeof schemas.CategoryResponse>;
export type CategoryWithQuestionCountResponse = z.infer<typeof schemas.CategoryWithQuestionCountResponse>;
export type GetCategoriesResponse = z.infer<typeof schemas.GetCategoriesResponse>;
export type CreateCategoryRequest = z.infer<typeof schemas.CreateCategoryRequest>;
export type CreateCategoryResponse = z.infer<typeof schemas.CreateCategoryResponse>;
export type isUnanswered = z.infer<typeof schemas.isUnanswered>;
export type QuestionTagResponse = z.infer<typeof schemas.QuestionTagResponse>;
export type QuestionResponse = z.infer<typeof schemas.QuestionResponse>;
export type GetQuestionsResponse = z.infer<typeof schemas.GetQuestionsResponse>;
export type CreateQuestionRequest = z.infer<typeof schemas.CreateQuestionRequest>;
export type CreateQuestionResponse = z.infer<typeof schemas.CreateQuestionResponse>;
export type TrendingTagResponse = z.infer<typeof schemas.TrendingTagResponse>;
export type GetTrendingTagsResponse = z.infer<typeof schemas.GetTrendingTagsResponse>;
export type GetMyQuestionsResponse = z.infer<typeof schemas.GetMyQuestionsResponse>;
export type GetSavedQuestionsResponse = z.infer<typeof schemas.GetSavedQuestionsResponse>;
export type GetQuestionResponse = z.infer<typeof schemas.GetQuestionResponse>;
export type PresignForumQuestionImageUploadRequest = z.infer<typeof schemas.PresignForumQuestionImageUploadRequest>;
export type PresignForumQuestionImageUploadResult = z.infer<typeof schemas.PresignForumQuestionImageUploadResult>;
export type PresignForumQuestionImageUploadResponse = z.infer<typeof schemas.PresignForumQuestionImageUploadResponse>;
export type EditQuestionRequest = z.infer<typeof schemas.EditQuestionRequest>;
export type VoteQuestionRequest = z.infer<typeof schemas.VoteQuestionRequest>;
export type SaveQuestionResponse = z.infer<typeof schemas.SaveQuestionResponse>;
export type RepliedAnswerResponse = z.infer<typeof schemas.RepliedAnswerResponse>;
export type AnswerResponse = z.infer<typeof schemas.AnswerResponse>;
export type GetAnswersResponse = z.infer<typeof schemas.GetAnswersResponse>;
export type AnswerQuestionResponse = z.infer<typeof schemas.AnswerQuestionResponse>;
export type MyAnswerResponse = z.infer<typeof schemas.MyAnswerResponse>;
export type MyAnswerDiscussionResponse = z.infer<typeof schemas.MyAnswerDiscussionResponse>;
export type MyAnswersPaginationResponse = z.infer<typeof schemas.MyAnswersPaginationResponse>;
export type GetMyAnswersResponse = z.infer<typeof schemas.GetMyAnswersResponse>;
export type CreateAnswerRequest = z.infer<typeof schemas.CreateAnswerRequest>;
export type CreateAnswerResponse = z.infer<typeof schemas.CreateAnswerResponse>;
export type UpdateAnswerRequest = z.infer<typeof schemas.UpdateAnswerRequest>;
export type EditAnswerResponse = z.infer<typeof schemas.EditAnswerResponse>;
export type AnswerErrorResponse = z.infer<typeof schemas.AnswerErrorResponse>;
export type DeleteAnswerResponse = z.infer<typeof schemas.DeleteAnswerResponse>;
export type VoteAnswerRequest = z.infer<typeof schemas.VoteAnswerRequest>;
export type VoteAnswerResponse = z.infer<typeof schemas.VoteAnswerResponse>;
export type MarkBestAnswerResponse = z.infer<typeof schemas.MarkBestAnswerResponse>;
export type VolunteerCategoryResponse = z.infer<typeof schemas.VolunteerCategoryResponse>;
export type VolunteerCategoryWithOpportunityCountResponse = z.infer<typeof schemas.VolunteerCategoryWithOpportunityCountResponse>;
export type GetVolunteerCategoriesResponse = z.infer<typeof schemas.GetVolunteerCategoriesResponse>;
export type VolunteerOperationErrorResponse = z.infer<typeof schemas.VolunteerOperationErrorResponse>;
export type CreateVolunteerCategoryRequest = z.infer<typeof schemas.CreateVolunteerCategoryRequest>;
export type CreateVolunteerCategoryResponse = z.infer<typeof schemas.CreateVolunteerCategoryResponse>;
export type VolunteerCategoryValidationErrorResponse = z.infer<typeof schemas.VolunteerCategoryValidationErrorResponse>;
export type VolunteerLocationResponse = z.infer<typeof schemas.VolunteerLocationResponse>;
export type GetVolunteerLocationsResponse = z.infer<typeof schemas.GetVolunteerLocationsResponse>;
export type PresignVolunteerOpportunityCoverUploadRequest = z.infer<typeof schemas.PresignVolunteerOpportunityCoverUploadRequest>;
export type PresignVolunteerOpportunityCoverUploadResult = z.infer<typeof schemas.PresignVolunteerOpportunityCoverUploadResult>;
export type PresignVolunteerOpportunityCoverUploadResponse = z.infer<typeof schemas.PresignVolunteerOpportunityCoverUploadResponse>;
export type PresignVolunteerApplicationDocumentUploadRequest = z.infer<typeof schemas.PresignVolunteerApplicationDocumentUploadRequest>;
export type PresignVolunteerApplicationDocumentUploadResult = z.infer<typeof schemas.PresignVolunteerApplicationDocumentUploadResult>;
export type PresignVolunteerApplicationDocumentUploadResponse = z.infer<typeof schemas.PresignVolunteerApplicationDocumentUploadResponse>;
export type VolunteerOpportunityReference = z.infer<typeof schemas.VolunteerOpportunityReference>;
export type VolunteerOpportunityListItemResponse = z.infer<typeof schemas.VolunteerOpportunityListItemResponse>;
export type VolunteerOpportunitiesPaginationResponse = z.infer<typeof schemas.VolunteerOpportunitiesPaginationResponse>;
export type GetVolunteerOpportunitiesResponse = z.infer<typeof schemas.GetVolunteerOpportunitiesResponse>;
export type VolunteerOpportunityContact = z.infer<typeof schemas.VolunteerOpportunityContact>;
export type VolunteerOpportunityRoleRequest = z.infer<typeof schemas.VolunteerOpportunityRoleRequest>;
export type CreateVolunteerOpportunityPayload = z.infer<typeof schemas.CreateVolunteerOpportunityPayload>;
export type CreateVolunteerOpportunityRequest = z.infer<typeof schemas.CreateVolunteerOpportunityRequest>;
export type VolunteerOpportunityContactResponse = z.infer<typeof schemas.VolunteerOpportunityContactResponse>;
export type VolunteerOpportunityOrganizerResponse = z.infer<typeof schemas.VolunteerOpportunityOrganizerResponse>;
export type VolunteerOpportunityRoleResponse = z.infer<typeof schemas.VolunteerOpportunityRoleResponse>;
export type VolunteerOpportunityResponse = z.infer<typeof schemas.VolunteerOpportunityResponse>;
export type CreateVolunteerOpportunityResponse = z.infer<typeof schemas.CreateVolunteerOpportunityResponse>;
export type GetVolunteerOpportunityResponse = z.infer<typeof schemas.GetVolunteerOpportunityResponse>;
export type UpdateVolunteerOpportunityContactRequest = z.infer<typeof schemas.UpdateVolunteerOpportunityContactRequest>;
export type UpdateVolunteerOpportunityRoleRequest = z.infer<typeof schemas.UpdateVolunteerOpportunityRoleRequest>;
export type UpdateVolunteerOpportunityRequest = z.infer<typeof schemas.UpdateVolunteerOpportunityRequest>;
export type SaveVolunteerOpportunityResponse = z.infer<typeof schemas.SaveVolunteerOpportunityResponse>;
export type CreateVolunteerApplicationRequest = z.infer<typeof schemas.CreateVolunteerApplicationRequest>;
export type VolunteerApplicationOpportunity = z.infer<typeof schemas.VolunteerApplicationOpportunity>;
export type VolunteerApplicationRoleResponse = z.infer<typeof schemas.VolunteerApplicationRoleResponse>;
export type VolunteerApplicationResponse = z.infer<typeof schemas.VolunteerApplicationResponse>;
export type CreateVolunteerApplicationResponse = z.infer<typeof schemas.CreateVolunteerApplicationResponse>;
export type CreateVolunteerApplicationBatchRequest = z.infer<typeof schemas.CreateVolunteerApplicationBatchRequest>;
export type CreateVolunteerApplicationBatchResponse = z.infer<typeof schemas.CreateVolunteerApplicationBatchResponse>;
export type PublicVolunteerOpportunityResponse = z.infer<typeof schemas.PublicVolunteerOpportunityResponse>;
export type GetPublicVolunteerOpportunityResponse = z.infer<typeof schemas.GetPublicVolunteerOpportunityResponse>;
export type ReportingTypeResponse = z.infer<typeof schemas.ReportingTypeResponse>;
export type GetReportingTypesResponse = z.infer<typeof schemas.GetReportingTypesResponse>;
export type CreateReportingRequest = z.infer<typeof schemas.CreateReportingRequest>;
export type CreateReportingResponse = z.infer<typeof schemas.CreateReportingResponse>;
export type LaunchpadCategoryResponse = z.infer<typeof schemas.LaunchpadCategoryResponse>;
export type GetLaunchpadCategoriesResponse = z.infer<typeof schemas.GetLaunchpadCategoriesResponse>;
export type PresignLaunchpadImageUploadRequest = z.infer<typeof schemas.PresignLaunchpadImageUploadRequest>;
export type PresignLaunchpadLogoUploadResult = z.infer<typeof schemas.PresignLaunchpadLogoUploadResult>;
export type PresignLaunchpadLogoUploadResponse = z.infer<typeof schemas.PresignLaunchpadLogoUploadResponse>;
export type LaunchpadLogoValidationErrorResponse = z.infer<typeof schemas.LaunchpadLogoValidationErrorResponse>;
export type LaunchpadOperationErrorResponse = z.infer<typeof schemas.LaunchpadOperationErrorResponse>;
export type PresignLaunchpadCoverUploadResult = z.infer<typeof schemas.PresignLaunchpadCoverUploadResult>;
export type PresignLaunchpadCoverUploadResponse = z.infer<typeof schemas.PresignLaunchpadCoverUploadResponse>;
export type PresignLaunchpadDocumentUploadRequest = z.infer<typeof schemas.PresignLaunchpadDocumentUploadRequest>;
export type PresignLaunchpadDocumentUploadResult = z.infer<typeof schemas.PresignLaunchpadDocumentUploadResult>;
export type PresignLaunchpadDocumentUploadResponse = z.infer<typeof schemas.PresignLaunchpadDocumentUploadResponse>;
export type GetSavedLaunchpadsResponse = z.infer<typeof schemas.GetSavedLaunchpadsResponse>;
export type SaveLaunchpadResponse = z.infer<typeof schemas.SaveLaunchpadResponse>;
export type CreateLaunchpadRequest = z.infer<typeof schemas.CreateLaunchpadRequest>;
export type CreateLaunchpadResponse = z.infer<typeof schemas.CreateLaunchpadResponse>;
export type GetLaunchpadsResponse = z.infer<typeof schemas.GetLaunchpadsResponse>;
export type UpdateLaunchpadRoleRequest = z.infer<typeof schemas.UpdateLaunchpadRoleRequest>;
export type UpdateLaunchpadRequest = z.infer<typeof schemas.UpdateLaunchpadRequest>;
export type GetLaunchpadByIdResponse = z.infer<typeof schemas.GetLaunchpadByIdResponse>;
export type PresignLaunchpadApplicationDocumentUploadRequest = z.infer<typeof schemas.PresignLaunchpadApplicationDocumentUploadRequest>;
export type PresignLaunchpadApplicationDocumentUploadResult = z.infer<typeof schemas.PresignLaunchpadApplicationDocumentUploadResult>;
export type PresignLaunchpadApplicationDocumentUploadResponse = z.infer<typeof schemas.PresignLaunchpadApplicationDocumentUploadResponse>;
export type LaunchpadApplicationValidationErrorResponse = z.infer<typeof schemas.LaunchpadApplicationValidationErrorResponse>;
export type LaunchpadApplicationOperationErrorResponse = z.infer<typeof schemas.LaunchpadApplicationOperationErrorResponse>;
export type CreateLaunchpadApplicationRequest = z.infer<typeof schemas.CreateLaunchpadApplicationRequest>;
export type LaunchpadApplicationLog = z.infer<typeof schemas.LaunchpadApplicationLog>;
export type LaunchpadApplication = z.infer<typeof schemas.LaunchpadApplication>;
export type CreateLaunchpadApplicationResponse = z.infer<typeof schemas.CreateLaunchpadApplicationResponse>;
export type CreateLaunchpadApplicationBatchRequest = z.infer<typeof schemas.CreateLaunchpadApplicationBatchRequest>;
export type CreateLaunchpadApplicationBatchResponse = z.infer<typeof schemas.CreateLaunchpadApplicationBatchResponse>;
export type LaunchpadApplicationBatchErrorResponse = z.infer<typeof schemas.LaunchpadApplicationBatchErrorResponse>;
export type GetLaunchpadApplicationResponse = z.infer<typeof schemas.GetLaunchpadApplicationResponse>;
export type MyApplicationStatusGroup = z.infer<typeof schemas.MyApplicationStatusGroup>;
export type MyApplicationReference = z.infer<typeof schemas.MyApplicationReference>;
export type MyApplicationTimeline = z.infer<typeof schemas.MyApplicationTimeline>;
export type MyApplicationRole = z.infer<typeof schemas.MyApplicationRole>;
export type MyApplicationItem = z.infer<typeof schemas.MyApplicationItem>;
export type MyApplicationsSummary = z.infer<typeof schemas.MyApplicationsSummary>;
export type MyApplicationsResponse = z.infer<typeof schemas.MyApplicationsResponse>;
export type MyApplicationsErrorResponse = z.infer<typeof schemas.MyApplicationsErrorResponse>;
export type MyApplicationRoleDetail = z.infer<typeof schemas.MyApplicationRoleDetail>;
export type MyApplicationDetail = z.infer<typeof schemas.MyApplicationDetail>;
export type MyApplicationDetailResponse = z.infer<typeof schemas.MyApplicationDetailResponse>;
export type MyApplicationStatusActionResponse = z.infer<typeof schemas.MyApplicationStatusActionResponse>;
export type MyApplicationArchiveActionResponse = z.infer<typeof schemas.MyApplicationArchiveActionResponse>;
export type ProfileResponse = z.infer<typeof schemas.ProfileResponse>;
export type ProfileErrorResponse = z.infer<typeof schemas.ProfileErrorResponse>;
export type UpdateProfileRequest = z.infer<typeof schemas.UpdateProfileRequest>;
export type UpdateProfileResponse = z.infer<typeof schemas.UpdateProfileResponse>;
export type RecentActivity = z.infer<typeof schemas.RecentActivity>;
export type GetRecentActivitiesResponse = z.infer<typeof schemas.GetRecentActivitiesResponse>;
export type RecentActivityErrorResponse = z.infer<typeof schemas.RecentActivityErrorResponse>;
export type SearchSkillsResponse = z.infer<typeof schemas.SearchSkillsResponse>;
export type GetSavedItemsResponse = z.infer<typeof schemas.GetSavedItemsResponse>;
export type SavedItemsErrorResponse = z.infer<typeof schemas.SavedItemsErrorResponse>;
export type PublicProfileResponse = z.infer<typeof schemas.PublicProfileResponse>;
export type GetMyPostedResponse = z.infer<typeof schemas.GetMyPostedResponse>;
export type MyPostedErrorResponse = z.infer<typeof schemas.MyPostedErrorResponse>;
export type ManagePostingStatus = z.infer<typeof schemas.ManagePostingStatus>;
export type ManagePostingItem = z.infer<typeof schemas.ManagePostingItem>;
export type ManagePostingsPagination = z.infer<typeof schemas.ManagePostingsPagination>;
export type ManagePostingsResponse = z.infer<typeof schemas.ManagePostingsResponse>;
export type ManagePostingsErrorResponse = z.infer<typeof schemas.ManagePostingsErrorResponse>;
export type ManagePostingApplicantStatus = z.infer<typeof schemas.ManagePostingApplicantStatus>;
export type ManagePostingApplicationRole = z.infer<typeof schemas.ManagePostingApplicationRole>;
export type ManagePostingSubmission = z.infer<typeof schemas.ManagePostingSubmission>;
export type ManagePostingApplicantPrivateNote = z.infer<typeof schemas.ManagePostingApplicantPrivateNote>;
export type ManagePostingApplicant = z.infer<typeof schemas.ManagePostingApplicant>;
export type ManagePostingCandidateDetailResponse = z.infer<typeof schemas.ManagePostingCandidateDetailResponse>;
export type UpsertManagePostingCandidateNoteRequest = z.infer<typeof schemas.UpsertManagePostingCandidateNoteRequest>;
export type UpsertManagePostingCandidateNoteResponse = z.infer<typeof schemas.UpsertManagePostingCandidateNoteResponse>;
export type UpdateManagePostingActionResponse = z.infer<typeof schemas.UpdateManagePostingActionResponse>;
export type ExtendManagePostingDeadlineRequest = z.infer<typeof schemas.ExtendManagePostingDeadlineRequest>;
export type ExtendManagePostingDeadlineResponse = z.infer<typeof schemas.ExtendManagePostingDeadlineResponse>;
export type ManagePostingApplicationActionResponse = z.infer<typeof schemas.ManagePostingApplicationActionResponse>;
export type ManagePostingDetail = z.infer<typeof schemas.ManagePostingDetail>;
export type ManagePostingDetailResponse = z.infer<typeof schemas.ManagePostingDetailResponse>;
export type postV1notificationstokens_Body = z.infer<typeof schemas.postV1notificationstokens_Body>;
export type postV1notificationssenduser_Body = z.infer<typeof schemas.postV1notificationssenduser_Body>;
export type postV1notificationsbroadcast_Body = z.infer<typeof schemas.postV1notificationsbroadcast_Body>;
export type patchV1notificationsread_Body = z.infer<typeof schemas.patchV1notificationsread_Body>;
// End generated API schema types


export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
