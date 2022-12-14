import { readFile } from "node:fs/promises";

export async function get() {
  const sw = await readFile(
    new URL("./noop-service-worker.js", import.meta.url).pathname,
    { encoding: "utf8" }
  );
  return {
    body: sw,
  };
}
