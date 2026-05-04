import { ProtectedApiError } from "./api-client.server";

export interface ActionResponse<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

export interface TransformOptions<T> {
  onSuccess?: (data: unknown) => T;
  onError?: (error: string) => string;
}

function parseZodError(details: unknown): string | null {
  const errDetails = details as { error?: { message?: string } } | undefined;
  if (errDetails?.error?.message) {
    try {
      const parsedErrors = JSON.parse(errDetails.error.message);
      if (Array.isArray(parsedErrors) && parsedErrors.length > 0) {
        return parsedErrors[0].message;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function transformActionResponse<T>(
  result: unknown,
  options?: TransformOptions<T>,
): ActionResponse<T> {
  if (result instanceof ProtectedApiError) {
    const message = parseZodError(result.details) ?? result.message;
    return {
      ok: false,
      error: options?.onError ? options.onError(message) : message,
    };
  }

  if (result instanceof Error) {
    console.error("Action error:", result);
    const message = "Internal server error";
    return {
      ok: false,
      error: options?.onError ? options.onError(message) : message,
    };
  }

  const data = options?.onSuccess ? options.onSuccess(result) : (result as T);
  return {
    ok: true,
    data,
  };
}

export function successActionResponse<T>(data: T): ActionResponse<T> {
  return { ok: true, data };
}

export function errorActionResponse(error: string): ActionResponse {
  return { ok: false, error };
}
