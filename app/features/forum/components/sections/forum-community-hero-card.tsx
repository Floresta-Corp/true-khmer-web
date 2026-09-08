import { Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Link,
  useLoaderData,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import type { loader } from "../../route/forum.new";
import type { loader as appLayoutLoader } from "~/layout/app-layout";
import AskQuestionDialog from "../dialog/ask-question-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUserDisplay } from "~/hooks/use-user-display";
import { validateQuestionImageFile } from "~/features/forum/utils";

const heroBackgroundImage = "/images/forum-background.jpg";

/**
 * One composer control. A signed-out visitor gets the same affordance pointed
 * at login, so the hero looks identical either way.
 */
function ComposerAction({
  isAuthenticated,
  loginHref,
  onClick,
  className,
  children,
}: {
  isAuthenticated: boolean;
  loginHref: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  if (!isAuthenticated) {
    return (
      <Link to={loginHref} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export default function ForumCommunityHeroCard() {
  const { categories, userId } = useLoaderData<typeof loader>();
  const appLayoutData =
    useRouteLoaderData<typeof appLayoutLoader>("layout/app-layout");
  const { displayName, initials, profileImage } = useUserDisplay(
    appLayoutData?.user,
  );
  const location = useLocation();
  const isAuthenticated = Boolean(userId);
  const redirectTo = `${location.pathname}${location.search}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  // A single dialog behind all three controls: mounting one per button gives
  // each its own form state and fetcher for no gain.
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const openComposer = () => {
    setPendingImage(null);
    setIsComposerOpen(true);
  };

  const handleImageClick = () => {
    setPendingImage(null);
    const input = imageInputRef.current;
    if (!input) return;
    // Clearing the value first so re-picking the same file still fires change.
    input.value = "";
    input.click();
  };

  const handleImageSelected = (file: File | null) => {
    if (!file) return;

    const imageError = validateQuestionImageFile(file);
    if (imageError) {
      toast.error(imageError);
      return;
    }

    setPendingImage(file);
    setIsComposerOpen(true);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#eef4ff] via-[#f4f8ff] to-[#e6f0ff] p-5 sm:p-8">
      <img
        src={heroBackgroundImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-3/5 object-cover opacity-20 sm:block"
      />
      <div className="relative flex flex-col gap-4 sm:gap-5">
        <div className="flex max-w-xl flex-col gap-2">
          <h1 className="text-2xl leading-tight font-semibold tracking-[-0.6px] text-[#0f1729] sm:text-4xl">
            Ask the community something...
          </h1>
          <p className="text-sm leading-6 text-[#48566a] sm:text-base">
            A space to share ideas, ask questions, and support each other.
            Together we learn, grow, and create impact for Cambodia.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_4px_24px_0px_rgba(15,23,41,0.06)] sm:p-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 shrink-0 border border-[#f9fafb]">
              <AvatarImage
                src={profileImage || undefined}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#EFF6FF] text-xs font-semibold text-[#2F6FE4]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <ComposerAction
              isAuthenticated={isAuthenticated}
              loginHref={loginHref}
              onClick={openComposer}
              className="min-w-0 flex-1 cursor-pointer truncate bg-transparent text-left text-sm text-[#9eacc0] sm:text-base"
            >
              What would you like to discuss?
            </ComposerAction>
          </div>

          <div className="flex items-center justify-between gap-3">
            <ComposerAction
              isAuthenticated={isAuthenticated}
              loginHref={loginHref}
              onClick={handleImageClick}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm font-medium text-[#48566a] transition-colors hover:text-[#0050d4]"
            >
              <ImageIcon className="size-4.5" />
              Image
            </ComposerAction>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(event) =>
                handleImageSelected(event.target.files?.[0] ?? null)
              }
              className="sr-only"
            />

            <ComposerAction
              isAuthenticated={isAuthenticated}
              loginHref={loginHref}
              onClick={openComposer}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#2f6fe4] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#1f62df]"
            >
              Post
            </ComposerAction>
          </div>
        </div>
      </div>

      {isAuthenticated ? (
        <AskQuestionDialog
          categories={categories}
          isAuthenticated
          initialImageFile={pendingImage}
          open={isComposerOpen}
          onOpenChange={setIsComposerOpen}
        />
      ) : null}
    </section>
  );
}
