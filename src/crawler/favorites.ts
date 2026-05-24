import { fetchText } from "./fetcher.ts";

const TOPIC_ROW_ID_RE = /data-topic-state-id=['"](\d+)['"]/g;

export interface CollectFavOpts {
  cookieHeader?: string;
  maxPages?: number;
  onPage?: (page: number, ids: number[], total: number) => void;
}

export async function collectFavedIds(
  userid: string,
  opts: CollectFavOpts = {},
): Promise<number[]> {
  const all = new Set<number>();
  const maxPages = opts.maxPages ?? 500;
  for (let page = 1; page <= maxPages; page++) {
    const path =
      page === 1
        ? `/faved_topics?userid=${encodeURIComponent(userid)}`
        : `/faved_topics?userid=${encodeURIComponent(userid)}&page=${page}`;
    const { body } = await fetchText(path, { cookieHeader: opts.cookieHeader });

    const idsOnPage: number[] = [];
    for (const m of body.matchAll(TOPIC_ROW_ID_RE)) {
      const id = Number.parseInt(m[1]!, 10);
      if (Number.isFinite(id) && id > 0) idsOnPage.push(id);
    }
    if (idsOnPage.length === 0) {
      opts.onPage?.(page, [], all.size);
      break;
    }
    const before = all.size;
    for (const id of idsOnPage) all.add(id);
    opts.onPage?.(page, idsOnPage, all.size);
    if (all.size === before) break; // no new IDs => looped or duplicate page
  }
  return [...all].sort((a, b) => b - a);
}
