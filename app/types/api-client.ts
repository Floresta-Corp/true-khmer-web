import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const AuthRegisterRequest = z.object({ firstName: z.string().min(2).max(100).regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u), lastName: z.string().min(2).max(100).regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u), gender: z.enum(["male", "female", "other"]), dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(), occupation: z.string().min(1).max(120), phone: z.object({ country: z.string().min(2).max(2), nationalNumber: z.string().min(1) }), email: z.string().min(1).email(), password: z.string().min(8).regex(/^\S+$/), waitlistId: z.string().uuid().optional() });

const AuthUserProfile = z.object({ id: z.string(), displayName: z.string().optional(), avatarKey: z.string().optional() });

const AuthUser = z.object({ id: z.string(), email: z.string().email(), emailVerified: z.boolean().optional(), twoFactorEnabled: z.boolean().optional(), twoFactorTotpEnabled: z.boolean().optional(), twoFactorEmailEnabled: z.boolean().optional(), setupNewPassword: z.boolean().optional(), role: z.string().optional(), name: z.string().optional(), firstName: z.string().optional(), lastName: z.string().optional(), gender: z.enum(["male", "female", "other"]).optional(), dateOfBirth: z.string().nullish(), occupation: z.string().nullish(), phoneNumber: z.string().nullish(), phoneCountry: z.string().nullish(), image: z.string().nullish(), signupCompletedAt: z.union([z.string(), z.string(), z.unknown()]).optional(), onboardingCompletedAt: z.union([z.string(), z.string(), z.unknown()]).optional(), onboardingStep: z.number().int().optional(), profile: AuthUserProfile.optional() });

const RegisterSuccessResponse = z.object({ success: z.literal(true), message: z.string(), otpSent: z.boolean(), user: AuthUser });

const AuthPhoneForm = z.object({ country: z.string(), nationalNumber: z.string() });

const AuthWaitlistPrefill = z.object({ firstName: z.string(), lastName: z.string(), phone: AuthPhoneForm, email: z.string().email(), gender: z.enum(["male", "female", "other"]), dateOfBirth: z.string(), occupation: z.string() });

const AuthWaitlistContextResponse = z.object({ found: z.boolean(), eligibleForEarlyFounder: z.boolean(), waitlistId: z.string().uuid().nullable(), prefill: AuthWaitlistPrefill.nullable() });

const AuthCompleteSignUpRequest = z.object({ firstName: z.string().min(2).max(100).regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u), lastName: z.string().min(2).max(100).regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u), gender: z.enum(["male", "female", "other"]), dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(), occupation: z.string().min(1).max(120), phone: z.object({ country: z.string().min(2).max(2), nationalNumber: z.string().min(1) }), memberAgreementAccepted: z.literal(true) });

const AuthAccessState = z.enum(["SIGNUP_REQUIRED", "ONBOARDING_REQUIRED", "ACTIVE"]);

const AuthRequiredAction = z.enum(["COMPLETE_SIGNUP", "COMPLETE_ONBOARDING"]);

const AuthFlow = z.object({ isNewUser: z.boolean(), requiresSignupCompletion: z.boolean(), requiresOnboarding: z.boolean(), nextStep: z.enum(["COMPLETE_SIGNUP", "ONBOARDING", "APP"]), accessState: AuthAccessState, requiredAction: AuthRequiredAction.nullable() });

const CompleteSignUpResponse = z.object({ success: z.literal(true), message: z.string(), user: AuthUser, authFlow: AuthFlow.optional() });

const AuthSessionResponse = z.object({ user: AuthUser, authFlow: AuthFlow });

const AuthProtectedErrorResponse = z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional(), requiredAction: AuthRequiredAction.nullish(), accessState: AuthAccessState.optional() });

const AuthGoogleRequest = z.object({ idToken: z.string().min(1), waitlistId: z.string().uuid().optional() });

const AuthTokenResponse = z.object({ accessToken: z.string(), refreshToken: z.string(), user: AuthUser, authFlow: AuthFlow.optional() });

const AuthVerifyRegisterOtpRequest = z.object({ email: z.string().min(1).email(), otp: z.string().min(6).max(6) });

const AuthResendRegisterOtpRequest = z.object({ email: z.string().min(1).email() });

const ResendRegisterOtpResponse = z.object({ success: z.boolean(), message: z.string() });

const AuthSimpleErrorResponse = z.object({ error: z.string() });

const AuthLoginRequest = z.object({ email: z.string().min(1).email(), password: z.string().min(1) });

const AuthTwoFactorRequiredResponse = z.object({ twoFactorRequired: z.literal(true), twoFactorRedirect: z.literal(true), twoFactorMethods: z.array(z.string()), twoFactorToken: z.string(), expiresIn: z.number().int().gt(0) });

const AuthRefreshRequest = z.object({ refreshToken: z.string().min(1) });

const RefreshSuccessResponse = z.object({ accessToken: z.string(), refreshToken: z.string() });

const AuthTwoFactorSettingsResponse = z.object({ twoFactorEnabled: z.boolean(), methods: z.object({ authenticatorApp: z.object({ enabled: z.boolean() }), emailOtp: z.object({ enabled: z.boolean(), email: z.string().email() }) }) });

const AuthTwoFactorTotpSetupRequest = z.object({ password: z.string().min(1) });

const AuthTwoFactorTotpSetupResponse = z.object({ totpURI: z.string(), backupCodes: z.array(z.string()) });

const AuthTwoFactorSessionRequest = z.object({  }).partial();
const AuthTwoFactorTotpVerifyRequest = AuthTwoFactorSessionRequest.and(z.object({ code: z.string().min(6).max(6), trustDevice: z.boolean().optional() }));

const AuthLoginTwoFactorSessionRequest = z.object({ twoFactorToken: z.string().min(1) });
const AuthLoginTwoFactorTotpVerifyRequest = AuthLoginTwoFactorSessionRequest.and(z.object({ code: z.string().min(6).max(6), trustDevice: z.boolean().optional() }));

const AuthStatusResponse = z.object({ status: z.boolean() });
const AuthTwoFactorEmailVerifyRequest = AuthTwoFactorSessionRequest.and(z.object({ code: z.string().min(6).max(6), trustDevice: z.boolean().optional() }));
const AuthLoginTwoFactorEmailVerifyRequest = AuthLoginTwoFactorSessionRequest.and(z.object({ code: z.string().min(6).max(6), trustDevice: z.boolean().optional() }));

const AuthForgotPasswordRequest = z.object({ email: z.string().min(1).email(), resetPageUrl: z.string().min(1) });

const ForgotPasswordResponse = z.object({ success: z.literal(true), message: z.string() });

const AuthForgotPasswordRequestOtpRequest = z.object({ email: z.string().min(1).email() });

const ForgotPasswordRequestOtpResponse = z.object({ success: z.literal(true), message: z.string() });

const AuthForgotPasswordVerifyOtpRequest = z.object({ email: z.string().min(1).email(), otp: z.string().regex(/^\d{6}$/) });

const ForgotPasswordVerifyOtpResponse = z.object({ success: z.literal(true), message: z.string(), token: z.string() });

const AuthResetPasswordRequest = z.object({ token: z.string().min(1), newPassword: z.string().min(8).regex(/^\S+$/) });

const ResetPasswordResponse = z.object({ success: z.literal(true), message: z.string() });

const AuthChangePasswordRequest = z.object({ oldPassword: z.string().min(1).optional(), newPassword: z.string().min(8).regex(/^\S+$/) });

const ChangePasswordResponse = z.object({ success: z.literal(true), message: z.string() });

const AdminLoginRequest = z.object({ email: z.string().min(1), password: z.string().min(1) });

const AdminLoginOtpChallengeResponse = z.object({ otpRequired: z.literal(true), challengeId: z.string().uuid(), expiresAt: z.string(), message: z.string() });

const AdminErrorResponse = z.object({ error: z.string() });

const AdminVerifyLoginOtpRequest = z.object({ challengeId: z.string().uuid(), otp: z.string().regex(/^\d{6}$/) });

const AdminUser = z.object({ id: z.string(), email: z.string().email(), firstName: z.string().nullable(), lastName: z.string().nullable(), avatarKey: z.string().nullable(), role: z.enum(["MODERATOR", "SUPER_ADMIN"]), createdAt: z.union([z.string(), z.string()]) });

const AdminLoginResponse = z.object({ accessToken: z.string(), refreshToken: z.string(), accessTokenExpiresAt: z.string(), refreshTokenExpiresAt: z.string(), admin: AdminUser });

const AdminRefreshRequest = z.object({ refreshToken: z.string().min(1) });

const AdminRefreshResponse = z.object({ accessToken: z.string(), refreshToken: z.string(), accessTokenExpiresAt: z.string(), refreshTokenExpiresAt: z.string() });

const AdminPresignAvatarUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(5242880) });

const AdminPresignAvatarUploadResponse = z.object({ ok: z.boolean(), upload: z.object({ uploadUrl: z.string().url(), method: z.literal("PUT"), requiredHeaders: z.record(z.string(), z.string()), avatarKey: z.string(), expiresInSeconds: z.number() }) });

const AdminUpdateProfileRequest = z.object({ firstName: z.string().min(1).max(100), lastName: z.string().min(1).max(100), avatarKey: z.string().nullable(), oldPassword: z.string().min(1), newPassword: z.string().min(8) }).partial();

const AdminUpdateProfileResponse = z.object({ ok: z.boolean(), admin: z.object({ id: z.string(), email: z.string(), firstName: z.string().nullable(), lastName: z.string().nullable(), avatarKey: z.string().nullable() }) });

const AdminLogoutResponse = z.object({ success: z.boolean(), message: z.string() });

const ContentModeratorReportsSummary = z.object({ openReports: z.number().int().gte(0), resolvedReports: z.number().int().gte(0), totalReports: z.number().int().gte(0), avgResolutionTime: z.string().nullable() });

const ContentModeratorReportType = z.object({ id: z.string(), name: z.string() });

const ContentModeratorReportReporter = z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable() });

const ContentModeratorReportAuthor = z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable() });

const ContentModeratorReportSolver = z.object({ id: z.string(), firstName: z.string().nullable(), lastName: z.string().nullable() });

const ContentModeratorReport = z.object({ id: z.string().uuid(), reportId: z.number().int().gt(0), type: ContentModeratorReportType, reportType: z.enum(["FORUM", "VOLUNTEER", "LAUNCHPAD"]), reportSubType: z.enum(["QUESTION", "ANSWER", "OPPORTUNITY", "PROJECT"]).nullable(), contentPreview: z.string(), sourceLink: z.string(), dateTime: z.string(), status: z.enum(["OPEN", "CLOSED"]), confirmStatus: z.enum(["CONTENT HIDDEN", "DISMISSED"]).nullable(), reportingBy: ContentModeratorReportReporter.nullable(), postedBy: ContentModeratorReportAuthor.nullable(), solvedBy: ContentModeratorReportSolver.nullable(), reporterNote: z.string().nullable(), note: z.string().nullable(), solvedAt: z.string().nullable() });

const CursorPagination = z.object({ limit: z.number().int().gt(0), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) });

const ListContentModeratorReportsResponse = z.object({ ok: z.boolean(), summary: ContentModeratorReportsSummary.nullable(), reports: z.array(ContentModeratorReport), pagination: CursorPagination });

const UpdateContentModeratorReportReviewRequest = z.object({ reportUuid: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), status: z.enum(["SAFE", "HIDE"]), note: z.string().max(1000).optional() });

const UpdateContentModeratorReportReviewResponse = z.object({ ok: z.boolean(), report: ContentModeratorReport });

const AdminDashboardOverviewResponse = z.object({ ok: z.literal(true), dashboard: z.object({ summary: z.object({ totalUsers: z.number().int().gte(0), totalPartners: z.number().int().gte(0), openReports: z.number().int().gte(0) }), demographics: z.object({ genderBreakdown: z.array(z.object({ label: z.string(), count: z.number().int().gte(0) })), ageGroups: z.array(z.object({ label: z.string(), count: z.number().int().gte(0) })) }), partners: z.object({ total: z.number().int().gte(0), sectors: z.array(z.object({ label: z.string(), count: z.number().int().gte(0) })) }) }) });

const AdminDashboardErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const AdminDashboardActiveUsersResponse = z.object({ ok: z.literal(true), activeUsers: z.object({ count: z.number().int().gte(0), changePercent: z.number().nullable(), countLast24Hours: z.number().int().gte(0), windowHours: z.literal(24), liveNow: z.boolean(), period: z.enum(["7d", "30d", "12w", "6m", "12m"]), trend: z.array(z.object({ label: z.string(), count: z.number().int().gte(0), date: z.string() })) }) });

const AdminDashboardNewRegistrationsResponse = z.object({ ok: z.literal(true), newRegistrations: z.object({ period: z.enum(["7d", "30d", "12w", "6m", "12m"]), changePercent: z.number().nullable(), trend: z.array(z.object({ label: z.string(), count: z.number().int().gte(0), date: z.string() })) }) });

const AcceptModeratorInviteRequest = z.object({ token: z.string().min(1), firstName: z.string().min(1).max(100), lastName: z.string().min(1).max(100), password: z.string().min(8) });

const InviteModeratorResponse = z.object({ ok: z.boolean() });

const Moderator = z.object({ id: z.string().uuid(), email: z.string(), firstName: z.string().nullable(), lastName: z.string().nullable(), role: z.enum(["MODERATOR", "SUPER_ADMIN"]), status: z.enum(["PENDING", "ACTIVE"]), lastActive: z.string().nullable(), createdAt: z.string() });

const ListModeratorsResponse = z.object({ ok: z.boolean(), moderators: z.array(Moderator), pagination: CursorPagination });

const CreateModeratorRequest = z.object({ email: z.string().min(1), role: z.enum(["MODERATOR", "SUPER_ADMIN"]).optional().default("MODERATOR") });

const ModeratorResponse = z.object({ ok: z.boolean(), moderator: Moderator });

const UpdateModeratorRequest = z.object({ role: z.enum(["MODERATOR", "SUPER_ADMIN"]) });

const DeleteModeratorResponse = z.object({ ok: z.boolean() });

const AdminUserManagementTier = z.object({ id: z.string().uuid(), slug: z.string(), name: z.string(), rankOrder: z.number().int(), minPoints: z.number().int() });

const AdminUserManagementUser = z.object({ id: z.string().uuid(), name: z.string(), firstName: z.string(), lastName: z.string(), displayName: z.string().nullable(), avatarKey: z.string().nullable(), email: z.string().email(), emailVerified: z.boolean(), phoneNumber: z.string().nullable(), phoneCountry: z.string().nullable(), role: z.string(), status: z.enum(["SIGNUP_REQUIRED", "ONBOARDING_REQUIRED", "ACTIVE", "SUSPENDED"]), tier: AdminUserManagementTier.nullable(), totalPoints: z.number().int(), signupCompletedAt: z.string().nullable(), onboardingStep: z.number().int(), onboardingCompletedAt: z.string().nullable(), lastActive: z.string().nullable(), createdAt: z.string(), updatedAt: z.string() });

const AdminUserManagementListResponse = z.object({ ok: z.literal(true), users: z.array(AdminUserManagementUser), total: z.number().int(), page: z.number().int(), limit: z.number().int(), totalPages: z.number().int() });

const AdminUserManagementStats = z.object({ totalUsers: z.object({ count: z.number().int(), growthPercent: z.number().nullable() }), activeUsers: z.object({ count: z.number().int(), percentOfTotal: z.number().nullable() }), newThisMonth: z.object({ count: z.number().int(), changePercent: z.number().nullable() }), topTier: z.object({ slug: z.string(), name: z.string() }).nullable() });

const AdminUserManagementStatsResponse = z.object({ ok: z.literal(true), stats: AdminUserManagementStats });

const AdminUserManagementPoints = z.object({ activePoints: z.number().int(), tierPoints: z.number().int(), legacyPoints: z.number().int(), totalPoints: z.number().int() });

const AdminUserManagementActivity = z.object({ id: z.string().uuid(), title: z.string(), actionType: z.string(), points: z.number().int(), pool: z.string(), mode: z.string(), referenceType: z.string().nullable(), referenceId: z.string().uuid().nullable(), createdAt: z.string() });
const AdminUserManagementDetailUser = AdminUserManagementUser.and(z.object({ dateOfBirth: z.string().nullable(), occupation: z.string().nullable(), telegramUsername: z.string().nullable(), location: z.object({ city: z.string().nullable(), country: z.string().nullable() }).nullable(), points: AdminUserManagementPoints, recentActivity: z.array(AdminUserManagementActivity) }));

const AdminUserManagementDetailResponse = z.object({ ok: z.literal(true), user: AdminUserManagementDetailUser });

const AdminAuditLogMember = z.object({ id: z.string().uuid(), name: z.string().nullable(), email: z.string().email(), role: z.string(), avatarKey: z.string().nullable(), entryCount: z.number().int() });

const AdminAuditLogMembersResponse = z.object({ ok: z.literal(true), members: z.array(AdminAuditLogMember) });

const AdminAuditActor = z.object({ id: z.string().uuid(), name: z.string().nullable(), email: z.string().email(), role: z.string(), avatarKey: z.string().nullable(), removedAt: z.string().nullable() });

const AdminAuditLogEntry = z.object({ id: z.string().uuid(), actor: AdminAuditActor, category: z.enum(["TEAM", "CONTENT", "USERS", "SYSTEM"]), action: z.string(), summary: z.string(), detail: z.string().nullable(), targetType: z.string().nullable(), targetId: z.string().nullable(), metadata: z.record(z.string(), z.unknown().nullable()).nullable(), ipAddress: z.string().nullable(), userAgent: z.string().nullable(), createdAt: z.string() });

const AdminAuditLogPagination = z.object({ limit: z.number().int().gt(0), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) });

const AdminAuditLogListResponse = z.object({ ok: z.literal(true), entries: z.array(AdminAuditLogEntry), pagination: AdminAuditLogPagination });

const patchV1adminnotificationsread_Body = z.object({ notificationIds: z.array(z.string().uuid()).min(1) });

const DeveloperClientResponse = z.object({ id: z.string().uuid(), clientId: z.string(), name: z.string(), description: z.string().nullable(), contactEmail: z.string().nullable(), allowedOrigins: z.array(z.string()), allowAllOrigins: z.boolean(), logoKey: z.string().nullable(), logoUrl: z.string().nullable(), clientSecretLast4: z.string().nullable(), clientSecretSetAt: z.string().nullable(), status: z.enum(["ACTIVE", "DISABLED", "DELETED"]), createdAt: z.string(), updatedAt: z.string(), deletedAt: z.string().nullable() });

const ListDeveloperClientsResponse = z.object({ ok: z.literal(true), clients: z.array(DeveloperClientResponse), meta: z.object({ page: z.number(), pageSize: z.number(), total: z.number(), totalPages: z.number() }) });

const DeveloperClientErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const CreateDeveloperClientRequest = z.object({ name: z.string().min(2).max(120), description: z.union([z.string(), z.unknown()]).optional(), contactEmail: z.union([z.string(), z.unknown()]).optional(), allowedOrigins: z.array(z.string().max(512)).max(20).optional(), allowAllOrigins: z.boolean().optional(), logoKey: z.union([z.string(), z.unknown()]).optional() });

const IssuedClientSecretResponse = z.object({ ok: z.literal(true), client: DeveloperClientResponse, clientSecret: z.string() });

const DeveloperClientDetailResponse = z.object({ ok: z.literal(true), client: DeveloperClientResponse });

const UpdateDeveloperClientRequest = z.object({ name: z.string().min(2).max(120), description: z.union([z.string(), z.unknown()]), contactEmail: z.union([z.string(), z.unknown()]), status: z.enum(["ACTIVE", "DISABLED"]), allowedOrigins: z.array(z.string().max(512)).max(20), allowAllOrigins: z.boolean(), logoKey: z.union([z.string(), z.unknown()]) }).partial();

const DeleteDeveloperClientResponse = z.object({ ok: z.literal(true) });

const Partner = z.object({ id: z.string().uuid(), name: z.string().nullable(), nameKh: z.string().nullable(), registrationNumber: z.string().nullable(), email: z.string(), logo: z.string().nullable(), description: z.string().nullable(), descriptionKm: z.string().nullable(), bio: z.string().nullable(), bioKm: z.string().nullable(), address: z.record(z.string(), z.unknown().nullable()).nullable(), addressKm: z.record(z.string(), z.unknown().nullable()).nullable(), phoneNumber: z.string(), telegram: z.string().nullable(), sectorActivity: z.string().nullable(), sectorActivityKm: z.string().nullable(), website: z.string().nullable(), facebook: z.string().nullable(), linkedin: z.string().nullable(), status: z.enum(["PENDING", "ACTIVE", "INACTIVE"]), package: z.string().nullable(), packageKm: z.string().nullable(), isPublished: z.boolean(), createdAt: z.union([z.string(), z.string()]), updatedAt: z.union([z.string(), z.string(), z.unknown()]) });

const ListPendingPartnersResponse = z.object({ ok: z.boolean(), partners: z.array(Partner) });

const ContactPerson = z.object({ id: z.string().uuid(), partnerId: z.string().uuid(), firstName: z.string().nullable(), lastName: z.string().nullable(), firstNameKm: z.string().nullable(), lastNameKm: z.string().nullable(), genderKm: z.string().nullable(), gender: z.string().nullable(), title: z.string().nullable(), titleKm: z.string().nullable(), email: z.string(), identityNumber: z.string().nullable(), position: z.string().nullable(), positionKm: z.string().nullable(), phoneNumber: z.string(), telegram: z.string().nullable(), linkedin: z.string().nullable(), facebook: z.string().nullable(), createdAt: z.union([z.string(), z.string()]), updatedAt: z.union([z.string(), z.string(), z.unknown()]) });

const PartnerDetailResponse = z.object({ ok: z.boolean(), partner: Partner, contactPersons: z.array(ContactPerson) });

const PartnerErrorResponse = z.object({ ok: z.boolean(), error: z.string(), validationErrors: z.record(z.string(), z.string()).optional() });

const UpdatePartnerRegistrationStatusRequest = z.object({ action: z.enum(["ACTIVE", "DELETE"]) });

const PartnerStatusResponse = z.object({ ok: z.boolean(), partner: z.object({ id: z.string().uuid(), status: z.enum(["PENDING", "ACTIVE", "INACTIVE"]) }) });

const DeletePartnerResponse = z.object({ ok: z.boolean() });

const ListManagedPartnersResponse = z.object({ ok: z.boolean(), data: z.array(Partner), meta: z.object({ page: z.number(), pageSize: z.number(), total: z.number(), totalPages: z.number() }) });

const CreateManagedPartnerRequest = z.object({ companyName: z.string().min(2).max(150), companyNameKm: z.string().max(150).optional(), registrationNumber: z.string().max(100).optional(), companyEmail: z.string().min(1).max(100).email(), companyContactNumber: z.string().min(5).max(30), sectorOfActivity: z.string().min(2), sectorOfActivityKm: z.string().max(100).optional(), companyAddress: z.string().min(5).max(200), companyAddressKm: z.string().max(200).optional(), city: z.string().min(2).max(100), cityKm: z.string().max(100).optional(), zipCode: z.string().max(20).optional(), zipCodeKm: z.string().max(20).optional(), country: z.string().min(2), countryKm: z.string().max(100).optional(), website: z.string().url().optional(), companyFacebookUrl: z.string().url().optional(), companyLinkedinUrl: z.string().url().optional(), companyTelegram: z.string().max(100).optional(), package: z.enum(["Platinum", "Gold", "Silver", "Bronze", "Government", "SME", "Video", "Free"]).optional(), packageKm: z.enum(["ប្លាទីន", "មាស", "ប្រាក់", "សំរិទ្ធ", "រដ្ឋាភិបាល", "SME", "វីដេអូ", "ឥតគិតថ្លៃ"]).optional(), bio: z.string().max(300).optional(), bioKm: z.string().max(300).optional(), description: z.string().max(5000).optional(), descriptionKm: z.string().max(5000).optional(), firstName: z.string().min(2).max(50), lastName: z.string().min(2).max(50), userEmail: z.string().min(1).max(100).email(), userIdentity: z.string().max(50).optional(), position: z.string().min(2), userContactNumber: z.string().min(5).max(30), userFacebookUrl: z.string().url().optional(), userLinkedinUrl: z.string().url().optional(), userTelegram: z.string().max(100).optional(), title: z.string().max(100).optional(), gender: z.string().max(10).optional() });

const CreateManagedPartnerResponse = z.object({ ok: z.boolean(), partnerId: z.string().uuid() });

const PartnerPhoto = z.object({ id: z.string().uuid(), partnerId: z.string().uuid(), url: z.string(), thumbnail: z.string().nullable(), createdAt: z.union([z.string(), z.string()]), updatedAt: z.union([z.string(), z.string(), z.unknown()]) });

