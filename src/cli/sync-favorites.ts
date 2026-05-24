import { parseArgs } from "node:util";
import { loadCookieHeader, fetchNavState } from "../crawler/auth.ts";
import { collectFavedIds } from "../crawler/favorites.ts";
import { iterTopicFiles, rewriteTopicFile } from "../lib/vault.ts";
import type { TopicFile } from "../lib/vault.ts";

async function main() {
  const { values } = parseArgs({
    options: {
      "dry-run": { type: "boolean", default: false },
      "max-pages": { type: "string" },
      userid: { type: "string" },
    },
    allowPositionals: true,
  });

  const cookieHeader = await loadCookieHeader();

  let userid = values.userid as string | undefined;
  if (!userid) {
    if (!cookieHeader) {
      console.error(
        "no --userid given and no cookies to auto-detect. Set COOKIE_HEADER/COOKIE_FILE or pass --userid <name>.",
      );
      process.exit(1);
    }
    const nav = await fetchNavState(cookieHeader);
    if (!nav.ok || !nav.logged_in) {
      console.error("auth failed: not logged in. Re-export cookies from your browser.");
      process.exit(2);
    }
    userid = String(nav.userid ?? nav.username ?? "");
    if (!userid) {
      console.error("nav-state did not return a userid");
      process.exit(3);
    }
    console.log(`logged in as ${nav.username ?? nav.userid} (userid=${userid})`);
  } else {
    console.log(`userid=${userid} (passed via flag; auth not required for public favorites page)`);
  }

  const maxPages = values["max-pages"] ? Number.parseInt(values["max-pages"] as string, 10) : 500;
  console.log(`fetching /faved_topics pages (max ${maxPages})...`);
  const favIds = await collectFavedIds(userid, {
    cookieHeader: cookieHeader ?? undefined,
    maxPages,
    onPage: (page, ids, total) => {
      console.log(`  page ${page}: +${ids.length} ids (cumulative ${total})`);
    },
  });
  const favSet = new Set(favIds);
  console.log(`\n${favIds.length} favorited topics on server`);

  const filesById = new Map<number, TopicFile>();
  for await (const tf of iterTopicFiles()) filesById.set(tf.id, tf);
  console.log(`${filesById.size} topics in vault`);

  let added = 0;
  let removed = 0;
  let unchanged = 0;
  const dryRun = !!values["dry-run"];

  for (const [id, tf] of filesById) {
    const wasFav = Boolean(tf.data.favorited);
    const nowFav = favSet.has(id);
    if (wasFav === nowFav) {
      unchanged++;
      continue;
    }
    if (nowFav) added++;
    else removed++;
    console.log(`${nowFav ? "★" : "·"} ${id} favorited: ${wasFav} → ${nowFav}`);
    if (dryRun) continue;
    await rewriteTopicFile(tf, (data, content) => ({
      data: { ...data, favorited: nowFav },
      content,
    }));
  }

  const missing = [...favSet].filter((id) => !filesById.has(id));
  console.log(
    `\ntotal: ${favSet.size} favorited / ${added} added / ${removed} removed / ${unchanged} unchanged${
      dryRun ? " (dry-run)" : ""
    }`,
  );
  if (missing.length > 0) {
    console.log(
      `\n${missing.length} favorited topic(s) not yet in vault — fetch them with:`,
    );
    const preview = missing.slice(0, 10).join(",");
    console.log(
      `  pnpm crawl ids ${preview}${missing.length > 10 ? `,... (+${missing.length - 10})` : ""}`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
