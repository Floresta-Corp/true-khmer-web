import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import WaveBackground from "~/components/icons/waveBg";

export function CommunityHero() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('/images/community/communityBG.webp')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-y-0 right-0 -z-10 text-blue-600 dark:text-white/10">
        <WaveBackground />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
        <div className="rounded-full bg-blue-600 px-4 py-1 text-sm text-white md:text-base">
          United for Cambodia
        </div>

        <h1 className="mb-6 text-3xl font-bold text-white md:text-6xl">
          Cambodia&apos;s future is built not by external expectations but by
          the hands, ideas, and energy of its own people.
        </h1>

        <div className="flex w-full max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
          >
            <Link
              to="/registration/partner-registration"
              title="Join as Partner"
              aria-label="Join as Partner"
            >
              Join as a Partner
              <ArrowRight className="ml-1 inline-block size-[18px]" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
