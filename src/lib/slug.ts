const NON_SLUG = /[^a-z0-9가-힣\s-]/g;
const SPACE = /\s+/g;
const DASH = /-+/g;

export function slugify(title: string, max = 60): string {
  const base = title
    .toLowerCase()
    .normalize("NFKC")
    .replace(NON_SLUG, "")
    .replace(SPACE, "-")
    .replace(DASH, "-")
    .replace(/^-|-$/g, "");
  if (!base) return "untitled";
  if (base.length <= max) return base;
  return base.slice(0, max).replace(/-$/, "");
}

export function topicFilePath(id: number, slug: string, postedAt: string | null): string {
  const d = postedAt ? new Date(postedAt) : new Date();
  const yyyy = d.getUTCFullYear().toString();
  const mm = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  return `topics/${yyyy}/${mm}/${id}-${slug}.md`;
}
