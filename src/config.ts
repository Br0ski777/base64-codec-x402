import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "base64-codec",
  slug: "base64-codec",
  description: "Encode and decode base64 strings with support for URL-safe variants.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/encode",
      price: "$0.001",
      description: "Encode or decode base64 data",
      toolName: "utility_encode_base64",
      toolDescription: "Use this when you need to encode text to base64 or decode base64 back to text. Supports standard and URL-safe base64 variants. Returns the encoded/decoded string and metadata. Do NOT use for hashing — use crypto_generate_hash instead. Do NOT use for JWT decoding — use security_decode_jwt instead.",
      inputSchema: {
        type: "object",
        properties: {
          data: { type: "string", description: "The data to encode or decode" },
          action: { type: "string", description: "Action: 'encode' or 'decode' (default: encode)" },
        },
        required: ["data"],
      },
    },
  ],
};
