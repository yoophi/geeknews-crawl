import { gzip } from "node:zlib";
import { promisify } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { config } from "../lib/config.ts";

const gzipP = promisify(gzip);

export async function saveRawHtml(id: number, html: string): Promise<string> {
  const rel = `_attachments/raw/${id}.html.gz`;
  const abs = join(config.vaultDir, rel);
  await mkdir(dirname(abs), { recursive: true });
  const compressed = await gzipP(Buffer.from(html, "utf8"));
  await writeFile(abs, compressed);
  return rel;
}
