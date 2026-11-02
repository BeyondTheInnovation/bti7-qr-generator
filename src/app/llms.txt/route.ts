import { getAllPosts } from "@/lib/blog";
import { QR_TYPES } from "@/qr-types";

export const dynamic = "force-static";

const SITE_URL = "https://qr.beyondtheinnovation.com";

function buildBody(): string {
  const generators = QR_TYPES.map(
    ({ id, label, description }) => `- [${label} QR code](${SITE_URL}/${id}.md): ${description}`,
  );
  const posts = getAllPosts().map(
    ({ slug, title, description }) => `- [${title}](${SITE_URL}/blog/${slug}.md): ${description}`,
  );

  return [
    "# Free QR Code Generator",
    "> Generate custom QR codes for free. Create QR codes for URLs, vCards, WiFi passwords, emails, phone numbers, SMS, calendar events, and more. Built by Beyond The Innovation as a web app, a CLI and a remote MCP server.",
    "## Generators",
    `- [Home](${SITE_URL}/index.md): The QR code generator`,
    ...generators,
    `- [Bulk vCard](${SITE_URL}/vcard/bulk.md): Generate vCard QR codes in bulk`,
    "## Docs",
    `- [MCP Server Documentation](${SITE_URL}/docs/mcp.md): Use the generator from AI tools over MCP`,
    "## Blog",
    `- [Blog](${SITE_URL}/blog.md): All posts`,
    ...posts,
    "## Policies",
    `- [Privacy Policy](${SITE_URL}/policies/privacy.md): How data is handled`,
    `- [Terms of Service](${SITE_URL}/policies/tos.md): Terms of use`,
  ]
    .join("\n\n")
    .replace(/\n\n(- )/g, "\n$1")
    .replace(/(\n- [^\n]*)\n\n(## )/g, "$1\n\n$2");
}

export function GET(): Response {
  return new Response(`${buildBody()}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
