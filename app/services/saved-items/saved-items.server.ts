import {
  apiRequestWithSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
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
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";

type SavedCollectionResponse<T> = {
  ok?: boolean;
  data?: unknown;
  items?: T[];
  questions?: T[];
  opportunities?: T[];
  launchpads?: T[];
  saved?: T[];
};

function readCollection<T>(
  response: SavedCollectionResponse<T>,
  keys: Array<keyof SavedCollectionResponse<T>>,
): T[] {
  for (const key of keys) {
    const value = response[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  if (response.data && typeof response.data === "object") {
    return readCollection(response.data as SavedCollectionResponse<T>, keys);
  }

  return [];
}

async function getSavedCollection<T>(
  request: Request,
  path: string,
  keys: Array<keyof SavedCollectionResponse<T>>,
) {
  try {
    const result = await apiRequestWithSession<SavedCollectionResponse<T>>(
      request,
      path,
      { method: "GET" },
    );
    return readCollection(result.data, keys);
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return [];
    }

    throw error;
  }
}

export async function getSavedItems(request: Request) {
  const [forums, volunteers, launchpads] = await Promise.all([
    getSavedCollection<Question>(request, "/forum/questions/saved", [
      "questions",
      "items",
      "saved",
    ]),
    getSavedCollection<Opportunity>(request, "/volunteer/saved", [
      "opportunities",
      "items",
      "saved",
    ]),
    getSavedCollection<LaunchpadOpportunity>(request, "/launchpad/saved", [
      "launchpads",
      "items",
      "saved",
    ]),
  ]);

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
