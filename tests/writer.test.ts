import { mkdtemp, readFile, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(__dirname, "fixtures/topic-22000.md");

describe("writeTopic", () => {
  let tmp: string;

  beforeAll(async () => {
    tmp = await mkdtemp(join(tmpdir(), "geeknews-crawl-"));
    process.env.VAULT_DIR = tmp;
  });

  async function load() {
    const md = readFileSync(fixturePath, "utf8");
    const { parseUpstreamMarkdown } = await import("../src/crawler/parser.ts");
    const { writeTopic } = await import("../src/crawler/writer.ts");
    return { parsed: parseUpstreamMarkdown(md), writeTopic };
  }

  it("creates new topic file with frontmatter and user section", async () => {
    const { parsed, writeTopic } = await load();
    const result = await writeTopic(22000, parsed);
    expect(result.created).toBe(true);
    expect(result.topicPath).toMatch(/^topics\/2025\/07\/22000-/);

    const written = await readFile(join(tmp, result.topicPath), "utf8");
    expect(written).toContain("<!-- USER:NOTES -->");
    expect(written).toContain("## 요약");
    expect(written).toContain("## 본문");
    expect(written).toContain("## 내 메모");

    const fm = matter(written).data;
    expect(fm.id).toBe(22000);
    expect(fm.points).toBe(35);
    expect(fm.tags).toEqual([]);
    expect(fm.auto_tags).toContain("domain/latpeed.com");
    expect(fm.favorited).toBe(false);
  });

  it("preserves user fields and notes on re-write", async () => {
    const { parsed, writeTopic } = await load();
    const first = await writeTopic(22000, parsed);
    const abs = join(tmp, first.topicPath);
    const original = await readFile(abs, "utf8");
    const parsedFile = matter(original);
    parsedFile.data.tags = ["llm", "startup"];
    parsedFile.data.favorited = true;
    const newContent = `${parsedFile.content.trimEnd()}\n\n내가 작성한 메모입니다.\n`;
    await writeFile(
      abs,
      matter.stringify(newContent, parsedFile.data),
      "utf8",
    );

    const second = await writeTopic(22000, parsed);
    expect(second.created).toBe(false);
    expect(second.topicPath).toBe(first.topicPath);

    const after = await readFile(abs, "utf8");
    const fm = matter(after).data;
    expect(fm.tags).toEqual(["llm", "startup"]);
    expect(fm.favorited).toBe(true);
    expect(after).toContain("내가 작성한 메모입니다.");
  });

  it("writes comments file", async () => {
    const { parsed, writeTopic } = await load();
    const result = await writeTopic(22000, parsed);
    expect(result.commentsPath).toBe("comments/22000.md");
    const written = await readFile(join(tmp, result.commentsPath!), "utf8");
    expect(written).toContain("### Comment 41587");
    expect(written).toContain("[[22000]]");
  });
});
