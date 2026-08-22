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
}

export interface SourceFile {
  id: string;
  filename: string;
  fileType: "pptx" | "docx" | "other";
  uploadedAt: string;
  knowledgePointIds: string[];
  status: "processing" | "done" | "error";
  error?: string;
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
