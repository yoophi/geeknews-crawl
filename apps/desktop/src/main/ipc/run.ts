import { ipcMain, BrowserWindow } from 'electron'
import { spawn, ChildProcess } from 'node:child_process'
import { repoRoot } from '../lib/repo'

interface Job {
  child: ChildProcess
  kind: string
  startedAt: number
}

const jobs = new Map<string, Job>()
let jobSeq = 0

function emit(target: BrowserWindow | null, channel: string, payload: unknown): void {
  if (!target || target.isDestroyed()) return
  target.webContents.send(channel, payload)
}

function startCli(
  kind: string,
  args: string[],
  sender: BrowserWindow | null
): { jobId: string } {
  const jobId = `${kind}-${++jobSeq}`
  const child = spawn('pnpm', args, {
    cwd: repoRoot(),
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe']
  })
  const startedAt = Date.now()
  jobs.set(jobId, { child, kind, startedAt })

  const onChunk = (stream: 'stdout' | 'stderr') => (buf: Buffer) => {
    const text = buf.toString('utf8')
    for (const line of text.split(/\r?\n/)) {
      if (line) emit(sender, 'run:line', { jobId, stream, line })
    }
  }
  child.stdout?.on('data', onChunk('stdout'))
  child.stderr?.on('data', onChunk('stderr'))
  child.on('exit', (code, signal) => {
    emit(sender, 'run:exit', { jobId, code, signal, durationMs: Date.now() - startedAt })
    jobs.delete(jobId)
  })
  child.on('error', (err) => {
    emit(sender, 'run:line', { jobId, stream: 'stderr', line: `[spawn error] ${err.message}` })
  })

  emit(sender, 'run:start', { jobId, kind, args })
  return { jobId }
}

export function registerRunIpc(): void {
  ipcMain.handle(
    'run:crawl',
    (e, kind: 'backfill' | 'incremental' | 'ids', opts: { months?: number; ids?: string; saveHtml?: boolean; refresh?: boolean }) => {
      const win = BrowserWindow.fromWebContents(e.sender)
      const args: string[] = ['crawl', kind]
      if (kind === 'backfill' && opts.months) args.push('--months', String(opts.months))
      if (kind === 'ids' && opts.ids) args.push(opts.ids)
      if (opts.saveHtml) args.push('--save-html')
      if (opts.refresh) args.push('--refresh')
      return startCli('crawl', args, win)
    }
  )

  ipcMain.handle('run:sync-favorites', (e, opts: { dryRun?: boolean; limit?: number; batch?: number }) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    const args: string[] = ['sync:favorites']
    if (opts.dryRun) args.push('--dry-run')
    if (opts.limit) args.push('--limit', String(opts.limit))
    if (opts.batch) args.push('--batch', String(opts.batch))
    return startCli('sync-favorites', args, win)
  })

  ipcMain.handle('run:graph-build', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    return startCli('graph-build', ['graph:build'], win)
  })

  ipcMain.handle('run:lint-vault', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    return startCli('lint-vault', ['lint:vault'], win)
  })

  ipcMain.handle('run:stop', (_e, jobId: string) => {
    const job = jobs.get(jobId)
    if (!job) return { ok: false, error: 'no such job' }
    job.child.kill('SIGTERM')
    return { ok: true }
  })

  ipcMain.handle('run:list', () => {
    return [...jobs.entries()].map(([id, j]) => ({
      jobId: id,
      kind: j.kind,
      startedAt: j.startedAt,
      pid: j.child.pid
    }))
  })
}
