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
      route("about", "routes/about.tsx"),
      route("dashboard", "routes/dashboard.tsx"),
      route("profile", "routes/onboarding-profile.tsx"),
      route("messages", "routes/messages.tsx"),
      route("forum", "features/forum/route/forum.new.tsx"),
      route("forum-old", "features/forum/route/forum.tsx"),
      route("forum/search", "features/forum/route/forum.search.tsx"),
      route("forum/detail/:questionId", "features/forum/route/forum.$id.tsx"),
      route("events", "features/events/routes/events.tsx"),
      route("events/all", "features/events/routes/events.all.tsx"),
      route("events/detail/:id", "features/events/routes/events.$id.tsx"),
      route("volunteer", "features/volunteer/routes/volunteer.tsx"),
      route("volunteer/all", "features/volunteer/routes/volunteer.all.tsx"),
      route(
        "volunteer/create",
        "features/volunteer/routes/volunteer.create.tsx",
      ),
      route(
        "volunteer/detail/:id",
        "features/volunteer/routes/volunteer.$id.tsx",
      ),
      route(
        "volunteer/edit/:id",
        "features/volunteer/routes/volunteer.edit.$id.tsx",
      ),
      route("poc", "features/poc/routes/poc.tsx"),
      route("poc/detail/:id", "features/poc/routes/poc.$id.tsx"),
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
    route("myspace", "features/myspace/route/myspace.tsx"),
    route("edit-profile", "features/myspace/route/edit-profile.tsx"),
    route("my-applications", "features/myspace/route/my-applications.tsx"),
    route("my-ticket", "routes/my-ticket.tsx"),
    route(
      "my-applications/detail/:sourceType/:postingId",
      "features/myspace/route/my-application.$sourceType.$postingId.tsx",
    ),
    route("saved-items", "features/saved-items/route/saved-items.tsx"),
    route("settings", "features/settings/routes/settings.tsx"),

    layout("layout/workspace-layout.tsx", [
      route("workspace", "features/workspace/routes/workspace.tsx"),
      route("my-events", "features/workspace/routes/my-events.tsx"),
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
  route("tk-admin", "features/admin/admindashboard/route/admin-layout.tsx", [
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
      "notifications/broadcast",
      "features/admin/notifications/route/notification-broadcast.tsx",
    ),
  ]),
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
  route("api/me", "routes/api/api.me.tsx"),
  route("api/myspace/skills/search", "routes/api/myspace/skills-search.ts"),
  route("api/launchpad/apply", "routes/api/api.launchpad.apply.ts"),
  route("api/launchpad/batch-apply", "routes/api/api.launchpad.batch-apply.ts"),
  route("api/launchpad/save", "routes/api/api.launchpad.save.ts"),
  route("api/notifications", "routes/api/api.notifications.ts"),
  route("api/notifications/stream", "routes/api/api.notifications.stream.ts"),
  route("api/notifications/read", "routes/api/api.notifications.read.ts"),
  route(
    "api/notifications/read/all",
    "routes/api/api.notifications.read.all.ts",
  ),
  route("api/candidate-note", "routes/api/api.candidate-note.ts"),
] satisfies RouteConfig;
