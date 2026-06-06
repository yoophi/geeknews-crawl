import { fetchText, FetchError } from "./fetcher.ts";

export interface TopicViewerState {
  vote?: string | null;
  fav?: string | null;
  flag?: string | null;
  dead?: string | null;
  [key: string]: unknown;
}

export interface ViewerStatesResponse {
  ok: boolean;
  logged_in: boolean;
  userid?: string | number;
  states?: Record<string, TopicViewerState>;
}

/**
 * Authoritative per-topic favorite state via the authenticated viewer API.
 * Unlike /faved_topics (capped at ~400 most-recent items), this answers for
 * arbitrary topic IDs — use it for full-vault reconciliation/recovery.
 */
export async function fetchViewerStates(
  ids: number[],
  cookieHeader: string,
  opts: { batchSize?: number; onBatch?: (done: number, total: number) => void } = {},
): Promise<Map<number, TopicViewerState>> {
  const batchSize = opts.batchSize ?? 100;
  const result = new Map<number, TopicViewerState>();
  for (let i = 0; i < ids.length; i += batchSize) {
    const chunk = ids.slice(i, i + batchSize);
    const { body } = await fetchText(`/api/viewer/topics?ids=${chunk.join(",")}`, {
      cookieHeader,
    });
    const payload = JSON.parse(body) as ViewerStatesResponse;
    if (!payload.ok || !payload.logged_in) {
      throw new Error("viewer API returned not-logged-in. Cookie expired?");
    }
    for (const [k, v] of Object.entries(payload.states ?? {})) {
      result.set(Number.parseInt(k, 10), v);
    }
    opts.onBatch?.(Math.min(i + batchSize, ids.length), ids.length);
  }
  return result;
}

export function isFavorited(state: TopicViewerState | undefined): boolean {
  if (!state) return false;
  const v = state.fav;
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v !== "" && v !== "0" && v !== "false";
  return Boolean(v);
}

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
    let body: string;
    try {
      ({ body } = await fetchText(path, { cookieHeader: opts.cookieHeader }));
    } catch (e) {
      // past-the-end pages return 404 — treat as end of pagination
      if (e instanceof FetchError && (e.status === 404 || e.status === 410)) {
        opts.onPage?.(page, [], all.size);
        break;
      }
      throw e;
    }

    const idsOnPage: number[] = [];
    for (const m of body.matchAll(TOPIC_ROW_ID_RE)) {
      const id = Number.parseInt(m[1]!, 10);
      if (Number.isFinite(id) && id > 0) idsOnPage.push(id);
    }
    const before = all.size;
    for (const id of idsOnPage) all.add(id);
    opts.onPage?.(page, idsOnPage, all.size);
    // stop on an empty page or when a page yields nothing new (loop/duplicate)
    if (all.size === before) break;
  }
  return [...all].sort((a, b) => b - a);
}
