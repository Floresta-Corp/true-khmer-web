import { Link, useLoaderData } from "react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock3,
  EllipsisVertical,
  Flag,
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Trophy,
} from "lucide-react";

import AddAnswerDialog from "../components/AddAnswerDialog";
import type { Route } from "./+types/forum-detail";

type Profile = {
  name: string;
  role: string;
  avatar: string;
};

type Answer = {
  id: string;
  body: string;
  votes: number;
  postedAt: string;
  author: Profile;
};

type DiscussionDetail = {
  id: string;
  category: string;
  postedAt: string;
  title: string;
  body: string;
  tags: string[];
  score: number;
  author: Profile;
  topAnswer: Answer;
  answers: Answer[];
};

const discussions: Record<string, DiscussionDetail> = {
  "1": {
    id: "1",
    category: "Business Growth",
    postedAt: "2 hours ago",
    title: "How to scale a local SME to the international market?",
    body: "I've been running a small production house in Phnom Penh for 3 years. We want to start exporting to neighboring countries. What are the first steps for legal compliance?",
    tags: ["# Export", "# Legal", "# SME"],
    score: 42,
    author: {
      name: "Dara Samnang",
      role: "SME Owner",
      avatar:
        "http://localhost:3845/assets/c688d192bfd3524458d5f9d6670fb96eba7796d4.png",
    },
    topAnswer: {
      id: "ta-1",
      body: "You should look into the General Department of Customs and Excise. They have specific guidelines for cross-border trade with Vietnam. I highly recommend attending the SME Export workshop next month.",
      votes: 45,
      postedAt: "1 hour ago",
      author: {
        name: "Sophea Rath",
        role: "Tech Recruiter",
        avatar:
          "http://localhost:3845/assets/8befcb6610611323e87966c7d635c0e3edd12197.png",
      },
    },
    answers: [
      {
        id: "a-1",
        body: "I've done this recently. Start with your Certificate of Origin. It's crucial for ASEAN trade benefits. Also, check the GDT for VAT export rules.",
        votes: 12,
        postedAt: "45 mins ago",
        author: {
          name: "Long Vannak",
          role: "Entrepreneur",
          avatar:
            "http://localhost:3845/assets/84deebc9464283edd8955ce95d024a9432e91489.png",
        },
      },
      {
        id: "a-2",
        body: "Actually, it has a very specific import quota for certain agricultural products. Make sure your production house is certified by the Ministry of Commerce.",
        votes: 8,
        postedAt: "10 mins ago",
        author: {
          name: "Chanavy K.",
          role: "Creative Lead",
          avatar:
            "http://localhost:3845/assets/c4561fc7e9918b600a1ca267d3619f90060aa23d.png",
        },
      },
    ],
  },
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forum Discussion - True Khmer" },
    {
      name: "description",
      content: "Discussion details, answers, and community insights.",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const discussion = discussions[params.postId ?? ""] ?? discussions["1"];
  return { discussion };
}

function VoteRail({ votes }: { votes: number }) {
  return (
    <div className="flex w-7 shrink-0 flex-col items-center gap-1.5 pt-1">
      <button className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#f3f4f6] bg-[#f9fafb] text-[#9eacc0] transition-colors hover:text-[#344256]">
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <span className="text-[11px] font-semibold leading-4 text-[#4a5565]">
        {votes}
      </span>
      <button className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#f3f4f6] bg-[#f9fafb] text-[#9eacc0] transition-colors hover:text-[#344256]">
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AnswerCard({ answer }: { answer: Answer }) {
  return (
    <article className="rounded-2xl border border-[#f3f4f6] bg-white p-6">
      <div className="flex items-start gap-5">
        <VoteRail votes={answer.votes} />
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-4.5 text-[#65758b]">{answer.body}</p>

          <div className="mt-5 flex items-center justify-between border-t border-[#f9fafb] pt-4">
            <div className="flex items-center gap-2.5">
              <img
                src={answer.author.avatar}
                alt={answer.author.name}
                className="h-7 w-7 rounded-full border border-[#f3f4f6] object-cover"
              />
              <div>
                <p className="text-xs font-semibold leading-4 text-[#344256]">
                  {answer.author.name}
                </p>
                <p className="text-[10px] font-medium leading-4 text-[#9eacc0]">
                  {answer.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium text-[#99a1af]">
              <span>{answer.postedAt}</span>
              <button className="rounded-sm p-1 transition-colors hover:text-[#4a5565]">
                <Flag className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ForumDetailFooter() {
  const social = [Facebook, Twitter, Instagram, Linkedin];

  return (
    <footer className="mt-6 w-full bg-white px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <img
              src="/logofullcolor.svg"
              alt="True Khmer"
              className="h-7 w-auto"
            />
            <p className="mt-4 max-w-107.5 text-sm leading-5 text-[#6a7282]">
              The leading community platform for Khmer business and career
              growth. Bridging the gap between talent and opportunity worldwide.
            </p>
            <div className="mt-5 flex items-center gap-3.5">
              {social.map((Icon, index) => (
                <button
                  key={index}
                  className="flex h-8.75 w-8.75 items-center justify-center rounded-full border border-[#f3f4f6] bg-[#f9fafb] text-[#9eacc0] transition-colors hover:text-[#2f6fe4]"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold leading-4 text-[#2f6fe4]">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-5 text-[#020618]">
              <li>Forum</li>
              <li>Events</li>
              <li>Volunteers</li>
              <li>Launchpad</li>
              <li>People of Cambodia</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold leading-4 text-[#2f6fe4]">
              Community
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-5 text-[#020618]">
              <li>Sponsors</li>
              <li>Success Stories</li>
              <li>Partners</li>
              <li>News</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold leading-4 text-[#2f6fe4]">
              About
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-5 text-[#020618]">
              <li>Our Story</li>
              <li>Our Team</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#e2e8f0] pt-7 text-sm text-[#62748e] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 True Khmer. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Cookie Settings</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function ForumDetailPage() {
  const { discussion } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 lg:px-20">
        <section className="mx-auto w-full max-w-190">
          <div className="mb-5 flex items-center justify-between">
            <Link
              to="/forum"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9eacc0] transition-colors hover:text-[#2f6fe4]"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
              Back to forum
            </Link>

            <div className="flex items-center gap-2">
              <button className="rounded-xl p-2 text-[#99a1af] transition-colors hover:bg-white hover:text-[#4a5565]">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="rounded-xl p-2 text-[#99a1af] transition-colors hover:bg-white hover:text-[#4a5565]">
                <EllipsisVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          <article className="rounded-2xl border border-[#f1f5f9] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold leading-4.5 text-[#2f6fe4]">
                {discussion.category}
              </p>
              <p className="inline-flex items-center gap-1 text-xs font-medium text-[#9eacc0]">
                <Clock3 className="h-4 w-4" />
                {discussion.postedAt}
              </p>
            </div>

            <h1 className="mt-5 text-base font-semibold leading-5 text-[#030213]">
              {discussion.title}
            </h1>
            <p className="mt-2 text-xs leading-4.5 text-[#65758b]">
              {discussion.body}
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#99a1af]">
              {discussion.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#f9fafb] pt-4">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2.5">
                  <img
                    src={discussion.author.avatar}
                    alt={discussion.author.name}
                    className="h-7 w-7 rounded-full border border-[#f3f4f6] object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold leading-4 text-[#344256]">
                      {discussion.author.name}
                    </p>
                    <p className="text-xs font-medium leading-4 text-[#9eacc0]">
                      {discussion.author.role}
                    </p>
                  </div>
                </div>

                <div className="flex h-7.5 items-center rounded-xl border border-[#f3f4f6] bg-[#f9fafb] text-[#4a5565]">
                  <button className="px-2 text-[#99a1af] hover:text-[#4a5565]">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-1 text-xs font-semibold">
                    {discussion.score}
                  </span>
                  <button className="px-2 text-[#99a1af] hover:text-[#4a5565]">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <AddAnswerDialog />
            </div>
          </article>

          <section className="mt-5">
            <h2 className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[1.3px] text-[#99a1af]">
              <Trophy className="h-3.5 w-3.5 text-[#f59e0b]" />
              Top Answer
            </h2>
            <div className="mt-2">
              <AnswerCard answer={discussion.topAnswer} />
            </div>
          </section>

          <section className="mt-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[1.3px] text-[#99a1af]">
              All Answers ({discussion.answers.length + 1})
            </h2>
            <div className="mt-2 space-y-3.5">
              {discussion.answers.map((answer) => (
                <AnswerCard key={answer.id} answer={answer} />
              ))}
            </div>
          </section>
        </section>
      </main>

      <ForumDetailFooter />
    </div>
  );
}