const ManagedPartnerDetailResponse = z.object({ ok: z.boolean(), partner: Partner, contactPersons: z.array(ContactPerson), photos: z.array(PartnerPhoto) });

const UpdateManagedPartnerRequest = z.object({ name: z.string().min(2).max(150), nameKh: z.string().max(150).nullable(), email: z.string().email(), phoneNumber: z.string().min(5).max(30), registrationNumber: z.string().max(100).nullable(), sectorActivity: z.string().min(2), sectorActivityKm: z.string().nullable(), website: z.string().url().nullable(), bio: z.string().max(300).nullable(), bioKm: z.string().max(300).nullable(), description: z.string().nullable(), descriptionKm: z.string().nullable(), status: z.enum(["ACTIVE", "INACTIVE"]), isPublished: z.boolean(), facebook: z.string().url().nullable(), linkedin: z.string().url().nullable(), telegram: z.string().nullable(), logo: z.string().nullable(), package: z.enum(["Platinum", "Gold", "Silver", "Bronze", "Government", "SME", "Video", "Free"]).nullable(), packageKm: z.enum(["ប្លាទីន", "មាស", "ប្រាក់", "សំរិទ្ធ", "រដ្ឋាភិបាល", "SME", "វីដេអូ", "ឥតគិតថ្លៃ"]).nullable(), address: z.object({ street: z.string().nullable(), city: z.string().nullable(), zipCode: z.string().nullable(), country: z.string().nullable() }).partial().nullable(), addressKm: z.object({ street: z.string().nullable(), city: z.string().nullable(), zipCode: z.string().nullable(), country: z.string().nullable() }).partial().nullable() }).partial();

const UpdateManagedPartnerResponse = z.object({ ok: z.boolean(), partner: Partner });

const DeleteManagedPartnerResponse = z.object({ ok: z.boolean() });

const AddPartnerPhotoRequest = z.object({ url: z.string().url() });

const PartnerPhotoResponse = z.object({ ok: z.boolean(), photo: PartnerPhoto });

const PresignPartnerAssetRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(5242880) });

const PresignPartnerLogoResponse = z.object({ ok: z.boolean(), upload: z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), publicUrl: z.string().nullable(), expiresInSeconds: z.number(), logoKey: z.string() }) });

const PresignPartnerPhotoResponse = z.object({ ok: z.boolean(), upload: z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), publicUrl: z.string().nullable(), expiresInSeconds: z.number(), photoKey: z.string() }) });

const QuestionTagResponse = z.object({ id: z.string(), name: z.string() });

const QuestionResponse = z.object({ id: z.string(), title: z.string(), body: z.string(), imageKey: z.string().nullable(), status: z.enum(["PUBLISHED", "CLOSED", "DELETED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), upvoteCount: z.number().int().gte(0), downvoteCount: z.number().int().gte(0), answerCount: z.number().int().gte(0), viewCount: z.number().int().gte(0), bestAnswerId: z.string().nullable(), bestAnswerSelectedAt: z.string().nullable(), score: z.number().int(), viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]).nullable(), viewerSave: z.boolean(), category: z.object({ id: z.string(), name: z.string() }), author: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable() }), tags: z.array(QuestionTagResponse), createdAt: z.string(), updatedAt: z.string() });

const GetQuestionsResponse = z.object({ ok: z.boolean(), questions: z.array(QuestionResponse), pagination: z.object({ limit: z.number(), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) }) });

const GetQuestionResponse = z.object({ ok: z.boolean(), question: QuestionResponse });

const AdminDeletePostErrorResponse = z.object({ ok: z.boolean(), error: z.string() });

const AdminDeletePostResponse = z.object({ ok: z.boolean() });

const RepliedAnswerResponse = z.object({ id: z.string(), body: z.string(), author: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable() }), upvoteCount: z.number(), downvoteCount: z.number(), replyCount: z.number(), score: z.number(), viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]).nullable(), createdAt: z.string(), updatedAt: z.string(), questionId: z.string(), status: z.enum(["PUBLISHED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), replyTo: z.string().nullable() });

const AnswerResponse = z.object({ id: z.string(), body: z.string(), author: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable() }), upvoteCount: z.number(), downvoteCount: z.number(), replyCount: z.number(), score: z.number(), viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]).nullable(), createdAt: z.string(), updatedAt: z.string(), questionId: z.string(), status: z.enum(["PUBLISHED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), replyTo: z.string().nullable(), repliedAnswers: z.array(RepliedAnswerResponse).nullable() });

const GetAnswersResponse = z.object({ ok: z.boolean(), answers: z.object({ bestAnswer: z.array(AnswerResponse), answers: z.array(AnswerResponse) }) });

const AdminSuspendPostBody = z.object({ reason: z.string().max(500) }).partial();

const AdminSuspendPostResponse = z.object({ ok: z.literal(true), status: z.enum(["SUSPENDED", "PUBLISHED", "CLOSED"]) });

const VolunteerOpportunityReference = z.object({ id: z.string(), name: z.string() });

const AdminVolunteerPostListItemResponse = z.object({ id: z.string(), title: z.string(), overview: z.string(), startDate: z.string().nullable(), endDate: z.string().nullable(), commitmentLabel: z.string().nullable(), commitmentDescription: z.string().nullable(), applicationDeadline: z.string(), applicationCount: z.number(), capacity: z.number(), filled: z.boolean(), totalView: z.number(), coverImageKey: z.string(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED", "DELETED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), createdAt: z.string(), viewerSave: z.boolean(), category: VolunteerOpportunityReference, location: VolunteerOpportunityReference });

const VolunteerOpportunitiesPaginationResponse = z.object({ limit: z.number(), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) });

const AdminVolunteerPostsResponse = z.object({ ok: z.literal(true), opportunities: z.array(AdminVolunteerPostListItemResponse), pagination: VolunteerOpportunitiesPaginationResponse });

const VolunteerOpportunityContactResponse = z.object({ email: z.string(), telegramUsername: z.string().nullable(), phone: z.string().nullable(), websiteUrl: z.string().nullable() });

const VolunteerOpportunityOrganizerResponse = z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), opportunityCount: z.number(), organizerLocation: VolunteerOpportunityReference.nullable(), contact: VolunteerOpportunityContactResponse });

const VolunteerOpportunityRoleResponse = z.object({ id: z.string(), title: z.string(), capacity: z.number(), responsibilities: z.array(z.string()), requirements: z.array(z.string()), displayOrder: z.number(), viewerApplied: z.boolean() });

const AdminVolunteerPostDetailResponse = z.object({ id: z.string(), category: VolunteerOpportunityReference, location: VolunteerOpportunityReference, title: z.string(), overview: z.string(), communityImpact: z.string().nullable(), startDate: z.string().nullable(), endDate: z.string().nullable(), commitmentLabel: z.string().nullable(), commitmentDescription: z.string().nullable(), applicationDeadline: z.string(), applicationCount: z.number(), capacity: z.number(), filled: z.boolean(), totalView: z.number(), coverImageKey: z.string(), benefits: z.array(z.string()), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED", "DELETED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), publishedAt: z.string().nullable(), organizer: VolunteerOpportunityOrganizerResponse, createdBy: z.string(), createdAt: z.string(), updatedAt: z.string(), viewerSave: z.boolean().nullable(), viewerTopPicked: z.string().nullable(), viewerBlocked: z.boolean(), roles: z.array(VolunteerOpportunityRoleResponse) });

const AdminVolunteerPostResponse = z.object({ ok: z.literal(true), opportunity: AdminVolunteerPostDetailResponse });

const AdminSuspendVolunteerPostResponse = z.object({ ok: z.literal(true), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED", "DELETED"]) });

const AdminLaunchpadPostListItemResponse = z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), deadline: z.string().nullable(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED", "DELETED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), coverKey: z.string().nullable(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), phoneNumber: z.string().nullable(), email: z.string().nullable(), telegramUsername: z.string().nullable(), createdBy: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), launchpadCount: z.number() }), createdAt: z.string(), category: z.object({ id: z.string(), name: z.string() }).optional(), city: z.object({ id: z.string(), name: z.string() }).optional(), totalRoles: z.number(), totalView: z.number(), isSaved: z.boolean() });

const AdminLaunchpadPostsResponse = z.object({ ok: z.literal(true), launchpads: z.array(AdminLaunchpadPostListItemResponse), nextCursor: z.string().nullable() });

const AdminLaunchpadPostDetailResponse = z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), deadline: z.string().nullable(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED", "DELETED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), coverKey: z.string().nullable(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), phoneNumber: z.string().nullable(), email: z.string().nullable(), telegramUsername: z.string().nullable(), createdBy: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), launchpadCount: z.number() }), createdAt: z.string(), category: z.object({ id: z.string(), name: z.string() }).optional(), city: z.object({ id: z.string(), name: z.string() }).optional(), roles: z.array(z.object({ id: z.string(), title: z.string(), description: z.string().nullable(), capacity: z.number(), viewerApplied: z.boolean() })), viewerBlocked: z.boolean(), isSaved: z.boolean().nullable(), totalView: z.number() });

const AdminLaunchpadPostResponse = z.object({ ok: z.literal(true), launchpad: AdminLaunchpadPostDetailResponse });

const AdminSuspendLaunchpadPostResponse = z.object({ ok: z.literal(true), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED", "DELETED"]) });

const OnboardingOkResponse = z.record(z.string(), z.unknown().nullable());

const OnboardingErrorResponse = z.record(z.string(), z.unknown().nullable());

const OnboardingProfileStepRequest = z.object({ bio: z.string().max(1000).optional(), countryId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), cityId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), avatarKey: z.string().min(1).max(600).optional() });

const OnboardingInterestsStepRequest = z.object({ interestIds: z.array(z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)).min(2).max(20) });

const OnboardingContributionsStepRequest = z.object({ community_member: z.boolean(), find_volunteers: z.boolean(), launch_project: z.boolean(), organize_event: z.boolean() }).partial();

const PresignAvatarUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(5242880) });

const PresignAvatarUploadResult = z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), avatarKey: z.string(), expiresInSeconds: z.number() });

const PresignAvatarUploadResponse = z.object({ ok: z.boolean(), upload: PresignAvatarUploadResult });

const CategoryResponse = z.object({ id: z.string(), name: z.string(), slug: z.string(), description: z.string().nullable(), displayOrder: z.number(), status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]), createdBy: z.string(), updatedBy: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(), archivedAt: z.string().nullable() });
const CategoryWithQuestionCountResponse = CategoryResponse.and(z.object({ questionCount: z.number() }));

const GetCategoriesResponse = z.object({ ok: z.boolean(), categories: z.array(CategoryWithQuestionCountResponse) });

const CreateCategoryRequest = z.object({ name: z.string().min(1).max(120), slug: z.string().min(1).max(255), description: z.string().max(1000).optional() });

const CreateCategoryResponse = z.object({ ok: z.boolean(), category: CategoryResponse });

const isUnanswered = z.union([z.boolean(), z.string()]).optional();

const CreateQuestionRequest = z.object({ categoryId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), title: z.string().min(1).max(300), body: z.string().min(1).max(10000), tags: z.union([z.array(z.string()), z.string()]).optional(), imageKey: z.string().min(1).max(600).nullish(), status: z.string().optional() });

const CreateQuestionResponse = z.object({ ok: z.boolean(), question: QuestionResponse });

const TrendingTagResponse = z.object({ id: z.string(), name: z.string(), count: z.number() });

const GetTrendingTagsResponse = z.object({ ok: z.boolean(), tags: z.array(TrendingTagResponse) });

const GetMyQuestionsResponse = z.object({ ok: z.boolean(), questions: z.array(QuestionResponse), pagination: z.object({ limit: z.number(), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) }) });

const GetSavedQuestionsResponse = z.object({ ok: z.boolean(), questions: z.array(QuestionResponse), pagination: z.object({ limit: z.number(), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) }) });

const PresignForumQuestionImageUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(5242880) });

const PresignForumQuestionImageUploadResult = z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), imageKey: z.string(), publicUrl: z.string().nullable(), expiresInSeconds: z.number() });

const PresignForumQuestionImageUploadResponse = z.object({ ok: z.literal(true), upload: PresignForumQuestionImageUploadResult });

const EditQuestionRequest = z.object({ categoryId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), title: z.string().min(1).max(300), body: z.string().min(1).max(10000), tags: z.union([z.array(z.string()), z.string()]), imageKey: z.string().min(1).max(600).nullable(), status: z.string() }).partial();

const VoteQuestionRequest = z.object({ voteType: z.string() });

const SaveQuestionResponse = z.object({ ok: z.literal(true) });

const AnswerQuestionResponse = z.object({ id: z.string(), categoryId: z.string(), title: z.string(), body: z.string(), imageKey: z.string().nullable(), status: z.enum(["PUBLISHED", "CLOSED", "DELETED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), answerCount: z.number().int().gte(0), upvoteCount: z.number().int().gte(0), downvoteCount: z.number().int().gte(0), viewCount: z.number().int().gte(0), bestAnswerId: z.string().nullable(), bestAnswerSelectedAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(), author: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable() }), category: CategoryResponse });

const MyAnswerResponse = z.object({ id: z.string(), body: z.string(), author: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable() }), upvoteCount: z.number(), downvoteCount: z.number(), replyCount: z.number(), score: z.number(), viewerVote: z.enum(["UPVOTE", "DOWNVOTE"]).nullable(), createdAt: z.string(), updatedAt: z.string(), questionId: z.string(), status: z.enum(["PUBLISHED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), replyTo: z.string().nullable(), isBestAnswer: z.boolean() });

const MyAnswerDiscussionResponse = z.object({ question: AnswerQuestionResponse, answers: z.array(MyAnswerResponse), myAnswerCount: z.number().int().gt(0), lastActivityAt: z.string() });

const MyAnswersPaginationResponse = z.object({ limit: z.number().int().gt(0), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) });

const GetMyAnswersResponse = z.object({ ok: z.boolean(), discussions: z.array(MyAnswerDiscussionResponse), totalAnswers: z.number().int().gte(0), pagination: MyAnswersPaginationResponse });

const CreateAnswerRequest = z.object({ questionId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), replyToAnswer: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).nullish(), body: z.string().min(1).max(10000) });

const CreateAnswerResponse = z.object({ ok: z.boolean(), answer: AnswerResponse });

const UpdateAnswerRequest = z.object({ body: z.string().min(1).max(10000) });

const EditAnswerResponse = z.object({ ok: z.boolean(), answer: AnswerResponse });

const AnswerErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const DeleteAnswerResponse = z.object({ ok: z.boolean() });

const VoteAnswerRequest = z.object({ voteType: z.string() });

const VoteAnswerResponse = z.object({ ok: z.boolean(), answer: AnswerResponse });

const MarkBestAnswerResponse = z.object({ ok: z.boolean(), answer: AnswerResponse });

const VolunteerCategoryResponse = z.object({ id: z.string(), slug: z.string(), name: z.string(), description: z.string().nullable(), iconKey: z.string().nullable(), mobileIconType: z.string().nullable(), mobileIconName: z.string().nullable(), displayOrder: z.number(), status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]), createdBy: z.string(), updatedBy: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(), archivedAt: z.string().nullable() });
const VolunteerCategoryWithOpportunityCountResponse = VolunteerCategoryResponse.and(z.object({ opportunityCount: z.number().int().gte(0) }));

const GetVolunteerCategoriesResponse = z.object({ ok: z.literal(true), categories: z.array(VolunteerCategoryWithOpportunityCountResponse) });

const VolunteerOperationErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const CreateVolunteerCategoryRequest = z.object({ name: z.string(), slug: z.string(), description: z.string().nullish(), iconKey: z.string().nullish(), mobileIconType: z.string().nullish(), mobileIconName: z.string().nullish(), status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]).optional() });

const CreateVolunteerCategoryResponse = z.object({ ok: z.literal(true), category: VolunteerCategoryResponse });

const VolunteerCategoryValidationErrorResponse = z.object({ ok: z.literal(false), error: z.string(), issues: z.array(z.object({ path: z.string(), message: z.string() })) });

const VolunteerLocationResponse = z.object({ id: z.string(), name: z.string() });

const GetVolunteerLocationsResponse = z.object({ ok: z.literal(true), locations: z.array(VolunteerLocationResponse) });

const PresignVolunteerOpportunityCoverUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(5242880) });

const PresignVolunteerOpportunityCoverUploadResult = z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), coverImageKey: z.string(), expiresInSeconds: z.number() });

const PresignVolunteerOpportunityCoverUploadResponse = z.object({ ok: z.literal(true), upload: PresignVolunteerOpportunityCoverUploadResult });

const PresignVolunteerApplicationDocumentUploadRequest = z.object({ opportunityId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), files: z.array(z.object({ fileName: z.string().min(1).max(255), contentType: z.string(), fileSize: z.number().int().gt(0).lte(10485760) })).min(1).max(3) });

const PresignVolunteerApplicationDocumentUploadResult = z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), supportingDocument: z.object({ name: z.string(), key: z.string() }), expiresInSeconds: z.number() });

const PresignVolunteerApplicationDocumentUploadResponse = z.object({ ok: z.literal(true), uploads: z.array(PresignVolunteerApplicationDocumentUploadResult) });

const VolunteerOpportunityListItemResponse = z.object({ id: z.string(), title: z.string(), overview: z.string(), startDate: z.string().nullable(), endDate: z.string().nullable(), commitmentLabel: z.string().nullable(), commitmentDescription: z.string().nullable(), applicationDeadline: z.string(), applicationCount: z.number(), capacity: z.number(), filled: z.boolean(), totalView: z.number(), coverImageKey: z.string(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), createdAt: z.string(), viewerSave: z.boolean(), category: VolunteerOpportunityReference, location: VolunteerOpportunityReference });

const GetVolunteerOpportunitiesResponse = z.object({ ok: z.literal(true), opportunities: z.array(VolunteerOpportunityListItemResponse), pagination: VolunteerOpportunitiesPaginationResponse });

const VolunteerOpportunityContact = z.object({ email: z.string().max(320).email(), telegramUsername: z.string().nullish(), phone: z.string().nullish(), websiteUrl: z.string().nullish() });

const VolunteerOpportunityRoleRequest = z.object({ title: z.string(), capacity: z.number().int().gte(1).lte(100000), responsibilities: z.array(z.string()).max(20).nullish(), requirements: z.array(z.string()).max(20).nullish() });

const CreateVolunteerOpportunityPayload = z.object({ categoryId: z.string().uuid(), locationId: z.string().uuid(), title: z.string(), overview: z.string(), communityImpact: z.string().nullish(), startDate: z.string().nullish(), endDate: z.string().nullish(), commitmentLabel: z.string().nullish(), commitmentDescription: z.string().nullish(), applicationDeadline: z.string(), benefits: z.array(z.string()).max(12).nullish(), contact: VolunteerOpportunityContact, roles: z.array(VolunteerOpportunityRoleRequest).min(1).max(20) });
const CreateVolunteerOpportunityRequest = CreateVolunteerOpportunityPayload.and(z.object({ coverImageKey: z.string().min(1).max(600) }));

const VolunteerOpportunityResponse = z.object({ id: z.string(), category: VolunteerOpportunityReference, location: VolunteerOpportunityReference, title: z.string(), overview: z.string(), communityImpact: z.string().nullable(), startDate: z.string().nullable(), endDate: z.string().nullable(), commitmentLabel: z.string().nullable(), commitmentDescription: z.string().nullable(), applicationDeadline: z.string(), applicationCount: z.number(), capacity: z.number(), filled: z.boolean(), totalView: z.number(), coverImageKey: z.string(), benefits: z.array(z.string()), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), publishedAt: z.string().nullable(), organizer: VolunteerOpportunityOrganizerResponse, createdBy: z.string(), createdAt: z.string(), updatedAt: z.string(), viewerSave: z.boolean().nullable(), viewerTopPicked: z.string().nullable(), viewerBlocked: z.boolean(), roles: z.array(VolunteerOpportunityRoleResponse) });

const CreateVolunteerOpportunityResponse = z.object({ ok: z.literal(true), opportunity: VolunteerOpportunityResponse });

const GetVolunteerOpportunityResponse = z.object({ ok: z.literal(true), opportunity: VolunteerOpportunityResponse });

const UpdateVolunteerOpportunityContactRequest = z.object({ email: z.string().max(320).email(), telegramUsername: z.string().nullable(), phone: z.string().nullable(), websiteUrl: z.string().nullable() }).partial();
const UpdateVolunteerOpportunityRoleRequest = VolunteerOpportunityRoleRequest.and(z.object({ id: z.string().uuid() }).partial());

const UpdateVolunteerOpportunityRequest = z.object({ categoryId: z.string().uuid(), locationId: z.string().uuid(), title: z.string(), overview: z.string(), communityImpact: z.string().nullable(), startDate: z.string().nullable(), endDate: z.string().nullable(), commitmentLabel: z.string().nullable(), commitmentDescription: z.string().nullable(), applicationDeadline: z.string(), coverImageKey: z.string().min(1).max(600), benefits: z.array(z.string()).max(12).nullable(), contact: UpdateVolunteerOpportunityContactRequest, roles: z.array(UpdateVolunteerOpportunityRoleRequest).min(1).max(20) }).partial();

const SaveVolunteerOpportunityResponse = z.object({ ok: z.literal(true) });

const CreateVolunteerApplicationRequest = z.object({ availability: z.string(), relevantExperience: z.string(), supportingDocuments: z.array(z.object({ name: z.string().min(1).max(255), key: z.string().min(1).max(600) })).max(3).optional().default([]), topPickRoleId: z.string().uuid().nullish(), roleId: z.string().uuid() });

const VolunteerApplicationOpportunity = z.object({ id: z.string(), title: z.string(), coverImageKey: z.string(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), applicationDeadline: z.string(), filled: z.boolean(), category: VolunteerOpportunityReference, location: VolunteerOpportunityReference });

const VolunteerApplicationRoleResponse = z.object({ id: z.string(), title: z.string() });

const VolunteerApplicationResponse = z.object({ id: z.string(), opportunity: VolunteerApplicationOpportunity, role: VolunteerApplicationRoleResponse, availability: z.string(), relevantExperience: z.string(), supportingDocuments: z.array(z.object({ name: z.string(), key: z.string() })), status: z.enum(["SUBMITTED", "UNDER_REVIEW", "APPROVED", "DECLINED", "CONFIRMED", "COMPLETED", "WITHDRAWN"]), createdAt: z.string(), updatedAt: z.string() });

const CreateVolunteerApplicationResponse = z.object({ ok: z.literal(true), application: VolunteerApplicationResponse });

const CreateVolunteerApplicationBatchRequest = z.object({ availability: z.string(), relevantExperience: z.string(), supportingDocuments: z.array(z.object({ name: z.string().min(1).max(255), key: z.string().min(1).max(600) })).max(3).optional().default([]), topPickRoleId: z.string().uuid().nullish(), roleIds: z.array(z.string().uuid()).min(1).max(20) });

const CreateVolunteerApplicationBatchResponse = z.object({ ok: z.literal(true), applications: z.array(VolunteerApplicationResponse) });

const PublicVolunteerOpportunityResponse = z.object({ id: z.string(), category: VolunteerOpportunityReference, location: VolunteerOpportunityReference, title: z.string(), overview: z.string(), communityImpact: z.string().nullable(), startDate: z.string().nullable(), endDate: z.string().nullable(), commitmentLabel: z.string().nullable(), commitmentDescription: z.string().nullable(), applicationDeadline: z.string(), applicationCount: z.number(), capacity: z.number(), filled: z.boolean(), totalView: z.number(), coverImageKey: z.string(), benefits: z.array(z.string()), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), publishedAt: z.string().nullable(), organizer: VolunteerOpportunityOrganizerResponse, createdAt: z.string(), updatedAt: z.string(), viewerSave: z.boolean().nullable(), viewerTopPicked: z.string().nullable(), viewerBlocked: z.boolean(), roles: z.array(VolunteerOpportunityRoleResponse) });

const GetPublicVolunteerOpportunityResponse = z.object({ ok: z.literal(true), opportunity: PublicVolunteerOpportunityResponse });

const ReportingTypeResponse = z.object({ id: z.string(), type: z.string() });

const GetReportingTypesResponse = z.object({ ok: z.boolean(), reportingTypes: z.array(ReportingTypeResponse) });

const PublicStatsResponse = z.object({ ok: z.literal(true), stats: z.object({ activeUsers: z.number().int().gte(0), projects: z.number().int().gte(0), userGrowthPercent: z.number().gte(0).nullable(), memberTrend: z.array(z.number().int().gte(0)), windowDays: z.number().int().gt(0) }) });

const PublicStatsErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const CreateReportingRequest = z.object({ questionId: z.string(), answerId: z.string(), typeId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), description: z.string().max(10000).optional() });

const CreateReportingResponse = z.object({ ok: z.boolean(), reportingId: z.string().uuid() });

const CreateVolunteerReportingRequest = z.object({ opportunityId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), typeId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), description: z.string().max(10000).optional() });

const CreateVolunteerReportingResponse = z.object({ ok: z.boolean(), reportingId: z.string().uuid() });

const CreateLaunchpadReportingRequest = z.object({ launchpadId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), typeId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), description: z.string().max(10000).optional() });

const CreateLaunchpadReportingResponse = z.object({ ok: z.boolean(), reportingId: z.string().uuid() });

const LaunchpadCategoryResponse = z.object({ id: z.string(), name: z.string(), slug: z.string(), iconKey: z.string(), mobileIconType: z.string().nullable(), mobileIconName: z.string().nullable(), displayOrder: z.number(), status: z.enum(["ACTIVE", "ARCHIVED", "HIDDEN"]), totalLaunchpad: z.number(), createdBy: z.string(), updatedBy: z.string().nullable(), createdAt: z.string(), updatedAt: z.string() });

const GetLaunchpadCategoriesResponse = z.object({ ok: z.boolean(), categories: z.array(LaunchpadCategoryResponse) });

const PresignLaunchpadImageUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(5242880) });

const PresignLaunchpadCoverUploadResult = z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), coverImageKey: z.string(), publicUrl: z.string().nullable(), expiresInSeconds: z.number() });

const PresignLaunchpadCoverUploadResponse = z.object({ ok: z.literal(true), upload: PresignLaunchpadCoverUploadResult });

const LaunchpadValidationErrorResponse = z.object({ ok: z.literal(false), error: z.string(), issues: z.array(z.object({ path: z.string(), message: z.string() })) });

const LaunchpadOperationErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const PresignLaunchpadDocumentUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(10485760) });

const PresignLaunchpadDocumentUploadResult = z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), documentKey: z.string(), publicUrl: z.string().nullable(), expiresInSeconds: z.number() });

const PresignLaunchpadDocumentUploadResponse = z.object({ ok: z.literal(true), upload: PresignLaunchpadDocumentUploadResult });

const GetSavedLaunchpadsResponse = z.object({ ok: z.literal(true), launchpads: z.array(z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), deadline: z.string().nullable(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), coverKey: z.string().nullable(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), phoneNumber: z.string().nullable(), email: z.string().nullable(), telegramUsername: z.string().nullable(), createdBy: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), launchpadCount: z.number() }), createdAt: z.string(), category: z.object({ id: z.string(), name: z.string() }).optional(), city: z.object({ id: z.string(), name: z.string() }).optional(), totalRoles: z.number(), totalView: z.number(), isSaved: z.literal(true), savedAt: z.string() })), nextCursor: z.string().nullable() });

const SaveLaunchpadResponse = z.object({ ok: z.literal(true) });

const CreateLaunchpadRequest = z.object({ name: z.string().min(1).max(120), description: z.string().nullish(), categoryId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), cityId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), deadline: z.string(), coverKey: z.string().min(1).max(255), role: z.array(z.object({ name: z.string().min(1).max(100), description: z.string().nullish(), capacity: z.number().int().gt(0).lte(1000).optional().default(1) })).min(1), materialDocumentKey: z.array(z.string().min(1).max(255)).min(1).max(5), materialDocumentName: z.array(z.string().min(1).max(255)).min(1).max(5), phoneNumber: z.string(), email: z.string().max(255).email(), telegramUsername: z.string().nullish() });

const CreateLaunchpadResponse = z.object({ ok: z.literal(true), launchpad: z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), deadline: z.string().nullable(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), coverKey: z.string().nullable(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), phoneNumber: z.string().nullable(), email: z.string().nullable(), telegramUsername: z.string().nullable(), totalView: z.number(), createdBy: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), launchpadCount: z.number() }), createdAt: z.string(), category: z.object({ id: z.string(), name: z.string() }).optional(), city: z.object({ id: z.string(), name: z.string() }).optional(), roles: z.array(z.object({ id: z.string(), title: z.string(), description: z.string().nullable(), capacity: z.number(), viewerApplied: z.boolean() })) }) });

const GetLaunchpadsResponse = z.object({ ok: z.literal(true), launchpads: z.array(z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), deadline: z.string().nullable(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), coverKey: z.string().nullable(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), phoneNumber: z.string().nullable(), email: z.string().nullable(), telegramUsername: z.string().nullable(), createdBy: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), launchpadCount: z.number() }), createdAt: z.string(), category: z.object({ id: z.string(), name: z.string() }).optional(), city: z.object({ id: z.string(), name: z.string() }).optional(), totalRoles: z.number(), totalView: z.number(), isSaved: z.boolean() })), nextCursor: z.string().nullable() });

const UpdateLaunchpadRoleRequest = z.object({ id: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional(), name: z.string().min(1).max(100), description: z.string().nullish(), capacity: z.number().int().gt(0).lte(1000).optional().default(1) });

const UpdateLaunchpadRequest = z.object({ name: z.string(), description: z.string().nullable(), categoryId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), cityId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), deadline: z.string(), coverKey: z.string().min(1).max(255), role: z.array(UpdateLaunchpadRoleRequest).min(1), materialDocumentKey: z.array(z.string().min(1).max(255)).min(1).max(5), materialDocumentName: z.array(z.string().min(1).max(255)).min(1).max(5), phoneNumber: z.string(), email: z.string().max(255).email(), telegramUsername: z.string().nullable() }).partial();

const GetLaunchpadByIdResponse = z.object({ ok: z.literal(true), launchpad: z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), deadline: z.string().nullable(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), coverKey: z.string().nullable(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), phoneNumber: z.string().nullable(), email: z.string().nullable(), telegramUsername: z.string().nullable(), createdBy: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), launchpadCount: z.number() }), createdAt: z.string(), category: z.object({ id: z.string(), name: z.string() }).optional(), city: z.object({ id: z.string(), name: z.string() }).optional(), roles: z.array(z.object({ id: z.string(), title: z.string(), description: z.string().nullable(), capacity: z.number(), viewerApplied: z.boolean() })), viewerBlocked: z.boolean(), isSaved: z.boolean().nullable(), totalView: z.number() }) });

const PresignLaunchpadApplicationDocumentUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(10485760) });

const PresignLaunchpadApplicationDocumentUploadResult = z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.object({ "Content-Length": z.string(), "Content-Type": z.string() }), documentKey: z.string(), expiresInSeconds: z.number() });

const PresignLaunchpadApplicationDocumentUploadResponse = z.object({ ok: z.literal(true), upload: PresignLaunchpadApplicationDocumentUploadResult });

const LaunchpadApplicationValidationErrorResponse = z.object({ ok: z.literal(false), error: z.string(), issues: z.array(z.object({ path: z.string(), message: z.string() })) });

const LaunchpadApplicationOperationErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const CreateLaunchpadApplicationRequest = z.object({ motivation: z.string().min(5).max(2000), portfolio: z.string().max(255).url().optional(), documentKeys: z.array(z.string().min(1).max(500)).max(5).optional(), documentNames: z.array(z.string().min(1).max(255)).max(5).optional(), topPickRoleId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).nullish(), launchpadRoleId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), relevantExperience: z.string().min(1).max(5000).optional().default("") });

const LaunchpadApplicationLog = z.object({ id: z.string(), status: z.enum(["SUBMITTED", "UNDER_REVIEW", "APPROVED", "DECLINED", "CONFIRMED", "COMPLETED", "WITHDRAWN"]), declinedBy: z.enum(["POSTER", "APPLICANT", "SYSTEM"]).nullable(), createdBy: z.string(), createdAt: z.string() });

const LaunchpadApplication = z.object({ id: z.string(), launchpadId: z.string(), launchpadRoleId: z.string(), motivation: z.string(), relevantExperience: z.string(), portfolio: z.string().nullable(), topPick: z.boolean(), status: z.enum(["SUBMITTED", "UNDER_REVIEW", "APPROVED", "DECLINED", "CONFIRMED", "COMPLETED", "WITHDRAWN"]), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), createdAt: z.string(), updatedAt: z.string(), logs: z.array(LaunchpadApplicationLog) });

const CreateLaunchpadApplicationResponse = z.object({ ok: z.literal(true), application: LaunchpadApplication });

const CreateLaunchpadApplicationBatchRequest = z.object({ motivation: z.string().min(5).max(2000), portfolio: z.string().max(255).url().optional(), documentKeys: z.array(z.string().min(1).max(500)).max(5).optional(), documentNames: z.array(z.string().min(1).max(255)).max(5).optional(), topPickRoleId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).nullish(), relevantExperience: z.string().min(1).max(5000), launchpadRoleIds: z.array(z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)).min(1).max(20) });

const CreateLaunchpadApplicationBatchResponse = z.object({ ok: z.literal(true), applications: z.array(LaunchpadApplication) });

const LaunchpadApplicationBatchErrorResponse = z.union([LaunchpadApplicationValidationErrorResponse, LaunchpadApplicationOperationErrorResponse]);

const GetLaunchpadApplicationResponse = z.object({ ok: z.literal(true), application: LaunchpadApplication });

const MyApplicationStatusGroup = z.enum(["SUBMITTED", "UNDER_REVIEW", "APPROVED", "DECLINED", "CONFIRMED", "COMPLETED", "WITHDRAWN"]);

const MyApplicationReference = z.object({ id: z.string(), name: z.string() });

const MyApplicationTimeline = z.object({ submitted: z.string().nullable(), underReview: z.string().nullable(), approved: z.string().nullable(), declined: z.object({ at: z.string().nullable(), by: z.enum(["POSTER", "APPLICANT", "SYSTEM"]).nullable() }), confirmed: z.string().nullable(), completed: z.string().nullable(), withdrawn: z.string().nullable() });

const MyApplicationRole = z.object({ applicationId: z.string(), roleId: z.string(), title: z.string(), status: MyApplicationStatusGroup, appliedAt: z.string(), timeline: MyApplicationTimeline });

const MyApplicationItem = z.object({ opportunityId: z.string(), opportunityTitle: z.string(), sourceType: z.enum(["VOLUNTEER", "PROJECT"]), imageKey: z.string().nullable(), appliedAt: z.string(), deadline: z.string().nullable(), startDate: z.string().nullable(), endDate: z.string().nullable(), status: MyApplicationStatusGroup, needAttention: z.boolean(), totalRoleApplied: z.number().int().gte(0), canArchive: z.boolean(), filled: z.boolean(), archivedAt: z.string().nullable(), category: MyApplicationReference.nullable(), location: MyApplicationReference.nullable(), roles: z.array(MyApplicationRole), approvedRole: MyApplicationRole.nullable() });

const MyApplicationsSummary = z.object({ PENDING: z.number().int().gte(0), APPROVED: z.number().int().gte(0), DECLINED: z.number().int().gte(0), ACTIVE: z.number().int().gte(0), COMPLETED: z.number().int().gte(0), WITHDRAWN: z.number().int().gte(0), ARCHIVED: z.number().int().gte(0) });

const MyApplicationsResponse = z.object({ ok: z.literal(true), applications: z.array(MyApplicationItem).nullable(), summary: MyApplicationsSummary });

const MyApplicationsErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const MyApplicationRoleDetail = z.object({ applicationId: z.string(), roleId: z.string(), title: z.string(), description: z.string().nullable(), responsibilities: z.array(z.string()), requirements: z.array(z.string()), status: MyApplicationStatusGroup, appliedAt: z.string(), archived: z.boolean(), archivedAt: z.string().nullable(), actions: z.object({ canConfirm: z.boolean(), canDecline: z.boolean(), canWithdraw: z.boolean() }), timeline: MyApplicationTimeline });

const MyApplicationDetail = z.object({ id: z.string(), sourceType: z.enum(["VOLUNTEER", "PROJECT"]), title: z.string(), imageKey: z.string().nullable(), status: MyApplicationStatusGroup, appliedAt: z.string(), deadline: z.string().nullable(), archived: z.boolean(), archivedAt: z.string().nullable(), needAttention: z.boolean(), totalRoleApplied: z.number().int().gte(0), canArchive: z.boolean(), opportunity: z.object({ id: z.string(), title: z.string(), overview: z.string().nullable(), category: MyApplicationReference.nullable(), location: MyApplicationReference.nullable(), startDate: z.string().nullable(), endDate: z.string().nullable(), commitmentLabel: z.string().nullable(), commitmentDescription: z.string().nullable(), filled: z.boolean(), impactRewardPoints: z.number().int().gte(0).nullable() }), owner: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), postedCount: z.number().int().gte(0), contact: z.object({ email: z.string(), phoneNumber: z.string().nullable(), telegramUsername: z.string().nullable() }) }), roles: z.array(MyApplicationRoleDetail), approvedRole: MyApplicationRole.nullable() });

const MyApplicationDetailResponse = z.object({ ok: z.literal(true), application: MyApplicationDetail });

const MyApplicationStatusActionResponse = z.object({ ok: z.literal(true), application: MyApplicationItem });

const MyApplicationArchiveActionResponse = z.object({ ok: z.literal(true), application: MyApplicationItem.and(z.object({ archived: z.boolean() })) });

const ProfileResponse = z.object({ ok: z.literal(true), profile: z.object({ user: z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), displayName: z.string().nullable(), email: z.string(), gender: z.enum(["male", "female", "other"]), dateOfBirth: z.string().nullable(), occupation: z.string().nullable(), phone: z.object({ country: z.string(), nationalNumber: z.string() }).nullable(), telegramUsername: z.string().nullable() }), profile: z.object({ avatarKey: z.string().nullable(), bio: z.string().nullable(), country: z.object({ id: z.string(), name: z.string(), iso2: z.string().nullable() }).nullable(), city: z.object({ id: z.string(), name: z.string() }).nullable(), visibility: z.object({ profile: z.enum(["public", "members", "private"]), contact: z.enum(["public", "members", "private"]), socialLinks: z.enum(["public", "members", "private"]), contributions: z.enum(["public", "members", "private"]) }) }), skills: z.array(z.object({ id: z.string(), name: z.string() })), socialLinks: z.object({ website: z.string().nullable(), linkedin: z.string().nullable(), twitter: z.string().nullable(), facebook: z.string().nullable() }), progress: z.object({ totalPoints: z.number(), rank: z.number().nullable(), tier: z.object({ id: z.string(), slug: z.string(), name: z.string(), rankOrder: z.number(), minPoints: z.number() }).nullable(), nextTier: z.object({ id: z.string(), slug: z.string(), name: z.string(), rankOrder: z.number(), minPoints: z.number() }).nullable(), pointsUntilNextTier: z.number() }), badges: z.array(z.object({ slug: z.string(), name: z.string(), description: z.string(), category: z.enum(["ONBOARDING", "COLLABORATION", "KNOWLEDGE", "VOLUNTEER", "LAUNCHPAD"]), awardedAt: z.string() })) }) });

const ProfileErrorResponse = z.object({ ok: z.literal(false), error: z.string(), issues: z.array(z.string()).optional() });

const UpdateProfileRequest = z.object({ firstName: z.string().min(2).max(100).regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u), lastName: z.string().min(2).max(100).regex(/^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$\/u/u), gender: z.enum(["male", "female", "other"]), dateOfBirth: z.union([z.string(), z.unknown()]), occupation: z.union([z.string(), z.unknown()]), phone: z.union([z.object({ country: z.string().min(2).max(2), nationalNumber: z.string().min(1) }), z.unknown()]), telegramUsername: z.union([z.string(), z.unknown()]), bio: z.union([z.string(), z.unknown()]), countryId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), cityId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), avatarKey: z.union([z.string(), z.unknown()]), skills: z.array(z.string()).max(20), socialLinks: z.object({ website: z.union([z.string(), z.string(), z.unknown()]), linkedin: z.union([z.string(), z.string(), z.unknown()]), twitter: z.union([z.string(), z.string(), z.unknown()]), facebook: z.union([z.string(), z.string(), z.unknown()]) }).partial(), visibility: z.object({ profile: z.enum(["public", "members", "private"]), contact: z.enum(["public", "members", "private"]), socialLinks: z.enum(["public", "members", "private"]), contributions: z.enum(["public", "members", "private"]) }).partial() }).partial();

const UpdateProfileResponse = z.object({ ok: z.literal(true), profile: z.object({ user: z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), displayName: z.string().nullable(), email: z.string(), gender: z.enum(["male", "female", "other"]), dateOfBirth: z.string().nullable(), occupation: z.string().nullable(), phone: z.object({ country: z.string(), nationalNumber: z.string() }).nullable(), telegramUsername: z.string().nullable() }), profile: z.object({ avatarKey: z.string().nullable(), bio: z.string().nullable(), country: z.object({ id: z.string(), name: z.string(), iso2: z.string().nullable() }).nullable(), city: z.object({ id: z.string(), name: z.string() }).nullable(), visibility: z.object({ profile: z.enum(["public", "members", "private"]), contact: z.enum(["public", "members", "private"]), socialLinks: z.enum(["public", "members", "private"]), contributions: z.enum(["public", "members", "private"]) }) }), skills: z.array(z.object({ id: z.string(), name: z.string() })), socialLinks: z.object({ website: z.string().nullable(), linkedin: z.string().nullable(), twitter: z.string().nullable(), facebook: z.string().nullable() }), progress: z.object({ totalPoints: z.number(), rank: z.number().nullable(), tier: z.object({ id: z.string(), slug: z.string(), name: z.string(), rankOrder: z.number(), minPoints: z.number() }).nullable(), nextTier: z.object({ id: z.string(), slug: z.string(), name: z.string(), rankOrder: z.number(), minPoints: z.number() }).nullable(), pointsUntilNextTier: z.number() }), badges: z.array(z.object({ slug: z.string(), name: z.string(), description: z.string(), category: z.enum(["ONBOARDING", "COLLABORATION", "KNOWLEDGE", "VOLUNTEER", "LAUNCHPAD"]), awardedAt: z.string() })) }) });

const RecentActivity = z.object({ id: z.string(), userId: z.string(), type: z.string(), title: z.string(), description: z.string().nullable(), targetType: z.string(), targetId: z.string(), referenceType: z.string(), referenceId: z.string(), data: z.record(z.string(), z.unknown().nullable()), createdAt: z.string(), updatedAt: z.string() });

const GetRecentActivitiesResponse = z.object({ ok: z.literal(true), activities: z.array(RecentActivity) });

const RecentActivityErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const SearchSkillsResponse = z.object({ ok: z.literal(true), skills: z.array(z.object({ id: z.string(), name: z.string() })) });

const GetSavedItemsResponse = z.object({ ok: z.literal(true), items: z.array(z.union([z.object({ type: z.literal("project"), savedAt: z.string(), item: z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), deadline: z.string().nullable(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), coverKey: z.string().nullable(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), phoneNumber: z.string().nullable(), email: z.string().nullable(), telegramUsername: z.string().nullable(), createdBy: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), launchpadCount: z.number() }), createdAt: z.string(), category: z.object({ id: z.string(), name: z.string() }).optional(), city: z.object({ id: z.string(), name: z.string() }).optional(), totalRoles: z.number(), totalView: z.number(), isSaved: z.literal(true), savedAt: z.string() }) }), z.object({ type: z.literal("volunteer"), savedAt: z.string(), item: VolunteerOpportunityListItemResponse }), z.object({ type: z.literal("forum"), savedAt: z.string(), item: QuestionResponse })])), pagination: z.object({ limit: z.number(), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) }), counts: z.object({ all: z.number().int().gte(0), project: z.number().int().gte(0), volunteer: z.number().int().gte(0), forum: z.number().int().gte(0) }) });

const SavedItemsErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const PublicProfileResponse = z.object({ ok: z.literal(true), profile: z.object({ user: z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), displayName: z.string().nullable(), occupation: z.string().nullable(), email: z.string().nullable(), phone: z.object({ country: z.string(), nationalNumber: z.string() }).nullable(), telegramUsername: z.string().nullable() }), profile: z.object({ avatarKey: z.string().nullable(), bio: z.string().nullable(), country: z.object({ id: z.string(), name: z.string(), iso2: z.string().nullable() }).nullable(), city: z.object({ id: z.string(), name: z.string() }).nullable() }), skills: z.array(z.object({ id: z.string(), name: z.string() })), socialLinks: z.object({ website: z.string().nullable(), linkedin: z.string().nullable(), twitter: z.string().nullable(), facebook: z.string().nullable() }), tier: z.object({ id: z.string(), slug: z.string(), name: z.string(), rankOrder: z.number(), minPoints: z.number() }).nullable(), postedCounts: z.object({ forum: z.number().int().gte(0), volunteer: z.number().int().gte(0), project: z.number().int().gte(0) }).nullable(), badges: z.array(z.object({ slug: z.string(), name: z.string(), description: z.string(), category: z.enum(["ONBOARDING", "COLLABORATION", "KNOWLEDGE", "VOLUNTEER", "LAUNCHPAD"]), awardedAt: z.string() })) }) });

const GetMyPostedResponse = z.union([z.object({ ok: z.literal(true), sourceType: z.literal("forum"), questions: z.array(QuestionResponse), pagination: z.object({ limit: z.number(), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) }) }), z.object({ ok: z.literal(true), sourceType: z.literal("volunteer"), opportunities: z.array(VolunteerOpportunityListItemResponse), pagination: VolunteerOpportunitiesPaginationResponse }), z.object({ ok: z.literal(true), sourceType: z.literal("project"), launchpads: z.array(z.object({ id: z.string(), name: z.string(), description: z.string().nullable(), deadline: z.string().nullable(), status: z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), coverKey: z.string().nullable(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()), phoneNumber: z.string().nullable(), email: z.string().nullable(), telegramUsername: z.string().nullable(), createdBy: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable(), launchpadCount: z.number() }), createdAt: z.string(), category: z.object({ id: z.string(), name: z.string() }).optional(), city: z.object({ id: z.string(), name: z.string() }).optional(), totalRoles: z.number(), totalView: z.number(), isSaved: z.boolean() })), nextCursor: z.string().nullable() })]);

const MyPostedErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const ManagePostingStatus = z.enum(["DRAFT", "LIVE", "IN_PROGRESS", "COMPLETED", "CANCELED", "DELETED", "SUSPENDED"]);

const ManagePostingItem = z.object({ id: z.string(), sourceType: z.enum(["VOLUNTEER", "PROJECT"]), title: z.string(), description: z.string().nullable(), imageKey: z.string().nullable(), status: ManagePostingStatus, filled: z.boolean(), roleCount: z.number().int().gte(0), applicantCount: z.number().int().gte(0), confirmedCount: z.number().int().gte(0), capacity: z.number().int().gte(0), views: z.number().int().gte(0), deadline: z.string().nullable(), isEditable: z.boolean(), createdAt: z.string() });

const ManagePostingsPagination = z.object({ page: z.number().int().gt(0), limit: z.number().int().gt(0), total: z.number().int().gte(0), totalPages: z.number().int().gte(0), hasNextPage: z.boolean(), hasPreviousPage: z.boolean() });

const ManagePostingsResponse = z.object({ ok: z.literal(true), postings: z.array(ManagePostingItem), pagination: ManagePostingsPagination });

const ManagePostingsErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const ManagePostingApplicantStatus = z.enum(["SUBMITTED", "UNDER_REVIEW", "APPROVED", "DECLINED", "CONFIRMED", "COMPLETED", "WITHDRAWN"]);

const ManagePostingApplicationRole = z.object({ applicationId: z.string(), roleId: z.string(), title: z.string(), description: z.string().nullable(), status: ManagePostingApplicantStatus, appliedAt: z.string(), updatedAt: z.string() });

const ManagePostingSubmission = z.object({ submissionKey: z.string(), roles: z.array(ManagePostingApplicationRole), topPick: z.string().nullable(), appliedAt: z.string(), updatedAt: z.string(), volunteer: z.object({ availability: z.string(), relevantExperience: z.string(), supportingDocuments: z.array(z.object({ name: z.string(), key: z.string() })) }).nullable(), project: z.object({ relevantExperience: z.string(), motivation: z.string(), portfolio: z.string(), documentKeys: z.array(z.string()), documentNames: z.array(z.string()) }).nullable() });

const ManagePostingApplicantPrivateNote = z.object({ id: z.string(), note: z.string(), createdBy: z.string(), updatedBy: z.string(), createdAt: z.string(), updatedAt: z.string() });

