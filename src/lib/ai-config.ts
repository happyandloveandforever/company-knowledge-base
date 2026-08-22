export type AIProvider = "anthropic" | "openai" | "gemini";

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  enabled: boolean;
}

const DEFAULT_MODELS: Record<AIProvider, string> = {
  anthropic: "claude-sonnet-4-20250514",
  openai: "gpt-4o",
  gemini: "gemini-2.0-flash",
};

export function getAIConfig(): AIConfig {
  const anthropicKey = process.env.ANTHROPIC_API_KEY || "";
  const openaiKey = process.env.OPENAI_API_KEY || "";
  const geminiKey = process.env.GEMINI_API_KEY || "";
  const preferred = (process.env.AI_PROVIDER || "anthropic") as AIProvider;

  let apiKey = "";
  let activeProvider: AIProvider = "anthropic";

  if (preferred === "anthropic" && anthropicKey) {
    apiKey = anthropicKey;
    activeProvider = "anthropic";
  } else if (preferred === "openai" && openaiKey) {
    apiKey = openaiKey;
    activeProvider = "openai";
  } else if (preferred === "gemini" && geminiKey) {
    apiKey = geminiKey;
    activeProvider = "gemini";
  } else if (anthropicKey) {
    apiKey = anthropicKey;
    activeProvider = "anthropic";
  } else if (openaiKey) {
    apiKey = openaiKey;
    activeProvider = "openai";
  } else if (geminiKey) {
    apiKey = geminiKey;
    activeProvider = "gemini";
  }

  const model = process.env.AI_MODEL || DEFAULT_MODELS[activeProvider];

  return {
    provider: activeProvider,
    model,
    apiKey,
    enabled: apiKey.length > 0,
  };
}

export function getAIStatusLabel(config: AIConfig): string {
  if (!config.enabled) return "Cursor Claude（对话拆分）";
  const names: Record<AIProvider, string> = {
    anthropic: "Claude API 自动拆分",
    openai: "OpenAI",
    gemini: "Google Gemini",
  };
  return `${names[config.provider]} · ${config.model}`;
}

export function isClaudeProvider(config: AIConfig): boolean {
  return config.provider === "anthropic";
}
