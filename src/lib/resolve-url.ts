const allowedHosts = [
  "maps.app.goo.gl",
  "goo.gl",
  "maps.google.com",
  "www.google.com",
  "google.com",
];

function isAllowedHost(hostname: string): boolean {
  return allowedHosts.some((host) => hostname === host || hostname.endsWith("." + host));
}

/**
 * Resolves a Google Maps short link to the URL it redirects to, so the browser can read
 * coordinates from it without hitting CORS. Returns only the Location header, never the
 * upstream body, so it cannot be used as a proxy.
 */
export async function resolveUrl(req: Request): Promise<Response> {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) return Response.json({ error: "Missing url parameter" }, { status: 400 });

  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }
  if (!isAllowedHost(hostname)) {
    return Response.json({ error: "Only Google Maps URLs are supported" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; QRGenerator/1.0)" },
    });
    await res.body?.cancel();
    return Response.json({ resolved: res.headers.get("location") || url });
  } catch {
    return Response.json({ error: "Failed to resolve URL" }, { status: 502 });
  }
}