const ManagePostingApplicant = z.object({ candidate: z.object({ id: z.string(), name: z.string(), email: z.string(), phoneNumber: z.string().nullable(), telegramUsername: z.string().nullable(), avatarKey: z.string().nullable() }), submissions: z.array(ManagePostingSubmission), submissionCount: z.number().int().gte(0), totalRoleApplied: z.number().int().gte(0), overallStatus: ManagePostingApplicantStatus, lastAppliedAt: z.string(), updatedAt: z.string(), contact: z.object({ email: z.string(), phoneNumber: z.string().nullable(), telegramUsername: z.string().nullable() }), privateNote: ManagePostingApplicantPrivateNote.nullable() });

const ManagePostingCandidateDetailResponse = z.object({ ok: z.literal(true), applicant: ManagePostingApplicant });

const UpsertManagePostingCandidateNoteRequest = z.object({ note: z.string().max(5000) });

const UpsertManagePostingCandidateNoteResponse = z.object({ ok: z.literal(true), applicant: ManagePostingApplicant });

const UpdateManagePostingActionResponse = z.object({ ok: z.literal(true), posting: ManagePostingItem });

const ExtendManagePostingDeadlineRequest = z.object({ deadline: z.string() });

const ExtendManagePostingDeadlineResponse = z.object({ ok: z.literal(true), posting: ManagePostingItem });

const ManagePostingApplicationActionResponse = z.object({ ok: z.literal(true), applicant: ManagePostingApplicant });

const ManagePostingDetail = z.object({ posting: ManagePostingItem, stats: z.object({ pending: z.number().int().gte(0), totalApplicants: z.number().int().gte(0), recruited: z.number().int().gte(0), capacity: z.number().int().gte(0), statuses: z.object({ SUBMITTED: z.number().int().gte(0), UNDER_REVIEW: z.number().int().gte(0), APPROVED: z.number().int().gte(0), DECLINED: z.number().int().gte(0), CONFIRMED: z.number().int().gte(0), COMPLETED: z.number().int().gte(0), WITHDRAWN: z.number().int().gte(0) }), filterCounts: z.object({ all: z.number().int().gte(0), new: z.number().int().gte(0), in_review: z.number().int().gte(0), approved: z.number().int().gte(0), confirmed: z.number().int().gte(0), declined: z.number().int().gte(0) }) }), applicants: z.array(ManagePostingApplicant), pagination: z.object({ page: z.number().int().gt(0), limit: z.number().int().gt(0), total: z.number().int().gte(0), totalPages: z.number().int().gte(0), hasNextPage: z.boolean(), hasPreviousPage: z.boolean() }) });

const ManagePostingDetailResponse = z.object({ ok: z.literal(true), detail: ManagePostingDetail });

const postV1notificationstokens_Body = z.object({ token: z.string().min(1), platform: z.enum(["android", "ios"]) });

const postV1notificationssenduser_Body = z.object({ userId: z.string().uuid(), title: z.string().min(1), body: z.string().min(1), data: z.record(z.string(), z.string()).optional(), imageUrl: z.string().optional(), type: z.enum(["forum", "profile_view", "new_message", "achievement", "event_reminder", "application", "launchpad_update", "points", "system"]).optional().default("system"), archived: z.boolean().optional(), webRoute: z.string().optional(), mobileRoute: z.string().optional() });

const postV1notificationsbroadcast_Body = z.object({ title: z.string().min(1), body: z.string().min(1), data: z.record(z.string(), z.string()).optional(), imageUrl: z.string().optional(), type: z.enum(["forum", "profile_view", "new_message", "achievement", "event_reminder", "application", "launchpad_update", "points", "system"]).optional().default("system"), archived: z.boolean().optional(), webRoute: z.string().optional(), mobileRoute: z.string().optional() });

const PartnerRegistrationRequest = z.object({ firstName: z.string().min(2).max(50), lastName: z.string().min(2).max(50), registrationNumber: z.string().optional(), sectorOfActivity: z.string().min(2), country: z.string().min(2), companyName: z.string().min(2).max(150), companyAddress: z.string().min(5).max(200), city: z.string().min(2).max(100), zipCode: z.string().max(20).optional(), userContactNumber: z.string().min(5).max(30), companyContactNumber: z.string().min(5).max(30), position: z.string().min(2), website: z.string().url().optional(), companyFacebookUrl: z.string().url().optional(), companyLinkedinUrl: z.string().url().optional(), companyEmail: z.string().min(1).max(100).email(), companyTelegram: z.string().optional(), userFacebookUrl: z.string().url().optional(), userLinkedinUrl: z.string().url().optional(), userEmail: z.string().min(1).max(100).email(), userIdentity: z.string().max(50).optional(), userTelegram: z.string().optional(), package: z.enum(["Platinum", "Gold", "Silver", "Bronze", "Government", "SME", "Video", "Free"]).optional().default("Bronze"), title: z.string().min(2).max(100), gender: z.string().min(2).max(10) });

const PartnerRegistrationResponse = z.object({ ok: z.boolean(), message: z.string(), partnerId: z.string().uuid().optional() });

const PartnerRegistrationKmRequest = z.object({ firstNameKm: z.string().min(2).max(50), lastNameKm: z.string().min(2).max(50), registrationNumber: z.string().optional(), sectorOfActivityKm: z.string().min(2), countryKm: z.string().min(2), companyNameKm: z.string().min(2).max(150), companyAddressKm: z.string().min(5).max(200), cityKm: z.string().min(2).max(100), postalCodeKm: z.string().max(20).optional(), userContactNumber: z.string().min(5).max(30), companyContactNumber: z.string().min(5).max(30), positionKm: z.string().min(2), website: z.string().url().optional(), companyFacebookUrl: z.string().url().optional(), companyLinkedinUrl: z.string().url().optional(), companyEmail: z.string().min(1).max(100).email(), companyTelegram: z.string().optional(), userFacebookUrl: z.string().url().optional(), userLinkedinUrl: z.string().url().optional(), userEmail: z.string().min(1).max(100).email(), userIdentity: z.string().max(50).optional(), userTelegram: z.string().optional(), packageKm: z.enum(["ប្លាទីន", "មាស", "ប្រាក់", "សំរិទ្ធ", "រដ្ឋាភិបាល", "SME", "វីដេអូ", "ឥតគិតថ្លៃ"]).optional().default("សំរិទ្ធ"), titleKm: z.string().min(2).max(100), genderKm: z.string().min(2).max(10) });

const PublicPartner = z.object({ id: z.string().uuid(), name: z.string().nullable(), nameKh: z.string().nullable(), logo: z.string().nullable(), description: z.string().nullable(), descriptionKm: z.string().nullable(), bio: z.string().nullable(), bioKm: z.string().nullable(), sectorActivity: z.string().nullable(), sectorActivityKm: z.string().nullable(), website: z.string().nullable(), facebook: z.string().nullable(), linkedin: z.string().nullable(), telegram: z.string().nullable(), package: z.string().nullable(), packageKm: z.string().nullable(), createdAt: z.union([z.string(), z.string()]) });

const ListPublicPartnersResponse = z.object({ ok: z.boolean(), data: z.array(PublicPartner), total: z.number().int().gte(0), page: z.number().int().gt(0), limit: z.number().int().gt(0), totalPages: z.number().int().gte(0) });

const PublicPartnerPhoto = z.object({ id: z.string().uuid(), url: z.string(), thumbnail: z.string().nullable() });

const PublicPartnerDetailResponse = z.object({ ok: z.boolean(), partner: PublicPartner, photos: z.array(PublicPartnerPhoto) });

const BlogCategoryResponse = z.object({ id: z.string().uuid(), name: z.string(), slug: z.string(), isVisible: z.boolean(), createdBy: z.string().uuid(), updatedBy: z.string().uuid().nullable(), createdAt: z.string(), updatedAt: z.string() });
const BlogCategoryWithUsageResponse = BlogCategoryResponse.and(z.object({ postCount: z.number() }));

const GetBlogCategoriesResponse = z.object({ ok: z.boolean(), categories: z.array(BlogCategoryWithUsageResponse) });

const CreateBlogCategoryRequest = z.object({ name: z.string().min(1).max(120), slug: z.string().min(1).max(140) });

const CreateBlogCategoryResponse = z.object({ ok: z.boolean(), category: BlogCategoryResponse });

const UpdateBlogCategoryRequest = z.object({ name: z.string().min(1).max(120), slug: z.string().min(1).max(140), isVisible: z.boolean() }).partial();

const UpdateBlogCategoryResponse = z.object({ ok: z.boolean(), category: BlogCategoryResponse });

const PaginationMeta = z.object({ page: z.number().int().gt(0), pageSize: z.number().int().gt(0), total: z.number().int().gte(0), totalPages: z.number().int().gte(0) });

const ListModeratorBlogPostsResponse = z.object({ ok: z.boolean(), data: z.array(z.object({ id: z.string().uuid(), title: z.string(), slug: z.string(), excerpt: z.string(), coverImageKey: z.string().nullable(), coverImageUrl: z.string().nullable(), coverImageAlt: z.string().nullable(), coverImageCaption: z.string().nullable(), authorName: z.string(), authorRole: z.string().nullable(), tags: z.array(z.string()), categoryId: z.string().uuid().nullable(), categoryName: z.string().nullish(), isFeatured: z.boolean(), commentCount: z.number().int().gte(0), status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]), placement: z.enum(["HOME", "CONTACT", "NONE"]), publishedAt: z.string().nullable(), createdBy: z.string().uuid(), updatedBy: z.string().uuid().nullable(), createdAt: z.string(), updatedAt: z.string() })), meta: PaginationMeta });

const CreateBlogPostRequest = z.object({ title: z.string().min(1).max(255), slug: z.string().max(255).optional(), excerpt: z.string().min(1), coverImageKey: z.string().max(600).nullish(), coverImageAlt: z.string().max(255).nullish(), coverImageCaption: z.string().nullish(), authorName: z.string().min(1).max(120), authorRole: z.string().max(120).nullish(), content: z.string().optional().default(""), tags: z.array(z.string().min(1).max(40)).max(5).optional(), categoryId: z.string().uuid().nullish(), status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"), placement: z.enum(["HOME", "CONTACT", "NONE"]).optional().default("HOME") });

const BlogPostResponse = z.object({ id: z.string().uuid(), title: z.string(), slug: z.string(), excerpt: z.string(), coverImageKey: z.string().nullable(), coverImageUrl: z.string().nullable(), coverImageAlt: z.string().nullable(), coverImageCaption: z.string().nullable(), authorName: z.string(), authorRole: z.string().nullable(), content: z.string(), tags: z.array(z.string()), categoryId: z.string().uuid().nullable(), categoryName: z.string().nullish(), isFeatured: z.boolean(), commentCount: z.number().int().gte(0), status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]), placement: z.enum(["HOME", "CONTACT", "NONE"]), publishedAt: z.string().nullable(), createdBy: z.string().uuid(), updatedBy: z.string().uuid().nullable(), createdAt: z.string(), updatedAt: z.string() });

const CreateBlogPostResponse = z.object({ ok: z.boolean(), post: BlogPostResponse });

const PresignBlogImageUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(5242880) });

const PresignBlogImageUploadResponse = z.object({ ok: z.boolean(), upload: z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.record(z.string(), z.string()), imageKey: z.string(), publicUrl: z.string().nullable(), expiresInSeconds: z.number() }) });

const GetBlogPostResponse = z.object({ ok: z.boolean(), post: BlogPostResponse });

const UpdateBlogPostRequest = z.object({ title: z.string().min(1).max(255), slug: z.string().max(255), excerpt: z.string().min(1), coverImageKey: z.string().max(600).nullable(), coverImageAlt: z.string().max(255).nullable(), coverImageCaption: z.string().nullable(), authorName: z.string().min(1).max(120), authorRole: z.string().max(120).nullable(), content: z.string().default(""), tags: z.array(z.string().min(1).max(40)).max(5), categoryId: z.string().uuid().nullable(), status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"), placement: z.enum(["HOME", "CONTACT", "NONE"]).default("HOME") }).partial();

const UpdateBlogPostResponse = z.object({ ok: z.boolean(), post: BlogPostResponse });

const DeleteBlogPostResponse = z.object({ ok: z.boolean() });

const SetBlogPostFeaturedRequest = z.object({ isFeatured: z.boolean() });

const BlogPostListingItemResponse = z.object({ id: z.string().uuid(), title: z.string(), slug: z.string(), excerpt: z.string(), coverImageKey: z.string().nullable(), coverImageUrl: z.string().nullable(), coverImageAlt: z.string().nullable(), coverImageCaption: z.string().nullable(), authorName: z.string(), authorRole: z.string().nullable(), tags: z.array(z.string()), categoryId: z.string().uuid().nullable(), categoryName: z.string().nullish(), isFeatured: z.boolean(), commentCount: z.number().int().gte(0), status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]), placement: z.enum(["HOME", "CONTACT", "NONE"]), publishedAt: z.string().nullable(), createdBy: z.string().uuid(), updatedBy: z.string().uuid().nullable(), createdAt: z.string(), updatedAt: z.string(), previewText: z.string() });

const ListPublicBlogPostsResponse = z.object({ ok: z.boolean(), data: z.array(BlogPostListingItemResponse), meta: PaginationMeta, featuredPost: BlogPostListingItemResponse.nullable() });

const GetPublicBlogPostResponse = z.object({ ok: z.boolean(), post: BlogPostResponse, relatedPosts: z.array(BlogPostListingItemResponse) });

const RepliedBlogCommentResponse = z.object({ id: z.string(), body: z.string(), author: z.object({ id: z.string(), name: z.string(), avatarKey: z.string().nullable() }), replyCount: z.number(), createdAt: z.string(), updatedAt: z.string(), postId: z.string(), status: z.enum(["PUBLISHED", "SUSPENDED"]), suspendedAt: z.string().nullable(), suspensionReason: z.string().nullable(), replyTo: z.string().nullable() });
const BlogCommentResponse = RepliedBlogCommentResponse.and(z.object({ repliedComments: z.array(RepliedBlogCommentResponse).nullable() }));

const GetBlogCommentsResponse = z.object({ ok: z.boolean(), comments: z.array(BlogCommentResponse), total: z.number().int().gte(0) });

const BlogCommentErrorResponse = z.object({ ok: z.literal(false), error: z.string() });

const CreateBlogCommentRequest = z.object({ postId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), replyToComment: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).nullish(), body: z.string().min(1).max(10000) });

const CreateBlogCommentResponse = z.object({ ok: z.boolean(), comment: BlogCommentResponse });

const UpdateBlogCommentRequest = z.object({ body: z.string().min(1).max(10000) });

const EditBlogCommentResponse = z.object({ ok: z.boolean(), comment: BlogCommentResponse });

const DeleteBlogCommentResponse = z.object({ ok: z.boolean() });

const CourseCategoryResponse = z.object({ id: z.string().uuid(), name: z.string(), slug: z.string().nullable(), iconKey: z.string().nullable(), mobileIconType: z.string().nullable(), mobileIconName: z.string().nullable(), createdAt: z.string(), updatedAt: z.string() });

const ListCourseCategoriesResponse = z.object({ ok: z.literal(true), categories: z.array(CourseCategoryResponse) });

const CreateCourseCategoryRequest = z.object({ name: z.string().min(1).max(120), slug: z.string().min(1).max(140).nullish(), iconKey: z.union([z.string(), z.unknown()]).optional(), mobileIconType: z.union([z.string(), z.unknown()]).optional(), mobileIconName: z.union([z.string(), z.unknown()]).optional() });

const GetCourseCategoryResponse = z.object({ ok: z.literal(true), category: CourseCategoryResponse });

const UpdateCourseCategoryRequest = z.object({ name: z.string().min(1).max(120), slug: z.string().min(1).max(140).nullable(), iconKey: z.union([z.string(), z.unknown()]), mobileIconType: z.union([z.string(), z.unknown()]), mobileIconName: z.union([z.string(), z.unknown()]) }).partial();

const DeleteCourseCategoryResponse = z.object({ ok: z.literal(true) });

const CourseResponse = z.object({ id: z.string().uuid(), title: z.string(), description: z.string(), categoryId: z.string().uuid(), coverImageKey: z.string().nullable(), coverImageUrl: z.string().nullable(), price: z.number(), status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "UNPUBLISHED"]), difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCE", "ALL_LEVELS"]).nullable(), format: z.enum(["MULTI", "SINGLE"]), skills: z.array(z.string()), tags: z.array(z.string()), certificateKind: z.enum(["PARTICIPATION", "COMPLETION"]).nullable(), quizPassMark: z.number().int(), createdBy: z.string().uuid(), creator: z.object({ id: z.string().uuid(), name: z.string(), email: z.string().email() }).nullish(), updatedBy: z.string().uuid().nullable(), publishedAt: z.string().nullable(), publishedBy: z.string().uuid().nullable(), unpublishedAt: z.string().nullable(), unpublishedBy: z.string().uuid().nullable(), rejectionNote: z.string().nullable(), rejectedAt: z.string().nullable(), rejectedBy: z.string().uuid().nullable(), createdAt: z.string(), updatedAt: z.string() });
const PublicCourseListItem = CourseResponse.and(z.object({ categoryName: z.string().nullable(), lessonCount: z.number().int().gte(0) }));

const ListPublicCoursesResponse = z.object({ ok: z.literal(true), courses: z.array(PublicCourseListItem), pagination: z.object({ page: z.number().int().gt(0), limit: z.number().int().gt(0), total: z.number().int().gte(0), totalPages: z.number().int().gte(0) }) });

const CreateCourseRequest = z.object({ title: z.string().min(1).max(255), description: z.string().min(1).max(20000), categoryId: z.string().uuid(), coverImageKey: z.string().min(1).max(600).nullish() });

const GetCourseResponse = z.object({ ok: z.literal(true), course: CourseResponse });

const PresignCourseCoverUploadRequest = z.object({ contentType: z.string(), fileSize: z.number().int().gt(0).lte(5242880) });

const PresignCourseCoverUploadResponse = z.object({ ok: z.literal(true), upload: z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.record(z.string(), z.string()), coverImageKey: z.string(), publicUrl: z.string().nullable(), expiresInSeconds: z.number() }) });

const ListMyCoursesResponse = z.object({ ok: z.literal(true), courses: z.array(CourseResponse), pagination: z.object({ limit: z.number().int().gt(0), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) }) });

const UpdateCourseRequest = z.object({ title: z.string().min(1).max(255), description: z.string().min(1).max(20000), categoryId: z.string().uuid(), coverImageKey: z.string().min(1).max(600).nullable(), price: z.number().gte(0).lte(9999999999.99) }).partial();

const DeleteCourseResponse = z.object({ ok: z.literal(true) });

const PresignCourseLessonAssetRequest = z.object({ contentType: z.enum(["application/pdf", "audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg", "audio/wav", "audio/x-wav", "audio/webm"]), fileSize: z.number().int().gt(0).lte(104857600) });

const PresignCourseLessonAssetResponse = z.object({ ok: z.literal(true), upload: z.object({ uploadUrl: z.string(), method: z.literal("PUT"), requiredHeaders: z.record(z.string(), z.string()), assetKey: z.string(), publicUrl: z.string().nullable(), expiresInSeconds: z.number() }) });

const CourseLessonResponse = z.object({ id: z.string().uuid(), title: z.string(), type: z.enum(["YOUTUBE", "PDF", "AUDIO"]), url: z.string().nullable(), assetKey: z.string().nullable(), assetUrl: z.string().nullable(), durationSeconds: z.number().int().nullable(), isPreview: z.boolean(), position: z.number().int() });

const CourseChapterResponse = z.object({ id: z.string().uuid(), title: z.string(), position: z.number().int(), lessons: z.array(CourseLessonResponse) });

const CourseCurriculumResponse = z.object({ format: z.enum(["MULTI", "SINGLE"]), chapters: z.array(CourseChapterResponse), lessonCount: z.number().int().gte(0) });

const GetCourseCurriculumResponse = z.object({ ok: z.literal(true), curriculum: CourseCurriculumResponse });

const ReplaceCourseCurriculumRequest = z.object({ format: z.enum(["MULTI", "SINGLE"]).optional().default("MULTI"), chapters: z.array(z.object({ id: z.string().uuid().nullish(), title: z.string().min(1).max(255), lessons: z.array(z.object({ id: z.string().uuid().nullish(), title: z.string().min(1).max(255), type: z.enum(["YOUTUBE", "PDF", "AUDIO"]), url: z.string().max(2000).url().nullish(), assetKey: z.string().min(1).max(600).nullish(), durationSeconds: z.number().int().gte(0).lte(86400).nullish(), isPreview: z.boolean().optional().default(false) })).max(200) })).max(100) });

const CourseQuizQuestionResponse = z.object({ id: z.string().uuid(), question: z.string(), position: z.number().int(), options: z.array(z.object({ id: z.string().uuid(), label: z.string(), isCorrect: z.boolean(), position: z.number().int() })) });

const CourseQuizResponse = z.object({ passMark: z.number().int(), questions: z.array(CourseQuizQuestionResponse) });

const GetCourseQuizResponse = z.object({ ok: z.literal(true), quiz: CourseQuizResponse });

const ReplaceCourseQuizRequest = z.object({ passMark: z.number().int().gte(0).lte(100).optional().default(70), questions: z.array(z.object({ question: z.string().min(1).max(2000), options: z.array(z.object({ label: z.string().min(1).max(500), isCorrect: z.boolean().optional().default(false) })).min(2).max(6) })).max(100) });

const UpdateCourseMetaRequest = z.object({ difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCE", "ALL_LEVELS"]).nullable(), skills: z.array(z.string().min(1).max(80)).max(30), tags: z.array(z.string().min(1).max(80)).max(30), certificateKind: z.enum(["PARTICIPATION", "COMPLETION"]).nullable() }).partial();
const AdminCourseResponse = CourseResponse.and(z.object({  }));

const AdminListCoursesResponse = z.object({ ok: z.literal(true), courses: z.array(AdminCourseResponse), pagination: z.object({ limit: z.number().int().gt(0), hasMore: z.boolean(), nextCursor: z.string().nullable(), total: z.number().int().gte(0) }) });
const AdminCourseDetailResponse = AdminCourseResponse.and(z.object({ curriculum: CourseCurriculumResponse, quiz: CourseQuizResponse }));

const AdminGetCourseResponse = z.object({ ok: z.literal(true), course: AdminCourseDetailResponse });

const AdminUpdateCourseRequest = z.object({ title: z.string().min(1).max(255), description: z.string().min(1).max(20000), categoryId: z.string().uuid(), coverImageKey: z.string().min(1).max(600).nullable(), price: z.number().gte(0).lte(9999999999.99) }).partial();

const RejectCourseRequest = z.object({ note: z.string().min(1).max(2000) }).partial();

const SsoVerifyClientResponse = z.object({ ok: z.literal(true), client: z.object({ clientId: z.string(), name: z.string(), description: z.string().nullable(), logoUrl: z.string().nullable() }) });

const SsoErrorResponse = z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() });

const SsoExchangeHandoffRequest = z.object({ clientId: z.string().min(8).max(64).regex(/^[A-Za-z0-9_]+$/), accessToken: z.string().min(1).max(4096) });

const SsoHandoffTokenResponse = z.object({ ok: z.literal(true), handoffToken: z.string(), expiresIn: z.number(), expiresAt: z.string() });

const SsoRedeemHandoffRequest = z.object({ handoffToken: z.string().min(16).max(128) });

const SsoUser = z.object({ id: z.string().uuid(), email: z.string(), emailVerified: z.boolean(), firstName: z.string(), lastName: z.string(), username: z.string().nullable(), gender: z.enum(["male", "female", "other"]), occupation: z.string().nullable(), avatarUrl: z.string().nullable(), createdAt: z.string() });

const SsoUserResponse = z.object({ ok: z.literal(true), user: SsoUser });

