import { NextResponse } from "next/server";
import { getAIConfig, getAIStatusLabel } from "@/lib/ai-config";

export async function GET() {
  const config = getAIConfig();
  return NextResponse.json({
    enabled: config.enabled,
    provider: config.provider,
    model: config.model,
    label: getAIStatusLabel(config),
    mode: config.enabled ? "api" : "cursor",
  });
}
