import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { resolveUrl } from "./resolve-url";

function request(url?: string): Request {
  const endpoint = new URL("https://qr.test/api/resolve-url");
  if (url !== undefined) endpoint.searchParams.set("url", url);
  return new Request(endpoint);
}

function mockFetch(response: () => Response | Promise<Response>) {
  return spyOn(globalThis, "fetch").mockImplementation((async () => response()) as typeof fetch);
}

afterEach(() => {
  (globalThis.fetch as unknown as { mockRestore?: () => void }).mockRestore?.();
});

describe("resolveUrl", () => {
  test("rejects a missing url", async () => {
    const res = await resolveUrl(request());
    expect(res.status).toBe(400);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(await res.json()).toEqual({ error: "Missing url parameter" });
  });

  test("rejects an invalid url", async () => {
    const res = await resolveUrl(request("not a url"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid URL" });
  });

  test("rejects hosts outside the allow-list without fetching", async () => {
    const fetchSpy = mockFetch(() => new Response(null));
    for (const url of [
      "https://example.com/x",
      "https://evilgoo.gl/x",
      "https://google.com.evil.io/",
    ]) {
      const res = await resolveUrl(request(url));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Only Google Maps URLs are supported" });
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("allows subdomains and fetches with a manual redirect and the user agent", async () => {
    const fetchSpy = mockFetch(
      () =>
        new Response(null, {
          status: 302,
          headers: { Location: "https://maps.google.com/?q=1,2" },
        }),
    );
    const res = await resolveUrl(request("https://foo.maps.app.goo.gl/abc"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ resolved: "https://maps.google.com/?q=1,2" });
    const [input, init] = fetchSpy.mock.calls[0];
    expect(input).toBe("https://foo.maps.app.goo.gl/abc");
    expect(init?.redirect).toBe("manual");
    expect(new Headers(init?.headers).get("user-agent")).toBe(
      "Mozilla/5.0 (compatible; QRGenerator/1.0)",
    );
  });

  test("returns the original url when there is no Location, never the upstream body", async () => {
    mockFetch(() => new Response("<html>secret</html>", { status: 200 }));
    const res = await resolveUrl(request("https://www.google.com/maps/place/x"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe(
      JSON.stringify({ resolved: "https://www.google.com/maps/place/x" }),
    );
  });

  test("returns the original url when Location is empty", async () => {
    mockFetch(() => new Response(null, { status: 302, headers: { Location: "" } }));
    const res = await resolveUrl(request("https://maps.app.goo.gl/abc"));
    expect(await res.json()).toEqual({ resolved: "https://maps.app.goo.gl/abc" });
  });

  test("answers 502 when the fetch fails", async () => {
    mockFetch(() => Promise.reject(new TypeError("network down")));
    const res = await resolveUrl(request("https://maps.app.goo.gl/abc"));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Failed to resolve URL" });
  });
});
