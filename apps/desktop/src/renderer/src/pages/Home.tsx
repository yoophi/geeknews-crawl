import { useEffect, useState } from 'react'
import { api, type TopicSummary } from '../lib/api'
import { TopicList } from '../components/TopicList'

export default function Home() {
  const [topics, setTopics] = useState<TopicSummary[] | null>(null)
  const [limit, setLimit] = useState(300)

  useEffect(() => {
    api.listTopics({ limit }).then(setTopics)
  }, [limit])

  if (!topics) return <p>로딩 중…</p>
  return (
    <>
      <h1>최근 토픽 ({topics.length})</h1>
      <TopicList topics={topics} />
      {topics.length === limit && (
        <button className="btn" onClick={() => setLimit((n) => n + 300)} style={{ marginTop: 24 }}>
          더 보기 (+300)
        </button>
      )}
    </>
  )
}
