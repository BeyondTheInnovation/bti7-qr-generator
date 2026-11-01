import { expect, test } from "bun:test";
import worker from "./index";

const served: string[] = [];
const env = {
  ASSETS: {
    async fetch(request: Request) {
      served.push(new URL(request.url).pathname);
      return new Response("page", { status: 200, headers: { "Content-Type": "text/html" } });
    },
  },
};

function call(path: string, method = "GET") {
  return worker.fetch(new Request(`https://qr.test${path}`, { method }), env);
}

test("answers MCP preflight with CORS headers", async () => {
  const res = await call("/mcp", "OPTIONS");
  expect(res.status).toBe(204);
  expect(res.headers.get("access-control-allow-origin")).toBe("*");
  expect(res.headers.get("access-control-expose-headers")).toBe("Mcp-Session-Id");
});

test("serves the server card on GET and drops the body on HEAD", async () => {
  expect((await call("/.well-known/mcp/server-card")).status).toBe(200);
  const head = await call("/.well-known/mcp/server-card", "HEAD");
  expect(head.status).toBe(200);
  expect(await head.text()).toBe("");
});

test("limits resolve-url to GET, HEAD and OPTIONS", async () => {
  const options = await call("/api/resolve-url", "OPTIONS");
  expect(options.status).toBe(204);
  expect(options.headers.get("allow")).toBe("GET, HEAD, OPTIONS");
  expect((await call("/api/resolve-url", "POST")).status).toBe(405);
  expect((await call("/api/resolve-url")).status).toBe(400);
});

test("returns the 404 page with status 404 for other Worker paths", async () => {
  for (const path of ["/api/nope", "/.well-known/mcp/other"]) {
    served.length = 0;
    const res = await call(path);
    expect(res.status).toBe(404);
    expect(served).toEqual(["/404"]);
  }
});

test("hands everything else to static assets", async () => {
  served.length = 0;
  const res = await call("/url");
  expect(res.status).toBe(200);
  expect(served).toEqual(["/url"]);
});