const postV1plumpievents_Body = z.object({ organizationId: z.string().uuid(), title: z.string().min(1).max(100), excerpt: z.string().min(1).max(200), eventCategories: z.array(z.string().uuid()), isOnline: z.boolean(), venueId: z.string().uuid().optional(), venueName: z.string().min(1).optional(), address: z.string().min(1).optional(), googleMapLink: z.string().max(500).url().optional(), eventDates: z.array(z.object({ startAt: z.string(), endAt: z.string() })).min(1), listingChannel: z.literal("TRUE_KHMER").optional().default("TRUE_KHMER"), visibility: z.enum(["LISTED", "UNLISTED"]).optional().default("LISTED"), registrationMode: z.enum(["ANYONE", "REQUIRED_APPROVAL", "INVITED_GUESTS_ONLY"]).optional().default("ANYONE"), entryMode: z.enum(["TICKETED", "RSVP", "OPEN_ACCESS"]).optional().default("TICKETED") });

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
	AuthForgotPasswordRequestOtpRequest,
	ForgotPasswordRequestOtpResponse,
	AuthForgotPasswordVerifyOtpRequest,
	ForgotPasswordVerifyOtpResponse,
	AuthResetPasswordRequest,
	ResetPasswordResponse,
	AuthChangePasswordRequest,
	ChangePasswordResponse,
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
	ContentModeratorReportsSummary,
	ContentModeratorReportType,
	ContentModeratorReportReporter,
	ContentModeratorReportAuthor,
	ContentModeratorReportSolver,
	ContentModeratorReport,
	CursorPagination,
	ListContentModeratorReportsResponse,
	UpdateContentModeratorReportReviewRequest,
	UpdateContentModeratorReportReviewResponse,
	AdminDashboardOverviewResponse,
	AdminDashboardErrorResponse,
	AdminDashboardActiveUsersResponse,
	AdminDashboardNewRegistrationsResponse,
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
	AdminUserManagementStats,
	AdminUserManagementStatsResponse,
	AdminUserManagementPoints,
	AdminUserManagementActivity,
	AdminUserManagementDetailUser,
	AdminUserManagementDetailResponse,
	AdminAuditLogMember,
	AdminAuditLogMembersResponse,
	AdminAuditActor,
	AdminAuditLogEntry,
	AdminAuditLogPagination,
	AdminAuditLogListResponse,
	patchV1adminnotificationsread_Body,
	DeveloperClientResponse,
	ListDeveloperClientsResponse,
	DeveloperClientErrorResponse,
	CreateDeveloperClientRequest,
	IssuedClientSecretResponse,
	DeveloperClientDetailResponse,
	UpdateDeveloperClientRequest,
	DeleteDeveloperClientResponse,
	Partner,
	ListPendingPartnersResponse,
	ContactPerson,
	PartnerDetailResponse,
	PartnerErrorResponse,
	UpdatePartnerRegistrationStatusRequest,
	PartnerStatusResponse,
	DeletePartnerResponse,
	ListManagedPartnersResponse,
	CreateManagedPartnerRequest,
	CreateManagedPartnerResponse,
	PartnerPhoto,
	ManagedPartnerDetailResponse,
	UpdateManagedPartnerRequest,
	UpdateManagedPartnerResponse,
	DeleteManagedPartnerResponse,
	AddPartnerPhotoRequest,
	PartnerPhotoResponse,
	PresignPartnerAssetRequest,
	PresignPartnerLogoResponse,
	PresignPartnerPhotoResponse,
	QuestionTagResponse,
	QuestionResponse,
	GetQuestionsResponse,
	GetQuestionResponse,
	AdminDeletePostErrorResponse,
	AdminDeletePostResponse,
	RepliedAnswerResponse,
	AnswerResponse,
	GetAnswersResponse,
	AdminSuspendPostBody,
	AdminSuspendPostResponse,
	VolunteerOpportunityReference,
	AdminVolunteerPostListItemResponse,
	VolunteerOpportunitiesPaginationResponse,
	AdminVolunteerPostsResponse,
	VolunteerOpportunityContactResponse,
	VolunteerOpportunityOrganizerResponse,
	VolunteerOpportunityRoleResponse,
	AdminVolunteerPostDetailResponse,
	AdminVolunteerPostResponse,
	AdminSuspendVolunteerPostResponse,
	AdminLaunchpadPostListItemResponse,
	AdminLaunchpadPostsResponse,
	AdminLaunchpadPostDetailResponse,
	AdminLaunchpadPostResponse,
	AdminSuspendLaunchpadPostResponse,
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
	CreateQuestionRequest,
	CreateQuestionResponse,
	TrendingTagResponse,
	GetTrendingTagsResponse,
	GetMyQuestionsResponse,
	GetSavedQuestionsResponse,
	PresignForumQuestionImageUploadRequest,
	PresignForumQuestionImageUploadResult,
	PresignForumQuestionImageUploadResponse,
	EditQuestionRequest,
	VoteQuestionRequest,
	SaveQuestionResponse,
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
	VolunteerOpportunityListItemResponse,
	GetVolunteerOpportunitiesResponse,
	VolunteerOpportunityContact,
	VolunteerOpportunityRoleRequest,
	CreateVolunteerOpportunityPayload,
	CreateVolunteerOpportunityRequest,
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
	PublicStatsResponse,
	PublicStatsErrorResponse,
	CreateReportingRequest,
	CreateReportingResponse,
	CreateVolunteerReportingRequest,
	CreateVolunteerReportingResponse,
	CreateLaunchpadReportingRequest,
	CreateLaunchpadReportingResponse,
	LaunchpadCategoryResponse,
	GetLaunchpadCategoriesResponse,
	PresignLaunchpadImageUploadRequest,
	PresignLaunchpadCoverUploadResult,
	PresignLaunchpadCoverUploadResponse,
	LaunchpadValidationErrorResponse,
	LaunchpadOperationErrorResponse,
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
	PartnerRegistrationRequest,
	PartnerRegistrationResponse,
	PartnerRegistrationKmRequest,
	PublicPartner,
	ListPublicPartnersResponse,
	PublicPartnerPhoto,
	PublicPartnerDetailResponse,
	BlogCategoryResponse,
	BlogCategoryWithUsageResponse,
	GetBlogCategoriesResponse,
	CreateBlogCategoryRequest,
	CreateBlogCategoryResponse,
	UpdateBlogCategoryRequest,
	UpdateBlogCategoryResponse,
	PaginationMeta,
	ListModeratorBlogPostsResponse,
	CreateBlogPostRequest,
	BlogPostResponse,
	CreateBlogPostResponse,
	PresignBlogImageUploadRequest,
	PresignBlogImageUploadResponse,
	GetBlogPostResponse,
	UpdateBlogPostRequest,
	UpdateBlogPostResponse,
	DeleteBlogPostResponse,
	SetBlogPostFeaturedRequest,
	BlogPostListingItemResponse,
	ListPublicBlogPostsResponse,
	GetPublicBlogPostResponse,
	RepliedBlogCommentResponse,
	BlogCommentResponse,
	GetBlogCommentsResponse,
	BlogCommentErrorResponse,
	CreateBlogCommentRequest,
	CreateBlogCommentResponse,
	UpdateBlogCommentRequest,
	EditBlogCommentResponse,
	DeleteBlogCommentResponse,
	CourseCategoryResponse,
	ListCourseCategoriesResponse,
	CreateCourseCategoryRequest,
	GetCourseCategoryResponse,
	UpdateCourseCategoryRequest,
	DeleteCourseCategoryResponse,
	CourseResponse,
	PublicCourseListItem,
	ListPublicCoursesResponse,
	CreateCourseRequest,
	GetCourseResponse,
	PresignCourseCoverUploadRequest,
	PresignCourseCoverUploadResponse,
	ListMyCoursesResponse,
	UpdateCourseRequest,
	DeleteCourseResponse,
	PresignCourseLessonAssetRequest,
	PresignCourseLessonAssetResponse,
	CourseLessonResponse,
	CourseChapterResponse,
	CourseCurriculumResponse,
	GetCourseCurriculumResponse,
	ReplaceCourseCurriculumRequest,
	CourseQuizQuestionResponse,
	CourseQuizResponse,
	GetCourseQuizResponse,
	ReplaceCourseQuizRequest,
	UpdateCourseMetaRequest,
	AdminCourseResponse,
	AdminListCoursesResponse,
	AdminCourseDetailResponse,
	AdminGetCourseResponse,
	AdminUpdateCourseRequest,
	RejectCourseRequest,
	SsoVerifyClientResponse,
	SsoErrorResponse,
	SsoExchangeHandoffRequest,
	SsoHandoffTokenResponse,
	SsoRedeemHandoffRequest,
	SsoUser,
	SsoUserResponse,
	postV1plumpievents_Body,
};

