import { useLoaderData } from "react-router";
import type { Route } from "./+types/profile";
import { requireUser } from "~/lib/session.server";
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

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return { user };
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

export default function ProfilePage() {
  const { user } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<TabId>("info");

  const displayName = user.email?.split("@")[0] || "User";
  const capitalizedName =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const fullName = `${capitalizedName} Mean`;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Profile Header / Cover */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-36 sm:h-56 rounded-b-2xl overflow-hidden bg-linear-to-br from-teal-600 via-cyan-700 to-emerald-800 relative">
            {/* Decorative misty/forest overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            <div className="absolute inset-0 opacity-30">
              <svg
                viewBox="0 0 800 300"
                className="w-full h-full"
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
          <div className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-8">
            <div className="relative">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-xl">
                <AvatarFallback className="bg-gray-800 text-white text-2xl sm:text-3xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-blue-500 border-3 border-white flex items-center justify-center">
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
        <div className="mt-14 sm:mt-16 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 px-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                {fullName}
              </h1>
              <Badge className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider border-0 px-2.5 py-0.5">
                Neary Tier
              </Badge>
            </div>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm">
              Senior Cultural Strategist & Weaver at Takeo Silk Collective
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600 self-start"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
          <nav className="flex gap-4 sm:gap-8 px-2 min-w-max">
            {profileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer",
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-8 pb-8 sm:pb-12">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Identity Details */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 sm:mb-5">
              Identity Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">
                  Senior Cultural Strategist & Weaver at{" "}
                  <span className="font-semibold text-gray-900">
                    Takeo Silk Collective
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">
                  Studied at{" "}
                  <span className="font-semibold text-gray-900">
                    Royal University of Fine Arts
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">
                  Lives in{" "}
                  <span className="font-semibold text-gray-900">
                    Phnom Penh, Cambodia
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">
                  Joined{" "}
                  <span className="font-semibold text-gray-900">May 2024</span>
                </p>
              </div>

              <Separator className="bg-gray-100 my-2" />

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <a
                  href={`mailto:${user.email}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {user.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <LinkIcon className="h-4 w-4 text-gray-400 shrink-0" />
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  @{displayName}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heritage Honors */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Heritage Honors
              </h3>
              <a
                href="#"
                className="text-xs font-semibold text-blue-600 hover:underline uppercase tracking-wider"
              >
                Full Collection
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Bookmark className="h-5 w-5 text-orange-500" />
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-3 space-y-6 sm:space-y-8">
        {/* About Me */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">About Me</h3>
          <blockquote className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-gray-200 pl-4">
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">
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
                className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 border-gray-200 bg-white hover:bg-gray-50"
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-white border border-gray-100 shadow-sm rounded-xl"
          >
            <CardContent className="p-3 sm:p-5 flex flex-col items-center text-center">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2 sm:mb-3">
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
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
      <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <CardContent className="p-5 sm:p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
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
