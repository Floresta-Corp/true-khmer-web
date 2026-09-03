import { useCallback, useMemo, useRef, useState } from "react";
import {
  DEFAULT_ANSWER_COUNT,
  MAX_ANSWER_COUNT,
  type QuizQuestion,
} from "~/features/course-builder/types";

export function useQuizDraft(initial?: {
  passMark?: string;
  questions?: QuizQuestion[];
}) {
  const [passMark, setPassMark] = useState(initial?.passMark ?? "70");
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    () => initial?.questions ?? [],
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const seq = useRef(0);

  const answerSeq = useRef(0);
  const nextAnswerId = useCallback((questionId: string) => {
    answerSeq.current += 1;
    return `${questionId}-a${answerSeq.current}`;
  }, []);

  const addQuestion = useCallback(() => {
    seq.current += 1;
    const id = `q-${seq.current}`;

    setQuestions((current) => [
      ...current,
      {
        id,
        text: "",
        answers: Array.from({ length: DEFAULT_ANSWER_COUNT }, (_, index) => ({
          id: nextAnswerId(id),
          text: "",
          correct: index === 0,
        })),
      },
    ]);
    setActiveId(id);
  }, [nextAnswerId]);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((current) => current.filter((question) => question.id !== id));
    setActiveId(null);
  }, []);

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
                { id: nextAnswerId(id), text: "", correct: false },
              ],
            },
      );
    },
    [patchQuestion, nextAnswerId],
  );

  const removeAnswer = useCallback(
    (id: string, answerId: string) => {
      patchQuestion(id, (question) => {
        const answers = question.answers.filter(
          (answer) => answer.id !== answerId,
        );

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

  const closeQuestion = useCallback(() => setActiveId(null), []);

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
    closeQuestion,
  };
}

export type QuizDraft = ReturnType<typeof useQuizDraft>;
