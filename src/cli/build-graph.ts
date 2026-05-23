import { buildGraph, writeGraph } from "../graph/builder.ts";

async function main() {
  console.log("building graph from vault...");
  const t0 = Date.now();
  const graph = await buildGraph();
  const path = await writeGraph(graph);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(
    `wrote ${path} — ${graph.node_count} nodes, ${graph.edge_count} edges (${dt}s)`,
  );
  const byKind: Record<string, number> = {};
  for (const e of graph.edges) byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
  for (const [k, v] of Object.entries(byKind)) console.log(`  ${k}: ${v}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
