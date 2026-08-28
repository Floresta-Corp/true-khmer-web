import { useCallback, useMemo, useRef, useState } from "react";
import {
  DEFAULT_ANSWER_COUNT,
  MAX_ANSWER_COUNT,
  type QuizQuestion,
} from "~/features/course-builder/types";

/**
 * Quiz state for the builder's Quiz step.
 *
 * A course has one quiz, sat at the end, so questions are a single flat list.
 *
 * Nothing here is persisted: the API has no quiz resource, so this lives for
 * the length of the session.
 */
export function useQuizDraft() {
  const [passMark, setPassMark] = useState("70");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  /** The question the editor modal is open on. */
  const [activeId, setActiveId] = useState<string | null>(null);

  // Ids only have to be unique within the session, and a counter avoids the
  // hydration mismatch a timestamp or random id would risk. It lives in a ref
  // so two adds in one render cannot be handed the same number.
  const seq = useRef(0);

  const addQuestion = useCallback(() => {
    seq.current += 1;
    const id = `q-${seq.current}`;

    setQuestions((current) => [
      ...current,
      {
        id,
        text: "",
        answers: Array.from({ length: DEFAULT_ANSWER_COUNT }, (_, index) => ({
          id: `${id}-a${index + 1}`,
          text: "",
          // A question needs one right answer, so the first starts marked.
          correct: index === 0,
        })),
      },
    ]);
    setActiveId(id);
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((current) => current.filter((question) => question.id !== id));
    setActiveId(null);
  }, []);

  /** Applies `change` to the question with `id`, leaving the rest untouched. */
  const patchQuestion = useCallback(
    (id: string, change: (question: QuizQuestion) => QuizQuestion) => {
      setQuestions((current) =>
        current.map((question) =>
          question.id === id ? change(question) : question,
        ),
      );
    },
    [],
  );

  const updateQuestion = useCallback(
    (id: string, changes: Partial<QuizQuestion>) => {
      patchQuestion(id, (question) => ({ ...question, ...changes }));
    },
    [patchQuestion],
  );

  const setAnswerText = useCallback(
    (id: string, answerId: string, text: string) => {
      patchQuestion(id, (question) => ({
        ...question,
        answers: question.answers.map((answer) =>
          answer.id === answerId ? { ...answer, text } : answer,
        ),
      }));
    },
    [patchQuestion],
  );

  /** Exactly one answer is correct, so marking one clears the rest. */
  const markCorrect = useCallback(
    (id: string, answerId: string) => {
      patchQuestion(id, (question) => ({
        ...question,
        answers: question.answers.map((answer) => ({
          ...answer,
          correct: answer.id === answerId,
        })),
      }));
    },
    [patchQuestion],
  );

  const addAnswer = useCallback(
    (id: string) => {
      patchQuestion(id, (question) =>
        question.answers.length >= MAX_ANSWER_COUNT
          ? question
          : {
              ...question,
              answers: [
                ...question.answers,
                {
                  id: `${id}-a${question.answers.length + 1}`,
                  text: "",
                  correct: false,
                },
              ],
            },
      );
    },
    [patchQuestion],
  );

  const removeAnswer = useCallback(
    (id: string, answerId: string) => {
      patchQuestion(id, (question) => {
        const answers = question.answers.filter(
          (answer) => answer.id !== answerId,
        );

        // Removing the correct answer would leave the question without one.
        return {
          ...question,
          answers: answers.some((answer) => answer.correct)
            ? answers
            : answers.map((answer, index) => ({
                ...answer,
                correct: index === 0,
              })),
        };
      });
    },
    [patchQuestion],
  );

  const activeQuestion = useMemo(() => {
    if (!activeId) return null;
    const index = questions.findIndex((question) => question.id === activeId);
    if (index === -1) return null;

    return { question: questions[index], number: index + 1 };
  }, [activeId, questions]);

  return {
    passMark,
    setPassMark,
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    setAnswerText,
    markCorrect,
    addAnswer,
    removeAnswer,
    activeQuestion,
    openQuestion: setActiveId,
    closeQuestion: () => setActiveId(null),
  };
}

export type QuizDraft = ReturnType<typeof useQuizDraft>;
