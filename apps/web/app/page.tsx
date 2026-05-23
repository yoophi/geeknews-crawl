import { listTopics } from "@/lib/vault";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topics = await listTopics({ limit: 200 });
  return (
    <>
      <h1 style={{ fontSize: 22 }}>최근 토픽 ({topics.length})</h1>
      <div>
        {topics.map((t) => (
          <article className="topic-card" key={t.id}>
            <h3>
              <a href={`/topic/${t.id}`}>{t.title}</a>
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
                    <a key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag-chip">#{tag}</a>
                  ))}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
