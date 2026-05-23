import Graph from "@/components/Graph";

export const dynamic = "force-dynamic";

export default function GraphPage() {
  return (
    <>
      <h1>그래프</h1>
      <p style={{ color: "var(--muted)", fontSize: 13 }}>
        노드 크기 = 포인트, 주황 = favorited. 노드 클릭 시 새 탭으로 토픽 열림. 엣지 종류는 위 토글로 필터링.
      </p>
      <Graph />
    </>
  );
}
