import { listTopics } from "@/lib/vault";

export const dynamic = "force-dynamic";

export default async function TagsIndex() {
  const topics = await listTopics();
  const userTags = new Map<string, number>();
  const autoTags = new Map<string, number>();
  for (const t of topics) {
    for (const tag of t.tags) userTags.set(tag, (userTags.get(tag) ?? 0) + 1);
    for (const tag of t.auto_tags) autoTags.set(tag, (autoTags.get(tag) ?? 0) + 1);
  }
  const sort = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]);
  return (
    <>
      <h1>태그</h1>
      <h2>사용자 태그</h2>
      {userTags.size === 0 ? <p>아직 사용자 태그 없음. <code>pnpm tag &lt;id&gt; ...</code></p> : null}
      <div>
        {sort(userTags).map(([t, n]) => (
          <a key={t} href={`/tags/${encodeURIComponent(t)}`} className="tag-chip">
            #{t} ({n})
          </a>
        ))}
      </div>
      <h2 style={{ marginTop: 32 }}>자동 태그</h2>
      <div>
        {sort(autoTags).slice(0, 100).map(([t, n]) => (
          <a key={t} href={`/tags/${encodeURIComponent(t)}`} className="tag-chip">
            {t} ({n})
          </a>
        ))}
      </div>
    </>
  );
}
