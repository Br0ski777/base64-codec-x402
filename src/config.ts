import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "base64-codec",
  slug: "base64-codec",
  description: "Encode text to base64 or decode base64 to text. Supports standard and URL-safe variants with metadata.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/encode",
      price: "$0.001",
      description: "Encode or decode base64 data",
      toolName: "utility_encode_base64",
      toolDescription: `Use this when you need to encode text to base64 or decode base64 back to plaintext. Returns the result string with encoding metadata.

1. result -- the encoded or decoded string
2. action -- whether encode or decode was performed
3. inputLength -- character count of the input
4. outputLength -- character count of the output
5. urlSafe -- boolean indicating if URL-safe variant was used

Example output: {"result":"SGVsbG8gV29ybGQ=","action":"encode","inputLength":11,"outputLength":16,"urlSafe":false}

Use this FOR embedding binary data in JSON, preparing email attachments (MIME), or decoding base64 tokens from APIs. Use this BEFORE sending data through channels that only support ASCII.

Do NOT use for hashing -- use crypto_generate_hash instead. Do NOT use for JWT decoding -- use security_decode_jwt instead. Do NOT use for URL slug creation -- use text_generate_slug instead.`,
      inputSchema: {
        type: "object",
        properties: {
          data: { type: "string", description: "The data to encode or decode" },
          action: { type: "string", description: "Action: 'encode' or 'decode' (default: encode)" },
        },
        required: ["data"],
      },
      outputSchema: {
          "type": "object",
          "properties": {
            "result": {
              "type": "string",
              "description": "Encoded or decoded result"
            },
            "urlSafe": {
              "type": "string",
              "description": "URL-safe base64 variant (encode only)"
            },
            "action": {
              "type": "string",
              "description": "Action performed (encode or decode)"
            },
            "inputLength": {
              "type": "number",
              "description": "Input string length"
            },
            "outputLength": {
              "type": "number",
              "description": "Output string length"
            }
          },
          "required": [
            "result",
            "action",
            "inputLength",
            "outputLength"
          ]
        },
    },
  ],
};
