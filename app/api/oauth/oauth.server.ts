import {
  apiRequestPublic,
  ProtectedApiError,
} from "~/lib/server/api-client.server";

export type SsoUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  gender: string | null;
  occupation: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

type GetSsoUserResponse = {
  ok: boolean;
  user: SsoUser;
};

type GetOAuthUserParams = {
  userId: string;
  clientId: string;
};

// The popup never trusts the user copy cached in the cookie session — it asks
// the SSO API for the account behind the id. The endpoint is authenticated by
// the calling client, so no bearer token is sent.
export async function getOAuthUser(
  request: Request,
  { userId, clientId }: GetOAuthUserParams,
): Promise<SsoUser | null> {
  try {
    const { data } = await apiRequestPublic<GetSsoUserResponse>(
      request,
      `/sso/users/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: { "x-client-id": clientId },
      },
    );

    if (!data?.ok || !data.user?.id || !data.user.email) return null;

    return data.user;
  } catch (error) {
    // An unknown client or unknown user just means the popup has to ask for a
    // login.
    if (
      error instanceof ProtectedApiError &&
      (error.status === 401 || error.status === 403 || error.status === 404)
    ) {
      return null;
    }
    throw error;
  }
}
