import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { config } from "../lib/config.ts";
import { iterTopicFiles, coerceDates, extractWikilinkIds } from "../lib/vault.ts";
import { TopicFrontmatter } from "../lib/schema.ts";

export interface GraphNode {
  id: number;
  title: string;
  domain: string | null;
  points: number;
  tags: string[];
  favorited: boolean;
  posted_at: string | null;
}

export type EdgeKind = "domain" | "tag" | "related" | "favorited" | "similarity";

export interface GraphEdge {
  src: number;
  dst: number;
  kind: EdgeKind;
  weight: number;
}

export interface Graph {
  generated_at: string;
  node_count: number;
  edge_count: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const SIM_NGRAM_SIZE = 3;
const SIM_THRESHOLD = 0.35;
const TAG_MAX_GROUP = 200;
const DOMAIN_MAX_GROUP = 200;

function ngrams(text: string, n: number): Set<string> {
  const t = text.toLowerCase().replace(/\s+/g, " ").trim();
  const out = new Set<string>();
  if (t.length < n) return out;
  for (let i = 0; i <= t.length - n; i++) out.add(t.slice(i, i + n));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersect = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) intersect++;
  return intersect / (a.size + b.size - intersect);
}

function pairKey(a: number, b: number): string {
  return a < b ? `${a}\t${b}` : `${b}\t${a}`;
}

export async function buildGraph(): Promise<Graph> {
  const nodes: GraphNode[] = [];
  const titleGrams = new Map<number, Set<string>>();

  for await (const tf of iterTopicFiles()) {
    const parsed = TopicFrontmatter.safeParse(coerceDates(tf.data));
    if (!parsed.success) continue;
    const fm = parsed.data;
    nodes.push({
      id: fm.id,
      title: fm.title,
      domain: fm.domain,
      points: fm.points,
      tags: fm.tags,
      favorited: fm.favorited,
      posted_at: fm.posted_at,
    });
    titleGrams.set(fm.id, ngrams(fm.title, SIM_NGRAM_SIZE));
  }
  nodes.sort((a, b) => b.id - a.id);

  const edgesByKey = new Map<string, GraphEdge>();
  const addEdge = (src: number, dst: number, kind: EdgeKind, weight: number) => {
    if (src === dst) return;
    const key = `${pairKey(src, dst)}\t${kind}`;
    const prev = edgesByKey.get(key);
    if (prev) prev.weight = Math.max(prev.weight, weight);
    else edgesByKey.set(key, { src: Math.min(src, dst), dst: Math.max(src, dst), kind, weight });
  };

  // domain edges
  const byDomain = new Map<string, number[]>();
  for (const n of nodes) {
    if (!n.domain) continue;
    const arr = byDomain.get(n.domain) ?? [];
    arr.push(n.id);
    byDomain.set(n.domain, arr);
  }
  for (const ids of byDomain.values()) {
    if (ids.length < 2 || ids.length > DOMAIN_MAX_GROUP) continue;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        addEdge(ids[i]!, ids[j]!, "domain", 1);
      }
    }
  }

  // tag edges
  const byTag = new Map<string, number[]>();
  for (const n of nodes) {
    for (const t of n.tags) {
      const arr = byTag.get(t) ?? [];
      arr.push(n.id);
      byTag.set(t, arr);
    }
  }
  for (const ids of byTag.values()) {
    if (ids.length < 2 || ids.length > TAG_MAX_GROUP) continue;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        // increment weight: existing weight + 1 for each shared tag
        const key = `${pairKey(ids[i]!, ids[j]!)}\ttag`;
        const prev = edgesByKey.get(key);
        if (prev) prev.weight += 1;
        else
          edgesByKey.set(key, {
            src: Math.min(ids[i]!, ids[j]!),
            dst: Math.max(ids[i]!, ids[j]!),
            kind: "tag",
            weight: 1,
          });
      }
    }
  }

  // related (wikilinks) edges
  for await (const tf of iterTopicFiles()) {
    const related = Array.isArray(tf.data.related) ? (tf.data.related as unknown[]) : [];
    const linkedIds = related
      .filter((v): v is string => typeof v === "string")
      .flatMap(extractWikilinkIds);
    for (const dst of linkedIds) addEdge(tf.id, dst, "related", 2);
  }

  // favorited edges (pairs of favorited nodes)
  const favIds = nodes.filter((n) => n.favorited).map((n) => n.id);
  for (let i = 0; i < favIds.length; i++) {
    for (let j = i + 1; j < favIds.length; j++) {
      addEdge(favIds[i]!, favIds[j]!, "favorited", 2);
    }
  }

  // similarity (title 3-gram jaccard). Bucket by shared trigrams to avoid full N^2.
  const buckets = new Map<string, number[]>();
  for (const [id, grams] of titleGrams) {
    for (const g of grams) {
      const arr = buckets.get(g) ?? [];
      arr.push(id);
      buckets.set(g, arr);
    }
  }
  const candidatePairs = new Set<string>();
  for (const ids of buckets.values()) {
    if (ids.length < 2 || ids.length > 50) continue;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        candidatePairs.add(pairKey(ids[i]!, ids[j]!));
      }
    }
  }
  for (const key of candidatePairs) {
    const [a, b] = key.split("\t").map(Number);
    const sa = titleGrams.get(a!);
    const sb = titleGrams.get(b!);
    if (!sa || !sb) continue;
    const score = jaccard(sa, sb);
    if (score >= SIM_THRESHOLD) addEdge(a!, b!, "similarity", score);
  }

  const edges = [...edgesByKey.values()];
  return {
    generated_at: new Date().toISOString(),
    node_count: nodes.length,
    edge_count: edges.length,
    nodes,
    edges,
  };
}

export async function writeGraph(graph: Graph): Promise<string> {
  const p = join(config.vaultDir, "_index", "graph.json");
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify(graph, null, 0), "utf8");
  return p;
}
