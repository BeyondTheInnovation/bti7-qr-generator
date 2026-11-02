export const dynamic = "force-static";

const BODY = `User-Agent: *
Allow: /
Content-Signal: search=yes, ai-input=yes, ai-train=yes

Host: https://qr.beyondtheinnovation.com
Sitemap: https://qr.beyondtheinnovation.com/sitemap.xml
`;

export function GET(): Response {
  return new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
