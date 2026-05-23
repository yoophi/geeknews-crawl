import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'

interface LogLine {
  jobId: string
  stream: 'stdout' | 'stderr' | 'meta'
  line: string
}

export default function Tools() {
  const [lines, setLines] = useState<LogLine[]>([])
  const [activeJobs, setActiveJobs] = useState<Record<string, string>>({})
  const [crawlKind, setCrawlKind] = useState<'backfill' | 'incremental' | 'ids'>('incremental')
  const [months, setMonths] = useState(12)
  const [ids, setIds] = useState('')
  const [saveHtml, setSaveHtml] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [syncDryRun, setSyncDryRun] = useState(true)
  const [syncLimit, setSyncLimit] = useState<number | ''>('')
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unStart = api.onRunStart(({ jobId, kind, args }) => {
      setActiveJobs((j) => ({ ...j, [jobId]: kind }))
      setLines((ls) => [...ls, { jobId, stream: 'meta', line: `▶ ${kind} ${args.join(' ')}` }])
    })
    const unLine = api.onRunLine(({ jobId, stream, line }) => {
      setLines((ls) => [...ls, { jobId, stream, line }])
    })
    const unExit = api.onRunExit(({ jobId, code, signal, durationMs }) => {
      setActiveJobs((j) => {
        const next = { ...j }
        delete next[jobId]
        return next
      })
      const note = signal ? `signal=${signal}` : `exit=${code}`
      setLines((ls) => [
        ...ls,
        { jobId, stream: 'meta', line: `■ done (${note}, ${(durationMs / 1000).toFixed(1)}s)` }
      ])
    })
    return () => {
      unStart()
      unLine()
      unExit()
    }
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [lines])

  async function startCrawl() {
    await api.crawl(crawlKind, {
      months: crawlKind === 'backfill' ? months : undefined,
      ids: crawlKind === 'ids' ? ids : undefined,
      saveHtml,
      refresh
    })
  }
  async function startSync() {
    await api.syncFavorites({
      dryRun: syncDryRun,
      limit: syncLimit ? Number(syncLimit) : undefined
    })
  }
  async function rebuildGraph() {
    await api.graphBuild()
  }
  async function lint() {
    await api.lintVault()
  }

  function stopAll() {
    for (const jobId of Object.keys(activeJobs)) {
      api.stopJob(jobId)
    }
  }
  function clear() {
    setLines([])
  }

  return (
    <>
      <h1>Tools</h1>
      <p style={{ color: 'var(--muted)', fontSize: 12.5 }}>
        CLI 명령을 데스크탑에서 직접 실행하고 출력 스트림을 확인합니다.
      </p>
      <div className="tools-grid">
        <div>
          <div className="tools-panel">
            <h3>크롤</h3>
            <div className="row">
              <label>모드</label>
              <select
                className="input"
                value={crawlKind}
                onChange={(e) => setCrawlKind(e.target.value as typeof crawlKind)}
              >
                <option value="incremental">incremental (RSS + 최근)</option>
                <option value="backfill">backfill (개월 단위)</option>
                <option value="ids">ids (범위 / 목록)</option>
              </select>
            </div>
            {crawlKind === 'backfill' && (
              <div className="row">
                <label>개월</label>
                <input
                  className="input"
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                />
              </div>
            )}
            {crawlKind === 'ids' && (
              <div className="row">
                <label>IDs</label>
                <input
                  className="input"
                  placeholder="29000-29100 또는 29797,29796"
                  value={ids}
                  onChange={(e) => setIds(e.target.value)}
                />
              </div>
            )}
            <div className="row">
              <label>옵션</label>
              <label style={{ display: 'flex', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={saveHtml}
                  onChange={(e) => setSaveHtml(e.target.checked)}
                />{' '}
                save-html
              </label>
              <label style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                <input
                  type="checkbox"
                  checked={refresh}
                  onChange={(e) => setRefresh(e.target.checked)}
                />{' '}
                refresh
              </label>
            </div>
            <button className="btn primary" onClick={startCrawl}>
              실행
            </button>
          </div>

          <div className="tools-panel" style={{ marginTop: 12 }}>
            <h3>Sync favorites</h3>
            <div className="row">
              <label style={{ display: 'flex', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={syncDryRun}
                  onChange={(e) => setSyncDryRun(e.target.checked)}
                />{' '}
                dry-run
              </label>
            </div>
            <div className="row">
              <label>limit</label>
              <input
                className="input"
                type="number"
                placeholder="전체"
                value={syncLimit}
                onChange={(e) => setSyncLimit(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
            <button className="btn primary" onClick={startSync}>
              실행
            </button>
          </div>

          <div className="tools-panel" style={{ marginTop: 12 }}>
            <h3>유지보수</h3>
            <button className="btn" onClick={rebuildGraph} style={{ marginRight: 6 }}>
              그래프 재빌드
            </button>
            <button className="btn" onClick={lint}>
              lint:vault
            </button>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <strong>
              실행 로그 {Object.keys(activeJobs).length > 0 && `(실행 중: ${Object.keys(activeJobs).length})`}
            </strong>
            <div>
              {Object.keys(activeJobs).length > 0 && (
                <button className="btn" onClick={stopAll} style={{ marginRight: 6 }}>
                  중지
                </button>
              )}
              <button className="btn" onClick={clear}>
                로그 지우기
              </button>
            </div>
          </div>
          <div className="log-pane" ref={logRef}>
            {lines.length === 0 ? (
              <span className="dim">대기 중…</span>
            ) : (
              lines.map((l, i) => (
                <div key={i} className={l.stream === 'stderr' ? 'stderr' : l.stream === 'meta' ? 'meta' : ''}>
                  <span className="dim">[{l.jobId}]</span> {l.line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
