import { getUserId } from "~/lib/server/session.server";
import { getQuestionById, getAnswersByQuestionId, getPublicQuestionById, getPublicAnswersByQuestionId } from "~/services/forum/server";
import type { Route as ForumDetailRoute } from "../../../features/forum/routes/+types/forum-detail";

export async function forumDetailLoader({ request, params }: ForumDetailRoute.LoaderArgs) {
    const questionId = params.questionId;

    if (!questionId) {
        throw new Error("No question ID provided");
    }

    const userId = await getUserId(request);

    const [question, answer] = await Promise.all(
        userId
            ? [
                getQuestionById(request, questionId),
                getAnswersByQuestionId(request, questionId),
            ]
            : [
                getPublicQuestionById(request, questionId),
                getPublicAnswersByQuestionId(request, questionId),
            ],
    );

    return {
        question: question?.data.question ?? null,
        answers: answer?.data.answers ?? [],
        userId: userId || null,
    };
}