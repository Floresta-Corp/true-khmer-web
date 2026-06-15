import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/app-layout.tsx", [
    layout("layout/footer-layout.tsx", [
      index("routes/index.tsx"),
      route("home", "routes/home.tsx"),
      route("about", "routes/about.tsx"),
      route("dashboard", "routes/dashboard.tsx"),
      route("profile", "routes/onboarding-profile.tsx"),
      route("messages", "routes/messages.tsx"),
      route("forum", "features/forum/routes/forum.new.tsx"),
      route("forum-old", "features/forum/routes/forum.tsx"),
      route("forum/search", "features/forum/routes/forum.search.tsx"),
      route("forum/detail/:questionId", "features/forum/routes/forum.$id.tsx"),
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
      route("launchpad", "features/launchpad/routes/launchpad.tsx"),
      route("launchpad/all", "features/launchpad/routes/launchpad.all.tsx"),
      route(
        "launchpad/create",
        "features/launchpad/routes/launchpad.create.tsx",
      ),
      route(
        "launchpad/detail/:id",
        "features/launchpad/routes/launchpad.$id.tsx",
      ),
      route(
        "launchpad/edit/:id",
        "features/launchpad/routes/launchpad.edit.$id.tsx",
      ),
      route("profile/:id", "features/profile/routes/profile.$id.tsx"),
    ]),
    route("myspace", "features/myspace/routes/myspace.tsx"),
    route("edit-profile", "features/myspace/routes/edit-profile.tsx"),
    route("my-applications", "features/myspace/routes/my-applications.tsx"),
    route("my-ticket", "routes/my-ticket.tsx"),
    route(
      "my-applications/detail/:sourceType/:postingId",
      "features/myspace/routes/my-application.$sourceType.$postingId.tsx",
    ),
    route("saved-items", "features/saved-items/routes/saved-items.tsx"),

    layout("layout/workspace-layout.tsx", [
      route("workspace", "features/workspace/routes/workspace.tsx"),
      route("my-events", "features/workspace/routes/my-events.tsx"),
      route("manage-post", "features/manage-post/routes/manage-post.tsx"),
      route(
        "manage-post/:sourceType/:id",
        "features/manage-post/routes/manage-post.$sourceType.$id.tsx",
      ),
    ]),
    route("notifications", "features/notifications/routes/notifications.tsx"),
  ]),
  route("onboarding", "routes/onboarding/pages/layout.tsx", [
    index("routes/onboarding/pages/index.tsx"),
    route("profile", "routes/onboarding/pages/onboarding-profile.tsx"),
    route("interest", "routes/onboarding/pages/interest.tsx"),
    route("contribution", "routes/onboarding/pages/contribution.tsx"),
    route("tier", "routes/onboarding/pages/tier.tsx"),
  ]),
  route("tk-admin", "layout/admin-layout.tsx", [
    index("features/admin/index.tsx"),
    // route("dashboard", "features/admin/index.tsx"),
    route("users", "features/admin/admin-users.tsx"),
  ]),
  route("tk-admin/login", "routes/auth/pages/admin-login.tsx"),

  route("login", "routes/auth/pages/login.tsx"),
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
