export type AIProvider = "openai" | "gemini";

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  enabled: boolean;
}

const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: "gpt-4o",
  gemini: "gemini-2.0-flash",
};

export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || "openai") as AIProvider;
  const openaiKey = process.env.OPENAI_API_KEY || "";
  const geminiKey = process.env.GEMINI_API_KEY || "";

  let apiKey = "";
  let activeProvider = provider;

  if (provider === "gemini" && geminiKey) {
    apiKey = geminiKey;
    activeProvider = "gemini";
  } else if (openaiKey) {
    apiKey = openaiKey;
    activeProvider = "openai";
  } else if (geminiKey) {
    apiKey = geminiKey;
    activeProvider = "gemini";
  }

  const model =
    process.env.AI_MODEL ||
    DEFAULT_MODELS[activeProvider];

  return {
    provider: activeProvider,
    model,
    apiKey,
    enabled: apiKey.length > 0,
  };
}

export function getAIStatusLabel(config: AIConfig): string {
  if (!config.enabled) return "未配置（使用基础拆分）";
  const names: Record<AIProvider, string> = {
    openai: "OpenAI",
    gemini: "Google Gemini",
  };
  return `${names[config.provider]} · ${config.model}`;
}
