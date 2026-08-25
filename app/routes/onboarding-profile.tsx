import { useLoaderData } from "react-router";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import {
  Building2,
  GraduationCap,
  MapPin,
  CalendarDays,
  Mail,
  LinkIcon,
  MoreHorizontal,
  Star,
  Bookmark,
  Zap,
  Users,
  MessageSquare,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useState } from "react";
import type { Route } from "./+types/onboarding-profile";

export async function loader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const { setCookie, ...payload } = auth;

  return withAuthData(auth, payload);
}

export function meta() {
  return [{ title: "Profile | True Khmer" }];
}

// Tab definitions
const profileTabs = [
  { id: "info", label: "INFO", icon: "📋" },
  { id: "platform", label: "ON THE PLATFORM", icon: "💻" },
  { id: "community", label: "COMMUNITY", icon: "👥" },
] as const;

type TabId = (typeof profileTabs)[number]["id"];

export default function onBoardingProfilePage() {
  const { user } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<TabId>("info");

  const displayName = user.name?.split("@")[0] || "User";
  const capitalizedName =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const fullName = `${capitalizedName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8">
        {/* Profile Header / Cover */}
        <div className="relative">
          {/* Cover Image */}
          <div className="relative h-36 overflow-hidden rounded-b-2xl bg-linear-to-br from-teal-600 via-cyan-700 to-emerald-800 sm:h-56">
            {/* Decorative misty/forest overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            <div className="absolute inset-0 opacity-30">
              <svg
                viewBox="0 0 800 300"
                className="h-full w-full"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="800" height="150" fill="url(#mist)" y="80" />
                {/* Simplified tree silhouettes */}
                <path
                  d="M100,300 L100,200 Q120,160 100,140 Q80,160 100,200"
                  fill="rgba(0,50,30,0.4)"
                />
                <path
                  d="M200,300 L200,180 Q230,130 200,100 Q170,130 200,180"
                  fill="rgba(0,50,30,0.3)"
                />
                <path
                  d="M350,300 L350,190 Q380,140 350,110 Q320,140 350,190"
                  fill="rgba(0,50,30,0.35)"
                />
                <path
                  d="M500,300 L500,170 Q530,120 500,90 Q470,120 500,170"
                  fill="rgba(0,50,30,0.3)"
                />
                <path
                  d="M650,300 L650,200 Q680,150 650,120 Q620,150 650,200"
                  fill="rgba(0,50,30,0.35)"
                />
                <path
                  d="M750,300 L750,210 Q770,170 750,150 Q730,170 750,210"
                  fill="rgba(0,50,30,0.3)"
                />
              </svg>
            </div>
          </div>

          {/* Avatar overlapping cover */}
          <div className="absolute -bottom-10 left-4 sm:-bottom-12 sm:left-8">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white shadow-xl sm:h-24 sm:w-24">
                <AvatarFallback className="bg-gray-800 text-2xl font-bold text-white sm:text-3xl">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span className="absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-3 border-white bg-blue-500">
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
          </div>
        </div>

        {/* Name + Title + Actions */}
        <div className="mt-14 mb-4 flex flex-col gap-3 px-2 sm:mt-16 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                {fullName}
              </h1>
              <Badge className="border-0 bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                Neary Tier
              </Badge>
            </div>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Senior Cultural Strategist & Weaver at Takeo Silk Collective
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="self-start text-gray-400 hover:text-gray-600"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto border-b border-gray-200 sm:mb-8">
          <nav className="flex min-w-max gap-4 px-2 sm:gap-8">
            {profileTabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                className={cn(
                  "relative flex h-auto cursor-pointer items-center gap-2 px-0 py-0 pb-3 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-blue-600" />
                )}
              </Button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && <InfoTab user={user} fullName={fullName} />}
        {activeTab === "platform" && <PlatformTab />}
        {activeTab === "community" && <CommunityTab />}
      </main>
    </div>
  );
}

/* ─── INFO TAB ─────────────────────────────────────────── */
function InfoTab({
  user,
  fullName,
}: {
  user: { id: string; email: string };
  fullName: string;
}) {
  const displayName = user.email?.split("@")[0] || "user";

  return (
    <div className="grid grid-cols-1 gap-5 pb-8 sm:gap-8 sm:pb-12 lg:grid-cols-5">
      {/* Left Column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Identity Details */}
        <Card className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-900 uppercase sm:mb-5">
              Identity Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Senior Cultural Strategist & Weaver at{" "}
                  <span className="font-semibold text-gray-900">
                    Takeo Silk Collective
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Studied at{" "}
                  <span className="font-semibold text-gray-900">
                    Royal University of Fine Arts
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Lives in{" "}
                  <span className="font-semibold text-gray-900">
                    Phnom Penh, Cambodia
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Joined{" "}
                  <span className="font-semibold text-gray-900">May 2024</span>
                </p>
              </div>

              <Separator className="my-2 bg-gray-100" />

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                <a
                  href={`mailto:${user.email}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {user.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <LinkIcon className="h-4 w-4 shrink-0 text-gray-400" />
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  @{displayName}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heritage Honors */}
        <Card className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
                Heritage Honors
              </h3>
              <a
                href="#"
                className="text-xs font-semibold tracking-wider text-blue-600 uppercase hover:underline"
              >
                Full Collection
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Bookmark className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6 sm:space-y-8 lg:col-span-3">
        {/* About Me */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">About Me</h3>
          <blockquote className="border-l-2 border-gray-200 pl-4 text-sm leading-relaxed text-gray-600 italic">
            "I'm a cultural preservationist turned strategist. I've combined a
            deep background in traditional Khmer textile techniques with modern
            digital marketing to scale local artisan brands globally. I've
            helped the Takeo Silk Collective reach international runways while
            maintaining 100% fair-trade transparency. I have over 8 years of
            experience leading cross-functional teams in the intersection of
            heritage and technology."
          </blockquote>
        </div>

        {/* Core Expertise */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Core Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Textile Design",
              "Brand Strategy",
              "Community Ethics",
              "Digital Preservation",
              "Export Logistics",
            ].map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="rounded-full border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ON THE PLATFORM TAB ──────────────────────────────── */
function PlatformTab() {
  const stats = [
    { label: "Projects Contributed", value: "8", icon: Zap },
    { label: "Events Attended", value: "12", icon: CalendarDays },
    { label: "Volunteer Hours", value: "45", icon: Users },
    { label: "Forum Posts", value: "23", icon: MessageSquare },
  ];

  return (
    <div className="pb-8 sm:pb-12">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <CardContent className="flex flex-col items-center p-3 text-center sm:p-5">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 sm:mb-3 sm:h-10 sm:w-10">
                <stat.icon className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── COMMUNITY TAB ────────────────────────────────────── */
function CommunityTab() {
  return (
    <div className="pb-8 sm:pb-12">
      <Card className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <CardContent className="p-5 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-700">
            Community Activity
          </h3>
          <p className="text-sm text-gray-400">
            Your community interactions, endorsements, and connections will
            appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
