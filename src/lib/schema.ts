import { z } from "zod";

export const TopicFrontmatter = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  url: z.string().url().nullable(),
  domain: z.string().nullable(),
  author: z.string().nullable(),
  points: z.number().int().nonnegative().default(0),
  comments_count: z.number().int().nonnegative().default(0),
  posted_at: z.string().nullable(),
  fetched_at: z.string(),
  last_seen_at: z.string(),
  tags: z.array(z.string()).default([]),
  auto_tags: z.array(z.string()).default([]),
  favorited: z.boolean().default(false),
  related: z.array(z.string()).default([]),
});
export type TopicFrontmatter = z.infer<typeof TopicFrontmatter>;

export const CommentNode = z.object({
  id: z.string().nullable(),
  author: z.string().nullable(),
  posted_at: z.string().nullable(),
  body: z.string(),
  depth: z.number().int().nonnegative(),
});
export type CommentNode = z.infer<typeof CommentNode>;

export const ParsedTopic = z.object({
  frontmatter: TopicFrontmatter,
  summary: z.string(),
  comments: z.array(CommentNode),
});
export type ParsedTopic = z.infer<typeof ParsedTopic>;

export const CrawlState = z.object({
  last_max_id: z.number().int().nonnegative().default(0),
  last_run_at: z.string().nullable().default(null),
  known_ids: z.array(z.number().int().positive()).default([]),
});
export type CrawlState = z.infer<typeof CrawlState>;
