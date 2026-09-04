import { useState } from "react";
import { Link } from "react-router";
import { motion, MotionConfig } from "motion/react";
import { slideUpVariants, staggerContainerVariants } from "./home-motion";
import { LaunchpadCompactCard } from "~/features/home/components/launchpad-compact-card";
import { VolunteerCompactCard } from "~/features/home/components/volunteer-compact-card";
import { EventListCard } from "~/features/events/components/event-list-card";
import type { EventListItem } from "~/features/events/types/events";
import { CourseCard } from "~/features/education/components/course-card";
import type { CourseSummary } from "~/features/education/types";
import { HomeDiscussionCard } from "./home-discussion-card";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";
import type {
  BlogPostListingItemResponse,
  QuestionResponse,
} from "~/types/api-client";
import { PublicBlogCard } from "~/features/blog/components/public-blog-card";

const OPPORTUNITY_PREVIEW_COUNT = 2;

const SECTION_PADDING = "py-5 lg:py-6";
const HEADING_GAP = "mb-4";
const CARD_GAP = "gap-5";

function SectionHeading({
  title,
  seeAllTo,
}: {
  title: string;
  seeAllTo: string;
}) {
  return (
    <div className={`${HEADING_GAP} flex items-center justify-between gap-4`}>
      <h2 className="text-[22px] leading-tight font-bold tracking-[-0.04em] text-[#333333]">
        {title}
      </h2>
      <Link
        to={seeAllTo}
        className="shrink-0 text-sm font-semibold text-[#1c5dd4] transition-colors hover:text-[#2f6fe4]"
      >
        See all
      </Link>
    </div>
  );
}

function FeedShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className={SECTION_PADDING}
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {children}
      </motion.section>
    </MotionConfig>
  );
}

function FeedSection({
  title,
  seeAllTo,
  children,
}: {
  title: string;
  seeAllTo: string;
  children: React.ReactNode;
}) {
  return (
    <FeedShell>
      <div className="site-container">
        <motion.div variants={slideUpVariants}>
          <SectionHeading title={title} seeAllTo={seeAllTo} />
        </motion.div>

        {children}
      </div>
    </FeedShell>
  );
}

function OpportunityColumn({
  title,
  seeAllTo,
  children,
}: {
  title: string;
  seeAllTo: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={slideUpVariants} className="flex flex-col">
      <SectionHeading title={title} seeAllTo={seeAllTo} />
      <div className="flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

export function OpportunitiesFeed({
  volunteers,
  launchpads,
}: {
  volunteers: Opportunity[];
  launchpads: LaunchpadOpportunity[];
}) {
  if (volunteers.length === 0 && launchpads.length === 0) return null;

  return (
    <FeedShell>
      <div className={`site-container grid ${CARD_GAP} lg:grid-cols-2`}>
        {volunteers.length > 0 && (
          <OpportunityColumn
            title="Volunteer opportunities"
            seeAllTo="/volunteer/all"
          >
            {volunteers
              .slice(0, OPPORTUNITY_PREVIEW_COUNT)
              .map((opportunity) => (
                <VolunteerCompactCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
          </OpportunityColumn>
        )}

        {launchpads.length > 0 && (
          <OpportunityColumn
            title="Launchpad openings"
            seeAllTo="/launchpad/all"
          >
            {launchpads.slice(0, OPPORTUNITY_PREVIEW_COUNT).map((item) => (
              <LaunchpadCompactCard key={item.id} item={item} />
            ))}
          </OpportunityColumn>
        )}
      </div>
    </FeedShell>
  );
}

export function DiscussionFeed({ items }: { items: QuestionResponse[] }) {
  if (items.length === 0) return null;

  return (
    <FeedSection title="Trending discussions" seeAllTo="/forum">
      <div className="flex flex-col gap-3">
        {items.slice(0, 2).map((question) => (
          <motion.div key={question.id} variants={slideUpVariants}>
            <HomeDiscussionCard question={question} />
          </motion.div>
        ))}
      </div>
    </FeedSection>
  );
}

export function BlogFeed({ items }: { items: BlogPostListingItemResponse[] }) {
  if (items.length === 0) return null;

  return (
    <FeedSection title="Latest from the blog" seeAllTo="/blog">
      <div
        className={`grid grid-cols-1 ${CARD_GAP} sm:grid-cols-2 lg:grid-cols-3`}
      >
        {items.slice(0, 3).map((post) => (
          <motion.div key={post.id} variants={slideUpVariants}>
            <PublicBlogCard post={post} />
          </motion.div>
        ))}
      </div>
    </FeedSection>
  );
}

export function CoursesFeed({ items }: { items: CourseSummary[] }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(items.filter((course) => course.isSaved).map((c) => c.id)),
  );

  if (items.length === 0) return null;

  const toggleSave = (courseId: string) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  return (
    <FeedSection title="Trending classes" seeAllTo="/education/all">
      <div
        className={`grid grid-cols-1 ${CARD_GAP} sm:grid-cols-2 lg:grid-cols-4`}
      >
        {items.map((course) => (
          <motion.div key={course.id} variants={slideUpVariants}>
            <CourseCard
              course={course}
              isSaved={savedIds.has(course.id)}
              onToggleSave={toggleSave}
            />
          </motion.div>
        ))}
      </div>
    </FeedSection>
  );
}

export function EventsFeed({ items }: { items: EventListItem[] }) {
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    items.filter((event) => event.isFavorite).map((event) => event.id),
  );

  if (items.length === 0) return null;

  const toggleSave = (eventId: string) => {
    setSavedIds((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId],
    );
  };

  return (
    <FeedSection title="Upcoming events" seeAllTo="/events/all">
      <div
        className={`grid grid-cols-1 ${CARD_GAP} sm:grid-cols-2 lg:grid-cols-4`}
      >
        {items.map((event) => (
          <motion.div key={event.id} variants={slideUpVariants}>
            <EventListCard
              event={event}
              isSaved={savedIds.includes(event.id)}
              onToggleSave={toggleSave}
            />
          </motion.div>
        ))}
      </div>
    </FeedSection>
  );
}
