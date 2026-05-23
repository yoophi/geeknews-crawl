"use client";

import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import type { Core, ElementDefinition, EdgeSingular, NodeSingular } from "cytoscape";

type EdgeKind = "domain" | "tag" | "related" | "favorited" | "similarity";

interface GraphNode {
  id: number;
  title: string;
  domain: string | null;
  points: number;
  tags: string[];
  favorited: boolean;
}
interface GraphEdge {
  src: number;
  dst: number;
  kind: EdgeKind;
  weight: number;
}
interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const EDGE_COLORS: Record<EdgeKind, string> = {
  domain: "#9aa0a6",
  tag: "#7c3aed",
  related: "#0ea5e9",
  favorited: "#d97706",
  similarity: "#10b981",
};

const ALL_KINDS: EdgeKind[] = ["domain", "tag", "related", "favorited", "similarity"];

export default function Graph() {
  const ref = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [data, setData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enabledKinds, setEnabledKinds] = useState<Set<EdgeKind>>(new Set(ALL_KINDS));
  const [onlyFavorited, setOnlyFavorited] = useState(false);

  useEffect(() => {
    fetch("/api/graph")
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "fetch failed");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e?.message ?? e)));
  }, []);

  useEffect(() => {
    if (!data || !ref.current) return;
    const nodes = data.nodes
      .filter((n) => !onlyFavorited || n.favorited)
      .map((n): ElementDefinition => ({
        data: {
          id: String(n.id),
          label: n.title.length > 30 ? n.title.slice(0, 30) + "…" : n.title,
          domain: n.domain ?? "",
          points: n.points,
          favorited: n.favorited,
        },
      }));
    const nodeIds = new Set(nodes.map((n) => n.data.id));
    const edges = data.edges
      .filter((e) => enabledKinds.has(e.kind))
      .filter((e) => nodeIds.has(String(e.src)) && nodeIds.has(String(e.dst)))
      .map((e): ElementDefinition => ({
        data: {
          id: `${e.src}-${e.dst}-${e.kind}`,
          source: String(e.src),
          target: String(e.dst),
          kind: e.kind,
          weight: e.weight,
        },
      }));

    if (cyRef.current) cyRef.current.destroy();
    cyRef.current = cytoscape({
      container: ref.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: "node",
          style: {
            "background-color": (ele: NodeSingular) => (ele.data("favorited") ? "#d97706" : "#3b82f6"),
            label: "data(label)",
            "font-size": 9,
            color: "#888",
            "text-valign": "bottom",
            "text-halign": "center",
            width: (ele: NodeSingular) => Math.max(6, Math.min(28, 6 + Math.sqrt(ele.data("points") || 0) * 3)),
            height: (ele: NodeSingular) => Math.max(6, Math.min(28, 6 + Math.sqrt(ele.data("points") || 0) * 3)),
          },
        },
        {
          selector: "edge",
          style: {
            "line-color": (ele: EdgeSingular) => EDGE_COLORS[ele.data("kind") as EdgeKind] ?? "#ccc",
            width: (ele: EdgeSingular) => Math.max(0.3, Math.min(3, (ele.data("weight") || 1) * 0.6)),
            opacity: 0.5,
            "curve-style": "haystack",
          },
        },
      ],
      layout: { name: "concentric", minNodeSpacing: 8, animate: false },
      wheelSensitivity: 0.2,
      minZoom: 0.05,
      maxZoom: 3,
    });
    cyRef.current.on("tap", "node", (e) => {
      const id = e.target.id();
      window.open(`/topic/${id}`, "_blank");
    });
    return () => {
      cyRef.current?.destroy();
      cyRef.current = null;
    };
  }, [data, enabledKinds, onlyFavorited]);

  function toggleKind(k: EdgeKind) {
    setEnabledKinds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  if (error) return <div>그래프 로드 실패: {error}</div>;
  if (!data) return <div>로딩 중…</div>;
  return (
    <>
      <div className="graph-toolbar">
        <strong>{data.nodes.length} 노드</strong> ·
        <span>{data.edges.length} 엣지</span>
        {ALL_KINDS.map((k) => (
          <label key={k}>
            <input type="checkbox" checked={enabledKinds.has(k)} onChange={() => toggleKind(k)} />
            <span style={{ color: EDGE_COLORS[k] }}>{k}</span>
          </label>
        ))}
        <label>
          <input type="checkbox" checked={onlyFavorited} onChange={(e) => setOnlyFavorited(e.target.checked)} />
          favorited만
        </label>
      </div>
      <div id="graph-canvas" ref={ref} />
    </>
  );
}
