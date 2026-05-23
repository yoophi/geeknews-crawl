import { parseArgs } from "node:util";
import { mkdir, readdir, writeFile, appendFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "../lib/config.ts";
import { fetchText, FetchError } from "../crawler/fetcher.ts";
import { parseUpstreamMarkdown } from "../crawler/parser.ts";
import { writeTopic } from "../crawler/writer.ts";
import { saveRawHtml } from "../crawler/raw-store.ts";
import {
  discoverFromIndex,
  discoverFromRss,
  getCurrentMaxId,
  loadState,
  saveState,
} from "../crawler/discovery.ts";

interface RunOptions {
  saveHtml: boolean;
  refresh: boolean;
  onProgress?: (ev: ProgressEvent) => void;
}

type ProgressEvent =
  | { kind: "fetched"; id: number; postedAt: string | null; path: string; created: boolean }
  | { kind: "skipped"; id: number; reason: string }
  | { kind: "missing"; id: number; status: number }
  | { kind: "error"; id: number; message: string };

const usage = `
Usage:
  pnpm crawl backfill [--months N] [--max-id N] [--min-id N] [--save-html] [--refresh]
  pnpm crawl incremental [--save-html] [--refresh]
  pnpm crawl ids <START-END | id,id,...> [--save-html] [--refresh]
`.trim();

async function main() {
  const args = process.argv.slice(2);
  const sub = args[0];
  const rest = args.slice(1);

  if (!sub || sub === "-h" || sub === "--help") {
    console.log(usage);
    process.exit(sub ? 0 : 1);
  }

  if (sub === "backfill") return cmdBackfill(rest);
  if (sub === "incremental") return cmdIncremental(rest);
  if (sub === "ids") return cmdIds(rest);
  console.error(`unknown command: ${sub}\n${usage}`);
  process.exit(1);
}

function parseCommonFlags(rest: string[]) {
  return parseArgs({
    args: rest,
    options: {
      months: { type: "string" },
      "max-id": { type: "string" },
      "min-id": { type: "string" },
      "save-html": { type: "boolean", default: false },
      refresh: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });
}

async function cmdBackfill(rest: string[]) {
  const { values } = parseCommonFlags(rest);
  const months = Number(values.months ?? 12);
  const startId = values["max-id"] ? Number(values["max-id"]) : await getCurrentMaxId();
  const minId = values["min-id"] ? Number(values["min-id"]) : 1;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  console.log(`backfill: ${startId} → ${minId}, cutoff=${cutoff.toISOString()}`);

  const state = await loadState();
  const existing = await loadExistingIds();
  const opts: RunOptions = { saveHtml: !!values["save-html"], refresh: !!values.refresh };
  let consecutiveMiss = 0;
  const maxConsecutiveMiss = 30;

  for (let id = startId; id >= minId; id--) {
    if (!opts.refresh && existing.has(id)) {
      log({ kind: "skipped", id, reason: "exists" });
      continue;
    }
    try {
      const result = await fetchAndWrite(id, opts);
      if (result.kind === "fetched") {
        consecutiveMiss = 0;
        const postedAt = result.postedAt ? new Date(result.postedAt) : null;
        if (postedAt && postedAt < cutoff) {
          console.log(`reached cutoff at id=${id} (${result.postedAt}). stopping.`);
          break;
        }
      } else if (result.kind === "missing") {
        consecutiveMiss++;
        if (consecutiveMiss >= maxConsecutiveMiss) {
          console.log(`stopping: ${consecutiveMiss} consecutive missing ids`);
          break;
        }
      }
    } catch (e) {
      await logError(id, e);
    }
    if (id % 50 === 0) {
      state.last_run_at = new Date().toISOString();
      await saveState(state);
    }
  }

  state.last_max_id = Math.max(state.last_max_id, startId);
  state.last_run_at = new Date().toISOString();
  await saveState(state);
}

async function cmdIncremental(rest: string[]) {
  const { values } = parseCommonFlags(rest);
  const opts: RunOptions = { saveHtml: !!values["save-html"], refresh: !!values.refresh };
  const state = await loadState();
  const fromRss = await discoverFromRss();
  const fromIndex = await discoverFromIndex(3);
  const all = new Set<number>([...fromRss, ...fromIndex]);
  const ids = [...all].sort((a, b) => b - a);
  console.log(`incremental: ${ids.length} candidate ids`);
  const existing = await loadExistingIds();
  for (const id of ids) {
    if (!opts.refresh && existing.has(id)) {
      log({ kind: "skipped", id, reason: "exists" });
      continue;
    }
    try {
      await fetchAndWrite(id, opts);
    } catch (e) {
      await logError(id, e);
    }
  }
  state.last_max_id = Math.max(state.last_max_id, ids[0] ?? 0);
  state.last_run_at = new Date().toISOString();
  await saveState(state);
}

async function cmdIds(rest: string[]) {
  const { values, positionals } = parseCommonFlags(rest);
  const opts: RunOptions = { saveHtml: !!values["save-html"], refresh: !!values.refresh };
  const spec = positionals[0];
  if (!spec) {
    console.error("ids: missing range or list");
    process.exit(1);
  }
  const ids = parseIdSpec(spec);
  console.log(`ids: ${ids.length} targets`);
  const existing = await loadExistingIds();
  for (const id of ids) {
    if (!opts.refresh && existing.has(id)) {
      log({ kind: "skipped", id, reason: "exists" });
      continue;
    }
    try {
      await fetchAndWrite(id, opts);
    } catch (e) {
      await logError(id, e);
    }
  }
}

function parseIdSpec(spec: string): number[] {
  if (spec.includes("-")) {
    const [a, b] = spec.split("-").map((s) => Number.parseInt(s, 10));
    if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error(`bad range: ${spec}`);
    const [lo, hi] = a! <= b! ? [a!, b!] : [b!, a!];
    const out: number[] = [];
    for (let i = hi; i >= lo; i--) out.push(i);
    return out;
  }
  return spec.split(",").map((s) => Number.parseInt(s.trim(), 10)).filter(Number.isFinite);
}

async function fetchAndWrite(
  id: number,
  opts: RunOptions,
): Promise<
  | { kind: "fetched"; postedAt: string | null; path: string }
  | { kind: "missing"; status: number }
> {
  try {
    const { body } = await fetchText(`/topic/${id}.md`);
    const parsed = parseUpstreamMarkdown(body);
    if (opts.saveHtml) {
      try {
        const { body: html } = await fetchText(`/topic?id=${id}`);
        await saveRawHtml(id, html);
      } catch {
        /* html backup is best-effort */
      }
    }
    const result = await writeTopic(id, parsed);
    log({
      kind: "fetched",
      id,
      postedAt: parsed.meta.published,
      path: result.topicPath,
      created: result.created,
    });
    return { kind: "fetched", postedAt: parsed.meta.published, path: result.topicPath };
  } catch (e) {
    if (e instanceof FetchError && (e.status === 404 || e.status === 410)) {
      log({ kind: "missing", id, status: e.status });
      return { kind: "missing", status: e.status };
    }
    throw e;
  }
}

async function loadExistingIds(): Promise<Set<number>> {
  const out = new Set<number>();
  const root = join(config.vaultDir, "topics");
  try {
    const years = await readdir(root);
    for (const y of years) {
      const months = await readdir(join(root, y)).catch(() => [] as string[]);
      for (const m of months) {
        const files = await readdir(join(root, y, m)).catch(() => [] as string[]);
        for (const f of files) {
          const match = f.match(/^(\d+)-/);
          if (match) out.add(Number.parseInt(match[1]!, 10));
        }
      }
    }
  } catch {
    /* topics dir may not exist yet */
  }
  return out;
}

function log(ev: ProgressEvent) {
  const ts = new Date().toISOString();
  if (ev.kind === "fetched") {
    console.log(`[${ts}] ✓ ${ev.id} → ${ev.path}${ev.created ? "" : " (update)"}`);
  } else if (ev.kind === "skipped") {
    console.log(`[${ts}] · ${ev.id} skipped (${ev.reason})`);
  } else if (ev.kind === "missing") {
    console.log(`[${ts}] ✗ ${ev.id} ${ev.status}`);
  } else {
    console.log(`[${ts}] ! ${ev.id} ${ev.message}`);
  }
}

async function logError(id: number, e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  log({ kind: "error", id, message: msg });
  const p = join(config.vaultDir, "_state", "crawl-errors.log");
  await mkdir(join(config.vaultDir, "_state"), { recursive: true });
  await appendFile(p, `${new Date().toISOString()}\t${id}\t${msg}\n`, "utf8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
