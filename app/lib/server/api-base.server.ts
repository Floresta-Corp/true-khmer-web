/**
 * Fill in the scheme when the configured base URL omits it.
 *
 * `api.example.com` is not something `fetch` can parse, and the failure
 * surfaces far from the cause — as "Failed to parse URL" inside whichever
 * loader happened to run first. Loopback hosts get http, everything else
 * https, which is what a bare hostname means in practice.
 */
function withScheme(value: string) {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return value;

  const isLoopback = /^(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(value);
  return `${isLoopback ? "http" : "https"}://${value}`;
}

export function resolveApiBase(request?: Request) {
  const fromEnv = process.env.API_BASE_URL;

  if (fromEnv) {
    let parsed: URL;
    try {
      parsed = new URL(withScheme(fromEnv.trim()));
    } catch {
      // Name the variable at fault: this is a deployment misconfiguration, and
      // the alternative is a 503 several frames away that reads like an outage.
      throw new Error(
        `API_BASE_URL is not a usable URL: ${JSON.stringify(fromEnv)}`,
      );
    }

    const normalizedBase = `${parsed.origin}${parsed.pathname}`
      .replace(/\/+$/, "")
      .replace(/\/v1$/, "");
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
