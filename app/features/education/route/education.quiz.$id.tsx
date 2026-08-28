import { useState } from "react";
import { useActionData, useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { EducationPage } from "../components/education-page";
import { QuizResultCard } from "../components/quiz-result-card";
import { QuizRunner } from "../components/quiz-runner";
import { educationQuizAction } from "../services/education-quiz.action";
import { educationQuizLoader } from "../services/education-quiz.loader";
import type { Route } from "./+types/education.quiz.$id";

export const loader = educationQuizLoader;
export const action = educationQuizAction;

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `Final quiz · ${data?.course.title ?? "Course"}` }];
}

export default function CourseQuizPage() {
  const { course, quiz } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  // Bumping the key remounts the runner, clearing answers for a retake.
  const [attempt, setAttempt] = useState(0);
  const result = actionData?.ok ? actionData.result : null;

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
            onRetake={() => setAttempt((value) => value + 1)}
          />
        ) : (
          <QuizRunner key={attempt} courseId={course.id} quiz={quiz} />
        )}
      </motion.div>
    </EducationPage>
  );
}
