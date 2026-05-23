import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

type Unsubscribe = () => void

const api = {
  // vault reads
  listTopics: (opts?: { limit?: number; tag?: string; favorited?: boolean }) =>
    ipcRenderer.invoke('vault:list', opts ?? {}),
  getTopic: (id: number) => ipcRenderer.invoke('vault:get', id),
  listTags: () => ipcRenderer.invoke('vault:tags'),
  getGraph: () => ipcRenderer.invoke('vault:graph'),

  // mutations
  addTags: (id: number, tags: string[]) => ipcRenderer.invoke('mutate:add-tags', id, tags),
  removeTag: (id: number, tag: string) => ipcRenderer.invoke('mutate:remove-tag', id, tag),
  addRelated: (srcId: number, dstIds: number[]) =>
    ipcRenderer.invoke('mutate:add-related', srcId, dstIds),
  removeRelated: (srcId: number, dstId: number) =>
    ipcRenderer.invoke('mutate:remove-related', srcId, dstId),
  setNote: (id: number, body: string) => ipcRenderer.invoke('mutate:set-note', id, body),

  // long-running CLI ops
  crawl: (
    kind: 'backfill' | 'incremental' | 'ids',
    opts: { months?: number; ids?: string; saveHtml?: boolean; refresh?: boolean }
  ) => ipcRenderer.invoke('run:crawl', kind, opts),
  syncFavorites: (opts: { dryRun?: boolean; limit?: number; batch?: number }) =>
    ipcRenderer.invoke('run:sync-favorites', opts),
  graphBuild: () => ipcRenderer.invoke('run:graph-build'),
  lintVault: () => ipcRenderer.invoke('run:lint-vault'),
  stopJob: (jobId: string) => ipcRenderer.invoke('run:stop', jobId),
  listJobs: () => ipcRenderer.invoke('run:list'),

  // streaming subscriptions
  onRunLine: (
    cb: (ev: { jobId: string; stream: 'stdout' | 'stderr'; line: string }) => void
  ): Unsubscribe => {
    const handler = (_e: Electron.IpcRendererEvent, ev: Parameters<typeof cb>[0]): void => cb(ev)
    ipcRenderer.on('run:line', handler)
    return () => ipcRenderer.removeListener('run:line', handler)
  },
  onRunStart: (
    cb: (ev: { jobId: string; kind: string; args: string[] }) => void
  ): Unsubscribe => {
    const handler = (_e: Electron.IpcRendererEvent, ev: Parameters<typeof cb>[0]): void => cb(ev)
    ipcRenderer.on('run:start', handler)
    return () => ipcRenderer.removeListener('run:start', handler)
  },
  onRunExit: (
    cb: (ev: { jobId: string; code: number | null; signal: string | null; durationMs: number }) => void
  ): Unsubscribe => {
    const handler = (_e: Electron.IpcRendererEvent, ev: Parameters<typeof cb>[0]): void => cb(ev)
    ipcRenderer.on('run:exit', handler)
    return () => ipcRenderer.removeListener('run:exit', handler)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

export type Api = typeof api
