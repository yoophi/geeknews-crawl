import { resolve } from "node:path";

const env = process.env;

export const config = {
  baseUrl: env.BASE_URL ?? "https://news.hada.io",
  userAgent:
    env.USER_AGENT ??
    "geeknews-crawl/0.1 (+https://github.com/yoophi/geeknews-crawl)",
  requestIntervalMs: Number(env.REQUEST_INTERVAL_MS ?? 1000),
  vaultDir: resolve(env.VAULT_DIR ?? "./vault"),
  cookieFile: env.COOKIE_FILE || null,
} as const;
