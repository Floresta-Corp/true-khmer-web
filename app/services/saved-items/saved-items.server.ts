import { apiRequestWithSession } from "~/lib/server/api-client.server";
import {
  UnsaveVolunteerOpportunity,
  SaveVolunteerOpportunity,
} from "~/services/volunteer/server/volunteer.opportunities.server";
import {
  addSaveQuestion,
  deleteSaveQuestion,
} from "~/services/forum/server/forum-question.server";
import {
  saveLaunchpad,
  unsaveLaunchpad,
} from "~/services/launchpad/server/launchpad.opportunities.server";
import type { Question } from "~/services/forum/forum-types";
import type { Opportunity } from "~/services/volunteer/volunteer-types";
import type { LaunchpadOpportunity } from "~/services/launchpad/types";
import type {
  GetSavedLaunchpadOpportunitiesResponse,
  GetSavedVolunteerOpportunitiesResponse,
  GetSaveForumQuestionResponse,
} from "./saved-items-types";

export async function getSavedForums(request: Request) {
  return await apiRequestWithSession<GetSaveForumQuestionResponse>(
    request,
    "/forum/questions/saved",
    { method: "GET" },
  );
}

export async function getSavedVolunteers(request: Request) {
  return await apiRequestWithSession<GetSavedVolunteerOpportunitiesResponse>(
    request,
    "/volunteer/saved",
    { method: "GET" },
  );
}

export async function getSavedLaunchpads(request: Request) {
  return await apiRequestWithSession<GetSavedLaunchpadOpportunitiesResponse>(
    request,
    "/launchpad/saved",
    { method: "GET" },
  );
}

export async function getSavedItems(request: Request, type?: string) {
  let forums: Question[] = [];
  let volunteers: Opportunity[] = [];
  let launchpads: LaunchpadOpportunity[] = [];
  if (type) {
    switch (type) {
      case "forum":
        const forumResult = await getSavedForums(request);
        forums = forumResult.data.questions;

      case "volunteer":
        const volunteerResult = await getSavedVolunteers(request);
        volunteers = volunteerResult.data.opportunities;

      case "launchpad":
        const launchpadResult = await getSavedLaunchpads(request);
        launchpads = launchpadResult.data.launchpads;

      case "all":
        const forumResultAll = await getSavedForums(request);
        const volunteerResultAll = await getSavedVolunteers(request);
        const launchpadResultAll = await getSavedLaunchpads(request);
        forums = forumResultAll.data.questions;
        volunteers = volunteerResultAll.data.opportunities;
        launchpads = launchpadResultAll.data.launchpads;
      default:
        break;
    }
  }
  return { forums, volunteers, launchpads };
}

export async function setSavedItem(
  request: Request,
  type: "forum" | "volunteer" | "launchpad",
  id: string,
  intent: "save" | "unsave",
) {
  if (type === "forum") {
    return intent === "save"
      ? addSaveQuestion(request, id)
      : deleteSaveQuestion(request, id);
  }
  if (type === "volunteer") {
    return intent === "save"
      ? SaveVolunteerOpportunity(request, id)
      : UnsaveVolunteerOpportunity(request, id);
  }
  if (type === "launchpad") {
    return intent === "save"
      ? saveLaunchpad(request, id)
      : unsaveLaunchpad(request, id);
  }
  throw new Response("Unsupported saved item type", { status: 400 });
}
