const SITE_URL = "https://qr.beyondtheinnovation.com";

interface Assets {
  fetch(request: Request): Promise<Response>;
}

/** True when the Accept header lists `text/markdown` with q > 0 (RFC 9110 quality values). */
export function acceptsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  for (const entry of accept.split(",")) {
    const [type, ...params] = entry.split(";").map((part) => part.trim());
    if (!type) continue;
    let q = 1;
    for (const param of params) {
      const match = /^q=(\d*\.?\d+)$/i.exec(param);
      if (match?.[1]) q = Number.parseFloat(match[1]);
    }
    if (q > 0 && type === "text/markdown") return true;
  }
  return false;
}

/** The markdown twin and canonical URL of a page path. Trailing slashes are left to the assets redirect. */
export function markdownTarget(pathname: string): { markdown: string; canonical: string } {
  if (pathname === "/") return { markdown: "/index.md", canonical: `${SITE_URL}/` };
  return { markdown: `${pathname}.md`, canonical: `${SITE_URL}${pathname}` };
}

/**
 * Serves a page as markdown when the client asks for it and the twin exists,
 * otherwise as HTML advertising the twin. A missing twin falls through to the
 * HTML response rather than a 404.
 */
export async function negotiate(request: Request, assets: Assets): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (pathname.endsWith(".md") || (pathname.endsWith("/") && pathname !== "/")) {
    return assets.fetch(request);
  }
  const target = markdownTarget(pathname);

  if (acceptsMarkdown(request.headers.get("accept"))) {
    const markdown = await assets.fetch(
      new Request(new URL(target.markdown, request.url), {
        method: request.method,
        headers: request.headers,
      }),
    );
    if (markdown.ok || markdown.status === 304) {
      const response = new Response(markdown.body, markdown);
      response.headers.set("Content-Type", "text/markdown; charset=utf-8");
      response.headers.set("Vary", "Accept");
      response.headers.set("Link", `<${target.canonical}>; rel="canonical"`);
      return response;
    }
  }

  const page = await assets.fetch(request);
  if (!isPage(page)) return page;
  const response = new Response(page.body, page);
  const alternate = `<${target.markdown}>; rel="alternate"; type="text/markdown"`;
  const link = response.headers.get("Link");
  response.headers.set("Link", link ? `${link}, ${alternate}` : alternate);
  response.headers.set("Vary", "Accept");
  return response;
}

function isPage(response: Response): boolean {
  if (response.status === 304) return true;
  return response.status === 200 && !!response.headers.get("Content-Type")?.startsWith("text/html");
}
