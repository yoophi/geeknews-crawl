import { fetchText } from "./fetcher.ts";

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

const DEFAULT_BATCH = 100;

export async function fetchViewerStates(
  ids: number[],
  cookieHeader: string,
  batchSize = DEFAULT_BATCH,
): Promise<Map<number, TopicViewerState>> {
  const result = new Map<number, TopicViewerState>();
  for (let i = 0; i < ids.length; i += batchSize) {
    const chunk = ids.slice(i, i + batchSize);
    const { body } = await fetchText(
      `/api/viewer/topics?ids=${chunk.join(",")}`,
      { cookieHeader },
    );
    const payload = JSON.parse(body) as ViewerStatesResponse;
    if (!payload.ok || !payload.logged_in) {
      throw new Error("API returned not-logged-in. Cookie expired?");
    }
    for (const [k, v] of Object.entries(payload.states ?? {})) {
      result.set(Number.parseInt(k, 10), v);
    }
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
