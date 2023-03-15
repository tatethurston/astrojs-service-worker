import { readFile } from "node:fs/promises";
import * as url from 'url';

export async function get() {
    const sw = await readFile(
    // eslint-disable-next-line no-undef
    url.fileURLToPath(import.meta.url), { encoding: "utf8" });
    return {
        body: sw,
    };
}