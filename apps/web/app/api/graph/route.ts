import { NextResponse } from "next/server";
import { loadGraphJson } from "@/lib/vault";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await loadGraphJson();
  if (!data) {
    return NextResponse.json(
      { error: "graph.json not found. Run `pnpm graph:build` first." },
      { status: 404 },
    );
  }
  return NextResponse.json(data);
}
