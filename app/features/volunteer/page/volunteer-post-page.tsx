import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "react-router";
import VolunteerPostPage1 from "./volunteer-post-page-1";
import BackToButton from "~/components/back-to-button";
import VolunteerPostPage2 from "./volunteer-post-page-2";

enum State {
  DETAIL = "Detail",
  ROLE = "Role",
}

export default function VolunteerPostPage() {
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

  return (
    <div className="min-h-screen w-full bg-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 lg:px-20">
        <section className="mx-auto w-full max-w-3xl">
          <motion.div
            key={State.ROLE}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          >
            <BackToButton
              text="Back to Volunteer Opportunities"
              to="/volunteer"
            />
          </motion.div>

          <motion.div
            className="my-10"
            key={State.ROLE}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.05,
            }}
          >
            <motion.div className="relative flex gap-3.5 transition-all items-center p-1 rounded-full">
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
            </motion.div>
          </motion.div>
          <motion.div
            className="my-10"
            key={State.ROLE}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
          >
            <section>
              <h1 className="text-[32px] font-semibold leading-[38.4px] text-[#030213]">
                Post new opportunity
              </h1>
              <p className="text-base text-[#6a7282]">
                Share the mission and core details of your project
              </p>
            </section>
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
                <VolunteerPostPage2
                  onBackToDetails={() => setState(State.DETAIL)}
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
                  delay: prefersReducedMotion ? 0 : 0.2,
                }}
              >
                <VolunteerPostPage1
                  onContinueToRole={() => {
                    setState(State.ROLE);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
