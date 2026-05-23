import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import matter from "gray-matter";
import { stringify as yamlStringify } from "yaml";
import { config } from "../lib/config.ts";
import { TopicFrontmatter } from "../lib/schema.ts";
import type { ParsedUpstream } from "./parser.ts";
import { buildFrontmatter } from "./parser.ts";
import { slugify, topicFilePath } from "../lib/slug.ts";

const USER_NOTES_MARKER = "<!-- USER:NOTES -->";
const DEFAULT_USER_SECTION = `${USER_NOTES_MARKER}\n## 내 메모\n\n`;

export interface WriteResult {
  topicPath: string;
  commentsPath: string | null;
  created: boolean;
}

async function findExistingTopicPath(id: number): Promise<string | null> {
  const root = join(config.vaultDir, "topics");
  try {
    const years = await readdir(root);
    for (const y of years) {
      const yDir = join(root, y);
      let months: string[];
      try {
        months = await readdir(yDir);
      } catch {
        continue;
      }
      for (const m of months) {
        const mDir = join(yDir, m);
        let files: string[];
        try {
          files = await readdir(mDir);
        } catch {
          continue;
        }
        const hit = files.find((f) => f.startsWith(`${id}-`) && f.endsWith(".md"));
        if (hit) return join("topics", y, m, hit);
      }
    }
  } catch {
    /* topics dir may not exist yet */
  }
  return null;
}

function coerceDates(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return out;
}

async function readPreserved(
  absPath: string,
): Promise<{ fm: Partial<TopicFrontmatter>; userSection: string | null } | null> {
  try {
    const raw = await readFile(absPath, "utf8");
    const parsed = matter(raw);
    const coerced = coerceDates(parsed.data as Record<string, unknown>);
    const fm = TopicFrontmatter.partial().parse(coerced);
    const idx = parsed.content.indexOf(USER_NOTES_MARKER);
    const userSection = idx >= 0 ? parsed.content.slice(idx) : null;
    return { fm, userSection };
  } catch {
    return null;
  }
}

function renderTopicFile(
  fm: TopicFrontmatter,
  parsed: ParsedUpstream,
  userSection: string,
): string {
  const yaml = yamlStringify(fm, { lineWidth: 0 }).trimEnd();
  const body = [
    `---\n${yaml}\n---`,
    "",
    "## 요약",
    parsed.summary || "_(요약 없음)_",
    "",
    "## 본문",
    parsed.topicBody || "_(본문 없음)_",
    "",
    userSection.trimEnd(),
    "",
  ].join("\n");
  return body;
}

function renderCommentsFile(id: number, parsed: ParsedUpstream): string {
  const fm = {
    topic_id: id,
    comments_count: parsed.meta.commentsCount,
    fetched_at: new Date().toISOString(),
  };
  const yaml = yamlStringify(fm, { lineWidth: 0 }).trimEnd();
  return [
    `---\n${yaml}\n---`,
    "",
    `# 댓글: ${parsed.meta.title}`,
    "",
    `> 토픽: [[${id}]]`,
    "",
    parsed.commentsSection || "_(댓글 없음)_",
    "",
  ].join("\n");
}

export async function writeTopic(
  id: number,
  parsed: ParsedUpstream,
): Promise<WriteResult> {
  const existingRel = await findExistingTopicPath(id);
  const slug = slugify(parsed.meta.title);
  const rel = existingRel ?? topicFilePath(id, slug, parsed.meta.published);
  const abs = join(config.vaultDir, rel);

  const existing = existingRel ? await readPreserved(abs) : null;
  const fm = buildFrontmatter(id, parsed, existing?.fm ?? null);
  const userSection = existing?.userSection ?? DEFAULT_USER_SECTION;

  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, renderTopicFile(fm, parsed, userSection), "utf8");

  let commentsRel: string | null = null;
  if (parsed.commentsSection.trim()) {
    commentsRel = `comments/${id}.md`;
    const cAbs = join(config.vaultDir, commentsRel);
    await mkdir(dirname(cAbs), { recursive: true });
    await writeFile(cAbs, renderCommentsFile(id, parsed), "utf8");
  }

  return { topicPath: rel, commentsPath: commentsRel, created: !existingRel };
}
