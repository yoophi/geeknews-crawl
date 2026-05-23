import GraphCanvas from '../components/GraphCanvas'

export default function GraphPage() {
  return (
    <>
      <h1>그래프</h1>
      <p style={{ color: 'var(--muted)', fontSize: 12.5 }}>
        노드 크기 = 포인트, 주황 = favorited. 노드 클릭 시 토픽 상세로 이동. 엣지 종류는 위 토글로 필터링.
      </p>
      <GraphCanvas />
    </>
  )
}
