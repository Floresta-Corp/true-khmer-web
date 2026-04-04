import { data, useLoaderData, Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { requireUser } from "~/lib/server/route-guards.server";
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
  const guard = await requireUser(request);
  const { setCookie, ...payload } = guard;

  return data(
    payload,
    setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
  );
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
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-4 sm:p-8 mb-6 sm:mb-10">
          {/* Background decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <svg viewBox="0 0 200 200" className="w-full h-full text-blue-600">
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
            <div className="flex justify-center md:justify-end mb-4 md:absolute md:top-0 md:right-0 md:mb-0">
              <Link
                to="#"
                className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                TIER BENEFITS
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
              {/* Left: Avatar + Welcome */}
              <div className="flex flex-col md:flex-row items-center md:items-center gap-4 sm:gap-5 w-full md:w-auto">
                <div className="relative shrink-0">
                  <Avatar className="h-20 w-20 sm:h-20 sm:w-20 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={profileImage}
                      alt={displayName}
                      className="object-fill"
                    />
                    <AvatarFallback className="bg-gray-800 text-white text-2xl font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
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
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Welcome back,
                    <br className="md:hidden" />
                    <span className="text-blue-600"> {capitalizedName}</span>
                  </h1>
                  <p className="text-gray-500 mt-1 italic text-sm">
                    "Grow like the banyan, provide shade for many."
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full sm:rounded-lg px-5 py-3 sm:py-2 text-base sm:text-sm font-semibold">
                      See my impact
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full sm:rounded-lg px-5 py-3 sm:py-2 border-gray-200 text-base sm:text-sm font-semibold"
                    >
                      View my profile
                      <User className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Stats - stacked vertically on mobile */}
              <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 sm:py-2.5 border border-gray-100 justify-center md:justify-start">
                    <Trophy className="h-5 w-5 sm:h-4 sm:w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
                        Current Tier
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        Arun Tier
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 sm:py-2.5 border border-gray-100 justify-center md:justify-start">
                    <Star className="h-5 w-5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
                        My Points
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        120 Seeds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 sm:py-2.5 border border-gray-100 justify-center md:justify-start">
                    <Hash className="h-5 w-5 sm:h-4 sm:w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
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
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide">
                Engagement Hub
              </h2>
            </div>
            <Link
              to="#"
              className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1"
            >
              TRACK ALL PROGRESS
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Launchpad Card */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Launchpad
                  </h3>
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">2</p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
                  Active Projects
                </p>
              </CardContent>
            </Card>

            {/* Volunteers Card */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Volunteers
                  </h3>
                  <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-pink-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">1</p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
                  Active Pledges
                </p>
              </CardContent>
            </Card>

            {/* Events Card */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Events
                  </h3>
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">1</p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
                  Confirmed Events
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Saved Collection */}
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-orange-500" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide">
                Saved Collection
              </h2>
            </div>
            <Link
              to="#"
              className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1"
            >
              VIEW ALL SAVED
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Saved Events */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">1</p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
                  Saved Events
                </p>
              </CardContent>
            </Card>

            {/* Opportunities Saved */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-lg bg-pink-50 flex items-center justify-center mb-3">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
                  Opportunities Saved
                </p>
              </CardContent>
            </Card>

            {/* Projects Saved */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <Rocket className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
                  Projects Saved
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* My History */}
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide">
                My History
              </h2>
            </div>
            <Link
              to="#"
              className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 font-medium flex items-center gap-1"
            >
              VIEW FULL ARCHIVE
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Past Events */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Past Events
                  </h3>
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">12</p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
                  Events Attended
                </p>
              </CardContent>
            </Card>

            {/* Volunteer History */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Volunteer History
                  </h3>
                  <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center">
                    <Users className="h-5 w-5 text-pink-500" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">5</p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
                  Activities Participated
                </p>
              </CardContent>
            </Card>

            {/* Project Logs */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Project Logs
                  </h3>
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                  8
                </p>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mt-1">
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
