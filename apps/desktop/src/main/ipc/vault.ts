import { ipcMain } from 'electron'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { iterTopicFiles, findTopicById, extractWikilinkIds } from '@core/lib/vault.ts'
import { vaultDir } from '../lib/repo'

export interface TopicSummary {
  id: number
  title: string
  domain: string | null
  author: string | null
  points: number
  comments_count: number
  posted_at: string | null
  tags: string[]
  auto_tags: string[]
  favorited: boolean
  relPath: string
}

export interface TopicDetail extends TopicSummary {
  url: string | null
  content: string
  commentsMarkdown: string | null
  related: string[]
}

function coerceDates(d: Record<string, unknown>): Record<string, unknown> {
  const o: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(d)) o[k] = v instanceof Date ? v.toISOString() : v
  return o
}

function asSummary(rel: string, raw: Record<string, unknown>): TopicSummary {
  const data = coerceDates(raw)
  return {
    id: Number(data.id),
    title: String(data.title ?? '(no title)'),
    domain: (data.domain as string | null | undefined) ?? null,
    author: (data.author as string | null | undefined) ?? null,
    points: Number(data.points ?? 0),
    comments_count: Number(data.comments_count ?? 0),
    posted_at: (data.posted_at as string | null | undefined) ?? null,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    auto_tags: Array.isArray(data.auto_tags) ? (data.auto_tags as string[]) : [],
    favorited: Boolean(data.favorited),
    relPath: rel
  }
}

async function listAll(): Promise<TopicSummary[]> {
  const out: TopicSummary[] = []
  for await (const tf of iterTopicFiles()) {
    out.push(asSummary(tf.relPath, tf.data))
  }
  out.sort((a, b) => (b.posted_at ?? '').localeCompare(a.posted_at ?? ''))
  return out
}

export function registerVaultIpc(): void {
  ipcMain.handle('vault:list', async (_e, opts: { limit?: number; tag?: string; favorited?: boolean } = {}) => {
    let all = await listAll()
    if (opts.tag) all = all.filter((t) => t.tags.includes(opts.tag!) || t.auto_tags.includes(opts.tag!))
    if (opts.favorited) all = all.filter((t) => t.favorited)
    if (opts.limit) all = all.slice(0, opts.limit)
    return all
  })

  ipcMain.handle('vault:get', async (_e, id: number): Promise<TopicDetail | null> => {
    const tf = await findTopicById(id)
    if (!tf) return null
    const data = coerceDates(tf.data)
    const summary = asSummary(tf.relPath, tf.data)
    let commentsMarkdown: string | null = null
    try {
      const cRaw = await readFile(join(vaultDir(), 'comments', `${id}.md`), 'utf8')
      commentsMarkdown = matter(cRaw).content
    } catch {
      /* no comments */
    }
    return {
      ...summary,
      url: (data.url as string | null | undefined) ?? null,
      content: tf.content,
      commentsMarkdown,
      related: Array.isArray(data.related) ? (data.related as string[]) : []
    }
  })

  ipcMain.handle('vault:tags', async () => {
    const userCounts = new Map<string, number>()
    const autoCounts = new Map<string, number>()
    for await (const tf of iterTopicFiles()) {
      const tags = Array.isArray(tf.data.tags) ? (tf.data.tags as string[]) : []
      const autos = Array.isArray(tf.data.auto_tags) ? (tf.data.auto_tags as string[]) : []
      for (const t of tags) userCounts.set(t, (userCounts.get(t) ?? 0) + 1)
      for (const t of autos) autoCounts.set(t, (autoCounts.get(t) ?? 0) + 1)
    }
    return {
      user: [...userCounts.entries()].sort((a, b) => b[1] - a[1]),
      auto: [...autoCounts.entries()].sort((a, b) => b[1] - a[1])
    }
  })

  ipcMain.handle('vault:graph', async () => {
    try {
      const raw = await readFile(join(vaultDir(), '_index', 'graph.json'), 'utf8')
      return JSON.parse(raw)
    } catch {
      return null
    }
  })

  ipcMain.handle('vault:wikilinks', async (_e, text: string) => extractWikilinkIds(text))
}
