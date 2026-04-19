import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

export function registerRoutes(app: Hono) {
  app.post("/api/encode", async (c) => {
    await tryRequirePayment(0.001);
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
