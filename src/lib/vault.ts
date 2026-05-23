import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { stringify as yamlStringify } from "yaml";
import { config } from "./config.ts";
import { TopicFrontmatter } from "./schema.ts";

export interface TopicFile {
  id: number;
  relPath: string;
  absPath: string;
  raw: string;
  data: Record<string, unknown>;
  content: string;
}

export async function* iterTopicFiles(): AsyncGenerator<TopicFile> {
  const root = join(config.vaultDir, "topics");
  let years: string[];
  try {
    years = await readdir(root);
  } catch {
    return;
  }
  for (const y of years.sort()) {
    let months: string[];
    try {
      months = await readdir(join(root, y));
    } catch {
      continue;
    }
    for (const m of months.sort()) {
      const dir = join(root, y, m);
      let files: string[];
      try {
        files = await readdir(dir);
      } catch {
        continue;
      }
      for (const f of files.sort()) {
        if (!f.endsWith(".md")) continue;
        const match = f.match(/^(\d+)-/);
        if (!match) continue;
        const id = Number.parseInt(match[1]!, 10);
        const absPath = join(dir, f);
        const relPath = `topics/${y}/${m}/${f}`;
        const raw = await readFile(absPath, "utf8");
        const parsed = matter(raw);
        yield { id, relPath, absPath, raw, data: parsed.data, content: parsed.content };
      }
    }
  }
}

export function coerceDates(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return out;
}

export async function findTopicById(id: number): Promise<TopicFile | null> {
  for await (const tf of iterTopicFiles()) {
    if (tf.id === id) return tf;
  }
  return null;
}

export async function rewriteTopicFile(
  tf: TopicFile,
  mutate: (data: Record<string, unknown>, content: string) => { data: Record<string, unknown>; content: string },
): Promise<void> {
  const next = mutate(coerceDates(tf.data), tf.content);
  const yaml = yamlStringify(next.data, { lineWidth: 0 }).trimEnd();
  const out = `---\n${yaml}\n---\n${next.content.startsWith("\n") ? "" : "\n"}${next.content}`;
  await writeFile(tf.absPath, out, "utf8");
}

export function validateFrontmatter(
  data: Record<string, unknown>,
): { ok: true } | { ok: false; error: string } {
  const result = TopicFrontmatter.safeParse(coerceDates(data));
  if (result.success) return { ok: true };
  return { ok: false, error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
}

const WIKILINK_RE = /\[\[(\d+)(?:-[^\]]*)?\]\]/g;

export function extractWikilinkIds(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(WIKILINK_RE)) {
    const id = Number.parseInt(m[1]!, 10);
    if (Number.isFinite(id)) out.push(id);
  }
  return out;
}
