import { NextRequest, NextResponse } from "next/server";
import { deletePatent, getPatents, updatePatent } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const patents = await getPatents();
  return NextResponse.json({ patents });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    }
    await updatePatent(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }
  const ok = await deletePatent(id);
  return NextResponse.json({ success: ok });
}
