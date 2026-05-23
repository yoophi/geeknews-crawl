import { iterTopicFiles, validateFrontmatter, extractWikilinkIds } from "../lib/vault.ts";

interface Issue {
  relPath: string;
  kind: "frontmatter" | "filename" | "wikilink";
  message: string;
}

async function main() {
  const issues: Issue[] = [];
  const knownIds = new Set<number>();
  let count = 0;
  for await (const tf of iterTopicFiles()) {
    knownIds.add(tf.id);
    count++;
    const fm = validateFrontmatter(tf.data);
    if (!fm.ok) {
      issues.push({ relPath: tf.relPath, kind: "frontmatter", message: fm.error });
    }
    const expectedPrefix = `${tf.id}-`;
    const fileName = tf.relPath.split("/").pop()!;
    if (!fileName.startsWith(expectedPrefix)) {
      issues.push({
        relPath: tf.relPath,
        kind: "filename",
        message: `filename must start with '${expectedPrefix}'`,
      });
    }
    const dataId = Number(tf.data.id);
    if (dataId !== tf.id) {
      issues.push({
        relPath: tf.relPath,
        kind: "frontmatter",
        message: `frontmatter id=${dataId} does not match filename id=${tf.id}`,
      });
    }
  }

  // second pass: wikilink targets exist
  for await (const tf of iterTopicFiles()) {
    const related = Array.isArray(tf.data.related) ? (tf.data.related as unknown[]) : [];
    const linked = related
      .filter((v): v is string => typeof v === "string")
      .flatMap(extractWikilinkIds);
    for (const target of linked) {
      if (!knownIds.has(target)) {
        issues.push({
          relPath: tf.relPath,
          kind: "wikilink",
          message: `related references unknown topic [[${target}]]`,
        });
      }
    }
  }

  console.log(`scanned ${count} topic files`);
  if (issues.length === 0) {
    console.log("OK — no issues found");
    return;
  }
  console.log(`found ${issues.length} issue(s):\n`);
  for (const i of issues) {
    console.log(`  [${i.kind}] ${i.relPath}\n    ${i.message}`);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
