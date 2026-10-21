import { apiRequestWithOptionalSession } from "~/lib/server/api-client.server";
import type { ContactCategory } from "~/features/contact/lib/contact-schema";

export type SendContactMessageBody = {
  category: ContactCategory;
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
};

export type ContactRateLimit = { limit: number; remaining: number };

export type SendContactMessageResponse = {
  ok: true;
  message: string;
  rateLimit: ContactRateLimit;
};

/**
 * The visitor's IP as seen by this server. The API counts the daily limit per
 * IP, and since the request to the API comes from this server, the original
 * address has to be passed along.
 */
export function getClientIp(request: Request): string | null {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;

  return request.headers.get("x-real-ip")?.trim() || null;
}

export async function SendContactMessage(
  request: Request,
  body: SendContactMessageBody,
) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");

  return apiRequestWithOptionalSession<
    SendContactMessageResponse,
    SendContactMessageBody
  >(request, "/contact", {
    method: "POST",
    body,
    headers: {
      ...(ip ? { "X-Forwarded-For": ip } : {}),
      ...(userAgent ? { "User-Agent": userAgent } : {}),
    },
  });
}
