import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function GET() {
  const sw = await readFile(
    // eslint-disable-next-line no-undef
    fileURLToPath(new URL("./noop-service-worker.js", import.meta.url)),
    {
      encoding: "utf8",
    },
  );

  // eslint-disable-next-line no-undef
  const headers = new Headers();
  headers.append("content-type", "application/javascript;charset=utf-8");
  // eslint-disable-next-line no-undef
  return new Response(sw, { headers });
}
