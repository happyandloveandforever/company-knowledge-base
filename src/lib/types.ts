export type KnowledgeStatus = "draft" | "review" | "approved";

export interface KnowledgeSource {
  file: string;
  location?: string;
  author?: string;
  date?: string;
}

export interface KnowledgePoint {
  id: string;
  title: string;
  category: string;
  tags: string[];
  audience: string[];
  prerequisites: string[];
  summary: string;
  body: string;
  examples: string[];
  source: KnowledgeSource;
  scenarios: string[];
  durationMin: number;
  version: string;
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
  /** 冲突组 ID：同组知识点为不同版本/表述，可并存 */
  variantGroupId?: string;
  /** 版本标签，如「政府版愿景」「投资人版愿景」 */
  variantLabel?: string;
  /** 允许与其他版本冲突（针对不同客户，非错误） */
  conflictAllowed?: boolean;
  /** 冲突说明，如「杨浦政府汇报用」「B端销售用」 */
  conflictNote?: string;
  /** 本组内首选版本（编排演讲时默认选中） */
  isPreferredInGroup?: boolean;
}

export interface SourceFile {
  id: string;
  filename: string;
  fileType: "pptx" | "docx" | "pdf" | "md" | "html" | "txt" | "image" | "other";
  uploadedAt: string;
  knowledgePointIds: string[];
  status: "processing" | "done" | "error" | "pending_claude";
  error?: string;
  splitMode?: "claude-api" | "claude-agent" | "ai" | "basic" | "queued";
  note?: string;
}

export interface PresentationLogic {
  id: string;
  name: string;
  description: string;
  steps: string[];
}

export interface OutlineSlide {
  order: number;
  title: string;
  bullets: string[];
  knowledgePointIds: string[];
  logicStep?: string;
  speakerNotes?: string;
}

export interface Outline {
  id: string;
  title: string;
  audience: string;
  durationMin: number;
  logicId: string;
  logicName: string;
  slides: OutlineSlide[];
  knowledgePointIds: string[];
  createdAt: string;
}

export interface ParsedChunk {
  title: string;
  body: string;
  location?: string;
}

export interface ConflictGroup {
  id: string;
  topic: string;
  type: "numeric" | "definition" | "mixed";
  memberIds: string[];
  allowedConflict: boolean;
  note?: string;
  details: string[];
}
