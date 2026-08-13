import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/app-layout.tsx", [
    layout("layout/footer-layout.tsx", [
      index("routes/home.tsx"),
      route("about", "features/about/route/about.tsx"),
      route("community", "features/community/route/community.tsx"),
      route(
        "community/partner/:partnerId",
        "features/community/route/community.$partnerId.tsx",
      ),
      route("dashboard", "routes/dashboard.tsx"),
      route("profile", "routes/onboarding-profile.tsx"),
      route("messages", "routes/messages.tsx"),
      route("forum", "features/forum/route/forum.new.tsx"),
      route("forum/search", "features/forum/route/forum.search.tsx"),
      route("forum/detail/:questionId", "features/forum/route/forum.$id.tsx"),
      route("events", "features/events/routes/events.tsx"),
      route("events/all", "features/events/routes/events.all.tsx"),
      route("events/detail/:id", "features/events/routes/events.$id.tsx"),
      route("volunteer", "features/volunteer/route/volunteer.tsx"),
      route("volunteer/all", "features/volunteer/route/volunteer.all.tsx"),
      route(
        "volunteer/create",
        "features/volunteer/route/volunteer.create.tsx",
      ),
      route(
        "volunteer/detail/:id",
        "features/volunteer/route/volunteer.$id.tsx",
      ),
      route(
        "volunteer/edit/:id",
        "features/volunteer/route/volunteer.edit.$id.tsx",
      ),
      route("poc", "features/poc/routes/poc.tsx"),
      route("poc/detail/:id", "features/poc/routes/poc.$id.tsx"),
      route("blog", "features/blog/route/blog.tsx"),
      route("blog/:slug", "features/blog/route/blog.$slug.tsx"),
      route("launchpad", "features/launchpad/route/launchpad.tsx"),
      route("launchpad/all", "features/launchpad/route/launchpad.all.tsx"),
      route(
        "launchpad/create",
        "features/launchpad/route/launchpad.create.tsx",
      ),
      route(
        "launchpad/detail/:id",
        "features/launchpad/route/launchpad.$id.tsx",
      ),
      route(
        "launchpad/edit/:id",
        "features/launchpad/route/launchpad.edit.$id.tsx",
      ),
      route("profile/:id", "features/profile/route/profile.$id.tsx"),
    ]),
    route("edit-profile", "features/myspace/route/edit-profile.tsx"),
    route(
      "my-applications/detail/:sourceType/:postingId",
      "features/myspace/route/my-application.$sourceType.$postingId.tsx",
    ),
    route("settings", "features/settings/route/settings.tsx"),

    layout("layout/myspace-layout.tsx", [
      route("myspace", "features/myspace/route/myspace.tsx"),
      route("my-applications", "features/myspace/route/my-applications.tsx"),
      route("my-ticket", "routes/my-ticket.tsx"),
      route("saved-items", "features/saved-items/route/saved-items.tsx"),
    ]),

    layout("layout/workspace-layout.tsx", [
      route("workspace", "features/workspace/route/workspace.tsx"),
      route("my-events", "features/workspace/route/my-events.tsx"),
      route("manage-post", "features/manage-post/route/manage-post.tsx"),
      route(
        "manage-post/:sourceType/:id",
        "features/manage-post/route/manage-post.$sourceType.$id.tsx",
      ),
    ]),
    route("notifications", "features/notifications/route/notifications.tsx"),
  ]),
  route("onboarding", "routes/onboarding/pages/layout.tsx", [
    index("routes/onboarding/pages/index.tsx"),
    route("profile", "routes/onboarding/pages/onboarding-profile.tsx"),
    route("interest", "routes/onboarding/pages/interest.tsx"),
    route("contribution", "routes/onboarding/pages/contribution.tsx"),
    route("tier", "routes/onboarding/pages/tier.tsx"),
  ]),
  route(
    "registration",
    "features/partner-registration/route/registration-layout.tsx",
    [
      index("features/partner-registration/route/registration-index.tsx"),
      route(
        "partner-registration",
        "features/partner-registration/route/partner-registration.tsx",
      ),
      route(
        "partner-registration/choose-package",
        "features/partner-registration/route/partner-packages.tsx",
      ),
      route(
        "partner-registration/choose-package/contact-person",
        "features/partner-registration/route/contact-person.tsx",
      ),
      route("successfully", "features/partner-registration/route/success.tsx"),
    ],
  ),
  route("tk-admin", "features/admin/layout/route/admin-layout.tsx", [
    index("features/admin/dashboard/route/admin-dashboard.tsx"),
    route(
      "manage-moderator/team",
      "features/admin/manage-moderator/route/manage-moderator.tsx",
    ),
    route(
      "content-moderator",
      "features/admin/contentmoderator/route/content-moderator.tsx",
    ),
    route("users", "features/admin/usermanagement/route/user-management.tsx"),
    route(
      "user/:userId",
      "features/admin/usermanagement/route/user-management.$userId.tsx",
    ),
    route(
      "notifications",
      "features/admin/notifications/route/admin-notifications.tsx",
    ),
    route(
      "registrations",
      "features/admin/registrations/route/registrations.tsx",
    ),
    route(
      "registrations/partner/:partnerId",
      "features/admin/registrations/route/registrations.partner.$partnerId.tsx",
    ),
    route("blog", "features/admin/blog/route/blog.tsx"),
    route("blog/new", "features/admin/blog/route/blog.new.tsx"),
    route("blog/preview", "features/admin/blog/route/blog.preview.tsx"),
    route("blog/:postId", "features/admin/blog/route/blog.$postId.tsx"),
    route(
      "blog/:postId/edit",
      "features/admin/blog/route/blog.$postId.edit.tsx",
    ),
    route("partners", "features/admin/partners/route/partners.tsx"),
    route("partners/new", "features/admin/partners/route/partners.new.tsx"),
    route(
      "partners/:partnerId",
      "features/admin/partners/route/partners.$partnerId.tsx",
    ),
    route(
      "partners/:partnerId/edit",
      "features/admin/partners/route/partners.$partnerId.edit.tsx",
    ),
    route(
      "notifications/broadcast",
      "features/admin/notifications/route/notification-broadcast.tsx",
    ),
    route(
      "account-settings",
      "features/admin/account-settings/route/account-settings.tsx",
    ),
    route(
      "admin-audit-log",
      "features/admin/admin-audit-log/route/admin-audit-log.tsx",
    ),
    route(
      "manage-forum",
      "features/admin/manage-content/route/manage-forum.tsx",
    ),
    route(
      "manage-forum/:questionId",
      "features/admin/manage-content/route/manage-forum.$questionId.tsx",
    ),
    route(
      "manage-launchpad",
      "features/admin/manage-content/route/manage-launchpad.tsx",
    ),
    route(
      "manage-launchpad/:launchpadId",
      "features/admin/manage-content/route/manage-launchpad.$launchpadId.tsx",
    ),
    route(
      "manage-volunteer",
      "features/admin/manage-content/route/manage-volunteer.tsx",
    ),
    route(
      "manage-volunteer/:opportunityId",
      "features/admin/manage-content/route/manage-volunteer.$opportunityId.tsx",
    ),
  ]),
  route(
    "tk-admin/admin-audit-log/export",
    "features/admin/admin-audit-log/route/admin-audit-log.export.tsx",
  ),
  route("tk-admin/login", "features/admin/auth/route/admin-login.tsx"),
  route("tk-admin/login/otp", "features/admin/auth/route/admin-login-otp.tsx"),
  route(
    "tk-admin/accept-invite",
    "features/admin/manage-moderator/route/accept-invite.tsx",
  ),
  route("tk-admin/logout", "features/admin/auth/route/admin-logout.tsx"),

  route("login", "routes/auth/pages/login.tsx"),
  route("login/2fa", "routes/auth/pages/login-2fa.tsx"),
  route("register", "routes/auth/pages/register.tsx"),
  route("signup", "routes/auth/pages/register.tsx", {
    id: "routes/auth/pages/signup",
  }),
  route("complete-signup", "routes/auth/pages/complete-signup.tsx"),
  route("forgot-password", "routes/auth/pages/forgot-password.tsx"),
  route(
    "forgot-password/check-email",
    "routes/auth/pages/forgot-password-check-email.tsx",
  ),
  route("reset-password", "routes/auth/pages/reset-password.tsx"),
  route("onboarding/completed", "routes/onboarding/pages/completed.tsx"),
  route("verify-otp", "routes/auth/pages/verify-otp.tsx"),
  route("logout", "routes/logout.tsx"),
  route("api/onboarding/cities", "routes/api/api.onboarding.cities.tsx"),
  route(
    "api/uploads/avatar/presign",
    "routes/api/api.uploads.avatar.presign.tsx",
  ),
  route(
    "api/admin/partners/:partnerId/logo-presign",
    "routes/api/api.admin.partners.$partnerId.logo-presign.tsx",
  ),
  route(
    "api/admin/blog/image-presign",
    "features/admin/blog/route/blog.image-presign.ts",
  ),
  route(
    "api/moderator/blog/autosave",
    "features/admin/blog/route/blog.autosave.ts",
  ),
  route(
    "api/admin/partners/:partnerId/photo-presign",
    "routes/api/api.admin.partners.$partnerId.photo-presign.tsx",
  ),
  route("api/me", "routes/api/api.me.tsx"),
  route(
    "api/myspace/skills/search",
    "features/myspace/route/myspace.skills-search.ts",
  ),
  route(
    "api/launchpad/batch-apply",
    "features/launchpad/route/launchpad.batch-apply.ts",
  ),
  route("api/launchpad/save", "features/launchpad/route/launchpad.save.ts"),
  route(
    "api/notifications",
    "features/notifications/route/notifications.feed.ts",
  ),
  route(
    "api/notifications/stream",
    "features/notifications/route/notifications.stream.ts",
  ),
  route(
    "api/notifications/read",
    "features/notifications/route/notifications.read.ts",
  ),
  route(
    "api/notifications/read/all",
    "features/notifications/route/notifications.read.all.ts",
  ),
  route(
    "api/admin/dashboard/active-users",
    "features/admin/dashboard/route/dashboard.active-users.ts",
  ),
  route(
    "api/admin/dashboard/new-registrations",
    "features/admin/dashboard/route/dashboard.new-registrations.ts",
  ),
  route(
    "api/admin/notifications",
    "features/admin/notifications/route/admin-notifications.feed.ts",
  ),
  route(
    "api/admin/notifications/stream",
    "features/admin/notifications/route/admin-notifications.stream.ts",
  ),
  route(
    "api/admin/notifications/read",
    "features/admin/notifications/route/admin-notifications.read.ts",
  ),
  route(
    "api/admin/notifications/read/all",
    "features/admin/notifications/route/admin-notifications.read.all.ts",
  ),
  route(
    "api/candidate-note",
    "features/manage-post/route/manage-post.candidate-note.ts",
  ),
] satisfies RouteConfig;
