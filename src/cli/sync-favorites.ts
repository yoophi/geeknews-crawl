import { parseArgs } from "node:util";
import { loadCookieHeader, fetchNavState } from "../crawler/auth.ts";
import { fetchViewerStates, isFavorited } from "../crawler/favorites.ts";
import { iterTopicFiles, rewriteTopicFile } from "../lib/vault.ts";
import type { TopicFile } from "../lib/vault.ts";

async function main() {
  const { values } = parseArgs({
    options: {
      "dry-run": { type: "boolean", default: false },
      batch: { type: "string", default: "100" },
      limit: { type: "string" },
    },
    allowPositionals: true,
  });

  const cookieHeader = await loadCookieHeader();
  if (!cookieHeader) {
    console.error(
      "no cookies found. Set COOKIE_HEADER env or COOKIE_FILE in .env (Netscape cookies.txt or JSON object).",
    );
    process.exit(1);
  }

  const nav = await fetchNavState(cookieHeader);
  if (!nav.ok || !nav.logged_in) {
    console.error("auth failed: not logged in. Re-export cookies from your browser.");
    process.exit(2);
  }
  console.log(`logged in as ${nav.username ?? nav.userid ?? "<?>"} (userid=${nav.userid ?? "?"})`);

  const ids: number[] = [];
  const filesById = new Map<number, TopicFile>();
  for await (const tf of iterTopicFiles()) {
    ids.push(tf.id);
    filesById.set(tf.id, tf);
  }
  console.log(`${ids.length} topics in vault`);

  const limited = values.limit ? ids.slice(0, Number.parseInt(values.limit, 10)) : ids;
  const batch = Number.parseInt(values.batch as string, 10);
  console.log(`querying viewer state for ${limited.length} topics in batches of ${batch}...`);

  const states = await fetchViewerStates(limited, cookieHeader, batch);
  let favs = 0;
  let changed = 0;
  const dryRun = !!values["dry-run"];

  for (const id of limited) {
    const tf = filesById.get(id);
    if (!tf) continue;
    const state = states.get(id);
    const nowFav = isFavorited(state);
    const wasFav = Boolean(tf.data.favorited);
    if (nowFav) favs++;
    if (nowFav === wasFav) continue;
    changed++;
    console.log(`${nowFav ? "★" : "·"} ${id} favorited: ${wasFav} → ${nowFav}`);
    if (dryRun) continue;
    await rewriteTopicFile(tf, (data, content) => ({
      data: { ...data, favorited: nowFav },
      content,
    }));
  }

  console.log(`\ntotal: ${favs} favorited / ${changed} updated${dryRun ? " (dry-run)" : ""}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
