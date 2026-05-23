import { findTopicById } from "../lib/vault.ts";

async function main() {
  const id = Number.parseInt(process.argv[2] ?? "", 10);
  if (!Number.isFinite(id)) {
    console.error("Usage: pnpm note <id>");
    process.exit(1);
  }
  const tf = await findTopicById(id);
  if (!tf) {
    console.error(`topic ${id} not found`);
    process.exit(1);
  }
  console.log(tf.absPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
