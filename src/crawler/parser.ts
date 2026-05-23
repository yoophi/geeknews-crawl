import type { TopicFrontmatter } from "../lib/schema.ts";

export interface ParsedUpstream {
  meta: {
    title: string;
    htmlUrl: string | null;
    mdUrl: string | null;
    type: string | null;
    author: string | null;
    published: string | null;
    updated: string | null;
    originalSourceUrl: string | null;
    originalSourceName: string | null;
    points: number;
    commentsCount: number;
  };
  summary: string;
  topicBody: string;
  commentsSection: string;
}

const META_PATTERNS = {
  htmlUrl: /^- GeekNews HTML: \[(?<url>[^\]]+)\]/m,
  mdUrl: /^- GeekNews Markdown: \[(?<url>[^\]]+)\]/m,
  type: /^- Type: (?<v>.+)$/m,
  authorLine: /^- Author: \[(?<name>[^\]]+)\]/m,
  published: /^- Published: (?<v>.+)$/m,
  updated: /^- Updated: (?<v>.+)$/m,
  originalSource: /^- Original source: \[(?<name>[^\]]+)\]\((?<url>[^)]+)\)/m,
  points: /^- Points: (?<v>\d+)/m,
  comments: /^- Comments: (?<v>\d+)/m,
};

function pick(text: string, re: RegExp, group = "v"): string | null {
  const m = text.match(re);
  return m?.groups?.[group] ?? null;
}

function pickInt(text: string, re: RegExp): number {
  const v = pick(text, re);
  return v ? Number.parseInt(v, 10) : 0;
}

function sliceBetween(
  body: string,
  startHeader: string,
  nextHeaders: string[],
): string {
  const startRe = new RegExp(`^${escapeRe(startHeader)}\\s*$`, "m");
  const startMatch = body.match(startRe);
  if (!startMatch || startMatch.index === undefined) return "";
  const startIdx = startMatch.index + startMatch[0].length;
  let endIdx = body.length;
  for (const h of nextHeaders) {
    const re = new RegExp(`^${escapeRe(h)}\\s*$`, "m");
    const m = re.exec(body.slice(startIdx));
    if (m && m.index !== undefined) {
      endIdx = Math.min(endIdx, startIdx + m.index);
    }
  }
  return body.slice(startIdx, endIdx).trim();
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseUpstreamMarkdown(md: string): ParsedUpstream {
  const titleMatch = md.match(/^#\s+(.+?)\s*$/m);
  const title = titleMatch?.[1]?.trim() ?? "Untitled";

  const metaSection = sliceBetween(md, "## Metadata", ["## Summary", "## Topic Body", "## Comments"]);
  const meta: ParsedUpstream["meta"] = {
    title,
    htmlUrl: pick(metaSection, META_PATTERNS.htmlUrl, "url"),
    mdUrl: pick(metaSection, META_PATTERNS.mdUrl, "url"),
    type: pick(metaSection, META_PATTERNS.type),
    author: pick(metaSection, META_PATTERNS.authorLine, "name"),
    published: pick(metaSection, META_PATTERNS.published),
    updated: pick(metaSection, META_PATTERNS.updated),
    originalSourceUrl: pick(metaSection, META_PATTERNS.originalSource, "url"),
    originalSourceName: pick(metaSection, META_PATTERNS.originalSource, "name"),
    points: pickInt(metaSection, META_PATTERNS.points),
    commentsCount: pickInt(metaSection, META_PATTERNS.comments),
  };

  const summary = sliceBetween(md, "## Summary", ["## Topic Body", "## Comments"]);
  const topicBody = sliceBetween(md, "## Topic Body", ["## Comments"]);
  const commentsSection = sliceBetween(md, "## Comments", []);

  return { meta, summary, topicBody, commentsSection };
}

export function extractDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function buildFrontmatter(
  id: number,
  parsed: ParsedUpstream,
  preserved: Partial<TopicFrontmatter> | null,
): TopicFrontmatter {
  const now = new Date().toISOString();
  const domain = extractDomain(parsed.meta.originalSourceUrl);
  const autoTags = new Set<string>(preserved?.auto_tags ?? []);
  if (domain) autoTags.add(`domain/${domain}`);
  if (parsed.meta.type) autoTags.add(`type/${parsed.meta.type}`);

  return {
    id,
    title: parsed.meta.title,
    url: parsed.meta.originalSourceUrl,
    domain,
    author: parsed.meta.author,
    points: parsed.meta.points,
    comments_count: parsed.meta.commentsCount,
    posted_at: parsed.meta.published,
    fetched_at: now,
    last_seen_at: now,
    tags: preserved?.tags ?? [],
    auto_tags: Array.from(autoTags).sort(),
    favorited: preserved?.favorited ?? false,
    related: preserved?.related ?? [],
  };
}
