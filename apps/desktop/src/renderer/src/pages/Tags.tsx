import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

interface TagsResp {
  user: [string, number][]
  auto: [string, number][]
}

export default function Tags() {
  const [data, setData] = useState<TagsResp | null>(null)
  useEffect(() => {
    api.listTags().then(setData)
  }, [])
  if (!data) return <p>로딩 중…</p>
  return (
    <>
      <h1>태그</h1>
      <h2>사용자 태그 ({data.user.length})</h2>
      {data.user.length === 0 ? (
        <p>아직 사용자 태그 없음. 토픽 상세에서 추가 가능.</p>
      ) : (
        <div>
          {data.user.map(([t, n]) => (
            <Link key={t} to={`/tags/${encodeURIComponent(t)}`} className="tag-chip">
              #{t} ({n})
            </Link>
          ))}
        </div>
      )}
      <h2>자동 태그 (상위 100)</h2>
      <div>
        {data.auto.slice(0, 100).map(([t, n]) => (
          <Link key={t} to={`/tags/${encodeURIComponent(t)}`} className="tag-chip">
            {t} ({n})
          </Link>
        ))}
      </div>
    </>
  )
}
