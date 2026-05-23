import { findTopicById, rewriteTopicFile } from "../lib/vault.ts";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: pnpm tag <id> <tag...> [--remove]");
    process.exit(1);
  }
  const removeMode = args.includes("--remove");
  const rest = args.filter((a) => a !== "--remove");
  const id = Number.parseInt(rest[0]!, 10);
  const tags = rest.slice(1);
  if (!Number.isFinite(id) || tags.length === 0) {
    console.error("invalid id or tags");
    process.exit(1);
  }
  const tf = await findTopicById(id);
  if (!tf) {
    console.error(`topic ${id} not found`);
    process.exit(1);
  }
  await rewriteTopicFile(tf, (data, content) => {
    const current = new Set(Array.isArray(data.tags) ? (data.tags as string[]) : []);
    for (const t of tags) {
      if (removeMode) current.delete(t);
      else current.add(t);
    }
    return { data: { ...data, tags: [...current].sort() }, content };
  });
  console.log(`${removeMode ? "removed" : "added"} ${tags.join(", ")} → ${id} (${tf.relPath})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
