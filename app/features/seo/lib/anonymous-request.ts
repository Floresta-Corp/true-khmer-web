/**
 * A cookie-free copy of a request, for reads whose result is cached publicly.
 *
 * The sitemaps are served with `Cache-Control: public`, so one visitor's copy
 * is handed to everyone. Several of the listing endpoints take an optional
 * session and personalise their rows when one is present (`isFavorite`,
 * `viewerSave`), and `apiRequestWithOptionalSession` will happily attach the
 * crawler's -- or a signed-in visitor's -- token. Dropping the headers makes
 * those reads provably anonymous: the session lookup finds nothing, the client
 * falls back to its public path, and nothing account-specific can end up in a
 * shared cache.
 */
export function anonymousRequest(request: Request): Request {
  return new Request(new URL(request.url).toString(), { method: "GET" });
}
