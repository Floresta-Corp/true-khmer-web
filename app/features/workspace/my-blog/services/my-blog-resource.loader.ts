/** Resource endpoints accept mutations only and return JSON for accidental GETs. */
export function myBlogMethodNotAllowedLoader() {
  return Response.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 },
  );
}
