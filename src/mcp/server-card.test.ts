import { expect, test } from "bun:test";
import { serverCardResponse } from "./server-card";

const publishedCard =
  '{"$schema":"https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json","name":"com.beyondtheinnovation/qr-generator","version":"1.0.0","title":"QR Code Generator","description":"Generate QR codes for URLs, vCards, WiFi, email, phone, SMS, calendar events, MeCards, X profiles, and plain text. No auth required.","websiteUrl":"https://qr.beyondtheinnovation.com","icons":[{"src":"https://qr.beyondtheinnovation.com/favicon.svg","mimeType":"image/svg+xml"}],"remotes":[{"type":"streamable-http","url":"https://qr.beyondtheinnovation.com/mcp","supportedProtocolVersions":["2025-03-26","2025-06-18","2025-11-25"],"authentication":{"required":false}}],"capabilities":{"tools":{"listChanged":false}}}';

test("serves the published card as cacheable JSON open to any origin", async () => {
  const res = serverCardResponse();
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toContain("application/json");
  expect(res.headers.get("access-control-allow-origin")).toBe("*");
  expect(res.headers.get("cache-control")).toBe("public, max-age=3600");
  expect(await res.text()).toBe(publishedCard);
});
