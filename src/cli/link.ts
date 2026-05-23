import { findTopicById, rewriteTopicFile } from "../lib/vault.ts";

async function main() {
  const args = process.argv.slice(2);
  const removeMode = args.includes("--remove");
  const rest = args.filter((a) => a !== "--remove");
  if (rest.length < 2) {
    console.error("Usage: pnpm link <src-id> <dst-id...> [--remove]");
    process.exit(1);
  }
  const srcId = Number.parseInt(rest[0]!, 10);
  const dstIds = rest.slice(1).map((s) => Number.parseInt(s, 10));
  if (!Number.isFinite(srcId) || dstIds.some((d) => !Number.isFinite(d))) {
    console.error("invalid ids");
    process.exit(1);
  }
  const src = await findTopicById(srcId);
  if (!src) {
    console.error(`topic ${srcId} not found`);
    process.exit(1);
  }
  const dstFiles = await Promise.all(dstIds.map((id) => findTopicById(id)));
  const missing = dstIds.filter((_, i) => !dstFiles[i]);
  if (missing.length) {
    console.error(`unknown target id(s): ${missing.join(", ")}`);
    process.exit(1);
  }
  const newLinks = dstFiles.map((tf) => `[[${tf!.id}-${slugFromPath(tf!.relPath)}]]`);
  await rewriteTopicFile(src, (data, content) => {
    const current = new Set(Array.isArray(data.related) ? (data.related as string[]) : []);
    const targetIds = new Set(dstIds.map((id) => `[[${id}`));
    if (removeMode) {
      for (const link of [...current]) {
        if ([...targetIds].some((t) => link.startsWith(t))) current.delete(link);
      }
    } else {
      for (const link of newLinks) current.add(link);
    }
    return { data: { ...data, related: [...current].sort() }, content };
  });
  console.log(
    `${removeMode ? "removed" : "added"} ${dstIds.length} link(s) on ${srcId} → ${src.relPath}`,
  );
}

function slugFromPath(rel: string): string {
  const file = rel.split("/").pop()!;
  return file.replace(/^\d+-/, "").replace(/\.md$/, "");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
