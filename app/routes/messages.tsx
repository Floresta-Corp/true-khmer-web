import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ChevronDown,
  CircleAlert,
  FileImage,
  Info,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Video,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type Conversation = {
  id: string;
  name: string;
  role: string;
  time: string;
  preview: string;
  app: string;
  unread?: number;
  active?: boolean;
  avatar: string;
};

const conversations: Conversation[] = [
  {
    id: "sophy-keo",
    name: "Sophy Keo",
    role: "Launchpad",
    time: "10:30 AM",
    preview: "Let’s finalize the design by Friday.",
    app: "KHMER EDU APP",
    unread: 2,
    active: true,
    avatar: "/images/forum-avatar.jpg",
  },
  {
    id: "bunthoeun-mean",
    name: "Bunthoeun Mean",
    role: "Volunteer",
    time: "Yesterday",
    preview: "Are you available for the event this weekend?",
    app: "SIEM REAP CLEAN UP",
    avatar: "/images/profile.jpg",
  },
  {
    id: "channary-leak",
    name: "Channary Leak",
    role: "Forum",
    time: "Monday",
    preview: "I sent you the Figma links.",
    app: "TRUE KHMER REFRESH",
    avatar: "/images/auth/signup-avatar-1.jpg",
  },
];

const messages = [
  {
    id: "m1",
    side: "left",
    text: "Hi Virak, how is the progress on the logo?",
    time: "9:00 AM",
    avatar: "/images/forum-avatar.jpg",
  },
  {
    id: "m2",
    side: "right",
    text: "Hey Sophy! It's coming along well. I should have a draft by tomorrow.",
    time: "9:15 AM",
  },
  {
    id: "m3",
    side: "left",
    text: "Great! Let's finalize the design by Friday.",
    time: "10:30 AM",
    avatar: "/images/forum-avatar.jpg",
  },
];

function Avatar({
  src,
  alt,
  active = false,
}: {
  src: string;
  alt: string;
  active?: boolean;
}) {
  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#EEF2F7]">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      {active && (
        <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
  );
}

function ConversationItem({ conversation }: { conversation: Conversation }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors",
        conversation.active ? "bg-[#F4F7FE]" : "hover:bg-[#FAFBFD]",
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          src={conversation.avatar}
          alt={conversation.name}
          active={conversation.active}
        />
        {conversation.unread ? (
          <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF3B30] px-1 text-[10px] font-semibold text-white">
            {conversation.unread}
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[#182031]">
              {conversation.name}
            </div>
            <div className="mt-0.5 truncate text-xs text-[#6B7280]">
              {conversation.preview}
            </div>
          </div>
          <span className="shrink-0 text-[11px] font-medium text-[#98A2B3]">
            {conversation.time}
          </span>
        </div>
        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.12em] text-[#9AA7B8] uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C7D2E2]" />
          {conversation.app}
        </div>
      </div>
    </button>
  );
}

function Bubble({
  side,
  text,
  time,
  avatar,
}: {
  side: "left" | "right";
  text: string;
  time: string;
  avatar?: string;
}) {
  const isRight = side === "right";

  return (
    <div
      className={cn(
        "flex items-end gap-3",
        isRight ? "justify-end" : "justify-start",
      )}
    >
      {!isRight && avatar ? <Avatar src={avatar} alt="Sender" /> : null}

      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
          isRight
            ? "bg-[#2F6FE4] text-white"
            : "border border-[#E7ECF3] bg-white text-[#182031]",
        )}
      >
        <p className="text-sm leading-6">{text}</p>
        <div
          className={cn(
            "mt-1 text-[11px] font-medium",
            isRight ? "text-white/80" : "text-[#98A2B3]",
          )}
        >
          {time}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((conversation) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [
      conversation.name,
      conversation.preview,
      conversation.app,
      conversation.role,
    ].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
          className="flex w-full flex-col border-r border-[#EEF2F7] bg-white lg:w-126"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <h1 className="text-[20px] font-semibold tracking-tight text-[#182031]">
              Messages
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-[#98A2B3] hover:bg-[#F6F8FC] hover:text-[#182031]"
            >
              <MoreVertical className="size-4" />
            </Button>
          </div>

          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#C7D0DE]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="h-12 rounded-full border-0 bg-[#FAFBFD] pr-4 pl-10 text-sm shadow-none placeholder:text-[#C7D0DE] focus-visible:ring-1 focus-visible:ring-[#2F6FE4]/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <div className="space-y-2">
              {filtered.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
            </div>
          </div>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.25,
            delay: prefersReducedMotion ? 0 : 0.03,
          }}
          className="flex min-w-0 flex-1 flex-col bg-white"
        >
          <div className="flex items-center justify-between border-b border-[#EEF2F7] px-5 py-4 lg:px-6">
            <div className="flex items-center gap-3">
              <Avatar src="/images/forum-avatar.jpg" alt="Sophy Keo" active />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#182031]">
                    Sophy Keo
                  </h2>
                  <ChevronDown className="size-4 text-[#98A2B3]" />
                </div>
                <p className="text-xs text-[#6B7280]">Launchpad</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 text-[#98A2B3] sm:flex">
              <Badge className="rounded-full bg-[#F8FAFC] px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase hover:bg-[#F8FAFC]">
                Launchpad
              </Badge>
              <span className="text-xs font-medium tracking-[0.14em] text-[#94A3B8] uppercase">
                Khmer Edu App
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-[#98A2B3] hover:bg-[#F6F8FC] hover:text-[#182031]"
              >
                <Info className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-[#98A2B3] hover:bg-[#F6F8FC] hover:text-[#182031]"
              >
                <MoreVertical className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
            <div className="space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
                >
                  <Bubble
                    side={message.side as "left" | "right"}
                    text={message.text}
                    time={message.time}
                    avatar={message.avatar}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#EEF2F7] px-4 py-4 lg:px-6">
            <div className="flex items-center gap-3 rounded-2xl border border-[#EEF2F7] bg-[#FAFBFD] px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-full text-[#98A2B3] hover:bg-white hover:text-[#182031]"
              >
                <Paperclip className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-full text-[#98A2B3] hover:bg-white hover:text-[#182031]"
              >
                <FileImage className="size-4" />
              </Button>

              <Input
                placeholder="Type your message..."
                className="h-12 flex-1 border-0 bg-transparent px-0 shadow-none placeholder:text-[#B2BCCB] focus-visible:ring-0"
              />

              <Button
                variant="ghost"
                size="icon"
                className="size-10 shrink-0 rounded-full bg-[#F1F5FB] text-[#C4CFDD] hover:bg-[#E9F0FD] hover:text-[#2F6FE4]"
              >
                <Send className="size-4" />
              </Button>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#98A2B3]">
              <div className="inline-flex items-center gap-2">
                <CircleAlert className="size-3.5" />
                <span>Messages are synced across devices</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Phone className="size-3.5" />
                <Video className="size-3.5" />
                <Mic className="size-3.5" />
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
