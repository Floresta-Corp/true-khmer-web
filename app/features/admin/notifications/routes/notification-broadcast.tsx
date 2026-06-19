import { data, redirect } from "react-router";
import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import { getAdminAccessToken } from "~/lib/server/session.server";

type BroadcastBody = {
  title: string;
  body: string;
  imageUrl?: string;
  type: string;
  webRoute?: string;
  mobileRoute?: string;
};

export async function action({ request }: { request: Request }) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const formData = await request.formData();

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const imageUrl = (formData.get("imageUrl") as string) || undefined;
  const type = (formData.get("type") as string) || "system";
  const webRoute = (formData.get("webRoute") as string) || undefined;
  const mobileRoute = (formData.get("mobileRoute") as string) || undefined;

  const payload: BroadcastBody = {
    title,
    body,
    type,
    ...(imageUrl ? { imageUrl } : {}),
    ...(webRoute ? { webRoute } : {}),
    ...(mobileRoute ? { mobileRoute } : {}),
  };

  try {
    await apiRequestWithAccessToken(
      request,
      accessToken,
      "/notifications/broadcast",
      { method: "POST", body: payload },
    );

    return data(
      { ok: true, error: null },
      setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send notification.";
    return data({ ok: false, error: message }, { status: 400 });
  }
}
