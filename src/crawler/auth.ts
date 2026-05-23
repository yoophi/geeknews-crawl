import { readFile } from "node:fs/promises";
import { config } from "../lib/config.ts";
import { fetchText } from "./fetcher.ts";

export interface NavState {
  ok: boolean;
  logged_in: boolean;
  userid?: string | number;
  username?: string;
}

export async function loadCookieHeader(): Promise<string | null> {
  if (process.env.COOKIE_HEADER) return process.env.COOKIE_HEADER.trim();
  if (!config.cookieFile) return null;
  const raw = await readFile(config.cookieFile, "utf8").catch(() => null);
  if (!raw) return null;
  const trimmed = raw.trim();
  // JSON object form: { "name": "value", ... }
  if (trimmed.startsWith("{")) {
    try {
      const obj = JSON.parse(trimmed) as Record<string, string>;
      return Object.entries(obj)
        .map(([k, v]) => `${k}=${v}`)
        .join("; ");
    } catch {
      /* fall through */
    }
  }
  // Netscape cookies.txt format
  const lines = trimmed
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"));
  const pairs: string[] = [];
  for (const line of lines) {
    const cols = line.split("\t");
    if (cols.length >= 7 && cols[5] && cols[6]) {
      pairs.push(`${cols[5]}=${cols[6]}`);
    }
  }
  if (pairs.length > 0) return pairs.join("; ");
  // single-line header form: "k=v; k=v"
  if (trimmed.includes("=")) return trimmed;
  return null;
}

export async function fetchNavState(cookieHeader: string): Promise<NavState> {
  const { body } = await fetchText("/auth/nav-state", { cookieHeader });
  return JSON.parse(body) as NavState;
}
