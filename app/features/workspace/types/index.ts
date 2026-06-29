import type { BasicJoinType } from "~/services/types";
import type {
  GetMyAnswersResponse,
  GetMyQuestionsResponse,
} from "~/types/api-client";

export type MyWorkSpaceLoaderData = {
  questions: GetMyQuestionsResponse;
  answers: GetMyAnswersResponse;
  categories: BasicJoinType[];
  userId: string | null;
};
