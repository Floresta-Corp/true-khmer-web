import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Rocket,
  Heart,
  CalendarDays,
  Bookmark,
  ArrowUpRight,
  ArrowRight,
  Star,
  Trophy,
  Hash,
  Zap,
  Clock,
  User,
  CheckCircle,
  Users,
  FileText,
} from "lucide-react";
import { resolveImageURL } from "~/lib/utils";

// This loader acts as middleware — it requires auth
export async function loader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const { setCookie, ...payload } = auth;

  return withAuthData(auth, payload);
}

export function meta() {
  return [{ title: "My Journey | True Khmer" }];
}

export default function DashboardPage() {
  const { user } = useLoaderData<typeof loader>();
  const displayName = user?.name || user.email?.split("@")[0] || "User";
  const profileImage = resolveImageURL(user?.profile?.avatarKey);
  const capitalizedName =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Welcome Hero Section */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mb-10 sm:p-8">
          {/* Background decorative element */}
          <div className="absolute top-0 right-0 h-64 w-64 opacity-5">
            <svg viewBox="0 0 200 200" className="h-full w-full text-blue-600">
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="180"
                fill="currentColor"
                fontWeight="bold"
              >
                TK
              </text>
            </svg>
          </div>

          {/* Mobile: Centered stacked layout / Desktop: Side-by-side */}
          <div className="relative">
            {/* TIER BENEFITS link - top right on mobile, repositioned on desktop */}
            <div className="mb-4 flex justify-center md:absolute md:top-0 md:right-0 md:mb-0 md:justify-end">
              <Link
                to="#"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                TIER BENEFITS
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
              {/* Left: Avatar + Welcome */}
              <div className="flex w-full flex-col items-center gap-4 sm:gap-5 md:w-auto md:flex-row md:items-center">
                <div className="relative shrink-0">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg sm:h-20 sm:w-20">
                    <AvatarImage
                      src={profileImage}
                      alt={displayName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-800 text-2xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <span className="absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500">
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Welcome back,
                    <br className="md:hidden" />
                    <span className="text-blue-600"> {capitalizedName}</span>
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 italic">
                    "Grow like the banyan, provide shade for many."
                  </p>
                  <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <Button className="rounded-full bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-700 sm:rounded-lg sm:py-2 sm:text-sm">
                      See my impact
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-gray-200 px-5 py-3 text-base font-semibold sm:rounded-lg sm:py-2 sm:text-sm"
                    >
                      View my profile
                      <User className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Stats - stacked vertically on mobile */}
              <div className="flex w-full flex-col items-center gap-3 md:w-auto md:items-end">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-4 md:w-auto">
                  <div className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 sm:py-2.5 md:justify-start">
                    <Trophy className="h-5 w-5 shrink-0 text-blue-500 sm:h-4 sm:w-4" />
                    <div>
                      <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        Current Tier
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        Arun Tier
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 sm:py-2.5 md:justify-start">
                    <Star className="h-5 w-5 shrink-0 text-amber-500 sm:h-4 sm:w-4" />
                    <div>
                      <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        My Points
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        120 Seeds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 sm:py-2.5 md:justify-start">
                    <Hash className="h-5 w-5 shrink-0 text-blue-500 sm:h-4 sm:w-4" />
                    <div>
                      <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        Global Rank
                      </p>
                      <p className="text-sm font-bold text-gray-800">#46</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Hub */}
        <section className="mb-6 sm:mb-10">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold tracking-wide text-gray-900 uppercase sm:text-lg">
                Engagement Hub
              </h2>
            </div>
            <Link
              to="#"
              className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 sm:text-sm"
            >
              TRACK ALL PROGRESS
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {/* Launchpad Card */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Launchpad
                  </h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Rocket className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">2</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Active Projects
                </p>
              </CardContent>
            </Card>

            {/* Volunteers Card */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Volunteers
                  </h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
                    <Heart className="h-5 w-5 text-pink-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">1</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Active Pledges
                </p>
              </CardContent>
            </Card>

            {/* Events Card */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Events
                  </h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <CalendarDays className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">1</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Confirmed Events
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Saved Collection */}
        <section className="mb-6 sm:mb-10">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-orange-500" />
              <h2 className="text-base font-bold tracking-wide text-gray-900 uppercase sm:text-lg">
                Saved Collection
              </h2>
            </div>
            <Link
              to="#"
              className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 sm:text-sm"
            >
              VIEW ALL SAVED
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {/* Saved Events */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">1</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Saved Events
                </p>
              </CardContent>
            </Card>

            {/* Opportunities Saved */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Opportunities Saved
                </p>
              </CardContent>
            </Card>

            {/* Projects Saved */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <Rocket className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Projects Saved
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* My History */}
        <section className="mb-6 sm:mb-10">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <h2 className="text-base font-bold tracking-wide text-gray-900 uppercase sm:text-lg">
                My History
              </h2>
            </div>
            <Link
              to="#"
              className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 sm:text-sm"
            >
              VIEW FULL ARCHIVE
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {/* Past Events */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Past Events
                  </h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">12</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Events Attended
                </p>
              </CardContent>
            </Card>

            {/* Volunteer History */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Volunteer History
                  </h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50">
                    <Users className="h-5 w-5 text-pink-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">5</p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Activities Participated
                </p>
              </CardContent>
            </Card>

            {/* Project Logs */}
            <Card className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                    Project Logs
                  </h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  8
                </p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Projects Applied To
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
