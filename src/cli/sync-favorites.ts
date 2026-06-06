import { parseArgs } from "node:util";
import { loadCookieHeader, getAuthCookieHeader } from "../crawler/auth.ts";
import { collectFavedIds, fetchViewerStates, isFavorited } from "../crawler/favorites.ts";
import { iterTopicFiles, rewriteTopicFile } from "../lib/vault.ts";
import type { TopicFile } from "../lib/vault.ts";

/**
 * Sync favorited flags from news.hada.io into vault frontmatter.
 *
 * Default source: /faved_topics?userid=X&page=N (public, no auth needed).
 *   ⚠ The site caps this listing at ~400 most-recent favorites, so it can
 *   only ADD flags reliably. Removal is therefore opt-in via --prune and
 *   only safe with --via-api.
 *
 * --via-api: query /api/viewer/topics?ids= for EVERY vault topic (auth
 *   required, ~1 req/sec per 100 ids). Authoritative for the full vault —
 *   use for recovery/reconciliation, and the only safe source for --prune.
 */
async function main() {
  const { values } = parseArgs({
    options: {
      "dry-run": { type: "boolean", default: false },
      "max-pages": { type: "string" },
      userid: { type: "string" },
      "via-api": { type: "boolean", default: false },
      prune: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });
  const dryRun = !!values["dry-run"];
  const viaApi = !!values["via-api"];
  const prune = !!values.prune;

  if (prune && !viaApi) {
    console.error(
      "--prune requires --via-api: the /faved_topics listing is capped (~400 items),\n" +
        "so absence there does NOT mean un-favorited. Aborting to protect existing flags.",
    );
    process.exit(1);
  }

  const filesById = new Map<number, TopicFile>();
  for await (const tf of iterTopicFiles()) filesById.set(tf.id, tf);
  console.log(`${filesById.size} topics in vault`);

  let favSet: Set<number>;
  let coversWholeVault: boolean;

  if (viaApi) {
    const { cookieHeader, nav } = await getAuthCookieHeader();
    console.log(`logged in as ${nav.username ?? nav.userid}`);
    const allIds = [...filesById.keys()];
    console.log(`querying viewer API for ${allIds.length} ids (batches of 100)...`);
    const states = await fetchViewerStates(allIds, cookieHeader, {
      onBatch: (done, total) => {
        if (done % 1000 === 0 || done === total) console.log(`  ${done}/${total}`);
      },
    });
    favSet = new Set([...states.entries()].filter(([, s]) => isFavorited(s)).map(([id]) => id));
    coversWholeVault = true;
  } else {
    let userid = values.userid as string | undefined;
    let cookieHeader = await loadCookieHeader();
    if (!userid) {
      if (process.env.GEEKNEWS_USERID) {
        // public page only needs the userid; avoid auth round-trips
        userid = process.env.GEEKNEWS_USERID;
        console.log(`userid=${userid} (from GEEKNEWS_USERID)`);
      } else {
        const auth = await getAuthCookieHeader();
        cookieHeader = auth.cookieHeader;
        userid = String(auth.nav.userid ?? auth.nav.username ?? "");
        console.log(`logged in as ${auth.nav.username ?? auth.nav.userid} (userid=${userid})`);
      }
    }
    const maxPages = values["max-pages"]
      ? Number.parseInt(values["max-pages"] as string, 10)
      : 500;
    console.log(`fetching /faved_topics pages (max ${maxPages})...`);
    const ids = await collectFavedIds(userid, {
      cookieHeader: cookieHeader ?? undefined,
      maxPages,
      onPage: (page, pageIds, total) => {
        console.log(`  page ${page}: +${pageIds.length} ids (cumulative ${total})`);
      },
    });
    favSet = new Set(ids);
    coversWholeVault = false;
    console.log(
      `\n${ids.length} favorites visible on /faved_topics (site caps this listing — add-only mode)`,
    );
  }

  let added = 0;
  let removed = 0;
  const canRemove = prune && coversWholeVault;
  for (const [id, tf] of filesById) {
    const wasFav = Boolean(tf.data.favorited);
    const nowFav = favSet.has(id);
    // favorited if seen on server; otherwise keep, unless pruning with full coverage
    const nextFav = nowFav || (wasFav && !canRemove);
    if (nextFav === wasFav) continue;
    if (nextFav) added++;
    else removed++;
    console.log(`${nextFav ? "★" : "·"} ${id} favorited: ${wasFav} → ${nextFav}`);
    if (dryRun) continue;
    await rewriteTopicFile(tf, (data, content) => ({
      data: { ...data, favorited: nextFav },
      content,
    }));
  }

  console.log(
    `\ntotal: ${favSet.size} favorited on server / ${added} added / ${removed} removed${
      dryRun ? " (dry-run)" : ""
    }`,
  );

  const missing = [...favSet].filter((id) => !filesById.has(id));
  if (missing.length > 0) {
    const preview = missing.slice(0, 10).join(",");
    console.log(`\n${missing.length} favorited topic(s) not yet in vault — fetch with:`);
    console.log(`  pnpm crawl ids ${preview}${missing.length > 10 ? ` (+${missing.length - 10} more)` : ""}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
