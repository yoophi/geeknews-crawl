import { listTopics } from "@/lib/vault";

export const dynamic = "force-dynamic";

export default async function FavoritedPage() {
  const topics = await listTopics({ favorited: true });
  return (
    <>
      <h1>★ 즐겨찾기 ({topics.length})</h1>
      {topics.length === 0 ? (
        <p>아직 즐겨찾기 표시된 토픽이 없습니다. (Phase 4에서 쿠키 동기화 예정)</p>
      ) : null}
      <div>
        {topics.map((t) => (
          <article className="topic-card" key={t.id}>
            <h3><a href={`/topic/${t.id}`}>{t.title}</a></h3>
            <div className="topic-meta">
              {t.domain && <span className="pill">{t.domain}</span>}
              <span>{t.points}P</span>
              {t.posted_at && <> · {t.posted_at.slice(0, 10)}</>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
