import type { Route } from "./+types/home";
import { Link, useLoaderData } from "react-router";
import { getUser } from "~/lib/server/session.server";
import type { SessionUser } from "~/lib/server/session.server";
import { resolveImageURL } from "~/lib/utils";
import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import type { AuthenticatedUser } from "~/lib/server/types";
import type { ComponentType, SVGProps } from "react";
import {
  ArrowUpRight,
  Award,
  Calendar,
  ChevronRight,
  Compass,
  Globe,
  Heart,
  HeartHandshake,
  Layers,
  MapPin,
  MessageSquare,
  MessagesSquare,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

// ── Route exports ─────────────────────────────────────────────────────────────

export function meta({}: Route.MetaArgs) {
  return [
    { title: "True Khmer — Khmer Digital Collective" },
    {
      name: "description",
      content:
        "Connect, grow, and make an impact with the True Khmer community.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  title: string;
  author: { name: string; initials: string };
  category: string;
  timeAgo: string;
  votes: number;
  answers: number;
  content: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  openRoles: number;
  image: string;
};

type VolunteerOp = {
  id: string;
  title: string;
  organization: string;
  location: string;
  isUrgent: boolean;
};

type Contributor = {
  id: string;
  name: string;
  points: number;
  initials: string;
};

type Stat = {
  label: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
  bg: string;
};

type NavItem = {
  to: string;
  label: string;
  sub: string;
  color: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

// ── Static data ───────────────────────────────────────────────────────────────

const TRENDING_POSTS: Post[] = [
  {
    id: "1",
    title: "How to scale AgriTech solutions for Cambodian rice farmers?",
    author: { name: "Sopheak Meas", initials: "SM" },
    category: "AgriTech",
    timeAgo: "2h ago",
    votes: 148,
    answers: 24,
    content:
      "Exploring scalable mobile-first tools for rural cooperatives in Kampong Thom and Siem Reap provinces.",
  },
  {
    id: "2",
    title: "Open call: Indigenous textile digitization project",
    author: { name: "Ratanak Phal", initials: "RP" },
    category: "Heritage",
    timeAgo: "5h ago",
    votes: 122,
    answers: 18,
    content:
      "Partnering with artisan networks in Takeo to preserve Khmer silk motifs through high-fidelity vector archives.",
  },
  {
    id: "3",
    title: "Building Cambodia's first open-source EV charging network",
    author: { name: "Vicheka Lorn", initials: "VL" },
    category: "CleanTech",
    timeAgo: "1d ago",
    votes: 98,
    answers: 31,
    content:
      "Community-driven charging station deployment across Phnom Penh & Sihanoukville with a shared revenue model.",
  },
];

const FEATURED_PROJECTS: Project[] = [
  {
    id: "1",
    title: "GreenSeed Platform",
    description:
      "Connecting eco-restoration volunteers with landowners for native reforestation in Mondulkiri.",
    category: "Eco-Tech",
    location: "Mondulkiri",
    openRoles: 5,
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    title: "Angkor Data Archive",
    description:
      "3D scanning and AI-powered restoration mapping for Angkor Wat and surrounding temple complexes.",
    category: "Heritage",
    location: "Siem Reap",
    openRoles: 3,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
  },
];

const VOLUNTEER_OPPORTUNITIES: VolunteerOp[] = [
  {
    id: "1",
    title: "Phnom Tamao Wildlife Reforestation Drive",
    organization: "Cambodia Wildlife Sanctuary",
    location: "Takeo Province",
    isUrgent: true,
  },
  {
    id: "2",
    title: "Digital Literacy for Rural Youth",
    organization: "TechForKhmer NGO",
    location: "Kampong Cham",
    isUrgent: false,
  },
  {
    id: "3",
    title: "Tonle Sap Floating Village Clean-up",
    organization: "Clean Water Cambodia",
    location: "Siem Reap",
    isUrgent: true,
  },
];

const CONTRIBUTORS: Contributor[] = [
  { id: "1", name: "Sopheak Meas", points: 2480, initials: "SM" },
  { id: "2", name: "Ratanak Phal", points: 2105, initials: "RP" },
  { id: "3", name: "Vicheka Lorn", points: 1880, initials: "VL" },
];

const CATEGORIES = [
  { name: "Agriculture & Food", count: 34 },
  { name: "Clean Energy & Eco", count: 28 },
  { name: "Heritage & Culture", count: 22 },
  { name: "Digital & Tech", count: 41 },
  { name: "Social Impact", count: 19 },
];

const STATS: Stat[] = [
  {
    label: "Active Members",
    value: "15.4k+",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Eco Seedlings",
    value: "148,000",
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    label: "Active Initiatives",
    value: "32",
    icon: Compass,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const NAV_ITEMS: NavItem[] = [
  {
    to: "/forum",
    label: "Forum",
    sub: "The Agora",
    color: "bg-blue-600",
    icon: MessagesSquare,
  },
  {
    to: "/launchpad",
    label: "Launchpad",
    sub: "Incubators",
    color: "bg-amber-500",
    icon: Zap,
  },
  {
    to: "/volunteer",
    label: "Volunteer",
    sub: "Active Ops",
    color: "bg-emerald-500",
    icon: HeartHandshake,
  },
  {
    to: "/events",
    label: "Events",
    sub: "Upcoming",
    color: "bg-violet-600",
    icon: Calendar,
  },
];

// ── Animation helper ──────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay, ease: "easeOut" } as const,
});

// ── Shared primitives ─────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  linkTo,
  linkLabel,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  linkTo: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <Icon className="text-blue-600" width={18} height={18} />
        <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
          {title}
        </h2>
      </div>
      <Link
        to={linkTo}
        className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
      >
        {linkLabel} <ChevronRight size={13} />
      </Link>
    </div>
  );
}

// ── Atom-level cards ──────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card className="rounded-2xl border-gray-100 bg-white">
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={`h-11 w-11 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
        >
          <stat.icon width={20} height={20} />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-gray-900 leading-none">
            {stat.value}
          </p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
            {stat.label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ForumPostCard({ post }: { post: Post }) {
  return (
    <Link to="/forum">
      <Card className="rounded-2xl border-gray-100 hover:border-blue-200 transition-colors duration-200 group cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-blue-50 text-blue-700 font-bold">
                  {post.author.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-gray-700">
                {post.author.name}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{post.timeAgo}</span>
            </div>
            <Badge
              variant="secondary"
              className="text-[10px] font-black uppercase tracking-wide rounded-full"
            >
              {post.category}
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
            {post.title}
          </h3>
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {post.content}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400">
            <span className="flex items-center gap-1.5">
              <MessageSquare size={12} />
              {post.answers} replies
            </span>
            <span className="text-blue-600">✦ {post.votes} supports</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to="/launchpad">
      <Card className="rounded-2xl border-gray-100 hover:border-amber-200 transition-colors duration-200 overflow-hidden group cursor-pointer p-0">
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/40 text-white border-white/10 text-[9px] font-black uppercase tracking-widest backdrop-blur-sm rounded-full">
              {project.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <h4 className="text-base font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {project.title}
          </h4>
          <p className="mt-1 text-xs font-medium text-gray-500 leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={11} className="text-gray-400" />
              {project.location}
            </span>
            <Badge
              variant="secondary"
              className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] font-extrabold uppercase rounded-full"
            >
              {project.openRoles} open roles
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function VolunteerItem({ opp }: { opp: VolunteerOp }) {
  return (
    <Link to="/volunteer">
      <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group cursor-pointer">
        <div className="h-9 w-9 rounded-2xl bg-emerald-50 flex items-center justify-center text-sm shrink-0 select-none">
          🇰🇭
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {opp.title}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
            {opp.organization}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
            <MapPin size={9} />
            <span className="truncate">{opp.location}</span>
          </div>
        </div>
        {opp.isUrgent && (
          <Badge className="bg-red-50 text-red-600 border-red-100 text-[8px] font-black uppercase shrink-0 self-start mt-0.5 rounded-full">
            Urgent
          </Badge>
        )}
      </div>
    </Link>
  );
}

function ContributorRow({
  contributor,
  rank,
}: {
  contributor: Contributor;
  rank: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-1.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
          {contributor.initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-200 truncate">
            {contributor.name}
          </p>
          <p className="text-[9px] font-bold text-slate-500 tracking-wider mt-0.5">
            {contributor.points.toLocaleString()} pts
          </p>
        </div>
      </div>
      <span className="text-[8px] font-black text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full select-none shrink-0">
        #{rank}
      </span>
    </div>
  );
}

function NavTile({ nav }: { nav: NavItem }) {
  return (
    <Link to={nav.to}>
      <Card className="rounded-2xl border-gray-100 transition-colors duration-200 group h-full hover:border-gray-200">
        <CardContent className="p-4">
          <div
            className={`h-9 w-9 rounded-2xl ${nav.color} text-white flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform`}
          >
            <nav.icon width={17} height={17} />
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
            {nav.sub}
          </p>
          <p className="text-sm font-extrabold text-gray-900 leading-none">
            {nav.label}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

// ── Section-level components ──────────────────────────────────────────────────

function CampaignBanner() {
  return (
    <Card className="rounded-2xl overflow-hidden border-gray-100 p-0">
      <div className="bg-linear-to-br from-indigo-900 to-slate-900 text-white flex flex-col md:flex-row">
        <div className="p-8 flex-1 flex flex-col justify-between gap-7">
          <div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">
              Eco-Restoration Lab · Campaign of the Week
            </span>
            <h3 className="mt-2 text-2xl sm:text-[28px] font-extrabold tracking-tight leading-snug">
              Phnom Tamao Canopy Re-Wilding
            </h3>
            <p className="mt-3 text-sm font-medium text-slate-300 leading-relaxed max-w-md">
              Pioneering native tree reinstatement and conservation corridors
              for endangered primates, designed and coordinated by True Khmer
              members.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                <Heart size={16} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Pledge Goal
                </p>
                <p className="text-sm font-bold text-white">
                  12,000 Rare Seedlings
                </p>
              </div>
            </div>
            <Button
              asChild
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100 border-0 rounded-2xl font-extrabold text-xs tracking-wider uppercase"
            >
              <Link to="/volunteer">Join Canopy Ops</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-[42%] relative aspect-video md:aspect-auto select-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
            alt="Reforestation"
            className="h-full w-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-indigo-900/80 via-transparent to-transparent" />
        </div>
      </div>
    </Card>
  );
}

function ForumSection() {
  return (
    <section>
      <SectionHeader
        icon={TrendingUp}
        title="Active Forum Conversations"
        linkTo="/forum"
        linkLabel="Enter Forum"
      />
      <div className="space-y-3">
        {TRENDING_POSTS.map((post, i) => (
          <motion.div key={post.id} {...fadeUp(0.16 + i * 0.04)}>
            <ForumPostCard post={post} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function LaunchpadSection() {
  return (
    <section>
      <SectionHeader
        icon={Sparkles}
        title="Incubated Startup Ventures"
        linkTo="/launchpad"
        linkLabel="Explore Ventures"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FEATURED_PROJECTS.map((project, i) => (
          <motion.div key={project.id} {...fadeUp(0.24 + i * 0.04)}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ShowcaseSection() {
  return (
    <section>
      <Card className="rounded-2xl border-gray-100">
        <CardContent className="p-7">
          <SectionHeader
            icon={Globe}
            title="Indigenous Showcase Spotlight"
            linkTo="/poc"
            linkLabel="Open Showcase"
          />
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-7 space-y-3">
              <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[9px] font-black uppercase tracking-widest rounded-full">
                ★ Highlight Spotlight
              </Badge>
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">
                The Weaver of Silk — Traditional Re-Mastering
              </h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                How a team of modern designers partnered with local master silk
                artisans in Takeo province to vectorize, archive, and weave
                iconic historical Khmer silk templates with zero heritage loss.
              </p>
              <Link
                to="/poc"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:underline"
              >
                Read visual storybook <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="sm:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&q=80&w=400"
                alt="Silk weaving"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function QuickNavPanel() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {NAV_ITEMS.map((nav) => (
        <NavTile key={nav.to} nav={nav} />
      ))}
    </div>
  );
}

function VolunteerPanel() {
  return (
    <Card className="rounded-2xl border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-pink-500" />
            <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">
              Green Impact Board
            </h3>
          </div>
          <Link
            to="/volunteer"
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>
        <div className="space-y-1">
          {VOLUNTEER_OPPORTUNITIES.map((opp) => (
            <VolunteerItem key={opp.id} opp={opp} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PioneerTerminal({
  user,
  displayName,
  avatarSrc,
}: {
  user: AuthenticatedUser | SessionUser | null;
  displayName: string;
  avatarSrc: string;
}) {
  return (
    <Card className="rounded-2xl border-0 overflow-hidden p-0">
      <div className="bg-slate-900 text-white">
        <div className="h-1 w-full bg-linear-to-r from-blue-500 to-emerald-500" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <Award size={16} className="text-amber-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-widest">
              Pioneer Terminal
            </h3>
          </div>

          {user && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarImage
                    src={avatarSrc}
                    alt={displayName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 tracking-wider">
                    Member
                  </p>
                </div>
              </div>
              <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-[8px] font-black uppercase shrink-0 rounded-full">
                ✦ Active
              </Badge>
            </div>
          )}

          <div className="space-y-3">
            {CONTRIBUTORS.map((c, idx) => (
              <ContributorRow key={c.id} contributor={c} rank={idx + 1} />
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
            >
              {user ? "Manage your profile" : "Sign in to join"}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CommunitiesPanel() {
  return (
    <Card className="rounded-2xl border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={16} className="text-blue-600" />
          <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">
            Communities Matrix
          </h3>
        </div>
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} to="/forum">
              <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer">
                <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] font-extrabold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {cat.count} cohorts
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function GuestCTA() {
  return (
    <Card className="rounded-2xl border-blue-100 bg-linear-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-5 text-center space-y-3">
        <Sparkles size={22} className="mx-auto text-blue-500" />
        <h3 className="text-base font-extrabold text-gray-900">
          Ready to contribute?
        </h3>
        <p className="text-xs font-medium text-gray-500 leading-relaxed">
          Join thousands of innovators building a stronger Cambodia together.
        </p>
        <Button asChild className="w-full font-bold rounded-2xl">
          <Link to="/register">Create your profile</Link>
        </Button>
        <p className="text-[10px] text-gray-400 font-medium">
          Already a member?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useLoaderData<typeof loader>();
  const displayName = user?.name || user?.email?.split("@")[0] || "";
  const avatarSrc = resolveImageURL(user?.image);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 pt-14 pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-0 w-[42%] h-[130%] bg-blue-500/4 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-[32%] h-[90%] bg-emerald-500/4 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-blue-700 select-none">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              The Digital Collective of Cambodia
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.06] text-gray-900 mb-5">
              True Khmer{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                Community
              </span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-gray-500 leading-relaxed max-w-2xl mb-8">
              Cambodia's private digital canvas where founders, eco-restoration
              leaders, and digital artisans collaborate on tech, agriculture,
              and heritage.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 max-w-2xl bg-gray-100 p-2 rounded-2xl border border-gray-200/70">
              <div className="relative flex flex-1 items-center pl-3.5">
                <Search size={15} className="shrink-0 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search forum, projects, volunteer ops..."
                  className="h-10 w-full bg-transparent pl-2.5 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = (e.target as HTMLInputElement).value.trim();
                      if (q)
                        window.location.href = `/forum?q=${encodeURIComponent(q)}`;
                    }
                  }}
                />
              </div>
              <Button
                asChild
                size="sm"
                className="h-10 px-5 rounded-2xl font-bold text-xs uppercase tracking-widest"
              >
                <Link to={user ? "/forum" : "/register"}>
                  {user ? "Browse Forum" : "Join Now"}
                </Link>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest select-none">
              <span>Explore:</span>
              <Link
                to="/forum"
                className="hover:text-blue-600 transition-colors"
              >
                ⚡ Forum
              </Link>
              <span className="text-gray-200">•</span>
              <Link
                to="/launchpad"
                className="hover:text-amber-500 transition-colors"
              >
                🔥 Launchpad
              </Link>
              <span className="text-gray-200">•</span>
              <Link
                to="/volunteer"
                className="hover:text-emerald-500 transition-colors"
              >
                🌱 Volunteer
              </Link>
              <span className="text-gray-200">•</span>
              <Link
                to="/events"
                className="hover:text-violet-500 transition-colors"
              >
                📅 Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 z-10">
        <motion.div
          {...fadeUp(0.06)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </div>

      {/* ── Main grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left — 8 cols */}
          <div className="lg:col-span-8 space-y-10">
            <motion.div {...fadeUp(0.1)}>
              <CampaignBanner />
            </motion.div>
            <motion.div {...fadeUp(0.14)}>
              <ForumSection />
            </motion.div>
            <motion.div {...fadeUp(0.22)}>
              <LaunchpadSection />
            </motion.div>
            <motion.div {...fadeUp(0.28)}>
              <ShowcaseSection />
            </motion.div>
          </div>

          {/* Right — 4 cols */}
          <div className="lg:col-span-4 space-y-5">
            <motion.div {...fadeUp(0.12)}>
              <QuickNavPanel />
            </motion.div>
            <motion.div {...fadeUp(0.16)}>
              <VolunteerPanel />
            </motion.div>
            <motion.div {...fadeUp(0.2)}>
              <PioneerTerminal
                user={user}
                displayName={displayName}
                avatarSrc={avatarSrc}
              />
            </motion.div>
            <motion.div {...fadeUp(0.24)}>
              <CommunitiesPanel />
            </motion.div>
            {!user && (
              <motion.div {...fadeUp(0.28)}>
                <GuestCTA />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
