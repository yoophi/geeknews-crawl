import { useEffect, useState } from 'react'
import { api, type TopicSummary } from '../lib/api'
import { TopicList } from '../components/TopicList'

export default function Favorited() {
  const [topics, setTopics] = useState<TopicSummary[] | null>(null)
  useEffect(() => {
    api.listTopics({ favorited: true }).then(setTopics)
  }, [])
  if (!topics) return <p>로딩 중…</p>
  return (
    <>
      <h1>★ 즐겨찾기 ({topics.length})</h1>
      {topics.length === 0 ? (
        <p>아직 즐겨찾기 표시된 토픽이 없습니다. Tools → Sync favorites에서 동기화 가능.</p>
      ) : (
        <TopicList topics={topics} />
      )}
    </>
  )
}
