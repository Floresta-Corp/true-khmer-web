import { useState } from "react";
import { useActionData, useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { EducationPage } from "../education-page";
import { QuizResultCard } from "../quiz-result-card";
import { QuizRunner } from "../quiz-runner";
import type { educationQuizAction } from "~/features/education/services/education-quiz.action";
import type { educationQuizLoader } from "~/features/education/services/education-quiz.loader";
import type { QuizAttemptResult } from "~/features/education/types";

export default function CourseQuizPage() {
  const { course, quiz } = useLoaderData<typeof educationQuizLoader>();
  const actionData = useActionData<typeof educationQuizAction>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [attempt, setAttempt] = useState(0);
  /**
   * The result the learner has dismissed by choosing "Retake quiz".
   *
   * `useActionData` keeps the graded result until the next navigation, so
   * bumping `attempt` alone left the result card mounted and the button did
   * nothing. Each POST deserializes a fresh result object, so comparing
   * identity re-opens the card for a new attempt without clearing it here.
   */
  const [dismissed, setDismissed] = useState<QuizAttemptResult | null>(null);

  const graded = actionData?.ok ? actionData.result : null;
  const result = graded && graded !== dismissed ? graded : null;

  const retake = () => {
    setDismissed(graded);
    // Remounting the runner clears the previous answers.
    setAttempt((value) => value + 1);
  };

  return (
    <EducationPage surface="muted">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
      >
        {result ? (
          <QuizResultCard
            courseId={course.id}
            result={result}
            passMark={quiz.passMark}
            onRetake={retake}
          />
        ) : (
          <QuizRunner key={attempt} courseId={course.id} quiz={quiz} />
        )}
      </motion.div>
    </EducationPage>
  );
}
