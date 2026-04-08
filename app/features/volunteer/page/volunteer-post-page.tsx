import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import OpportunityDetail from "../components/opportunity-detail";
import RoleDetail from "../components/role-detail";

enum State {
  DETAIL = "Detail",
  ROLE = "Role",
}

export default function VolunteerPostPage() {
  const [state, setState] = React.useState<State>(State.DETAIL);
  const prefersReducedMotion = useReducedMotion();
  const transition = { duration: prefersReducedMotion ? 0 : 0.3 };

  return (
    <AnimatePresence mode="wait">
      {state === State.ROLE ? (
        <motion.div
          key={State.ROLE}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={transition}
        >
          <RoleDetail onBackToDetails={() => setState(State.DETAIL)} />
        </motion.div>
      ) : (
        <motion.div
          key={State.DETAIL}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={transition}
        >
          <OpportunityDetail
            onContinueToRole={() => {
              setState(State.ROLE);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
