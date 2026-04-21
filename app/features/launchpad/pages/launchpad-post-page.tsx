import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "react-router";
import BackToButton from "~/components/back-to-button";
import { fadeUp } from "~/components/default-animation";
import LaunchpadPostPage1 from "./launchpad-post-page-1";
import LaunchpadPostPage2 from "./launchpad-post-page-2";

enum State {
  DETAIL = "Detail",
  ROLE = "Role",
}

export default function LaunchpadPostPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const state =
    searchParams.get("state")?.toLowerCase() === "role"
      ? State.ROLE
      : State.DETAIL;

  const setState = (nextState: State) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextState === State.ROLE) {
      nextParams.set("state", "role");
    } else {
      nextParams.delete("state");
    }

    setSearchParams(nextParams, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const onSaveClicked = () => {
    setState(State.ROLE);
  };

  const onCancelClicked = () => {
    // For simplicity, we just go back to the previous page. In a real application, you might want to show a confirmation dialog here.
    window.history.back();
  };

  const onBackToDetailClicked = () => {
    setState(State.DETAIL);
  };

  const onPublishedClicked = () => {};

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 lg:px-20">
        <section className="mx-auto w-full max-w-3xl">
          <motion.div
            className="mb-5 flex items-center justify-between"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <BackToButton text="Back to Launchpad" to="/launchpad" />
          </motion.div>

          <motion.div
            className="my-10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.05,
            }}
          >
            <div className="relative flex gap-3.5 transition-all items-center p-1 rounded-full">
              <motion.div
                className="h-3 w-20 bg-blue-500 rounded-full absolute top-1 left-1"
                initial={{ x: 0, y: 0 }}
                animate={{ x: state === State.DETAIL ? 0 : 80 + 13 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                }}
              />
              <div
                className="cursor-pointer h-3 w-20 bg-gray-200 rounded-full"
                onClick={() => setState(State.DETAIL)}
              />
              <div
                className="cursor-pointer h-3 w-20 bg-gray-200 rounded-full"
                onClick={() => setState(State.ROLE)}
              />
            </div>
          </motion.div>

          <motion.div
            className="my-10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
          >
            <div className="text-4xl">Launch a New Project</div>
            <div className="text-[#65758B]">
              Tell the community what you're building and who you need.
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {state === State.ROLE ? (
              <motion.div
                key={State.ROLE}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  delay: prefersReducedMotion ? 0 : 0.15,
                }}
              >
                <LaunchpadPostPage2
                  onBackToDetailClicked={onBackToDetailClicked}
                  onPublishedClicked={onPublishedClicked}
                />
              </motion.div>
            ) : (
              <motion.div
                key={State.DETAIL}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  delay: prefersReducedMotion ? 0 : 0.15,
                }}
              >
                <LaunchpadPostPage1
                  onSaveClicked={onSaveClicked}
                  onCancelClicked={onCancelClicked}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
