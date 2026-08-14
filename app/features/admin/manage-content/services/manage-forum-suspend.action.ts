import { data } from "react-router";

import {
  suspendForumAnswer,
  suspendForumQuestion,
  unsuspendForumAnswer,
  unsuspendForumQuestion,
} from "~/api/admin/manage-forum/manage-forum.server";

const REASON_MAX_LENGTH = 500;

const INTENTS = {
  suspendQuestion: { idField: "questionId", noun: "Question" },
  unsuspendQuestion: { idField: "questionId", noun: "Question" },
  suspendAnswer: { idField: "answerId", noun: "Answer" },
  unsuspendAnswer: { idField: "answerId", noun: "Answer" },
} as const;

export type SuspendIntent = keyof typeof INTENTS;

export function isSuspendIntent(intent: string): intent is SuspendIntent {
  return intent in INTENTS;
}

export async function handleSuspendIntent(
  request: Request,
  accessToken: string,
  formData: FormData,
  intent: SuspendIntent,
  cookieHeader: ResponseInit,
) {
  const { idField, noun } = INTENTS[intent];
  const id = String(formData.get(idField) ?? "").trim();

  if (!id) {
    return data(
      { ok: false, message: `${noun} ID is required` },
      { status: 400 },
    );
  }

  const isSuspend = intent === "suspendQuestion" || intent === "suspendAnswer";
  let reason = "";

  if (isSuspend) {
    reason = String(formData.get("reason") ?? "").trim();

    if (reason.length > REASON_MAX_LENGTH) {
      return data(
        {
          ok: false,
          message: `Reason must be ${REASON_MAX_LENGTH} characters or fewer.`,
        },
        { status: 400 },
      );
    }
  }

  const body = reason ? { reason } : {};
  const result = await (intent === "suspendQuestion"
    ? suspendForumQuestion(request, accessToken, id, body)
    : intent === "unsuspendQuestion"
      ? unsuspendForumQuestion(request, accessToken, id)
      : intent === "suspendAnswer"
        ? suspendForumAnswer(request, accessToken, id, body)
        : unsuspendForumAnswer(request, accessToken, id));

  return data(
    {
      ok: true,
      intent,
      [idField]: id,
      status: result.status,
      message: `${noun} ${isSuspend ? "suspended" : "restored"}.`,
    },
    cookieHeader,
  );
}
