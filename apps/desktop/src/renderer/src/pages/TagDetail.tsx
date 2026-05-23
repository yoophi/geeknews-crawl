import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, type TopicSummary } from '../lib/api'
import { TopicList } from '../components/TopicList'

export default function TagDetail() {
  const { name } = useParams<{ name: string }>()
  const tag = decodeURIComponent(name ?? '')
  const [topics, setTopics] = useState<TopicSummary[] | null>(null)
  useEffect(() => {
    api.listTopics({ tag }).then(setTopics)
  }, [tag])
  if (!topics) return <p>로딩 중…</p>
  return (
    <>
      <h1>#{tag} ({topics.length})</h1>
      <TopicList topics={topics} />
    </>
  )
}
