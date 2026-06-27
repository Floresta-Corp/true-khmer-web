import type {
  CursorPagination,
  ListModeratorsResponse,
} from "~/types/api-client";

export type ManageModTeamLoaderData = {
  moderators: ListModeratorsResponse["moderators"];
  pagination: CursorPagination;
  currentUserId: string;
};

export type AcceptInviteErrors = Partial<
  Record<"token" | "name" | "password" | "confirmPassword" | "form", string>
>;

export type AcceptInviteActionData = {
  errors?: AcceptInviteErrors;
};
