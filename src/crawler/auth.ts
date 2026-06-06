import { readFile } from "node:fs/promises";
import { fetch as undiciFetch } from "undici";
import { config } from "../lib/config.ts";
import { fetchText } from "./fetcher.ts";

export interface NavState {
  ok: boolean;
  logged_in: boolean;
  userid?: string | number;
  username?: string;
}

export async function loadCookieHeader(): Promise<string | null> {
  if (process.env.COOKIE_HEADER?.trim()) return process.env.COOKIE_HEADER.trim();
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
  const lines = trimmed.split(/\r?\n/).filter((l) => l && !l.startsWith("#"));
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

/**
 * POST /auth/gn_login with GEEKNEWS_USERID/PASSWORD and return the fresh
 * session cookie header (PHPSESSID + remember_me) from Set-Cookie.
 */
export async function login(): Promise<string> {
  const userid = process.env.GEEKNEWS_USERID;
  const password = process.env.GEEKNEWS_PASSWORD;
  if (!userid || !password) {
    throw new Error("GEEKNEWS_USERID / GEEKNEWS_PASSWORD not set in .env");
  }
  const res = await undiciFetch(`${config.baseUrl}/auth/gn_login`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "User-Agent": config.userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: config.baseUrl,
      Referer: `${config.baseUrl}/login`,
    },
    body: new URLSearchParams({ userid, password, remember: "on" }).toString(),
  });
  const setCookies = res.headers.getSetCookie?.() ?? [];
  const pairs = setCookies
    .map((c) => c.split(";")[0]!.trim())
    .filter((p) => p.includes("="));
  if (res.status !== 302 || pairs.length === 0) {
    throw new Error(`login failed (status ${res.status}). Check credentials in .env`);
  }
  return pairs.join("; ");
}

/**
 * Resolve an AUTHENTICATED cookie header:
 * 1. COOKIE_HEADER / COOKIE_FILE if still valid,
 * 2. otherwise auto-login with GEEKNEWS_USERID/PASSWORD.
 * Returns { cookieHeader, nav } or throws with a clear message.
 */
export async function getAuthCookieHeader(): Promise<{ cookieHeader: string; nav: NavState }> {
  const manual = await loadCookieHeader();
  if (manual) {
    const nav = await fetchNavState(manual);
    if (nav.ok && nav.logged_in) return { cookieHeader: manual, nav };
    console.log("stored cookie is expired/anonymous — attempting auto-login...");
  }
  const fresh = await login();
  const nav = await fetchNavState(fresh);
  if (!nav.ok || !nav.logged_in) {
    throw new Error("auto-login succeeded but session is not authenticated — site behavior changed?");
  }
  console.log(`auto-login ok (userid=${nav.userid})`);
  return { cookieHeader: fresh, nav };
}