const endpoints = makeApi([
	{
		method: "get",
		path: "/v1/admin/audit-log",
		alias: "getV1adminauditLog",
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(500).optional().default(20)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "category",
				type: "Query",
				schema: z.enum(["all", "TEAM", "CONTENT", "USERS", "SYSTEM"]).optional()
			},
			{
				name: "adminId",
				type: "Query",
				schema: z.string().uuid().optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).max(100).optional()
			},
			{
				name: "from",
				type: "Query",
				schema: z.string().nullish()
			},
			{
				name: "to",
				type: "Query",
				schema: z.string().nullish()
			},
		],
		response: AdminAuditLogListResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/audit-log/members",
		alias: "getV1adminauditLogmembers",
		requestFormat: "json",
		response: AdminAuditLogMembersResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/blog/category",
		alias: "getV1adminblogcategory",
		requestFormat: "json",
		response: GetBlogCategoriesResponse,
	},
	{
		method: "post",
		path: "/v1/admin/blog/category",
		alias: "postV1adminblogcategory",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateBlogCategoryRequest
			},
		],
		response: CreateBlogCategoryResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Category already exists`,
				schema: z.void()
			},
		]
	},
	{
		method: "patch",
		path: "/v1/admin/blog/category/:id",
		alias: "patchV1adminblogcategoryId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UpdateBlogCategoryRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: UpdateBlogCategoryResponse,
		errors: [
			{
				status: 404,
				description: `Category not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Category already exists`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/blog/posts",
		alias: "getV1adminblogposts",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "pageSize",
				type: "Query",
				schema: z.number().int().gt(0).lte(100).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional()
			},
			{
				name: "placement",
				type: "Query",
				schema: z.enum(["HOME", "CONTACT", "NONE"]).optional()
			},
			{
				name: "sortField",
				type: "Query",
				schema: z.enum(["createdAt", "updatedAt", "publishedAt", "title"]).optional().default("updatedAt")
			},
			{
				name: "sortOrder",
				type: "Query",
				schema: z.enum(["asc", "desc"]).optional().default("desc")
			},
		],
		response: ListModeratorBlogPostsResponse,
	},
	{
		method: "post",
		path: "/v1/admin/blog/posts",
		alias: "postV1adminblogposts",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateBlogPostRequest
			},
		],
		response: CreateBlogPostResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/blog/posts/:id",
		alias: "getV1adminblogpostsId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetBlogPostResponse,
		errors: [
			{
				status: 404,
				description: `Blog post not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "patch",
		path: "/v1/admin/blog/posts/:id",
		alias: "patchV1adminblogpostsId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UpdateBlogPostRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: UpdateBlogPostResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not the owner of this blog post`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Blog post not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/blog/posts/:id",
		alias: "deleteV1adminblogpostsId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 403,
				description: `Not the owner of this blog post`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Blog post not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/blog/posts/:id/featured",
		alias: "postV1adminblogpostsIdfeatured",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ isFeatured: z.boolean() })
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: UpdateBlogPostResponse,
		errors: [
			{
				status: 400,
				description: `Only published blog posts can be featured`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not the owner of this blog post`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Blog post not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/blog/posts/image/presign",
		alias: "postV1adminblogpostsimagepresign",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PresignBlogImageUploadRequest
			},
		],
		response: PresignBlogImageUploadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/content-moderator",
		alias: "getV1admincontentModerator",
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.enum(["OPEN", "CLOSED"]).optional()
			},
			{
				name: "reportType",
				type: "Query",
				schema: z.enum(["FORUM", "VOLUNTEER", "LAUNCHPAD"]).optional()
			},
			{
				name: "typeId",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "id",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: ListContentModeratorReportsResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
		]
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
				schema: UpdateContentModeratorReportReviewRequest
			},
		],
		response: UpdateContentModeratorReportReviewResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Report or reported content not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/dashboard",
		alias: "getV1admindashboard",
		requestFormat: "json",
		response: AdminDashboardOverviewResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: AdminDashboardErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/dashboard/active-users",
		alias: "getV1admindashboardactiveUsers",
		requestFormat: "json",
		parameters: [
			{
				name: "period",
				type: "Query",
				schema: z.enum(["7d", "30d", "12w", "6m", "12m"]).optional()
			},
		],
		response: AdminDashboardActiveUsersResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: AdminDashboardErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/dashboard/new-registrations",
		alias: "getV1admindashboardnewRegistrations",
		requestFormat: "json",
		parameters: [
			{
				name: "period",
				type: "Query",
				schema: z.enum(["7d", "30d", "12w", "6m", "12m"]).optional()
			},
		],
		response: AdminDashboardNewRegistrationsResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: AdminDashboardErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/developer-client",
		alias: "getV1admindeveloperClient",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "pageSize",
				type: "Query",
				schema: z.number().int().gt(0).lte(100).optional().default(20)
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(200).optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.enum(["ACTIVE", "DISABLED"]).optional()
			},
			{
				name: "sortField",
				type: "Query",
				schema: z.enum(["name", "createdAt"]).optional().default("createdAt")
			},
			{
				name: "sortOrder",
				type: "Query",
				schema: z.enum(["asc", "desc"]).optional().default("desc")
			},
		],
		response: ListDeveloperClientsResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: DeveloperClientErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/developer-client",
		alias: "postV1admindeveloperClient",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateDeveloperClientRequest
			},
		],
		response: IssuedClientSecretResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Client ID collision`,
				schema: DeveloperClientErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: DeveloperClientErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/developer-client/:id",
		alias: "getV1admindeveloperClientId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: DeveloperClientDetailResponse,
		errors: [
			{
				status: 400,
				description: `Invalid developer client ID`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Developer client not found`,
				schema: DeveloperClientErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: DeveloperClientErrorResponse
			},
		]
	},
	{
		method: "patch",
		path: "/v1/admin/developer-client/:id",
		alias: "patchV1admindeveloperClientId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UpdateDeveloperClientRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: DeveloperClientDetailResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Developer client not found`,
				schema: DeveloperClientErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: DeveloperClientErrorResponse
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/developer-client/:id",
		alias: "deleteV1admindeveloperClientId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: DeleteDeveloperClientResponse,
		errors: [
			{
				status: 400,
				description: `Invalid developer client ID`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Developer client not found`,
				schema: DeveloperClientErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: DeveloperClientErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/developer-client/:id/regenerate-client-id",
		alias: "postV1admindeveloperClientIdregenerateClientId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: DeveloperClientDetailResponse,
		errors: [
			{
				status: 400,
				description: `Invalid developer client ID`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Developer client not found`,
				schema: DeveloperClientErrorResponse
			},
			{
				status: 409,
				description: `Client ID collision`,
				schema: DeveloperClientErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: DeveloperClientErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/developer-client/:id/regenerate-secret",
		alias: "postV1admindeveloperClientIdregenerateSecret",
		description: `Issue a fresh client secret. The previous secret stops working immediately, and the new one is returned only in this response.`,
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: IssuedClientSecretResponse,
		errors: [
			{
				status: 400,
				description: `Invalid developer client ID`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Developer client not found`,
				schema: DeveloperClientErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: DeveloperClientErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/education-center/courses",
		alias: "getV1admineducationCentercourses",
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(20)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).max(255).optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.enum(["PENDING", "PUBLISHED", "UNPUBLISHED"]).optional()
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["newest", "oldest"]).optional().default("newest")
			},
			{
				name: "createdBy",
				type: "Query",
				schema: z.string().uuid().optional()
			},
		],
		response: AdminListCoursesResponse,
		errors: [
			{
				status: 400,
				description: `Invalid creator ID`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/education-center/courses/:id",
		alias: "getV1admineducationCentercoursesId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: AdminGetCourseResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "put",
		path: "/v1/admin/education-center/courses/:id",
		alias: "putV1admineducationCentercoursesId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AdminUpdateCourseRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Validation or status transition failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/education-center/courses/:id",
		alias: "deleteV1admineducationCentercoursesId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: DeleteCourseResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/education-center/courses/:id/approve",
		alias: "postV1admineducationCentercoursesIdapprove",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Only pending courses can be approved`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course status changed concurrently`,
				schema: z.void()
			},
		]
	},
	{
		method: "put",
		path: "/v1/admin/education-center/courses/:id/publication/:action",
		alias: "putV1admineducationCentercoursesIdpublicationAction",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
			{
				name: "action",
				type: "Path",
				schema: z.enum(["PUBLISH", "UNPUBLISH"])
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Invalid course status transition`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course status changed concurrently`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/education-center/courses/:id/reject",
		alias: "postV1admineducationCentercoursesIdreject",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ note: z.string().min(1).max(2000) }).partial().optional()
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Only pending courses can be rejected`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course status changed concurrently`,
				schema: z.void()
			},
		]
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
				schema: AdminLoginRequest
			},
		],
		response: AdminLoginOtpChallengeResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Invalid credentials`,
				schema: z.void()
			},
			{
				status: 429,
				description: `Too many requests or account locked`,
				schema: z.void()
			},
			{
				status: 500,
				description: `OTP delivery failed`,
				schema: z.object({ error: z.string() })
			},
		]
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
				schema: AdminVerifyLoginOtpRequest
			},
		],
		response: AdminLoginResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Invalid or expired OTP challenge`,
				schema: z.void()
			},
			{
				status: 429,
				description: `Too many OTP attempts`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Session creation failed`,
				schema: z.object({ error: z.string() })
			},
		]
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
				schema: z.void()
			},
		]
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
				schema: z.void()
			},
		]
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
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "role",
				type: "Query",
				schema: z.enum(["MODERATOR", "SUPER_ADMIN"]).optional()
			},
		],
		response: ListModeratorsResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
		]
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
				schema: CreateModeratorRequest
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Email already in use`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: ModeratorResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Moderator not found`,
				schema: z.void()
			},
		]
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
				schema: UpdateModeratorRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: ModeratorResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Moderator not found`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required or cannot remove own account`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Moderator not found`,
				schema: z.void()
			},
		]
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
				schema: AcceptModeratorInviteRequest
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Invalid or expired invite link`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/notifications",
		alias: "getV1adminnotifications",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "unreadOnly",
				type: "Query",
				schema: z.enum(["true", "false"]).optional()
			},
			{
				name: "type",
				type: "Query",
				schema: z.enum(["content_report", "partner_registration", "system"]).optional()
			},
		],
		response: z.object({ ok: z.literal(true), notifications: z.array(z.object({ id: z.string().uuid(), title: z.string(), body: z.string(), icon: z.string(), type: z.string(), eventType: z.string().nullish(), dedupeKey: z.string().nullish(), aggregateCount: z.number().int().gt(0).optional(), data: z.record(z.string(), z.string()).nullable(), isRead: z.boolean(), readAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string().optional(), webRoute: z.string().nullish() })), total: z.number(), page: z.number(), limit: z.number(), unreadCount: z.number() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
	},
	{
		method: "patch",
		path: "/v1/admin/notifications/read",
		alias: "patchV1adminnotificationsread",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: patchV1adminnotificationsread_Body
			},
		],
		response: z.object({ ok: z.boolean(), message: z.string() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
	},
	{
		method: "patch",
		path: "/v1/admin/notifications/read/all",
		alias: "patchV1adminnotificationsreadall",
		requestFormat: "json",
		parameters: [
			{
				name: "type",
				type: "Query",
				schema: z.enum(["content_report", "partner_registration", "system"]).optional()
			},
		],
		response: z.object({ ok: z.boolean(), message: z.string() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/partner",
		alias: "getV1adminpartner",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "pageSize",
				type: "Query",
				schema: z.number().int().gt(0).lte(100).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "sortField",
				type: "Query",
				schema: z.enum(["name", "createdAt"]).optional().default("createdAt")
			},
			{
				name: "sortOrder",
				type: "Query",
				schema: z.enum(["asc", "desc"]).optional().default("desc")
			},
		],
		response: ListManagedPartnersResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/partner",
		alias: "postV1adminpartner",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateManagedPartnerRequest
			},
		],
		response: CreateManagedPartnerResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Email conflict`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/partner/:id",
		alias: "getV1adminpartnerId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: ManagedPartnerDetailResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "patch",
		path: "/v1/admin/partner/:id",
		alias: "patchV1adminpartnerId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UpdateManagedPartnerRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: UpdateManagedPartnerResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/partner/:id",
		alias: "deleteV1adminpartnerId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/partner/:id/logo/presign",
		alias: "postV1adminpartnerIdlogopresign",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PresignPartnerAssetRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: PresignPartnerLogoResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/partner/:id/photos",
		alias: "postV1adminpartnerIdphotos",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ url: z.string().url() })
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: PartnerPhotoResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/partner/:id/photos/:photoId",
		alias: "deleteV1adminpartnerIdphotosPhotoId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
			{
				name: "photoId",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Photo not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/partner/:id/photos/presign",
		alias: "postV1adminpartnerIdphotospresign",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PresignPartnerAssetRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: PresignPartnerPhotoResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/partner/registrations",
		alias: "getV1adminpartnerregistrations",
		requestFormat: "json",
		response: ListPendingPartnersResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/partner/registrations/:id",
		alias: "getV1adminpartnerregistrationsId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: PartnerDetailResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "patch",
		path: "/v1/admin/partner/registrations/:id",
		alias: "patchV1adminpartnerregistrationsId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UpdatePartnerRegistrationStatusRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: z.union([PartnerStatusResponse, DeletePartnerResponse]),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Super admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/posts/forum/answers/:answerId",
		alias: "deleteV1adminpostsforumanswersAnswerId",
		description: `Soft-deletes a forum answer regardless of its author. Deleting a top-level answer also removes its replies; deleting a reply decrements its parent&#x27;s reply count. The question&#x27;s answer count is adjusted and a best-answer selection pointing at the removed answer is cleared.`,
		requestFormat: "json",
		parameters: [
			{
				name: "answerId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Forum answer not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Forum answer is already deleted`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/posts/forum/answers/:answerId/suspend",
		alias: "postV1adminpostsforumanswersAnswerIdsuspend",
		description: `Puts a forum answer on moderation hold. Only its author still sees it — along with the suspension reason — and the author is notified. Replies to the answer are left published but stop being reachable while their parent is hidden. The question&#x27;s answer count is unchanged, since the answer is hidden rather than removed.`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ reason: z.string().max(500) }).partial().optional()
			},
			{
				name: "answerId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminSuspendPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Forum answer not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Forum answer is deleted or already suspended`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/posts/forum/answers/:answerId/unsuspend",
		alias: "postV1adminpostsforumanswersAnswerIdunsuspend",
		description: `Republishes a suspended forum answer and notifies its author that it is visible again.`,
		requestFormat: "json",
		parameters: [
			{
				name: "answerId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminSuspendPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Forum answer not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Forum answer is not suspended`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/posts/forum/questions",
		alias: "getV1adminpostsforumquestions",
		description: `Lists forum questions the way moderators need to see them: suspended questions are included instead of being hidden the way the public and member endpoints hide them. Deleted questions are left out unless status&#x3D;DELETED is requested. viewerVote and viewerSave are always null/false because an admin is not a forum member.`,
		requestFormat: "json",
		parameters: [
			{
				name: "status",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "categoryId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "tagId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(300).optional()
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["mostRelevant", "newest", "oldest", "mostVoted", "mostAnswered", "byCategory"]).optional().default("newest")
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: GetQuestionsResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/posts/forum/questions/:questionId",
		alias: "getV1adminpostsforumquestionsQuestionId",
		description: `Returns a single forum question whatever its status — published, closed, suspended, or deleted — together with its suspension reason. The view count is not incremented.`,
		requestFormat: "json",
		parameters: [
			{
				name: "questionId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: GetQuestionResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Forum question not found`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/posts/forum/questions/:questionId",
		alias: "deleteV1adminpostsforumquestionsQuestionId",
		description: `Soft-deletes a forum question regardless of its author or status. The question drops out of every listing and detail endpoint; its answers stay attached to the removed question.`,
		requestFormat: "json",
		parameters: [
			{
				name: "questionId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Forum question not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Forum question is already deleted`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/posts/forum/questions/:questionId/answers",
		alias: "getV1adminpostsforumquestionsQuestionIdanswers",
		description: `Lists the answers of a question with suspended answers included, so a moderator can review what the forum no longer shows. Deleted answers stay out.`,
		requestFormat: "json",
		parameters: [
			{
				name: "questionId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["popular", "newest", "oldest"]).optional().default("popular")
			},
		],
		response: GetAnswersResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Forum question not found`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/posts/forum/questions/:questionId/suspend",
		alias: "postV1adminpostsforumquestionsQuestionIdsuspend",
		description: `Puts a forum question on moderation hold. It disappears from every listing, search result, and detail endpoint except for its author, who keeps seeing it with the suspension reason attached, and is notified that it was suspended. The hold is reversible and the pre-hold status (PUBLISHED or CLOSED) is restored when it is lifted.`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ reason: z.string().max(500) }).partial().optional()
			},
			{
				name: "questionId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminSuspendPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Forum question not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Forum question is deleted or already suspended`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/posts/forum/questions/:questionId/unsuspend",
		alias: "postV1adminpostsforumquestionsQuestionIdunsuspend",
		description: `Restores a suspended forum question to the status it held before the hold and notifies its author that it is public again.`,
		requestFormat: "json",
		parameters: [
			{
				name: "questionId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminSuspendPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Forum question not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Forum question is not suspended`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/posts/launchpad",
		alias: "getV1adminpostslaunchpad",
		description: `Lists launchpad posts the way moderators need to see them: suspended posts are included instead of being hidden the way the member and public endpoints hide them. Deleted posts are left out unless status&#x3D;DELETED is requested. Accepts the same filters as the member-facing list; isSaved is always false because an admin is not a member.`,
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["newest", "oldest", "startingSoon", "mostSpotsAvailable"]).optional().default("newest")
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "categoryId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "cityId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).max(120).optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: AdminLaunchpadPostsResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/posts/launchpad/:launchpadId",
		alias: "getV1adminpostslaunchpadLaunchpadId",
		description: `Returns a single launchpad post whatever its status — live, in progress, completed, canceled, suspended, or deleted — together with its suspension reason. The view count is not incremented.`,
		requestFormat: "json",
		parameters: [
			{
				name: "launchpadId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminLaunchpadPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Launchpad post not found`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/posts/launchpad/:launchpadId",
		alias: "deleteV1adminpostslaunchpadLaunchpadId",
		description: `Soft-deletes a launchpad project regardless of its poster, status, or applicant count. Existing applications are left untouched.`,
		requestFormat: "json",
		parameters: [
			{
				name: "launchpadId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Launchpad post not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Launchpad post is already deleted`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/posts/launchpad/:launchpadId/suspend",
		alias: "postV1adminpostslaunchpadLaunchpadIdsuspend",
		description: `Puts a launchpad post on moderation hold. It disappears from every listing, search result, saved list, and detail endpoint except for its poster, who keeps seeing it with the suspension reason attached and is notified that it was suspended. Nobody can apply to it or save it while it is held, and the poster cannot edit it or run status actions on it. Existing applications are left untouched. The hold is reversible and the pre-hold status is restored when it is lifted.`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ reason: z.string().max(500) }).partial().optional()
			},
			{
				name: "launchpadId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminSuspendLaunchpadPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Launchpad post not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Launchpad post is deleted or already suspended`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/posts/launchpad/:launchpadId/unsuspend",
		alias: "postV1adminpostslaunchpadLaunchpadIdunsuspend",
		description: `Restores a suspended launchpad post to the status it held before the hold and notifies its poster that it is public again.`,
		requestFormat: "json",
		parameters: [
			{
				name: "launchpadId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminSuspendLaunchpadPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Launchpad post not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Launchpad post is not suspended`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/posts/volunteer",
		alias: "getV1adminpostsvolunteer",
		description: `Lists volunteer posts the way moderators need to see them: suspended posts are included instead of being hidden the way the member and public endpoints hide them, and posts sitting in an archived category or a deactivated city are kept too. Deleted posts are left out unless status&#x3D;DELETED is requested. Unpublished drafts never appear, since the listing is ordered and paginated by publication time. Accepts the same filters as the member-facing list; viewerSave is always false because an admin is not a member.`,
		requestFormat: "json",
		parameters: [
			{
				name: "categoryId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "locationId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(300).optional()
			},
			{
				name: "filter",
				type: "Query",
				schema: z.enum(["recentlyAdded", "startingSoon", "mostSpotsAvailable"]).optional().default("recentlyAdded")
			},
			{
				name: "timeCommitment",
				type: "Query",
				schema: z.enum(["Light", "Regular", "Intensive"]).optional()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: AdminVolunteerPostsResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/posts/volunteer/:opportunityId",
		alias: "getV1adminpostsvolunteerOpportunityId",
		description: `Returns a single volunteer post whatever its status — live, in progress, completed, canceled, suspended, or deleted — together with its suspension reason. The view count is not incremented.`,
		requestFormat: "json",
		parameters: [
			{
				name: "opportunityId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminVolunteerPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Volunteer post not found`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "delete",
		path: "/v1/admin/posts/volunteer/:opportunityId",
		alias: "deleteV1adminpostsvolunteerOpportunityId",
		description: `Soft-deletes a volunteer opportunity regardless of its poster, status, or applicant count. Existing applications are left untouched.`,
		requestFormat: "json",
		parameters: [
			{
				name: "opportunityId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Volunteer post not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Volunteer post is already deleted`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/posts/volunteer/:opportunityId/suspend",
		alias: "postV1adminpostsvolunteerOpportunityIdsuspend",
		description: `Puts a volunteer post on moderation hold. It disappears from every listing, search result, saved list, and detail endpoint except for its poster, who keeps seeing it with the suspension reason attached and is notified that it was suspended. Nobody can apply to it or save it while it is held, and the poster cannot edit it or run status actions on it. Existing applications are left untouched. The hold is reversible and the pre-hold status is restored when it is lifted.`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ reason: z.string().max(500) }).partial().optional()
			},
			{
				name: "opportunityId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminSuspendVolunteerPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Volunteer post not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Volunteer post is deleted or already suspended`,
				schema: AdminDeletePostErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/admin/posts/volunteer/:opportunityId/unsuspend",
		alias: "postV1adminpostsvolunteerOpportunityIdunsuspend",
		description: `Restores a suspended volunteer post to the status it held before the hold and notifies its poster that it is public again.`,
		requestFormat: "json",
		parameters: [
			{
				name: "opportunityId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: AdminSuspendVolunteerPostResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Moderator role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Volunteer post not found`,
				schema: AdminDeletePostErrorResponse
			},
			{
				status: 409,
				description: `Volunteer post is not suspended`,
				schema: AdminDeletePostErrorResponse
			},
		]
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
				schema: AdminPresignAvatarUploadRequest
			},
		],
		response: AdminPresignAvatarUploadResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Failed to generate upload URL`,
				schema: z.void()
			},
		]
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
				schema: AdminUpdateProfileRequest
			},
		],
		response: AdminUpdateProfileResponse,
		errors: [
			{
				status: 400,
				description: `Invalid avatarKey or old password is incorrect`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Admin not found`,
				schema: z.void()
			},
		]
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
				schema: z.object({ refreshToken: z.string().min(1) })
			},
		],
		response: AdminRefreshResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Invalid or expired refresh token`,
				schema: z.void()
			},
		]
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
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(20)
			},
			{
				name: "status",
				type: "Query",
				schema: z.enum(["all", "SIGNUP_REQUIRED", "ONBOARDING_REQUIRED", "ACTIVE", "SUSPENDED"]).optional()
			},
			{
				name: "tier",
				type: "Query",
				schema: z.enum(["all", "dam", "doh", "loas_sleuk", "phka_reek", "preksa"]).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).max(100).optional()
			},
		],
		response: AdminUserManagementListResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: z.string().uuid()
			},
		],
		response: AdminUserManagementDetailResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: z.string().uuid()
			},
			{
				name: "action",
				type: "Path",
				schema: z.enum(["suspend", "unsuspend"])
			},
		],
		response: z.object({ ok: z.literal(true), user: AdminUserManagementDetailUser }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/admin/user-management/stats",
		alias: "getV1adminuserManagementstats",
		requestFormat: "json",
		response: AdminUserManagementStatsResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: z.object({  }).partial()
			},
		],
		response: z.object({ status: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
		]
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
				schema: z.object({  }).partial()
			},
		],
		response: z.object({ status: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Email OTP already enabled`,
				schema: z.void()
			},
		]
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
				schema: AuthTwoFactorEmailVerifyRequest
			},
		],
		response: AuthTokenResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Email OTP already enabled`,
				schema: z.void()
			},
		]
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
				schema: z.void()
			},
			{
				status: 404,
				description: `User not found`,
				schema: z.void()
			},
		]
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
				schema: z.object({  }).partial()
			},
		],
		response: z.object({ status: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
		]
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
				schema: z.object({ password: z.string().min(1) })
			},
		],
		response: AuthTwoFactorTotpSetupResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Authenticator app already enabled`,
				schema: z.void()
			},
		]
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
				schema: AuthTwoFactorTotpVerifyRequest
			},
		],
		response: AuthTokenResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Authenticator app already enabled`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/auth/change-password",
		alias: "postV1authchangePassword",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AuthChangePasswordRequest
			},
		],
		response: ChangePasswordResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed, old password is required, or old password is invalid`,
				schema: z.object({ error: z.string() })
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
		]
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
				schema: AuthForgotPasswordRequest
			},
		],
		response: ForgotPasswordResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.object({ error: z.string() })
			},
		]
	},
	{
		method: "post",
		path: "/v1/auth/forgot-password/request-otp",
		alias: "postV1authforgotPasswordrequestOtp",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ email: z.string().min(1).email() })
			},
		],
		response: ForgotPasswordRequestOtpResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.object({ error: z.string() })
			},
		]
	},
	{
		method: "post",
		path: "/v1/auth/forgot-password/verify-otp",
		alias: "postV1authforgotPasswordverifyOtp",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AuthForgotPasswordVerifyOtpRequest
			},
		],
		response: ForgotPasswordVerifyOtpResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed or OTP is invalid/expired`,
				schema: z.object({ error: z.string() })
			},
		]
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
				schema: AuthGoogleRequest
			},
		],
		response: AuthTokenResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Google authentication failed`,
				schema: z.void()
			},
		]
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
				schema: AuthLoginRequest
			},
		],
		response: z.union([AuthTokenResponse, AuthTwoFactorRequiredResponse]),
		errors: [
			{
				status: 401,
				description: `Invalid credentials`,
				schema: z.void()
			},
		]
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
				schema: z.object({ twoFactorToken: z.string().min(1) })
			},
		],
		response: z.object({ status: z.boolean() }),
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Invalid or expired two-factor challenge`,
				schema: z.void()
			},
		]
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
				schema: AuthLoginTwoFactorEmailVerifyRequest
			},
		],
		response: AuthTokenResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Invalid or expired two-factor challenge`,
				schema: z.void()
			},
		]
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
				schema: AuthLoginTwoFactorTotpVerifyRequest
			},
		],
		response: AuthTokenResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Invalid or expired two-factor challenge`,
				schema: z.void()
			},
		]
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
				schema: z.object({ refreshToken: z.string().min(1) })
			},
		],
		response: RefreshSuccessResponse,
		errors: [
			{
				status: 401,
				description: `Invalid refresh token`,
				schema: z.void()
			},
		]
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
				schema: AuthRegisterRequest
			},
		],
		response: RegisterSuccessResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
		]
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
				schema: AuthCompleteSignUpRequest
			},
		],
		response: CompleteSignUpResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 404,
				description: `User not found`,
				schema: z.void()
			},
		]
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
				schema: z.object({ email: z.string().min(1).email() })
			},
		],
		response: ResendRegisterOtpResponse,
		errors: [
			{
				status: 400,
				description: `Invalid email`,
				schema: z.object({ error: z.string() })
			},
		]
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
				schema: AuthVerifyRegisterOtpRequest
			},
		],
		response: AuthTokenResponse,
		errors: [
			{
				status: 400,
				description: `Invalid OTP`,
				schema: z.void()
			},
		]
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
				schema: z.string().uuid()
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
				schema: AuthResetPasswordRequest
			},
		],
		response: ResetPasswordResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed or token is invalid`,
				schema: z.object({ error: z.string() })
			},
		]
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
				schema: AuthProtectedErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/blog/comment",
		alias: "getV1blogcomment",
		requestFormat: "json",
		parameters: [
			{
				name: "postId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["newest", "oldest"]).optional().default("newest")
			},
		],
		response: GetBlogCommentsResponse,
		errors: [
			{
				status: 404,
				description: `Blog post not found`,
				schema: BlogCommentErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/blog/comment",
		alias: "postV1blogcomment",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateBlogCommentRequest
			},
		],
		response: CreateBlogCommentResponse,
		errors: [
			{
				status: 404,
				description: `Blog post or reply target not found`,
				schema: BlogCommentErrorResponse
			},
			{
				status: 409,
				description: `Comment cannot be posted to this target`,
				schema: BlogCommentErrorResponse
			},
		]
	},
	{
		method: "patch",
		path: "/v1/blog/comment/:commentId",
		alias: "patchV1blogcommentCommentId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ body: z.string().min(1).max(10000) })
			},
			{
				name: "commentId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: EditBlogCommentResponse,
		errors: [
			{
				status: 403,
				description: `Not authorized`,
				schema: BlogCommentErrorResponse
			},
			{
				status: 404,
				description: `Comment not found`,
				schema: BlogCommentErrorResponse
			},
		]
	},
	{
		method: "delete",
		path: "/v1/blog/comment/:commentId",
		alias: "deleteV1blogcommentCommentId",
		requestFormat: "json",
		parameters: [
			{
				name: "commentId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 403,
				description: `Not authorized`,
				schema: BlogCommentErrorResponse
			},
			{
				status: 404,
				description: `Comment not found`,
				schema: BlogCommentErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/blog/public/category",
		alias: "getV1blogpubliccategory",
		requestFormat: "json",
		response: GetBlogCategoriesResponse,
	},
	{
		method: "get",
		path: "/v1/blog/public/posts",
		alias: "getV1blogpublicposts",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "pageSize",
				type: "Query",
				schema: z.number().int().gt(0).lte(50).optional()
			},
			{
				name: "categorySlug",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "sort",
				type: "Query",
				schema: z.enum(["newest", "oldest"]).optional().default("newest")
			},
		],
		response: ListPublicBlogPostsResponse,
	},
	{
		method: "get",
		path: "/v1/blog/public/posts/:slug",
		alias: "getV1blogpublicpostsSlug",
		requestFormat: "json",
		parameters: [
			{
				name: "slug",
				type: "Path",
				schema: z.string().min(1)
			},
		],
		response: GetPublicBlogPostResponse,
		errors: [
			{
				status: 404,
				description: `Blog post not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/education-center/categories",
		alias: "getV1educationCentercategories",
		requestFormat: "json",
		response: ListCourseCategoriesResponse,
		errors: [
			{
				status: 500,
				description: `Internal server error`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/education-center/categories",
		alias: "postV1educationCentercategories",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateCourseCategoryRequest
			},
		],
		response: GetCourseCategoryResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Admin role required`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course category name already exists`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/education-center/categories/:id",
		alias: "getV1educationCentercategoriesId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseCategoryResponse,
		errors: [
			{
				status: 400,
				description: `Invalid category ID`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course category not found`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.void()
			},
		]
	},
	{
		method: "put",
		path: "/v1/education-center/categories/:id",
		alias: "putV1educationCentercategoriesId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UpdateCourseCategoryRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseCategoryResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course category not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course category name already exists`,
				schema: z.void()
			},
		]
	},
	{
		method: "delete",
		path: "/v1/education-center/categories/:id",
		alias: "deleteV1educationCentercategoriesId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: DeleteCourseCategoryResponse,
		errors: [
			{
				status: 400,
				description: `Invalid category ID`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Admin role required`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course category not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course category still has courses`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/education-center/courses",
		alias: "getV1educationCentercourses",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(50).optional().default(8)
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).max(255).optional()
			},
			{
				name: "categoryId",
				type: "Query",
				schema: z.string().uuid().optional()
			},
			{
				name: "pricing",
				type: "Query",
				schema: z.enum(["free", "paid"]).optional()
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["newest", "oldest", "az", "price"]).optional().default("newest")
			},
		],
		response: ListPublicCoursesResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/education-center/courses",
		alias: "postV1educationCentercourses",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateCourseRequest
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed or category not found`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `User access is restricted`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/education-center/courses/:id",
		alias: "getV1educationCentercoursesId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Invalid course ID`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found or not visible`,
				schema: z.void()
			},
		]
	},
	{
		method: "put",
		path: "/v1/education-center/courses/:id",
		alias: "putV1educationCentercoursesId",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UpdateCourseRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Validation or status transition failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not permitted to update this course`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course status changed concurrently`,
				schema: z.void()
			},
		]
	},
	{
		method: "delete",
		path: "/v1/education-center/courses/:id",
		alias: "deleteV1educationCentercoursesId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: DeleteCourseResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not permitted to delete this course`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/education-center/courses/:id/curriculum",
		alias: "getV1educationCentercoursesIdcurriculum",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseCurriculumResponse,
		errors: [
			{
				status: 400,
				description: `Invalid course ID`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found or not visible`,
				schema: z.void()
			},
		]
	},
	{
		method: "put",
		path: "/v1/education-center/courses/:id/curriculum",
		alias: "putV1educationCentercoursesIdcurriculum",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: ReplaceCourseCurriculumRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseCurriculumResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed, or the course cannot be edited`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not the course owner`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "patch",
		path: "/v1/education-center/courses/:id/meta",
		alias: "patchV1educationCentercoursesIdmeta",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UpdateCourseMetaRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed, or the course cannot be edited`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not the course owner`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/education-center/courses/:id/quiz",
		alias: "getV1educationCentercoursesIdquiz",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseQuizResponse,
		errors: [
			{
				status: 400,
				description: `Invalid course ID`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found or not visible`,
				schema: z.void()
			},
		]
	},
	{
		method: "put",
		path: "/v1/education-center/courses/:id/quiz",
		alias: "putV1educationCentercoursesIdquiz",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: ReplaceCourseQuizRequest
			},
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseQuizResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed, or the course cannot be edited`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not the course owner`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/education-center/courses/:id/submit",
		alias: "postV1educationCentercoursesIdsubmit",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Course cannot be submitted from its current status`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not the course owner`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course status changed concurrently`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/education-center/courses/:id/unpublish",
		alias: "postV1educationCentercoursesIdunpublish",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Course is not published`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not the course owner`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course status changed concurrently`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/education-center/courses/:id/withdraw",
		alias: "postV1educationCentercoursesIdwithdraw",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: GetCourseResponse,
		errors: [
			{
				status: 400,
				description: `Course is not pending`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `Not the course owner`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Course not found`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Course status changed concurrently`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/education-center/courses/cover/presign",
		alias: "postV1educationCentercoursescoverpresign",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PresignCourseCoverUploadRequest
			},
		],
		response: PresignCourseCoverUploadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `User access is restricted`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/education-center/courses/lesson/presign",
		alias: "postV1educationCentercourseslessonpresign",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PresignCourseLessonAssetRequest
			},
		],
		response: PresignCourseLessonAssetResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/education-center/courses/mine",
		alias: "getV1educationCentercoursesmine",
		requestFormat: "json",
		parameters: [
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(20)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).max(255).optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.enum(["DRAFT", "PENDING", "PUBLISHED", "UNPUBLISHED"]).optional()
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["newest", "oldest"]).optional().default("newest")
			},
		],
		response: ListMyCoursesResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 403,
				description: `User access is restricted`,
				schema: z.void()
			},
		]
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
				schema: CreateAnswerRequest
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 403,
				description: `Not authorized`,
				schema: AnswerErrorResponse
			},
		]
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
				schema: z.object({ body: z.string().min(1).max(10000) })
			},
			{
				name: "answerId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: EditAnswerResponse,
		errors: [
			{
				status: 403,
				description: `Not authorized`,
				schema: AnswerErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["popular", "newest", "oldest"]).optional().default("popular")
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: MarkBestAnswerResponse,
		errors: [
			{
				status: 403,
				description: `Not authorized`,
				schema: AnswerErrorResponse
			},
			{
				status: 404,
				description: `Answer not found`,
				schema: AnswerErrorResponse
			},
			{
				status: 409,
				description: `Answer cannot be marked as best answer`,
				schema: AnswerErrorResponse
			},
		]
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
				schema: z.string().max(300).optional()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["lastActivity", "mostReplies", "category"]).optional().default("lastActivity")
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
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
				schema: z.object({ voteType: z.string() })
			},
			{
				name: "answerId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
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
				schema: CreateCategoryRequest
			},
		],
		response: CreateCategoryResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 409,
				description: `Category already exists`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["popular", "newest", "oldest"]).optional().default("popular")
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "tagId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(300).optional()
			},
			{
				name: "isUnanswered",
				type: "Query",
				schema: isUnanswered
			},
			{
				name: "isTrending",
				type: "Query",
				schema: isUnanswered
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["mostRelevant", "newest", "oldest", "mostVoted", "mostAnswered", "byCategory"]).optional().default("newest")
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: GetQuestionResponse,
		errors: [
			{
				status: 404,
				description: `Question not found`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
		],
		response: GetTrendingTagsResponse,
		errors: [
			{
				status: 404,
				description: `Category not found`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "tagId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(300).optional()
			},
			{
				name: "isUnanswered",
				type: "Query",
				schema: isUnanswered
			},
			{
				name: "isTrending",
				type: "Query",
				schema: isUnanswered
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["mostRelevant", "newest", "oldest", "mostVoted", "mostAnswered", "byCategory"]).optional().default("newest")
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
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
				schema: CreateQuestionRequest
			},
		],
		response: CreateQuestionResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Category not found`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: GetQuestionResponse,
		errors: [
			{
				status: 404,
				description: `Question not found`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: z.object({ ok: z.boolean() }),
		errors: [
			{
				status: 404,
				description: `Question not found`,
				schema: z.void()
			},
		]
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
				schema: EditQuestionRequest
			},
			{
				name: "questionId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: CreateQuestionResponse,
		errors: [
			{
				status: 404,
				description: `Question not found`,
				schema: z.void()
			},
		]
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
				schema: PresignForumQuestionImageUploadRequest
			},
		],
		response: PresignForumQuestionImageUploadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.void()
			},
		]
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
				schema: z.string().max(300).optional()
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["newest", "mostVoted", "mostAnswered", "byCategory"]).optional().default("newest")
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: SaveQuestionResponse,
		errors: [
			{
				status: 404,
				description: `Question not found`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: SaveQuestionResponse,
		errors: [
			{
				status: 404,
				description: `Question not found`,
				schema: z.void()
			},
		]
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
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
		],
		response: GetTrendingTagsResponse,
		errors: [
			{
				status: 404,
				description: `Category not found`,
				schema: z.void()
			},
		]
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
				schema: z.object({ voteType: z.string() })
			},
			{
				name: "questionId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: CreateQuestionResponse,
		errors: [
			{
				status: 404,
				description: `Question not found`,
				schema: z.void()
			},
		]
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
				schema: CreateReportingRequest
			},
		],
		response: CreateReportingResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Reported entity not found`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.void()
			},
		]
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
				schema: CreateLaunchpadRequest
			},
		],
		response: CreateLaunchpadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: LaunchpadValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 409,
				description: `Launchpad with this name already exists`,
				schema: LaunchpadOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["newest", "oldest", "startingSoon", "mostSpotsAvailable"]).optional().default("newest")
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
			{
				name: "categoryId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "cityId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).max(120).optional()
			},
		],
		response: GetLaunchpadsResponse,
		errors: [
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: UpdateLaunchpadRequest
			},
			{
				name: "launchpadId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: CreateLaunchpadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: LaunchpadValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Launchpad or related record not found`,
				schema: LaunchpadOperationErrorResponse
			},
			{
				status: 409,
				description: `Launchpad edit conflict`,
				schema: LaunchpadOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: GetLaunchpadByIdResponse,
		errors: [
			{
				status: 404,
				description: `Launchpad not found`,
				schema: LaunchpadOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: CreateLaunchpadApplicationRequest
			},
			{
				name: "launchpadId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: CreateLaunchpadApplicationResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: LaunchpadApplicationValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Launchpad or role not found`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
			{
				status: 409,
				description: `Already applied for this role`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "applicationId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: GetLaunchpadApplicationResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Application not found`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
		]
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
				schema: CreateLaunchpadApplicationBatchRequest
			},
			{
				name: "launchpadId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: CreateLaunchpadApplicationBatchResponse,
		errors: [
			{
				status: 400,
				description: `Validation or business rule failed`,
				schema: LaunchpadApplicationBatchErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Launchpad or role not found`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
			{
				status: 409,
				description: `Already applied for one or more roles`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
		]
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
				schema: PresignLaunchpadApplicationDocumentUploadRequest
			},
			{
				name: "launchpadId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: PresignLaunchpadApplicationDocumentUploadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: LaunchpadApplicationValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadApplicationOperationErrorResponse
			},
		]
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
				schema: PresignLaunchpadImageUploadRequest
			},
		],
		response: PresignLaunchpadCoverUploadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: LaunchpadValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: PresignLaunchpadDocumentUploadRequest
			},
		],
		response: PresignLaunchpadDocumentUploadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: LaunchpadValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: GetLaunchpadCategoriesResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request parameters`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Launchpad category not found`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.void()
			},
		]
	},
	{
		method: "post",
		path: "/v1/launchpad/reporting",
		alias: "postV1launchpadreporting",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateLaunchpadReportingRequest
			},
		],
		response: CreateLaunchpadReportingResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Reported entity not found`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: SaveLaunchpadResponse,
		errors: [
			{
				status: 400,
				description: `Bad request`,
				schema: LaunchpadValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Launchpad not found`,
				schema: LaunchpadOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: SaveLaunchpadResponse,
		errors: [
			{
				status: 400,
				description: `Bad request`,
				schema: LaunchpadValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Launchpad not found`,
				schema: LaunchpadOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: GetSavedLaunchpadsResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: LaunchpadValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: LaunchpadOperationErrorResponse
			},
		]
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
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: ProfileErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ProfileErrorResponse
			},
		]
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
				schema: UpdateProfileRequest
			},
		],
		response: UpdateProfileResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: ProfileErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: ProfileErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ProfileErrorResponse
			},
		]
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
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: RecentActivityErrorResponse
			},
		]
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
				schema: z.enum(["all", "project", "volunteer", "forum"]).optional().default("all")
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: GetSavedItemsResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: SavedItemsErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: SavedItemsErrorResponse
			},
		]
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
				schema: z.string()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(20).optional().default(10)
			},
		],
		response: SearchSkillsResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: ProfileErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ProfileErrorResponse
			},
		]
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
				schema: z.enum(["all", "volunteer", "projects"]).optional().default("all")
			},
			{
				name: "filter",
				type: "Query",
				schema: z.enum(["all", "pending", "approved", "active", "completed", "archived"]).optional().default("all")
			},
		],
		response: MyApplicationsResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: MyApplicationsErrorResponse
			},
		]
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
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "applicationId",
				type: "Path",
				schema: z.string().uuid()
			},
			{
				name: "statusAction",
				type: "Path",
				schema: z.enum(["confirm", "decline", "withdraw"])
			},
		],
		response: MyApplicationStatusActionResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Application not found`,
				schema: MyApplicationsErrorResponse
			},
			{
				status: 409,
				description: `Application status cannot be changed with this action`,
				schema: MyApplicationsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: MyApplicationsErrorResponse
			},
		]
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
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "opportunityId",
				type: "Path",
				schema: z.string().uuid()
			},
			{
				name: "archiveAction",
				type: "Path",
				schema: z.enum(["archive", "unarchive"])
			},
		],
		response: MyApplicationArchiveActionResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Opportunity application group not found`,
				schema: MyApplicationsErrorResponse
			},
			{
				status: 409,
				description: `Only completed groups or groups containing only declined/withdrawn roles can be archived`,
				schema: MyApplicationsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: MyApplicationsErrorResponse
			},
		]
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
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "postingId",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: MyApplicationDetailResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Posting application not found`,
				schema: MyApplicationsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: MyApplicationsErrorResponse
			},
		]
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
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "unreadOnly",
				type: "Query",
				schema: z.enum(["true", "false"]).optional()
			},
			{
				name: "type",
				type: "Query",
				schema: z.enum(["forum", "profile_view", "new_message", "achievement", "event_reminder", "application", "launchpad_update", "points", "system"]).optional()
			},
			{
				name: "archived",
				type: "Query",
				schema: z.enum(["true", "false"]).optional()
			},
		],
		response: z.object({ ok: z.literal(true), notifications: z.array(z.object({ id: z.string().uuid(), title: z.string(), body: z.string(), imageUrl: z.string().nullish(), icon: z.string(), type: z.string(), eventType: z.string().nullish(), dedupeKey: z.string().nullish(), aggregateCount: z.number().int().gt(0).optional(), data: z.record(z.string(), z.string()).nullable(), isRead: z.boolean(), readAt: z.string().nullable(), archived: z.boolean(), createdAt: z.string(), updatedAt: z.string().optional(), webRoute: z.string().nullish(), mobileRoute: z.string().nullish() })), total: z.number(), page: z.number(), limit: z.number(), unreadCounts: z.record(z.string(), z.number()) }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: postV1notificationsbroadcast_Body
			},
		],
		response: z.object({ ok: z.boolean(), successCount: z.number(), failureCount: z.number() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: patchV1adminnotificationsread_Body
			},
		],
		response: z.object({ ok: z.boolean(), message: z.string(), platform: z.enum(["android", "ios"]).optional() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: z.enum(["true", "false"]).optional()
			},
			{
				name: "type",
				type: "Query",
				schema: z.enum(["forum", "profile_view", "new_message", "achievement", "event_reminder", "application", "launchpad_update", "points", "system"]).optional()
			},
		],
		response: z.object({ ok: z.boolean(), message: z.string(), platform: z.enum(["android", "ios"]).optional() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: postV1notificationssenduser_Body
			},
		],
		response: z.object({ ok: z.boolean(), successCount: z.number(), failureCount: z.number() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: postV1notificationstokens_Body
			},
		],
		response: z.object({ ok: z.boolean(), message: z.string(), platform: z.enum(["android", "ios"]).optional() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: z.object({ token: z.string().min(1) })
			},
		],
		response: z.object({ ok: z.boolean(), message: z.string(), platform: z.enum(["android", "ios"]).optional() }),
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string() })
			},
		]
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
				schema: z.record(z.string(), z.unknown().nullable())
			},
		]
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
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: z.record(z.string(), z.unknown().nullable())
			},
		]
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
				schema: OnboardingProfileStepRequest
			},
		],
		response: z.record(z.string(), z.unknown().nullable()),
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.record(z.string(), z.unknown().nullable())
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: z.record(z.string(), z.unknown().nullable())
			},
		]
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
				schema: OnboardingInterestsStepRequest
			},
		],
		response: z.record(z.string(), z.unknown().nullable()),
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.record(z.string(), z.unknown().nullable())
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: z.record(z.string(), z.unknown().nullable())
			},
		]
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
				schema: OnboardingContributionsStepRequest
			},
		],
		response: z.record(z.string(), z.unknown().nullable()),
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: z.record(z.string(), z.unknown().nullable())
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: z.record(z.string(), z.unknown().nullable())
			},
		]
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
				schema: z.record(z.string(), z.unknown().nullable())
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/partner/public",
		alias: "getV1partnerpublic",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gt(0).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(20)
			},
		],
		response: ListPublicPartnersResponse,
		errors: [
			{
				status: 500,
				description: `Internal server error`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/partner/public/:id",
		alias: "getV1partnerpublicId",
		requestFormat: "json",
		parameters: [
			{
				name: "id",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: PublicPartnerDetailResponse,
		errors: [
			{
				status: 404,
				description: `Partner not found`,
				schema: PartnerErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/partner/registration",
		alias: "postV1partnerregistration",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PartnerRegistrationRequest
			},
		],
		response: PartnerRegistrationResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: PartnerErrorResponse
			},
			{
				status: 409,
				description: `Registration conflict`,
				schema: PartnerErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/partner/registration-km",
		alias: "postV1partnerregistrationKm",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: PartnerRegistrationKmRequest
			},
		],
		response: PartnerRegistrationResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: PartnerErrorResponse
			},
			{
				status: 409,
				description: `Registration conflict`,
				schema: PartnerErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: PartnerErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/plumpi/auth/handoff",
		alias: "postV1plumpiauthhandoff",
		requestFormat: "json",
		response: z.object({ ok: z.literal(true), token: z.string().min(1), expiresIn: z.number().int().gt(0), expiresAt: z.string() }),
		errors: [
			{
				status: 400,
				description: `Plumpi rejected the handoff request`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 401,
				description: `True Khmer authentication required`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 403,
				description: `Plumpi account cannot be handed off`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 409,
				description: `Plumpi account is already linked to another TK user`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/plumpi/event-categories",
		alias: "getV1plumpieventCategories",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).optional()
			},
		],
		response: z.object({ ok: z.literal(true), categories: z.array(z.record(z.string(), z.unknown().nullable())), meta: z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }) }),
		errors: [
			{
				status: 400,
				description: `Invalid query`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 401,
				description: `True Khmer authentication required`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/plumpi/events",
		alias: "getV1plumpievents",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.enum(["DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED", "POSTPONED", "ACTIVE", "LIVE", "ARCHIVED"]).optional()
			},
			{
				name: "eventType",
				type: "Query",
				schema: z.enum(["CONFERENCE", "WORKSHOP", "SEMINAR", "CONCERT", "FESTIVAL", "EXHIBITION", "NETWORKING", "TRAINING", "WEBINAR", "OTHER"]).optional()
			},
			{
				name: "isFeatured",
				type: "Query",
				schema: z.boolean().optional()
			},
			{
				name: "isOnline",
				type: "Query",
				schema: z.boolean().optional()
			},
			{
				name: "isPaid",
				type: "Query",
				schema: z.boolean().optional()
			},
			{
				name: "venueId",
				type: "Query",
				schema: z.string().uuid().optional()
			},
			{
				name: "visibility",
				type: "Query",
				schema: z.enum(["LISTED", "UNLISTED"]).optional()
			},
			{
				name: "registrationMode",
				type: "Query",
				schema: z.enum(["ANYONE", "REQUIRED_APPROVAL", "INVITED_GUESTS_ONLY"]).optional()
			},
			{
				name: "entryMode",
				type: "Query",
				schema: z.enum(["TICKETED", "RSVP", "OPEN_ACCESS"]).optional()
			},
			{
				name: "startDate",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "endDate",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["createdAt", "startAt", "endAt", "title", "status", "updatedAt"]).optional().default("createdAt")
			},
			{
				name: "sortOrder",
				type: "Query",
				schema: z.enum(["asc", "desc"]).optional().default("desc")
			},
		],
		response: z.object({ ok: z.literal(true), events: z.array(z.record(z.string(), z.unknown().nullable())), meta: z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }) }),
		errors: [
			{
				status: 400,
				description: `Invalid event-list query`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "post",
		path: "/v1/plumpi/events",
		alias: "postV1plumpievents",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: postV1plumpievents_Body
			},
		],
		response: z.object({ ok: z.literal(true), event: z.record(z.string(), z.unknown().nullable()) }),
		errors: [
			{
				status: 400,
				description: `Invalid event data`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.literal("VALIDATION_ERROR"), formErrors: z.array(z.string()), fieldErrors: z.record(z.string(), z.array(z.string())) })
			},
			{
				status: 401,
				description: `True Khmer authentication required`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 403,
				description: `Account or Plumpi operation is not allowed`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Invalid or unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "patch",
		path: "/v1/plumpi/events/:eventId/cover",
		alias: "patchV1plumpieventsEventIdcover",
		requestFormat: "form-data",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ cover: z.instanceof(File) })
			},
			{
				name: "eventId",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: z.object({ ok: z.literal(true), event: z.record(z.string(), z.unknown().nullable()) }),
		errors: [
			{
				status: 400,
				description: `Invalid cover image`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 401,
				description: `True Khmer authentication required`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 403,
				description: `Account or Plumpi operation is not allowed`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 404,
				description: `Plumpi event not found`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 413,
				description: `Cover image exceeds the 2 MB limit`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Invalid or unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "patch",
		path: "/v1/plumpi/events/:eventId/thumbnail",
		alias: "patchV1plumpieventsEventIdthumbnail",
		requestFormat: "form-data",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ thumbnail: z.instanceof(File) })
			},
			{
				name: "eventId",
				type: "Path",
				schema: z.string().uuid()
			},
		],
		response: z.object({ ok: z.literal(true), event: z.record(z.string(), z.unknown().nullable()) }),
		errors: [
			{
				status: 400,
				description: `Invalid thumbnail image`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 401,
				description: `True Khmer authentication required`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 403,
				description: `Account or Plumpi operation is not allowed`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 404,
				description: `Plumpi event not found`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 413,
				description: `Thumbnail image exceeds the 2 MB limit`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Invalid or unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/plumpi/events/slug/:slug",
		alias: "getV1plumpieventsslugSlug",
		requestFormat: "json",
		parameters: [
			{
				name: "slug",
				type: "Path",
				schema: z.string().min(1).max(255)
			},
		],
		response: z.object({ ok: z.literal(true), event: z.record(z.string(), z.unknown().nullable()) }),
		errors: [
			{
				status: 404,
				description: `Event not found`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/plumpi/myevents",
		alias: "getV1plumpimyevents",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "status",
				type: "Query",
				schema: z.enum(["DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED", "POSTPONED", "ACTIVE", "LIVE", "ARCHIVED"]).optional()
			},
			{
				name: "eventType",
				type: "Query",
				schema: z.enum(["CONFERENCE", "WORKSHOP", "SEMINAR", "CONCERT", "FESTIVAL", "EXHIBITION", "NETWORKING", "TRAINING", "WEBINAR", "OTHER"]).optional()
			},
			{
				name: "isFeatured",
				type: "Query",
				schema: z.boolean().optional()
			},
			{
				name: "isOnline",
				type: "Query",
				schema: z.boolean().optional()
			},
			{
				name: "isPaid",
				type: "Query",
				schema: z.boolean().optional()
			},
			{
				name: "venueId",
				type: "Query",
				schema: z.string().uuid().optional()
			},
			{
				name: "visibility",
				type: "Query",
				schema: z.enum(["LISTED", "UNLISTED"]).optional()
			},
			{
				name: "registrationMode",
				type: "Query",
				schema: z.enum(["ANYONE", "REQUIRED_APPROVAL", "INVITED_GUESTS_ONLY"]).optional()
			},
			{
				name: "entryMode",
				type: "Query",
				schema: z.enum(["TICKETED", "RSVP", "OPEN_ACCESS"]).optional()
			},
			{
				name: "startDate",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "endDate",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "sortBy",
				type: "Query",
				schema: z.enum(["createdAt", "startAt", "endAt", "title", "status", "updatedAt"]).optional().default("createdAt")
			},
			{
				name: "sortOrder",
				type: "Query",
				schema: z.enum(["asc", "desc"]).optional().default("desc")
			},
		],
		response: z.object({ ok: z.literal(true), events: z.array(z.record(z.string(), z.unknown().nullable())), meta: z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }) }),
		errors: [
			{
				status: 400,
				description: `Invalid event-list query`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 401,
				description: `True Khmer authentication required`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 403,
				description: `Plumpi operation is not allowed`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/plumpi/organizations",
		alias: "getV1plumpiorganizations",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).optional()
			},
		],
		response: z.object({ ok: z.literal(true), organizations: z.array(z.record(z.string(), z.unknown().nullable())), meta: z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }) }),
		errors: [
			{
				status: 400,
				description: `Invalid query`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 401,
				description: `True Khmer authentication required`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 403,
				description: `Plumpi operation is not allowed`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/plumpi/tickets/tiers",
		alias: "getV1plumpiticketstiers",
		requestFormat: "json",
		parameters: [
			{
				name: "eventId",
				type: "Query",
				schema: z.string().uuid()
			},
		],
		response: z.object({ ok: z.literal(true), ticketTiers: z.array(z.record(z.string(), z.unknown().nullable())), meta: z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }) }),
		errors: [
			{
				status: 400,
				description: `Invalid ticket-tier query`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 404,
				description: `Event not found`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
	},
	{
		method: "get",
		path: "/v1/plumpi/venues",
		alias: "getV1plumpivenues",
		requestFormat: "json",
		parameters: [
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).lte(100).optional().default(10)
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "city",
				type: "Query",
				schema: z.string().min(1).optional()
			},
			{
				name: "countryCode",
				type: "Query",
				schema: z.string().min(2).max(2).optional()
			},
			{
				name: "isVerified",
				type: "Query",
				schema: z.boolean().optional()
			},
			{
				name: "isActive",
				type: "Query",
				schema: z.boolean().optional()
			},
			{
				name: "minCapacity",
				type: "Query",
				schema: z.number().int().gte(1).optional()
			},
			{
				name: "maxCapacity",
				type: "Query",
				schema: z.number().int().gte(1).optional()
			},
			{
				name: "pricingModel",
				type: "Query",
				schema: z.string().min(1).optional()
			},
		],
		response: z.object({ ok: z.literal(true), venues: z.array(z.record(z.string(), z.unknown().nullable())), meta: z.object({ page: z.number().int(), limit: z.number().int(), total: z.number().int(), totalPages: z.number().int() }) }),
		errors: [
			{
				status: 400,
				description: `Invalid query`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 401,
				description: `True Khmer authentication required`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 502,
				description: `Unsuccessful Plumpi response`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
			{
				status: 503,
				description: `Plumpi integration is unavailable`,
				schema: z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: PublicProfileResponse,
		errors: [
			{
				status: 404,
				description: `User not found`,
				schema: ProfileErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ProfileErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "sourceType",
				type: "Query",
				schema: z.enum(["forum", "volunteer", "project"])
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(20)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: GetMyPostedResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: MyPostedErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: MyPostedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: MyPostedErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/public/reporting-type",
		alias: "getV1publicreportingType",
		requestFormat: "json",
		response: GetReportingTypesResponse,
		errors: [
			{
				status: 404,
				description: `No reporting types found`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.void()
			},
		]
	},
	{
		method: "get",
		path: "/v1/public/stats",
		alias: "getV1publicstats",
		requestFormat: "json",
		response: PublicStatsResponse,
		errors: [
			{
				status: 500,
				description: `Internal server error`,
				schema: PublicStatsErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/sso/clients/:clientId",
		alias: "getV1ssoclientsClientId",
		description: `Fetch a partner&#x27;s public name, description and logo so its own login page can render &#x27;Sign in to &lt;name&gt;&#x27;. Requires no credential. The origin must exactly match one the client has registered, unless the client has allowAllOrigins enabled.`,
		requestFormat: "json",
		parameters: [
			{
				name: "clientId",
				type: "Path",
				schema: z.string().min(8).max(64).regex(/^[A-Za-z0-9_]+$/)
			},
			{
				name: "origin",
				type: "Query",
				schema: z.string().min(1).max(512)
			},
		],
		response: SsoVerifyClientResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: SsoErrorResponse
			},
			{
				status: 404,
				description: `Unknown, disabled or deleted client, or the origin is not registered — one response for all four, so client existence is never confirmed`,
				schema: SsoErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: SsoErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/sso/handoff",
		alias: "postV1ssohandoff",
		description: `Exchange a user&#x27;s access token for a single-use handoff token. Called by the partner&#x27;s frontend after it has logged the user in via POST /v1/auth/login. The access token goes in the body, never the query string.`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: SsoExchangeHandoffRequest
			},
		],
		response: SsoHandoffTokenResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: SsoErrorResponse
			},
			{
				status: 401,
				description: `Invalid or expired access token`,
				schema: SsoErrorResponse
			},
			{
				status: 403,
				description: `Account suspended, or signup is not complete`,
				schema: SsoErrorResponse
			},
			{
				status: 404,
				description: `Client not found or not authorized for this origin`,
				schema: SsoErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: SsoErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/sso/handoff/redeem",
		alias: "postV1ssohandoffredeem",
		description: `Redeem a handoff token for the user&#x27;s identity. Called by the partner&#x27;s BACKEND — it requires the client secret, which must never reach a browser. A token can be redeemed once and only by the client that requested it.`,
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ handoffToken: z.string().min(16).max(128) })
			},
			{
				name: "x-client-id",
				type: "Header",
				schema: z.string().min(8).max(64).regex(/^[A-Za-z0-9_]+$/)
			},
			{
				name: "x-client-secret",
				type: "Header",
				schema: z.string().min(16).max(128)
			},
		],
		response: SsoUserResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: SsoErrorResponse
			},
			{
				status: 401,
				description: `Invalid client credentials`,
				schema: SsoErrorResponse
			},
			{
				status: 403,
				description: `User account is suspended`,
				schema: SsoErrorResponse
			},
			{
				status: 404,
				description: `Token unknown, already redeemed, expired, or issued to another client — one response for all four`,
				schema: SsoErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: SsoErrorResponse
			},
		]
	},
	{
		method: "get",
		path: "/v1/sso/users/:userId",
		alias: "getV1ssousersUserId",
		description: `Resolve a True Khmer user ID directly. Kept for partners integrated before the handoff flow; prefer POST /handoff/redeem, which ties the lookup to an actual login.`,
		requestFormat: "json",
		parameters: [
			{
				name: "userId",
				type: "Path",
				schema: z.string().uuid()
			},
			{
				name: "x-client-id",
				type: "Header",
				schema: z.string().min(8).max(64).regex(/^[A-Za-z0-9_]+$/)
			},
			{
				name: "x-client-secret",
				type: "Header",
				schema: z.string().min(16).max(128)
			},
		],
		response: SsoUserResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: SsoErrorResponse
			},
			{
				status: 401,
				description: `Invalid client credentials`,
				schema: SsoErrorResponse
			},
			{
				status: 403,
				description: `User account is suspended`,
				schema: SsoErrorResponse
			},
			{
				status: 404,
				description: `User not found`,
				schema: SsoErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: SsoErrorResponse
			},
		]
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
				schema: PresignAvatarUploadRequest
			},
		],
		response: PresignAvatarUploadResponse,
		errors: [
			{
				status: 400,
				description: `Invalid parameters`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.void()
			},
		]
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
				schema: CreateVolunteerApplicationRequest
			},
		],
		response: CreateVolunteerApplicationResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Volunteer role not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 409,
				description: `Duplicate volunteer application`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: CreateVolunteerApplicationBatchRequest
			},
		],
		response: CreateVolunteerApplicationBatchResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Volunteer role not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 409,
				description: `Duplicate volunteer application`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: PresignVolunteerApplicationDocumentUploadRequest
			},
		],
		response: PresignVolunteerApplicationDocumentUploadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Volunteer opportunity not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 409,
				description: `Volunteer application already exists`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: CreateVolunteerCategoryRequest
			},
		],
		response: CreateVolunteerCategoryResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 409,
				description: `Category already exists`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "locationId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(300).optional()
			},
			{
				name: "filter",
				type: "Query",
				schema: z.enum(["recentlyAdded", "startingSoon", "mostSpotsAvailable"]).optional().default("recentlyAdded")
			},
			{
				name: "timeCommitment",
				type: "Query",
				schema: z.enum(["Light", "Regular", "Intensive"]).optional()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: GetVolunteerOpportunitiesResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Related volunteer records were not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: CreateVolunteerOpportunityRequest
			},
		],
		response: CreateVolunteerOpportunityResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Related volunteer records were not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: GetVolunteerOpportunityResponse,
		errors: [
			{
				status: 400,
				description: `Bad Request - invalid opportunityId`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Volunteer opportunity not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: UpdateVolunteerOpportunityRequest
			},
			{
				name: "opportunityId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: CreateVolunteerOpportunityResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Volunteer opportunity or related record not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 409,
				description: `Volunteer opportunity edit conflict`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: PresignVolunteerOpportunityCoverUploadRequest
			},
		],
		response: PresignVolunteerOpportunityCoverUploadResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "locationId",
				type: "Query",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).optional()
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(300).optional()
			},
			{
				name: "filter",
				type: "Query",
				schema: z.enum(["recentlyAdded", "startingSoon", "mostSpotsAvailable"]).optional().default("recentlyAdded")
			},
			{
				name: "timeCommitment",
				type: "Query",
				schema: z.enum(["Light", "Regular", "Intensive"]).optional()
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: GetVolunteerOpportunitiesResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 404,
				description: `Related volunteer records were not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: GetPublicVolunteerOpportunityResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 404,
				description: `Volunteer opportunity not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/volunteer/reporting",
		alias: "postV1volunteerreporting",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: CreateVolunteerReportingRequest
			},
		],
		response: CreateVolunteerReportingResponse,
		errors: [
			{
				status: 400,
				description: `Invalid request data`,
				schema: z.void()
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: z.void()
			},
			{
				status: 404,
				description: `Reported entity not found`,
				schema: z.void()
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: z.void()
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: SaveVolunteerOpportunityResponse,
		errors: [
			{
				status: 400,
				description: `Bad Request - invalid opportunityId`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Volunteer opportunity not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: SaveVolunteerOpportunityResponse,
		errors: [
			{
				status: 400,
				description: `Bad Request - invalid opportunityId`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Volunteer opportunity not found`,
				schema: VolunteerOperationErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: z.number().int().gte(1).optional().default(10)
			},
			{
				name: "cursor",
				type: "Query",
				schema: z.string().optional()
			},
		],
		response: GetVolunteerOpportunitiesResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: VolunteerCategoryValidationErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Forbidden`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: VolunteerOperationErrorResponse
			},
		]
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
				schema: z.enum(["all", "volunteer", "projects"]).optional().default("all")
			},
			{
				name: "filter",
				type: "Query",
				schema: z.enum(["all", "live", "draft", "in_progress", "completed", "canceled", "filled"]).optional().default("all")
			},
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(6)
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(300).optional()
			},
		],
		response: ManagePostingsResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ManagePostingsErrorResponse
			},
		]
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
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "postingId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "filter",
				type: "Query",
				schema: z.enum(["all", "new", "in_review", "approved", "confirmed", "declined"]).optional().default("all")
			},
			{
				name: "search",
				type: "Query",
				schema: z.string().max(300).optional()
			},
			{
				name: "page",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(1)
			},
			{
				name: "limit",
				type: "Query",
				schema: z.number().int().gte(1).optional().default(10)
			},
		],
		response: ManagePostingDetailResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Posting not found`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ManagePostingsErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/workspace/manage-posting/:sourceType/:postingId/:applicationId/change-status/:statusAction",
		alias: "postV1workspacemanagePostingSourceTypePostingIdApplicationIdchangeStatusStatusAction",
		requestFormat: "json",
		parameters: [
			{
				name: "sourceType",
				type: "Path",
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "postingId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "applicationId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "statusAction",
				type: "Path",
				schema: z.enum(["under_review", "approve"])
			},
		],
		response: ManagePostingApplicationActionResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Application not found`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 409,
				description: `Application is no longer pending review`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ManagePostingsErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/workspace/manage-posting/:sourceType/:postingId/:applicationId/decline",
		alias: "postV1workspacemanagePostingSourceTypePostingIdApplicationIddecline",
		requestFormat: "json",
		parameters: [
			{
				name: "sourceType",
				type: "Path",
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "postingId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "applicationId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "declineAll",
				type: "Query",
				schema: z.boolean().nullish().default(false)
			},
			{
				name: "blockFutureApply",
				type: "Query",
				schema: z.boolean().nullish().default(false)
			},
		],
		response: ManagePostingApplicationActionResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Application not found`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 409,
				description: `Application cannot be declined from the current state`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ManagePostingsErrorResponse
			},
		]
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
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "postingId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "candidateId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: ManagePostingCandidateDetailResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Candidate not found`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ManagePostingsErrorResponse
			},
		]
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
				schema: z.object({ note: z.string().max(5000) })
			},
			{
				name: "sourceType",
				type: "Path",
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "postingId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "candidateId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: UpsertManagePostingCandidateNoteResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Candidate not found`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ManagePostingsErrorResponse
			},
		]
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
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "postingId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
			{
				name: "postingAction",
				type: "Path",
				schema: z.enum(["cancel", "close", "delete", "mark_complete"])
			},
		],
		response: UpdateManagePostingActionResponse,
		errors: [
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Posting not found`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 409,
				description: `Posting action is not allowed for the current state`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ManagePostingsErrorResponse
			},
		]
	},
	{
		method: "post",
		path: "/v1/workspace/manage-posting/:sourceType/:postingId/extend-application-deadline",
		alias: "postV1workspacemanagePostingSourceTypePostingIdextendApplicationDeadline",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ deadline: z.string() })
			},
			{
				name: "sourceType",
				type: "Path",
				schema: z.enum(["volunteer", "projects"])
			},
			{
				name: "postingId",
				type: "Path",
				schema: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			},
		],
		response: ExtendManagePostingDeadlineResponse,
		errors: [
			{
				status: 400,
				description: `Validation failed`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 401,
				description: `Unauthorized`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 403,
				description: `Onboarding required`,
				schema: AuthProtectedErrorResponse
			},
			{
				status: 404,
				description: `Posting not found`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 409,
				description: `Posting deadline cannot be extended from the current state`,
				schema: ManagePostingsErrorResponse
			},
			{
				status: 500,
				description: `Internal server error`,
				schema: ManagePostingsErrorResponse
			},
		]
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
export type AuthForgotPasswordRequestOtpRequest = z.infer<typeof schemas.AuthForgotPasswordRequestOtpRequest>;
export type ForgotPasswordRequestOtpResponse = z.infer<typeof schemas.ForgotPasswordRequestOtpResponse>;
export type AuthForgotPasswordVerifyOtpRequest = z.infer<typeof schemas.AuthForgotPasswordVerifyOtpRequest>;
export type ForgotPasswordVerifyOtpResponse = z.infer<typeof schemas.ForgotPasswordVerifyOtpResponse>;
export type AuthResetPasswordRequest = z.infer<typeof schemas.AuthResetPasswordRequest>;
export type ResetPasswordResponse = z.infer<typeof schemas.ResetPasswordResponse>;
export type AuthChangePasswordRequest = z.infer<typeof schemas.AuthChangePasswordRequest>;
export type ChangePasswordResponse = z.infer<typeof schemas.ChangePasswordResponse>;
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
export type ContentModeratorReportsSummary = z.infer<typeof schemas.ContentModeratorReportsSummary>;
export type ContentModeratorReportType = z.infer<typeof schemas.ContentModeratorReportType>;
export type ContentModeratorReportReporter = z.infer<typeof schemas.ContentModeratorReportReporter>;
export type ContentModeratorReportAuthor = z.infer<typeof schemas.ContentModeratorReportAuthor>;
export type ContentModeratorReportSolver = z.infer<typeof schemas.ContentModeratorReportSolver>;
export type ContentModeratorReport = z.infer<typeof schemas.ContentModeratorReport>;
export type CursorPagination = z.infer<typeof schemas.CursorPagination>;
export type ListContentModeratorReportsResponse = z.infer<typeof schemas.ListContentModeratorReportsResponse>;
export type UpdateContentModeratorReportReviewRequest = z.infer<typeof schemas.UpdateContentModeratorReportReviewRequest>;
export type UpdateContentModeratorReportReviewResponse = z.infer<typeof schemas.UpdateContentModeratorReportReviewResponse>;
export type AdminDashboardOverviewResponse = z.infer<typeof schemas.AdminDashboardOverviewResponse>;
export type AdminDashboardErrorResponse = z.infer<typeof schemas.AdminDashboardErrorResponse>;
export type AdminDashboardActiveUsersResponse = z.infer<typeof schemas.AdminDashboardActiveUsersResponse>;
export type AdminDashboardNewRegistrationsResponse = z.infer<typeof schemas.AdminDashboardNewRegistrationsResponse>;
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
export type AdminUserManagementStats = z.infer<typeof schemas.AdminUserManagementStats>;
export type AdminUserManagementStatsResponse = z.infer<typeof schemas.AdminUserManagementStatsResponse>;
export type AdminUserManagementPoints = z.infer<typeof schemas.AdminUserManagementPoints>;
export type AdminUserManagementActivity = z.infer<typeof schemas.AdminUserManagementActivity>;
export type AdminUserManagementDetailUser = z.infer<typeof schemas.AdminUserManagementDetailUser>;
export type AdminUserManagementDetailResponse = z.infer<typeof schemas.AdminUserManagementDetailResponse>;
export type AdminAuditLogMember = z.infer<typeof schemas.AdminAuditLogMember>;
export type AdminAuditLogMembersResponse = z.infer<typeof schemas.AdminAuditLogMembersResponse>;
export type AdminAuditActor = z.infer<typeof schemas.AdminAuditActor>;
export type AdminAuditLogEntry = z.infer<typeof schemas.AdminAuditLogEntry>;
export type AdminAuditLogPagination = z.infer<typeof schemas.AdminAuditLogPagination>;
export type AdminAuditLogListResponse = z.infer<typeof schemas.AdminAuditLogListResponse>;
export type patchV1adminnotificationsread_Body = z.infer<typeof schemas.patchV1adminnotificationsread_Body>;
export type DeveloperClientResponse = z.infer<typeof schemas.DeveloperClientResponse>;
export type ListDeveloperClientsResponse = z.infer<typeof schemas.ListDeveloperClientsResponse>;
export type DeveloperClientErrorResponse = z.infer<typeof schemas.DeveloperClientErrorResponse>;
export type CreateDeveloperClientRequest = z.infer<typeof schemas.CreateDeveloperClientRequest>;
export type IssuedClientSecretResponse = z.infer<typeof schemas.IssuedClientSecretResponse>;
export type DeveloperClientDetailResponse = z.infer<typeof schemas.DeveloperClientDetailResponse>;
export type UpdateDeveloperClientRequest = z.infer<typeof schemas.UpdateDeveloperClientRequest>;
export type DeleteDeveloperClientResponse = z.infer<typeof schemas.DeleteDeveloperClientResponse>;
export type Partner = z.infer<typeof schemas.Partner>;
export type ListPendingPartnersResponse = z.infer<typeof schemas.ListPendingPartnersResponse>;
export type ContactPerson = z.infer<typeof schemas.ContactPerson>;
export type PartnerDetailResponse = z.infer<typeof schemas.PartnerDetailResponse>;
export type PartnerErrorResponse = z.infer<typeof schemas.PartnerErrorResponse>;
export type UpdatePartnerRegistrationStatusRequest = z.infer<typeof schemas.UpdatePartnerRegistrationStatusRequest>;
export type PartnerStatusResponse = z.infer<typeof schemas.PartnerStatusResponse>;
export type DeletePartnerResponse = z.infer<typeof schemas.DeletePartnerResponse>;
export type ListManagedPartnersResponse = z.infer<typeof schemas.ListManagedPartnersResponse>;
export type CreateManagedPartnerRequest = z.infer<typeof schemas.CreateManagedPartnerRequest>;
export type CreateManagedPartnerResponse = z.infer<typeof schemas.CreateManagedPartnerResponse>;
export type PartnerPhoto = z.infer<typeof schemas.PartnerPhoto>;
export type ManagedPartnerDetailResponse = z.infer<typeof schemas.ManagedPartnerDetailResponse>;
export type UpdateManagedPartnerRequest = z.infer<typeof schemas.UpdateManagedPartnerRequest>;
export type UpdateManagedPartnerResponse = z.infer<typeof schemas.UpdateManagedPartnerResponse>;
export type DeleteManagedPartnerResponse = z.infer<typeof schemas.DeleteManagedPartnerResponse>;
export type AddPartnerPhotoRequest = z.infer<typeof schemas.AddPartnerPhotoRequest>;
export type PartnerPhotoResponse = z.infer<typeof schemas.PartnerPhotoResponse>;
export type PresignPartnerAssetRequest = z.infer<typeof schemas.PresignPartnerAssetRequest>;
export type PresignPartnerLogoResponse = z.infer<typeof schemas.PresignPartnerLogoResponse>;
export type PresignPartnerPhotoResponse = z.infer<typeof schemas.PresignPartnerPhotoResponse>;
export type QuestionTagResponse = z.infer<typeof schemas.QuestionTagResponse>;
export type QuestionResponse = z.infer<typeof schemas.QuestionResponse>;
export type GetQuestionsResponse = z.infer<typeof schemas.GetQuestionsResponse>;
export type GetQuestionResponse = z.infer<typeof schemas.GetQuestionResponse>;
export type AdminDeletePostErrorResponse = z.infer<typeof schemas.AdminDeletePostErrorResponse>;
export type AdminDeletePostResponse = z.infer<typeof schemas.AdminDeletePostResponse>;
export type RepliedAnswerResponse = z.infer<typeof schemas.RepliedAnswerResponse>;
export type AnswerResponse = z.infer<typeof schemas.AnswerResponse>;
export type GetAnswersResponse = z.infer<typeof schemas.GetAnswersResponse>;
export type AdminSuspendPostBody = z.infer<typeof schemas.AdminSuspendPostBody>;
export type AdminSuspendPostResponse = z.infer<typeof schemas.AdminSuspendPostResponse>;
export type VolunteerOpportunityReference = z.infer<typeof schemas.VolunteerOpportunityReference>;
export type AdminVolunteerPostListItemResponse = z.infer<typeof schemas.AdminVolunteerPostListItemResponse>;
export type VolunteerOpportunitiesPaginationResponse = z.infer<typeof schemas.VolunteerOpportunitiesPaginationResponse>;
export type AdminVolunteerPostsResponse = z.infer<typeof schemas.AdminVolunteerPostsResponse>;
export type VolunteerOpportunityContactResponse = z.infer<typeof schemas.VolunteerOpportunityContactResponse>;
export type VolunteerOpportunityOrganizerResponse = z.infer<typeof schemas.VolunteerOpportunityOrganizerResponse>;
export type VolunteerOpportunityRoleResponse = z.infer<typeof schemas.VolunteerOpportunityRoleResponse>;
export type AdminVolunteerPostDetailResponse = z.infer<typeof schemas.AdminVolunteerPostDetailResponse>;
export type AdminVolunteerPostResponse = z.infer<typeof schemas.AdminVolunteerPostResponse>;
export type AdminSuspendVolunteerPostResponse = z.infer<typeof schemas.AdminSuspendVolunteerPostResponse>;
export type AdminLaunchpadPostListItemResponse = z.infer<typeof schemas.AdminLaunchpadPostListItemResponse>;
export type AdminLaunchpadPostsResponse = z.infer<typeof schemas.AdminLaunchpadPostsResponse>;
export type AdminLaunchpadPostDetailResponse = z.infer<typeof schemas.AdminLaunchpadPostDetailResponse>;
export type AdminLaunchpadPostResponse = z.infer<typeof schemas.AdminLaunchpadPostResponse>;
export type AdminSuspendLaunchpadPostResponse = z.infer<typeof schemas.AdminSuspendLaunchpadPostResponse>;
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
export type CreateQuestionRequest = z.infer<typeof schemas.CreateQuestionRequest>;
export type CreateQuestionResponse = z.infer<typeof schemas.CreateQuestionResponse>;
export type TrendingTagResponse = z.infer<typeof schemas.TrendingTagResponse>;
export type GetTrendingTagsResponse = z.infer<typeof schemas.GetTrendingTagsResponse>;
export type GetMyQuestionsResponse = z.infer<typeof schemas.GetMyQuestionsResponse>;
export type GetSavedQuestionsResponse = z.infer<typeof schemas.GetSavedQuestionsResponse>;
export type PresignForumQuestionImageUploadRequest = z.infer<typeof schemas.PresignForumQuestionImageUploadRequest>;
export type PresignForumQuestionImageUploadResult = z.infer<typeof schemas.PresignForumQuestionImageUploadResult>;
export type PresignForumQuestionImageUploadResponse = z.infer<typeof schemas.PresignForumQuestionImageUploadResponse>;
export type EditQuestionRequest = z.infer<typeof schemas.EditQuestionRequest>;
export type VoteQuestionRequest = z.infer<typeof schemas.VoteQuestionRequest>;
export type SaveQuestionResponse = z.infer<typeof schemas.SaveQuestionResponse>;
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
export type VolunteerOpportunityListItemResponse = z.infer<typeof schemas.VolunteerOpportunityListItemResponse>;
export type GetVolunteerOpportunitiesResponse = z.infer<typeof schemas.GetVolunteerOpportunitiesResponse>;
export type VolunteerOpportunityContact = z.infer<typeof schemas.VolunteerOpportunityContact>;
export type VolunteerOpportunityRoleRequest = z.infer<typeof schemas.VolunteerOpportunityRoleRequest>;
export type CreateVolunteerOpportunityPayload = z.infer<typeof schemas.CreateVolunteerOpportunityPayload>;
export type CreateVolunteerOpportunityRequest = z.infer<typeof schemas.CreateVolunteerOpportunityRequest>;
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
export type PublicStatsResponse = z.infer<typeof schemas.PublicStatsResponse>;
export type PublicStatsErrorResponse = z.infer<typeof schemas.PublicStatsErrorResponse>;
export type CreateReportingRequest = z.infer<typeof schemas.CreateReportingRequest>;
export type CreateReportingResponse = z.infer<typeof schemas.CreateReportingResponse>;
export type CreateVolunteerReportingRequest = z.infer<typeof schemas.CreateVolunteerReportingRequest>;
export type CreateVolunteerReportingResponse = z.infer<typeof schemas.CreateVolunteerReportingResponse>;
export type CreateLaunchpadReportingRequest = z.infer<typeof schemas.CreateLaunchpadReportingRequest>;
export type CreateLaunchpadReportingResponse = z.infer<typeof schemas.CreateLaunchpadReportingResponse>;
export type LaunchpadCategoryResponse = z.infer<typeof schemas.LaunchpadCategoryResponse>;
export type GetLaunchpadCategoriesResponse = z.infer<typeof schemas.GetLaunchpadCategoriesResponse>;
export type PresignLaunchpadImageUploadRequest = z.infer<typeof schemas.PresignLaunchpadImageUploadRequest>;
export type PresignLaunchpadCoverUploadResult = z.infer<typeof schemas.PresignLaunchpadCoverUploadResult>;
export type PresignLaunchpadCoverUploadResponse = z.infer<typeof schemas.PresignLaunchpadCoverUploadResponse>;
export type LaunchpadValidationErrorResponse = z.infer<typeof schemas.LaunchpadValidationErrorResponse>;
export type LaunchpadOperationErrorResponse = z.infer<typeof schemas.LaunchpadOperationErrorResponse>;
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
export type PartnerRegistrationRequest = z.infer<typeof schemas.PartnerRegistrationRequest>;
export type PartnerRegistrationResponse = z.infer<typeof schemas.PartnerRegistrationResponse>;
export type PartnerRegistrationKmRequest = z.infer<typeof schemas.PartnerRegistrationKmRequest>;
export type PublicPartner = z.infer<typeof schemas.PublicPartner>;
export type ListPublicPartnersResponse = z.infer<typeof schemas.ListPublicPartnersResponse>;
export type PublicPartnerPhoto = z.infer<typeof schemas.PublicPartnerPhoto>;
export type PublicPartnerDetailResponse = z.infer<typeof schemas.PublicPartnerDetailResponse>;
export type BlogCategoryResponse = z.infer<typeof schemas.BlogCategoryResponse>;
export type BlogCategoryWithUsageResponse = z.infer<typeof schemas.BlogCategoryWithUsageResponse>;
export type GetBlogCategoriesResponse = z.infer<typeof schemas.GetBlogCategoriesResponse>;
export type CreateBlogCategoryRequest = z.infer<typeof schemas.CreateBlogCategoryRequest>;
export type CreateBlogCategoryResponse = z.infer<typeof schemas.CreateBlogCategoryResponse>;
export type UpdateBlogCategoryRequest = z.infer<typeof schemas.UpdateBlogCategoryRequest>;
export type UpdateBlogCategoryResponse = z.infer<typeof schemas.UpdateBlogCategoryResponse>;
export type PaginationMeta = z.infer<typeof schemas.PaginationMeta>;
export type ListModeratorBlogPostsResponse = z.infer<typeof schemas.ListModeratorBlogPostsResponse>;
export type CreateBlogPostRequest = z.infer<typeof schemas.CreateBlogPostRequest>;
export type BlogPostResponse = z.infer<typeof schemas.BlogPostResponse>;
export type CreateBlogPostResponse = z.infer<typeof schemas.CreateBlogPostResponse>;
export type PresignBlogImageUploadRequest = z.infer<typeof schemas.PresignBlogImageUploadRequest>;
export type PresignBlogImageUploadResponse = z.infer<typeof schemas.PresignBlogImageUploadResponse>;
export type GetBlogPostResponse = z.infer<typeof schemas.GetBlogPostResponse>;
export type UpdateBlogPostRequest = z.infer<typeof schemas.UpdateBlogPostRequest>;
export type UpdateBlogPostResponse = z.infer<typeof schemas.UpdateBlogPostResponse>;
export type DeleteBlogPostResponse = z.infer<typeof schemas.DeleteBlogPostResponse>;
export type SetBlogPostFeaturedRequest = z.infer<typeof schemas.SetBlogPostFeaturedRequest>;
export type BlogPostListingItemResponse = z.infer<typeof schemas.BlogPostListingItemResponse>;
export type ListPublicBlogPostsResponse = z.infer<typeof schemas.ListPublicBlogPostsResponse>;
export type GetPublicBlogPostResponse = z.infer<typeof schemas.GetPublicBlogPostResponse>;
export type RepliedBlogCommentResponse = z.infer<typeof schemas.RepliedBlogCommentResponse>;
export type BlogCommentResponse = z.infer<typeof schemas.BlogCommentResponse>;
export type GetBlogCommentsResponse = z.infer<typeof schemas.GetBlogCommentsResponse>;
export type BlogCommentErrorResponse = z.infer<typeof schemas.BlogCommentErrorResponse>;
export type CreateBlogCommentRequest = z.infer<typeof schemas.CreateBlogCommentRequest>;
export type CreateBlogCommentResponse = z.infer<typeof schemas.CreateBlogCommentResponse>;
export type UpdateBlogCommentRequest = z.infer<typeof schemas.UpdateBlogCommentRequest>;
export type EditBlogCommentResponse = z.infer<typeof schemas.EditBlogCommentResponse>;
export type DeleteBlogCommentResponse = z.infer<typeof schemas.DeleteBlogCommentResponse>;
export type CourseCategoryResponse = z.infer<typeof schemas.CourseCategoryResponse>;
export type ListCourseCategoriesResponse = z.infer<typeof schemas.ListCourseCategoriesResponse>;
export type CreateCourseCategoryRequest = z.infer<typeof schemas.CreateCourseCategoryRequest>;
export type GetCourseCategoryResponse = z.infer<typeof schemas.GetCourseCategoryResponse>;
export type UpdateCourseCategoryRequest = z.infer<typeof schemas.UpdateCourseCategoryRequest>;
export type DeleteCourseCategoryResponse = z.infer<typeof schemas.DeleteCourseCategoryResponse>;
export type CourseResponse = z.infer<typeof schemas.CourseResponse>;
export type PublicCourseListItem = z.infer<typeof schemas.PublicCourseListItem>;
export type ListPublicCoursesResponse = z.infer<typeof schemas.ListPublicCoursesResponse>;
export type CreateCourseRequest = z.infer<typeof schemas.CreateCourseRequest>;
export type GetCourseResponse = z.infer<typeof schemas.GetCourseResponse>;
export type PresignCourseCoverUploadRequest = z.infer<typeof schemas.PresignCourseCoverUploadRequest>;
export type PresignCourseCoverUploadResponse = z.infer<typeof schemas.PresignCourseCoverUploadResponse>;
export type ListMyCoursesResponse = z.infer<typeof schemas.ListMyCoursesResponse>;
export type UpdateCourseRequest = z.infer<typeof schemas.UpdateCourseRequest>;
export type DeleteCourseResponse = z.infer<typeof schemas.DeleteCourseResponse>;
export type PresignCourseLessonAssetRequest = z.infer<typeof schemas.PresignCourseLessonAssetRequest>;
export type PresignCourseLessonAssetResponse = z.infer<typeof schemas.PresignCourseLessonAssetResponse>;
export type CourseLessonResponse = z.infer<typeof schemas.CourseLessonResponse>;
export type CourseChapterResponse = z.infer<typeof schemas.CourseChapterResponse>;
export type CourseCurriculumResponse = z.infer<typeof schemas.CourseCurriculumResponse>;
export type GetCourseCurriculumResponse = z.infer<typeof schemas.GetCourseCurriculumResponse>;
export type ReplaceCourseCurriculumRequest = z.infer<typeof schemas.ReplaceCourseCurriculumRequest>;
export type CourseQuizQuestionResponse = z.infer<typeof schemas.CourseQuizQuestionResponse>;
export type CourseQuizResponse = z.infer<typeof schemas.CourseQuizResponse>;
export type GetCourseQuizResponse = z.infer<typeof schemas.GetCourseQuizResponse>;
export type ReplaceCourseQuizRequest = z.infer<typeof schemas.ReplaceCourseQuizRequest>;
export type UpdateCourseMetaRequest = z.infer<typeof schemas.UpdateCourseMetaRequest>;
export type AdminCourseResponse = z.infer<typeof schemas.AdminCourseResponse>;
export type AdminListCoursesResponse = z.infer<typeof schemas.AdminListCoursesResponse>;
export type AdminCourseDetailResponse = z.infer<typeof schemas.AdminCourseDetailResponse>;
export type AdminGetCourseResponse = z.infer<typeof schemas.AdminGetCourseResponse>;
export type AdminUpdateCourseRequest = z.infer<typeof schemas.AdminUpdateCourseRequest>;
export type RejectCourseRequest = z.infer<typeof schemas.RejectCourseRequest>;
export type SsoVerifyClientResponse = z.infer<typeof schemas.SsoVerifyClientResponse>;
export type SsoErrorResponse = z.infer<typeof schemas.SsoErrorResponse>;
export type SsoExchangeHandoffRequest = z.infer<typeof schemas.SsoExchangeHandoffRequest>;
export type SsoHandoffTokenResponse = z.infer<typeof schemas.SsoHandoffTokenResponse>;
export type SsoRedeemHandoffRequest = z.infer<typeof schemas.SsoRedeemHandoffRequest>;
export type SsoUser = z.infer<typeof schemas.SsoUser>;
export type SsoUserResponse = z.infer<typeof schemas.SsoUserResponse>;
export type postV1plumpievents_Body = z.infer<typeof schemas.postV1plumpievents_Body>;
// End generated API schema types

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
    return new Zodios(baseUrl, endpoints, options);
}
