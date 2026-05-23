import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseUpstreamMarkdown, extractDomain, buildFrontmatter } from "../src/crawler/parser.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(__dirname, "fixtures/topic-22000.md");

describe("parseUpstreamMarkdown", () => {
  const md = readFileSync(fixturePath, "utf8");
  const parsed = parseUpstreamMarkdown(md);

  it("extracts title", () => {
    expect(parsed.meta.title).toBe("샘 알트만의 스타트업 플레이북 한국어 번역");
  });

  it("extracts metadata fields", () => {
    expect(parsed.meta.author).toBe("mobeah");
    expect(parsed.meta.points).toBe(35);
    expect(parsed.meta.commentsCount).toBe(20);
    expect(parsed.meta.originalSourceUrl).toBe("https://www.latpeed.com/products/rCoSX");
    expect(parsed.meta.published).toBe("2025-07-15T20:21:13+09:00");
    expect(parsed.meta.type).toBe("news");
  });

  it("extracts summary, body, comments separately", () => {
    expect(parsed.summary.length).toBeGreaterThan(20);
    expect(parsed.topicBody).toContain("10년전");
    expect(parsed.commentsSection).toContain("### Comment 41587");
  });
});

describe("extractDomain", () => {
  it("strips www", () => {
    expect(extractDomain("https://www.example.com/x")).toBe("example.com");
  });
  it("returns null for invalid", () => {
    expect(extractDomain(null)).toBeNull();
    expect(extractDomain("not a url")).toBeNull();
  });
});

describe("buildFrontmatter", () => {
  const md = readFileSync(fixturePath, "utf8");
  const parsed = parseUpstreamMarkdown(md);

  it("merges preserved user fields", () => {
    const fm = buildFrontmatter(22000, parsed, {
      tags: ["llm", "startup"],
      related: ["[[9081-startup-playbook]]"],
      favorited: true,
    });
    expect(fm.tags).toEqual(["llm", "startup"]);
    expect(fm.related).toEqual(["[[9081-startup-playbook]]"]);
    expect(fm.favorited).toBe(true);
    expect(fm.auto_tags).toContain("domain/latpeed.com");
    expect(fm.auto_tags).toContain("type/news");
  });

  it("works with no preserved state", () => {
    const fm = buildFrontmatter(22000, parsed, null);
    expect(fm.tags).toEqual([]);
    expect(fm.favorited).toBe(false);
    expect(fm.id).toBe(22000);
    expect(fm.title).toBe("샘 알트만의 스타트업 플레이북 한국어 번역");
  });
});
