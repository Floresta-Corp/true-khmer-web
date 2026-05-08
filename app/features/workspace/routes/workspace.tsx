import {
  deleteAnswerById,
  myPublishForumAnswer,
  myPublishForumQuestion,
  updateAnswerById,
} from "~/services/forum/server";
import type { Route } from "./+types/workspace";
import WorkSpaceCard from "../components/card/workspace-card";

export async function loader({ request }: Route.LoaderArgs) {
  const qa = await myPublishForumQuestion(request);
  const questions = qa?.data?.questions || []; //array type

  const an = await myPublishForumAnswer(request);
  const answers = an?.data?.answers || [];

  return { questions, answer: answers };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const method = request.method.toUpperCase();
  const answerId = String(formData.get("answerId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const allowedActionTypes = new Set(["delete-answer", "update-answer"]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return {
      ok: false,
      message: "Unsupported action.",
    };
  }

  if (actionType === "update-answer") {
    if (method !== "PATCH") {
      return {
        ok: false,
        message: "Invalid method for updating an answer.",
      };
    }

    if (!answerId) {
      return {
        ok: false,
        message: "Answer ID is required.",
      };
    }

    if (!body) {
      return {
        ok: false,
        message: "Answer body is required.",
      };
    }

    return updateAnswerById(request, answerId, { body });
  }

  if (actionType === "delete-answer") {
    if (!answerId) {
      return {
        ok: false,
        message: "Answer ID is required.",
      };
    }

    return deleteAnswerById(request, answerId);
  }
}

export default function WorkspacePage({ loaderData }: Route.ComponentProps) {
  return (
    <WorkSpaceCard
      questions={loaderData.questions}
      answer={loaderData.answer}
    />
  );
}
