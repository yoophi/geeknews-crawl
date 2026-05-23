import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { api, type TopicDetail } from '../lib/api'

function rewriteWikilinks(md: string): string {
  return md.replace(/\[\[(\d+)(?:-([^\]]*))?\]\]/g, (_, id: string, slug?: string) => {
    const label = slug ? `${id}-${slug}` : id
    return `[${label}](#/topic/${id})`
  })
}

export default function Topic() {
  const { id } = useParams<{ id: string }>()
  const tid = Number(id)
  const [topic, setTopic] = useState<TopicDetail | null>(null)
  const [newTag, setNewTag] = useState('')
  const [savingTag, setSavingTag] = useState(false)
  const [note, setNote] = useState('')
  const [noteHydrated, setNoteHydrated] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)

  function refresh() {
    api.getTopic(tid).then((t) => {
      setTopic(t)
      if (t) {
        const idx = t.content.indexOf('<!-- USER:NOTES -->')
        if (idx >= 0) {
          const tail = t.content.slice(idx).replace(/^<!-- USER:NOTES -->\s*/, '')
          const body = tail.replace(/^## 내 메모\s*/m, '').trim()
          setNote(body)
        } else {
          setNote('')
        }
        setNoteHydrated(true)
      }
    })
  }
  useEffect(() => {
    refresh()
  }, [tid])

  if (!topic) return <p>로딩 중…</p>

  const upstreamPart = (() => {
    const idx = topic.content.indexOf('<!-- USER:NOTES -->')
    return idx >= 0 ? topic.content.slice(0, idx) : topic.content
  })()
  const html = marked.parse(rewriteWikilinks(upstreamPart), { breaks: true, gfm: true }) as string
  const commentsHtml = topic.commentsMarkdown
    ? (marked.parse(rewriteWikilinks(topic.commentsMarkdown), { breaks: true, gfm: true }) as string)
    : null

  async function addTag() {
    const t = newTag.trim()
    if (!t) return
    setSavingTag(true)
    await api.addTags(tid, [t])
    setNewTag('')
    setSavingTag(false)
    refresh()
  }
  async function removeTag(tag: string) {
    await api.removeTag(tid, tag)
    refresh()
  }
  async function saveNote() {
    setSavingNote(true)
    await api.setNote(tid, note)
    setSavingNote(false)
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 1500)
    refresh()
  }

  return (
    <>
      <h1>
        {topic.title} {topic.favorited && <span className="fav">★</span>}
      </h1>
      <div className="topic-meta" style={{ marginBottom: 12 }}>
        {topic.url && (
          <>
            <a href={topic.url} target="_blank" rel="noreferrer">
              {topic.domain}
            </a>{' '}
            ·{' '}
          </>
        )}
        <span>{topic.points}P</span>
        {topic.author && <> · by {topic.author}</>}
        {topic.posted_at && <> · {topic.posted_at.slice(0, 10)}</>}{' '}
        ·{' '}
        <a href={`https://news.hada.io/topic?id=${topic.id}`} target="_blank" rel="noreferrer">
          원본 →
        </a>
      </div>

      <div style={{ marginBottom: 16 }}>
        {topic.tags.map((t) => (
          <span key={t} className="tag-chip removable">
            #{t}
            <button onClick={() => removeTag(t)} title="제거">×</button>
          </span>
        ))}
        {topic.auto_tags.map((t) => (
          <Link key={t} to={`/tags/${encodeURIComponent(t)}`} className="tag-chip" style={{ opacity: 0.6 }}>
            {t}
          </Link>
        ))}
        <input
          className="input"
          style={{ display: 'inline-block', width: 200, marginLeft: 8 }}
          placeholder="태그 추가"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTag()
          }}
        />
        <button className="btn" onClick={addTag} disabled={savingTag || !newTag.trim()} style={{ marginLeft: 6 }}>
          추가
        </button>
      </div>

      <article className="markdown" dangerouslySetInnerHTML={{ __html: html }} />

      <section style={{ marginTop: 32 }}>
        <h2>내 메모</h2>
        {!noteHydrated ? (
          <p>로딩 중…</p>
        ) : (
          <>
            <textarea
              className="textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Markdown으로 자유롭게…"
            />
            <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="btn primary" onClick={saveNote} disabled={savingNote}>
                {savingNote ? '저장 중…' : '저장'}
              </button>
              {noteSaved && <span style={{ color: 'var(--muted)' }}>저장됨</span>}
            </div>
          </>
        )}
      </section>

      {commentsHtml && (
        <details style={{ marginTop: 32 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
            댓글 {topic.comments_count}개 보기
          </summary>
          <article className="markdown" dangerouslySetInnerHTML={{ __html: commentsHtml }} />
        </details>
      )}
    </>
  )
}
