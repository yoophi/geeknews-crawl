import { ipcMain } from 'electron'
import { findTopicById, rewriteTopicFile } from '@core/lib/vault.ts'

export function registerMutateIpc(): void {
  ipcMain.handle('mutate:add-tags', async (_e, id: number, tags: string[]) => {
    const tf = await findTopicById(id)
    if (!tf) return { ok: false, error: `topic ${id} not found` }
    await rewriteTopicFile(tf, (data, content) => {
      const cur = new Set(Array.isArray(data.tags) ? (data.tags as string[]) : [])
      for (const t of tags) cur.add(t)
      return { data: { ...data, tags: [...cur].sort() }, content }
    })
    return { ok: true }
  })

  ipcMain.handle('mutate:remove-tag', async (_e, id: number, tag: string) => {
    const tf = await findTopicById(id)
    if (!tf) return { ok: false, error: `topic ${id} not found` }
    await rewriteTopicFile(tf, (data, content) => {
      const cur = new Set(Array.isArray(data.tags) ? (data.tags as string[]) : [])
      cur.delete(tag)
      return { data: { ...data, tags: [...cur].sort() }, content }
    })
    return { ok: true }
  })

  ipcMain.handle('mutate:add-related', async (_e, srcId: number, dstIds: number[]) => {
    const src = await findTopicById(srcId)
    if (!src) return { ok: false, error: `topic ${srcId} not found` }
    const dstFiles = await Promise.all(dstIds.map((id) => findTopicById(id)))
    const missing = dstIds.filter((_, i) => !dstFiles[i])
    if (missing.length) return { ok: false, error: `missing target(s): ${missing.join(', ')}` }
    const newLinks = dstFiles.map((tf) => {
      const slug = tf!.relPath.split('/').pop()!.replace(/^\d+-/, '').replace(/\.md$/, '')
      return `[[${tf!.id}-${slug}]]`
    })
    await rewriteTopicFile(src, (data, content) => {
      const cur = new Set(Array.isArray(data.related) ? (data.related as string[]) : [])
      for (const l of newLinks) cur.add(l)
      return { data: { ...data, related: [...cur].sort() }, content }
    })
    return { ok: true }
  })

  ipcMain.handle('mutate:remove-related', async (_e, srcId: number, dstId: number) => {
    const src = await findTopicById(srcId)
    if (!src) return { ok: false, error: `topic ${srcId} not found` }
    await rewriteTopicFile(src, (data, content) => {
      const cur = Array.isArray(data.related) ? (data.related as string[]) : []
      const filtered = cur.filter((l) => !l.startsWith(`[[${dstId}`))
      return { data: { ...data, related: filtered }, content }
    })
    return { ok: true }
  })

  ipcMain.handle('mutate:set-note', async (_e, id: number, body: string) => {
    const tf = await findTopicById(id)
    if (!tf) return { ok: false, error: `topic ${id} not found` }
    const MARKER = '<!-- USER:NOTES -->'
    await rewriteTopicFile(tf, (data, content) => {
      const idx = content.indexOf(MARKER)
      const head = idx >= 0 ? content.slice(0, idx) : content.trimEnd() + '\n\n'
      return { data, content: `${head}${MARKER}\n## 내 메모\n\n${body.trim()}\n` }
    })
    return { ok: true }
  })
}
