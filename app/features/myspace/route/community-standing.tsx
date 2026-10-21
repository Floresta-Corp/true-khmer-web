import {
  useSearchParams,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import { motion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { communityStandingLoader } from "../services/community-standing.loader";
import { StandingPointsTab } from "../components/standing/standing-points-tab";
import { StandingLeaderboardTab } from "../components/standing/standing-leaderboard-tab";
import { StandingTiersTab } from "../components/standing/standing-tiers-tab";
import { StandingSummary } from "../components/standing/standing-summary";
import { StandingTabSchema } from "../types";
import type { Route } from "./+types/community-standing";

export const loader = communityStandingLoader;

// Every tab's data is already loaded, so switching tabs only rewrites `?tab`;
// refetch when anything else (the history page) changes.
export function shouldRevalidate({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  const current = new URLSearchParams(currentUrl.search);
  const next = new URLSearchParams(nextUrl.search);
  current.delete("tab");
  next.delete("tab");
  if (
    currentUrl.pathname === nextUrl.pathname &&
    current.toString() === next.toString()
  ) {
    return false;
  }
  return defaultShouldRevalidate;
}

export function meta() {
  return [{ title: "Community Standing | True Khmer" }];
}

const TABS = [
  { value: "points", label: "Points" },
  { value: "leaderboard", label: "Leaderboard" },
  { value: "tiers", label: "Tiers" },
] as const;

export default function CommunityStandingPage({
  loaderData,
}: Route.ComponentProps) {
  const { history, leaderboard, tiers, page } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = StandingTabSchema.catch("points").parse(searchParams.get("tab"));

  const handleTabChange = (value: string) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("tab", value);
        return nextParams;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  return (
    <ForumPageLayout className="min-h-full bg-transparent">
      <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 sm:p-6 lg:mx-12 lg:p-8 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-4"
        >
          <BackToButton text="Back" to="/myspace" />
          <div className="space-y-2">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-[40px] dark:text-white">
              Community Standing
            </h1>
            <p className="text-base font-medium text-slate-500 sm:text-lg dark:text-slate-400">
              Track your points, community ranking, and tier progress.
            </p>
          </div>
        </motion.div>

        {tiers && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <StandingSummary
              totalPoints={tiers.totalPoints}
              rank={leaderboard?.me.rank ?? null}
              tiers={tiers.tiers}
              currentTierId={tiers.currentTierId}
            />
          </motion.div>
        )}

        <Tabs value={tab} onValueChange={handleTabChange}>
          <div className="mb-6 w-full overflow-x-auto overflow-y-hidden border-b">
            <TabsList
              className="flex w-max min-w-full justify-start bg-transparent"
              variant="line"
            >
              {TABS.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="cursor-pointer px-4 py-3 text-xs font-bold sm:px-6 sm:text-sm data-active:text-[#1A73E8] data-active:after:bg-[#1A73E8] dark:data-active:text-blue-400"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="points">
            <StandingPointsTab history={history} page={page} />
          </TabsContent>
          <TabsContent value="leaderboard">
            <StandingLeaderboardTab leaderboard={leaderboard} />
          </TabsContent>
          <TabsContent value="tiers">
            <StandingTiersTab tiers={tiers} />
          </TabsContent>
        </Tabs>
      </div>
    </ForumPageLayout>
  );
}
