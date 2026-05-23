import { setTimeout as sleep } from "node:timers/promises";
import { fetch as undiciFetch } from "undici";
import { config } from "../lib/config.ts";

export interface FetchOptions {
  retries?: number;
  retryDelayMs?: number;
  signal?: AbortSignal;
  cookieHeader?: string;
}

let lastRequestAt = 0;

async function throttle() {
  const elapsed = Date.now() - lastRequestAt;
  const wait = config.requestIntervalMs - elapsed;
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

export class FetchError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
    message: string,
  ) {
    super(message);
  }
}

export async function fetchText(
  pathOrUrl: string,
  opts: FetchOptions = {},
): Promise<{ body: string; status: number; finalUrl: string }> {
  const url = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${config.baseUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
  const retries = opts.retries ?? 3;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    await throttle();
    try {
      const headers: Record<string, string> = {
        "User-Agent": config.userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko,en;q=0.8",
      };
      if (opts.cookieHeader) headers.Cookie = opts.cookieHeader;
      const res = await undiciFetch(url, {
        method: "GET",
        headers,
        signal: opts.signal,
        redirect: "follow",
      });
      const status = res.status;
      const body = await res.text();
      if (status >= 500 || status === 429) {
        throw new FetchError(status, url, `transient ${status}`);
      }
      if (status >= 400) {
        throw new FetchError(status, url, `http ${status}`);
      }
      return { body, status, finalUrl: url };
    } catch (err) {
      lastErr = err;
      const isTransient =
        err instanceof FetchError ? err.status >= 500 || err.status === 429 : true;
      if (attempt === retries || !isTransient) throw err;
      const delay = (opts.retryDelayMs ?? 1000) * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
  throw lastErr;
}
