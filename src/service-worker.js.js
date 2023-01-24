import { readFile } from "node:fs/promises";

export async function get() {
  const sw = await readFile(
    // eslint-disable-next-line no-undef
    new URL("./noop-service-worker.js", import.meta.url).pathname,
    { encoding: "utf8" }
  );
  return {
    body: sw,
  };
}
