import { describe, expect, test } from "bun:test";
import { handleMcpRequest } from "./http";

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
  "access-control-allow-headers":
    "Content-Type, Accept, Mcp-Session-Id, Last-Event-ID, Mcp-Protocol-Version",
  "access-control-expose-headers": "Mcp-Session-Id",
};

function expectCors(res: Response) {
  for (const [key, value] of Object.entries(cors)) expect(res.headers.get(key)).toBe(value);
}

let nextId = 1;

async function rpc(method: string, params?: unknown) {
  const id = nextId++;
  const res = await handleMcpRequest(
    new Request("https://qr.test/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        "Mcp-Protocol-Version": "2025-11-25",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    }),
  );
  expectCors(res);
  expect(res.headers.get("mcp-session-id")).toBeNull();
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.id).toBe(id);
  return body.result;
}

describe("handleMcpRequest", () => {
  test("answers the preflight with 204 and the CORS headers", async () => {
    const res = await handleMcpRequest(new Request("https://qr.test/mcp", { method: "OPTIONS" }));
    expect(res.status).toBe(204);
    expectCors(res);
  });

  test("serves initialize, tools/list and tools/call without a session", async () => {
    const init = await rpc("initialize", {
      protocolVersion: "2025-11-25",
      capabilities: {},
      clientInfo: { name: "test", version: "1.0.0" },
    });
    expect(init.serverInfo).toEqual({ name: "qr-generator", version: "1.0.0" });

    const { tools } = await rpc("tools/list");
    expect(tools).toHaveLength(11);
    expect(tools.map((t: { name: string }) => t.name)).toContain("generate_url_qr");

    const call = await rpc("tools/call", {
      name: "generate_url_qr",
      arguments: { url: "https://beyondtheinnovation.com" },
    });
    expect(call.isError).toBeUndefined();
    expect(call.content[0]).toEqual({
      type: "text",
      text: "QR code generated for https://beyondtheinnovation.com",
    });
    expect(call.content[1].type).toBe("image");
    expect(call.content[1].mimeType).toBe("image/png");
    expect(Buffer.from(call.content[1].data, "base64").subarray(1, 4).toString()).toBe("PNG");
  });

  test("refuses GET and other methods with 405 and the CORS headers", async () => {
    for (const method of ["GET", "PUT"]) {
      const res = await handleMcpRequest(
        new Request("https://qr.test/mcp", {
          method,
          headers: { Accept: "text/event-stream" },
        }),
      );
      expect(res.status).toBe(405);
      expectCors(res);
    }
  });
});
