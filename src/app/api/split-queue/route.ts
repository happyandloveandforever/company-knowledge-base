import { NextResponse } from "next/server";
import { getSplitQueue, getPendingSplitQueue } from "@/lib/split-queue";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pendingOnly = searchParams.get("pending") === "1";

  const items = pendingOnly ? await getPendingSplitQueue() : await getSplitQueue();

  return NextResponse.json({
    items,
    pendingCount: items.filter((i) => i.status === "pending").length,
  });
}
