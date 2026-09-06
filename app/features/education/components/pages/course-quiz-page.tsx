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
  const [dismissed, setDismissed] = useState<QuizAttemptResult | null>(null);

  const graded = actionData?.ok ? actionData.result : null;
  const result = graded && graded !== dismissed ? graded : null;

  const failure = actionData && !actionData.ok ? actionData.message : null;

  const retake = () => {
    setDismissed(graded);
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
          <>
            {failure && (
              <p
                role="alert"
                className="mx-auto mb-5 max-w-180 rounded-[10px] border border-[#FB3748]/30 bg-[#FB3748]/5 px-4 py-3 text-[13px] font-semibold text-[#FB3748]"
              >
                {failure}
              </p>
            )}
            <QuizRunner key={attempt} courseId={course.id} quiz={quiz} />
          </>
        )}
      </motion.div>
    </EducationPage>
  );
}
