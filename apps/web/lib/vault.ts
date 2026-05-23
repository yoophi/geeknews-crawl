import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import matter from "gray-matter";

const VAULT_DIR = resolve(process.cwd(), "..", "..", "vault");

export interface TopicSummary {
  id: number;
  title: string;
  domain: string | null;
  author: string | null;
  points: number;
  comments_count: number;
  posted_at: string | null;
  tags: string[];
  auto_tags: string[];
  favorited: boolean;
  relPath: string;
}

export interface TopicDetail extends TopicSummary {
  url: string | null;
  content: string;
  commentsMarkdown: string | null;
  related: string[];
}

function coerceFm(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return out;
}

function asSummary(rel: string, data: Record<string, unknown>): TopicSummary {
  return {
    id: Number(data.id),
    title: String(data.title ?? "(no title)"),
    domain: (data.domain as string | null | undefined) ?? null,
    author: (data.author as string | null | undefined) ?? null,
    points: Number(data.points ?? 0),
    comments_count: Number(data.comments_count ?? 0),
    posted_at: (data.posted_at as string | null | undefined) ?? null,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    auto_tags: Array.isArray(data.auto_tags) ? (data.auto_tags as string[]) : [],
    favorited: Boolean(data.favorited),
    relPath: rel,
  };
}

export async function listTopics(opts: { limit?: number; tag?: string; favorited?: boolean } = {}): Promise<TopicSummary[]> {
  const root = join(VAULT_DIR, "topics");
  const out: TopicSummary[] = [];
  let years: string[];
  try {
    years = await readdir(root);
  } catch {
    return out;
  }
  for (const y of years.sort().reverse()) {
    let months: string[];
    try {
      months = await readdir(join(root, y));
    } catch {
      continue;
    }
    for (const m of months.sort().reverse()) {
      let files: string[];
      try {
        files = await readdir(join(root, y, m));
      } catch {
        continue;
      }
      for (const f of files) {
        if (!f.endsWith(".md")) continue;
        const rel = `topics/${y}/${m}/${f}`;
        const raw = await readFile(join(root, y, m, f), "utf8");
        const data = coerceFm(matter(raw).data);
        const s = asSummary(rel, data);
        if (opts.tag && !s.tags.includes(opts.tag) && !s.auto_tags.includes(opts.tag)) continue;
        if (opts.favorited && !s.favorited) continue;
        out.push(s);
      }
    }
  }
  out.sort((a, b) => (b.posted_at ?? "").localeCompare(a.posted_at ?? ""));
  return opts.limit ? out.slice(0, opts.limit) : out;
}

export async function getTopic(id: number): Promise<TopicDetail | null> {
  const root = join(VAULT_DIR, "topics");
  let years: string[];
  try {
    years = await readdir(root);
  } catch {
    return null;
  }
  for (const y of years) {
    const months = await readdir(join(root, y)).catch(() => [] as string[]);
    for (const m of months) {
      const files = await readdir(join(root, y, m)).catch(() => [] as string[]);
      const hit = files.find((f) => f.startsWith(`${id}-`) && f.endsWith(".md"));
      if (hit) {
        const rel = `topics/${y}/${m}/${hit}`;
        const raw = await readFile(join(root, y, m, hit), "utf8");
        const parsed = matter(raw);
        const data = coerceFm(parsed.data);
        const summary = asSummary(rel, data);
        const commentsPath = join(VAULT_DIR, "comments", `${id}.md`);
        let commentsMarkdown: string | null = null;
        try {
          const cRaw = await readFile(commentsPath, "utf8");
          commentsMarkdown = matter(cRaw).content;
        } catch {
          /* no comments file */
        }
        return {
          ...summary,
          url: (data.url as string | null | undefined) ?? null,
          content: parsed.content,
          commentsMarkdown,
          related: Array.isArray(data.related) ? (data.related as string[]) : [],
        };
      }
    }
  }
  return null;
}

export async function loadGraphJson(): Promise<unknown | null> {
  try {
    const raw = await readFile(join(VAULT_DIR, "_index", "graph.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function rewriteWikilinks(md: string): string {
  return md.replace(/\[\[(\d+)(?:-([^\]]*))?\]\]/g, (_, id, slug) => {
    const label = slug ? `${id}-${slug}` : id;
    return `[${label}](/topic/${id})`;
  });
}
