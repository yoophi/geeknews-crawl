import { notFound } from "next/navigation";
import { marked } from "marked";
import { getTopic, rewriteWikilinks } from "@/lib/vault";

export const dynamic = "force-dynamic";

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number.parseInt(idStr, 10);
  if (!Number.isFinite(id)) return notFound();
  const topic = await getTopic(id);
  if (!topic) return notFound();

  const html = marked.parse(rewriteWikilinks(topic.content), { breaks: true, gfm: true }) as string;
  const commentsHtml = topic.commentsMarkdown
    ? (marked.parse(rewriteWikilinks(topic.commentsMarkdown), { breaks: true, gfm: true }) as string)
    : null;

  return (
    <>
      <h1>{topic.title} {topic.favorited && <span className="fav">★</span>}</h1>
      <div className="topic-meta" style={{ marginBottom: 16 }}>
        {topic.url && (
          <>
            <a href={topic.url} target="_blank" rel="noreferrer">{topic.domain}</a> ·{" "}
          </>
        )}
        <span>{topic.points}P</span>
        {topic.author && <> · by {topic.author}</>}
        {topic.posted_at && <> · {topic.posted_at.slice(0, 10)}</>}
        {" · "}
        <a href={`https://news.hada.io/topic?id=${topic.id}`} target="_blank" rel="noreferrer">원본 →</a>
      </div>
      <div>
        {topic.tags.map((t) => (
          <a key={t} href={`/tags/${encodeURIComponent(t)}`} className="tag-chip">#{t}</a>
        ))}
        {topic.auto_tags.map((t) => (
          <span key={t} className="tag-chip" style={{ opacity: 0.6 }}>{t}</span>
        ))}
      </div>
      <article className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
      {commentsHtml && (
        <details style={{ marginTop: 32 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>
            댓글 {topic.comments_count}개 보기
          </summary>
          <article className="markdown" dangerouslySetInnerHTML={{ __html: commentsHtml }} />
        </details>
      )}
    </>
  );
}
