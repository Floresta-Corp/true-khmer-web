import { ProtectedApiError } from "~/lib/server/api-client.server";

/**
 * Toast-ready result returned by every workspace action branch.
 * Components read `ok` to pick the toast variant and `message` for its text.
 */
export type WorkSpaceActionResult = {
  ok: boolean;
  message: string;
  /** Per-field validation errors, keyed by form field name. */
  fieldErrors?: Record<string, string>;
};

export function actionSuccess(message: string): WorkSpaceActionResult {
  return { ok: true, message };
}

export function actionError(
  message: string,
  fieldErrors?: Record<string, string>,
): WorkSpaceActionResult {
  return { ok: false, message, ...(fieldErrors ? { fieldErrors } : {}) };
}

type ApiResult = { data?: { ok?: boolean } | null; setCookie?: string };

/**
 * Normalize a service call (which returns `{ data, setCookie }` and may throw
 * `ProtectedApiError`) into a toast-ready result. Returns the service's
 * `setCookie` so the caller can forward any refreshed-session cookie.
 */
export async function runServiceAction(
  fn: () => Promise<ApiResult>,
  messages: { success: string; error: string },
): Promise<{ result: WorkSpaceActionResult; setCookie?: string }> {
  try {
    const res = await fn();
    if (res?.data?.ok) {
      return { result: actionSuccess(messages.success), setCookie: res.setCookie };
    }
    return { result: actionError(messages.error), setCookie: res?.setCookie };
  } catch (error) {
    const message =
      error instanceof ProtectedApiError ? error.message : messages.error;
    return { result: actionError(message) };
  }
}
