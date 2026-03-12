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
    route("events", "routes/events.tsx"),
    route("volunteer", "routes/volunteer/page.tsx"),
    route("volunteer/:id", "routes/volunteer/$id.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("onboarding", "routes/onboarding/layout.tsx", [
    index("routes/onboarding/index.tsx"),
    route("profile", "routes/onboarding/profile.tsx"),
    route("interest", "routes/onboarding/interest.tsx"),
    route("contribution", "routes/onboarding/contribution.tsx"),
    route("tier", "routes/onboarding/tier.tsx"),
  ]),
  route("onboarding/completed", "routes/onboarding/completed.tsx"),
  route("verify-otp", "routes/verify-otp.tsx"),
  route("logout", "routes/logout.tsx"),
  route("api/onboarding/cities", "routes/api/api.onboarding.cities.tsx"),
  route("api/uploads/avatar/presign", "routes/api/api.uploads.avatar.presign.tsx"),
  route("api/me", "routes/api/api.me.tsx"),
] satisfies RouteConfig;
