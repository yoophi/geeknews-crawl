import { listTopics } from "@/lib/vault";

export const dynamic = "force-dynamic";

export default async function TagPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const tag = decodeURIComponent(name);
  const topics = await listTopics({ tag });
  return (
    <>
      <h1>#{tag} ({topics.length})</h1>
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
