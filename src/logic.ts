import type { Hono } from "hono";

export function registerRoutes(app: Hono) {
  app.post("/api/encode", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body?.data) {
      return c.json({ error: "Missing required field: data" }, 400);
    }

    const data: string = body.data;
    const action: string = (body.action || "encode").toLowerCase();

    if (action !== "encode" && action !== "decode") {
      return c.json({ error: "Invalid action. Use 'encode' or 'decode'" }, 400);
    }

    try {
      if (action === "encode") {
        const standard = Buffer.from(data, "utf-8").toString("base64");
        const urlSafe = standard.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        return c.json({
          result: standard,
          urlSafe,
          action: "encode",
          inputLength: data.length,
          outputLength: standard.length,
        });
      } else {
        // Handle both standard and URL-safe base64
        let normalized = data.replace(/-/g, "+").replace(/_/g, "/");
        while (normalized.length % 4) normalized += "=";
        const decoded = Buffer.from(normalized, "base64").toString("utf-8");
        return c.json({
          result: decoded,
          action: "decode",
          inputLength: data.length,
          outputLength: decoded.length,
        });
      }
    } catch (e: any) {
      return c.json({ error: `Failed to ${action}: ${e.message}` }, 400);
    }
  });
}
