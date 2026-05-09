import { Link } from "react-router";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  MoreVertical,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Star,
  Award,
  Trophy,
  Medal,
  BarChart3,
} from "lucide-react";
import { MyspaceLoader } from "~/routes/api/myspace/myspace-loader";
import type { Route } from "./+types/myspace";
import { resolveImageURL } from "~/lib/utils";
import { RecentActivityList } from "../components/recent-activity-list";

export const loader = MyspaceLoader;

export default function MySpacePage({ loaderData }: Route.ComponentProps) {
  const { me, recentActivities } = loaderData;

  if (!me) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const displayName =
    me.user.displayName || `${me.user.firstName} ${me.user.lastName}`;
  const avatarUrl = resolveImageURL(me.profile.avatarKey || undefined);
  const hasSocialLinks =
    me.socialLinks.website ||
    me.socialLinks.linkedin ||
    me.socialLinks.twitter ||
    me.socialLinks.facebook;

  console.log(me);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 space-y-6">
          <motion.div
            className="flex items-start justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Space</h1>
              <p className="text-sm text-muted-foreground">
                Visualize your growth and community contributions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to={"/edit-profile"}>
                <Button variant="default" className="h-9 bg-blue-600">
                  Edit profile
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          {/* Figma Profile Header Card Implementation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Card className="bg-white flex gap-8 items-start overflow-clip p-8 relative rounded-xl">
              {/* Avatar with border and shadow */}
              <div className="flex flex-col items-start shrink-0">
                <div className="bg-white border-8 border-[#f5f7f9] flex flex-col items-start justify-center overflow-clip p-2 rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] size-40">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="object-cover size-full rounded-[24px]"
                    />
                  ) : (
                    <div className="size-full bg-gray-200 rounded-[24px] flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {me.user.firstName[0]}
                        {me.user.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Profile Info */}
              <div className="flex flex-1 flex-col gap-4 items-start min-w-0">
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-start w-full">
                    <div className="flex flex-1 flex-col gap-2 justify-center min-w-0">
                      <p className="font-bold text-[26px] leading-9.75 text-[#2c2f31] whitespace-nowrap">
                        {displayName}
                      </p>
                      <p className="font-medium text-[18px] leading-6.75 text-[#65758b] whitespace-nowrap">
                        {me.user.occupation || "No occupation set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start max-w-xl w-full">
                    <p className="font-medium text-[14px] leading-5.25 text-[#595c5e]">
                      {me.profile.bio || "No bio set"}
                    </p>
                  </div>
                </div>
                {/* Social Buttons */}
                <div className="flex items-end w-full">
                  <div className="flex gap-2 items-center">
                    {me.socialLinks.linkedin && (
                      <a
                        href={me.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="size-4" />
                      </a>
                    )}
                    {me.socialLinks.facebook && (
                      <a
                        href={me.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="size-4" />
                      </a>
                    )}
                    {me.socialLinks.twitter && (
                      <a
                        href={me.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="size-4" />
                      </a>
                    )}
                    {me.socialLinks.website && (
                      <a
                        href={me.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                        aria-label="Website"
                      >
                        <Globe className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="flex h-full flex-col items-start rounded-2xl bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
              <div className="flex w-full items-center justify-between pb-4">
                <CardDescription className="text-base font-medium text-[#595c5e]">
                  Impact Points
                </CardDescription>
                <Star className="h-4.25 w-4.25 shrink-0 text-[#f59e0b]" />
              </div>
              <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#1d283a]">
                {me.progress.totalPoints}
              </CardTitle>
            </Card>

            <Card className="flex h-full flex-col items-start justify-between rounded-2xl bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
              <div className="flex w-full items-center justify-between pb-4">
                <CardDescription className="text-base font-medium text-[#595c5e]">
                  Current Tier
                </CardDescription>
                <Award className="h-5.25 w-4 shrink-0 text-[#cd7f32]" />
              </div>
              <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#1d283a]">
                {me.progress.tier.name}
              </CardTitle>
              <div className="mt-6 flex w-full flex-col gap-2">
                <div className="h-2 w-full rounded-full bg-[#f1f5f9]" />
                <p className="text-[10px] leading-3.75 text-[#94a3b8]">
                  Next tier: Silver (100 pts)
                </p>
              </div>
            </Card>

            <Card className="flex h-full flex-col items-start rounded-2xl bg-white p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
              <div className="flex w-full items-center justify-between pb-4">
                <CardDescription className="text-base font-medium text-[#595c5e]">
                  Current Rank
                </CardDescription>
                <Trophy className="h-5 w-5 shrink-0 text-[#fbbf24]" />
              </div>
              <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#0f172a]">
                {me.progress.rank || "#-"}
              </CardTitle>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <Card>
              <div className="relative overflow-clip rounded-2xl bg-white p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
                <div className="pb-4">
                  <CardTitle className="text-[20px] font-bold leading-7 text-[#2c2f31]">
                    Achievements
                  </CardTitle>
                </div>

                <div className="relative flex min-h-45 flex-col items-center justify-center py-2 text-center">
                  <Medal className="mb-2 h-8 w-6 shrink-0 text-[#94a3b8]" />
                  <p className="text-base text-[#64748b]">No medals yet</p>
                  <Link
                    to="#"
                    className="pt-4 text-sm font-semibold text-[#2563eb]"
                  >
                    Browse achievements
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <Card className="relative overflow-clip rounded-xl bg-white p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
              <div className="flex w-full items-center justify-between pb-8">
                <CardTitle className="text-[20px] font-bold leading-7 text-[#2c2f31]">
                  Points Earned Over Time
                </CardTitle>
                <div className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8fafc]">
                    <BarChart3 className="h-[11.667px] w-[10.5px] shrink-0 text-[#64748b]" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] px-0.5 py-0.5">
                <div className="flex h-64 flex-col items-center justify-center">
                  <div className="flex h-30 flex-col items-center justify-center pb-6">
                    <div className="flex h-24 items-end gap-3">
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 19.19 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 38.39 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 28.8 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 57.59 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 43.19 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0] opacity-40"
                        style={{ height: 24 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0] opacity-20"
                        style={{ height: 14.39 }}
                      />
                    </div>
                  </div>

                  <p className="pb-4 text-[16px] leading-6 text-[#64748b]">
                    Your impact will appear here
                  </p>

                  <Link
                    to="#"
                    className="inline-flex items-center justify-center rounded-full bg-[#eff6ff] px-6 py-2 text-[14px] font-semibold leading-5 text-[#2563eb]"
                  >
                    Participate in events
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <RecentActivityList
              activities={recentActivities || []}
              maxItems={20}
            />
          </motion.div>
        </div>

        <aside className="lg:col-span-3">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <Card className="p-4 bg-linear-to-br from-blue-500 to-indigo-500 text-white">
                <h3 className="font-semibold text-lg">Grow together</h3>
                <p className="text-sm mt-2">
                  Inspire others by sharing this verified profile of community
                  achievement and social leadership.
                </p>
                <div className="mt-4">
                  <Button className="w-full bg-white text-blue-600">
                    Share profile
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top 10 Ranking</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/romdoul.svg" alt="" />
                          <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            Sarah Jenkins
                          </div>
                          <div className="text-xs text-muted-foreground">
                            12.5k points
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">1</div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </aside>
      </div>
    </div>
  );
}
