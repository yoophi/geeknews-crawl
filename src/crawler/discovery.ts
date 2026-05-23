import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { CrawlState } from "../lib/schema.ts";
import type { CrawlState as CrawlStateT } from "../lib/schema.ts";
import { config } from "../lib/config.ts";
import { fetchText } from "./fetcher.ts";

const STATE_PATH = () => join(config.vaultDir, "_state", "crawl-state.json");

const TOPIC_ID_RE = /topic\?id=(\d+)/g;

export async function loadState(): Promise<CrawlStateT> {
  try {
    const raw = await readFile(STATE_PATH(), "utf8");
    return CrawlState.parse(JSON.parse(raw));
  } catch {
    return CrawlState.parse({});
  }
}

export async function saveState(state: CrawlStateT): Promise<void> {
  const p = STATE_PATH();
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify(state, null, 2), "utf8");
}

function extractIds(text: string): number[] {
  const found = new Set<number>();
  for (const m of text.matchAll(TOPIC_ID_RE)) {
    const id = Number.parseInt(m[1]!, 10);
    if (Number.isFinite(id) && id > 0) found.add(id);
  }
  return [...found].sort((a, b) => b - a);
}

export async function discoverFromRss(): Promise<number[]> {
  const { body } = await fetchText("/rss/news");
  return extractIds(body);
}

export async function discoverFromIndex(maxPages = 5): Promise<number[]> {
  const all = new Set<number>();
  for (let p = 1; p <= maxPages; p++) {
    const path = p === 1 ? "/" : `/?page=${p}`;
    try {
      const { body } = await fetchText(path);
      const ids = extractIds(body);
      if (ids.length === 0) break;
      for (const id of ids) all.add(id);
    } catch {
      break;
    }
  }
  return [...all].sort((a, b) => b - a);
}

export async function getCurrentMaxId(): Promise<number> {
  const ids = await discoverFromRss();
  if (ids.length === 0) throw new Error("RSS returned no topic IDs");
  return ids[0]!;
}
