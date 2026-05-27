import { ZodError } from "zod";
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

function firstIssueMessage(
  issues: { path: unknown[]; message: string }[],
): string | null {
  const first = issues[0];
  if (!first) return null;
  const pathStr = first.path
    .filter((p): p is string | number => typeof p !== "symbol")
    .join(".");
  const path = pathStr.length > 0 ? `${pathStr}: ` : "";
  return `${path}${first.message}`;
}

function parseZodError(details: unknown): string | null {
  const errDetails = details as { error?: { message?: string } } | undefined;
  if (errDetails?.error?.message) {
    try {
      const parsedErrors = JSON.parse(errDetails.error.message);
      if (Array.isArray(parsedErrors) && parsedErrors.length > 0) {
        return firstIssueMessage(parsedErrors) ?? parsedErrors[0].message;
      }
    } catch {
      return errDetails.error.message;
    }
  }
  return null;
}

export function mapZodError(error: unknown): string | null {
  if (error instanceof ZodError) {
    return firstIssueMessage(error.issues);
  }

  if (error instanceof ProtectedApiError) {
    return parseZodError(error.details);
  }

  return null;
}

export function transformActionResponse<T>(
  result: unknown,
  options?: TransformOptions<T>,
): ActionResponse<T> {
  if (result instanceof ProtectedApiError) {
    const message = mapZodError(result) ?? result.message;
    return {
      ok: false,
      error: options?.onError ? options.onError(message) : message,
    };
  }

  if (result instanceof ZodError) {
    const message = mapZodError(result) ?? "Validation failed";
    return {
      ok: false,
      error: options?.onError ? options.onError(message) : message,
    };
  }

  if (result instanceof Error) {
    console.error("Action error:", result);
    return {
      ok: false,
      error: options?.onError
        ? options.onError("Internal server error")
        : "Internal server error",
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
