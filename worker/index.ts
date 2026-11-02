import { resolveUrl } from "../src/lib/resolve-url";
import { handleMcpRequest } from "../src/mcp/http";
import { serverCardResponse } from "../src/mcp/server-card";
import { negotiate } from "./markdown";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

async function notFound(request: Request, env: Env): Promise<Response> {
  const page = await env.ASSETS.fetch(new Request(new URL("/404", request.url)));
  return new Response(page.body, { status: 404, headers: page.headers });
}

async function getOnly(
  request: Request,
  respond: () => Response | Promise<Response>,
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { Allow: "GET, HEAD, OPTIONS" } });
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, { status: 405 });
  }
  const response = await respond();
  return request.method === "HEAD" ? new Response(null, response) : response;
}

const worker = {
  fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/mcp") return handleMcpRequest(request);
    if (pathname === "/api/resolve-url") return getOnly(request, () => resolveUrl(request));
    if (
      pathname === "/.well-known/mcp/server-card" ||
      pathname === "/.well-known/mcp/server-card.json"
    ) {
      return getOnly(request, serverCardResponse);
    }
    if (pathname.startsWith("/api/") || pathname.startsWith("/.well-known/mcp/")) {
      return notFound(request, env);
    }
    return negotiate(request, env.ASSETS);
  },
};

export default worker;
