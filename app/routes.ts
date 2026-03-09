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
    route("events/:id", "features/events/routes/events.$id.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("logout", "routes/logout.tsx"),
  route("api/me", "routes/api/api.me.tsx"),
] satisfies RouteConfig;
