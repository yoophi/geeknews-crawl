import { Link } from 'react-router-dom'
import type { TopicSummary } from '../lib/api'

export function TopicList({ topics }: { topics: TopicSummary[] }) {
  return (
    <div>
      {topics.map((t) => (
        <article className="topic-card" key={t.id}>
          <h3>
            <Link to={`/topic/${t.id}`}>{t.title}</Link>
            {t.favorited && <span className="fav" title="favorited"> ★</span>}
          </h3>
          <div className="topic-meta">
            {t.domain && <span className="pill">{t.domain}</span>}
            {t.author && <>by {t.author} · </>}
            <span>{t.points}P</span>
            {t.comments_count > 0 && <> · 댓글 {t.comments_count}</>}
            {t.posted_at && <> · {t.posted_at.slice(0, 10)}</>}
            {t.tags.length > 0 && (
              <span style={{ marginLeft: 8 }}>
                {t.tags.map((tag) => (
                  <Link key={tag} to={`/tags/${encodeURIComponent(tag)}`} className="tag-chip">
                    #{tag}
                  </Link>
                ))}
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
