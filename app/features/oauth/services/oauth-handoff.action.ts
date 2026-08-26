import type { Route } from "project-types/oauth/route/+types/oauth-handoff";
import { apiRequestPublic } from "~/lib/server/api-client.server";
import type { OAuthHandoffResult } from "../types";

type OAuthHandoffRequestBody = {
  origin?: string;
  clientId?: string;
  accessToken?: string;
};

export async function OauthHandoffAction({ request }: Route.ActionArgs) {
  const { origin, clientId, accessToken } =
    (await request.json()) as OAuthHandoffRequestBody;

  if (!clientId || !accessToken) {
    throw new Response("clientId and accessToken are required.", {
      status: 400,
    });
  }

  const { data } = await apiRequestPublic<OAuthHandoffResult>(
    request,
    "/sso/handoff",
    {
      method: "POST",
      body: { clientId, accessToken },
    },
  );

  return { ...data, origin };
}
