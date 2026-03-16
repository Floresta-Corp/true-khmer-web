import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout/app-layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("profile", "routes/profile.tsx"),
    route("events", "features/events/routes/events.tsx"),
    route("events/all", "features/events/routes/events.all.tsx"),
    route("events/:id", "features/events/routes/events.$id.tsx"),
    route("volunteer", "features/volunteer/routes/page.tsx"),
    route("volunteer/:id", "features/volunteer/routes/$id.tsx"),
  ]),
  route("login", "routes/auth/pages/login.tsx"),
  route("register", "routes/auth/pages/register.tsx"),
  route("onboarding", "routes/onboarding/pages/layout.tsx", [
    index("routes/onboarding/pages/index.tsx"),
    route("profile", "routes/onboarding/pages/profile.tsx"),
    route("interest", "routes/onboarding/pages/interest.tsx"),
    route("contribution", "routes/onboarding/pages/contribution.tsx"),
    route("tier", "routes/onboarding/pages/tier.tsx"),
  ]),
  route("onboarding/completed", "routes/onboarding/pages/completed.tsx"),
  route("verify-otp", "routes/auth/pages/verify-otp.tsx"),
  route("logout", "routes/logout.tsx"),
  route("api/onboarding/cities", "routes/api/api.onboarding.cities.tsx"),
  route(
    "api/uploads/avatar/presign",
    "routes/api/api.uploads.avatar.presign.tsx",
  ),
  route("api/me", "routes/api/api.me.tsx"),
] satisfies RouteConfig;
