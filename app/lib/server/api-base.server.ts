export function resolveApiBase(request?: Request) {
  const fromEnv = process.env.API_BASE_URL;

  if (fromEnv) {
    const normalizedBase = fromEnv.replace(/\/+$/, "").replace(/\/v1$/, "");
    return `${normalizedBase}/v1`;
  }

  if (request) {
    const origin = new URL(request.url).origin;
    return `${origin}/v1`;
  }

  throw new Error(
    "API base URL is not configured. Set API_BASE_URL or provide Request context.",
  );
}
