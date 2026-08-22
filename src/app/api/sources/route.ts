import { NextResponse } from "next/server";
import { getSourceFiles } from "@/lib/storage";

export async function GET() {
  const sources = await getSourceFiles();
  return NextResponse.json({ sources });
}
