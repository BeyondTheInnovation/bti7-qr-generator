import { describe, expect, test } from "bun:test";
import { acceptsMarkdown, markdownTarget, negotiate } from "./markdown";

const FILES: Record<string, { body: string; type: string }> = {
  "/index.html": { body: "<h1>home</h1>", type: "text/html; charset=utf-8" },
  "/index.md": { body: "# home", type: "text/markdown" },
  "/blog/post.html": { body: "<h1>post</h1>", type: "text/html; charset=utf-8" },
  "/blog/post.md": { body: "# post", type: "text/markdown" },
  "/url.html": { body: "<h1>url</h1>", type: "text/html; charset=utf-8" },
  "/blog/post/opengraph-image-x": { body: "png", type: "image/png" },
};

const assets = {
  async fetch(request: Request) {
    const { pathname } = new URL(request.url);
    if (pathname !== "/" && pathname.endsWith("/")) {
      return new Response(null, { status: 307, headers: { Location: pathname.slice(0, -1) } });
    }
    const file = FILES[pathname === "/" ? "/index.html" : pathname] ?? FILES[`${pathname}.html`];
    if (!file) return new Response("missing", { status: 404 });
    return new Response(file.body, { headers: { "Content-Type": file.type } });
  },
};

const get = (path: string, accept?: string) =>
  negotiate(
    new Request(`https://qr.test${path}`, accept ? { headers: { Accept: accept } } : {}),
    assets,
  );

describe("acceptsMarkdown", () => {
  test.each<[string | null, boolean]>([
    [null, false],
    ["", false],
    ["text/html", false],
    ["text/markdown", true],
    ["text/html, text/markdown;q=0.5", true],
    ["text/markdown;q=0", false],
    ["text/markdown;Q=.1", true],
    ["text/*", false],
    ["*/*", false],
  ])("%p -> %p", (accept, expected) => {
    expect(acceptsMarkdown(accept)).toBe(expected);
  });
});

describe("markdownTarget", () => {
  test("maps the home page and nested paths", () => {
    expect(markdownTarget("/")).toEqual({
      markdown: "/index.md",
      canonical: "https://qr.beyondtheinnovation.com/",
    });
    expect(markdownTarget("/blog/post").markdown).toBe("/blog/post.md");
  });
});

describe("negotiate", () => {
  test("serves the markdown twin when asked", async () => {
    const res = await get("/blog/post", "text/markdown");
    expect(await res.text()).toBe("# post");
    expect(res.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(res.headers.get("Vary")).toBe("Accept");
    expect(res.headers.get("Link")).toBe(
      '<https://qr.beyondtheinnovation.com/blog/post>; rel="canonical"',
    );
  });

  test("serves the home page markdown", async () => {
    const res = await get("/", "text/markdown");
    expect(await res.text()).toBe("# home");
    expect(res.headers.get("Link")).toBe('<https://qr.beyondtheinnovation.com/>; rel="canonical"');
  });

  test("serves HTML that advertises the twin", async () => {
    const res = await get("/blog/post", "text/html");
    expect(await res.text()).toBe("<h1>post</h1>");
    expect(res.headers.get("Vary")).toBe("Accept");
    expect(res.headers.get("Link")).toBe('</blog/post.md>; rel="alternate"; type="text/markdown"');
  });

  test("falls back to HTML when the twin is missing", async () => {
    const res = await get("/url", "text/markdown");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("<h1>url</h1>");
  });

  test("leaves redirects, missing pages and non-HTML files untouched", async () => {
    const redirect = await get("/blog/post/", "text/markdown");
    expect(redirect.status).toBe(307);
    expect(redirect.headers.get("Vary")).toBeNull();

    const missing = await get("/nope");
    expect(missing.status).toBe(404);
    expect(missing.headers.get("Link")).toBeNull();

    const image = await get("/blog/post/opengraph-image-x", "text/markdown");
    expect(image.headers.get("Content-Type")).toBe("image/png");
    expect(image.headers.get("Link")).toBeNull();
  });
});
