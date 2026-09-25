export function anonymousRequest(request: Request): Request {
  return new Request(new URL(request.url).toString(), { method: "GET" });
}
