export type KnowledgeStatus = "draft" | "review" | "approved";

/** 知识分层：通识（公开科学/政策）vs 公司自有（产品、报价、SOP、案例） */
export type KnowledgeLayer = "commons" | "company";

/** 使用场景：不是第三层。同一条知识可同时服务汇报与培训。 */
export type KnowledgeUsage = "pitch" | "training" | "ops" | "both";

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
  /** 通识层 / 公司自有层。缺省按公司自有处理。 */
  layer?: KnowledgeLayer;
  /** 汇报、培训、运营。缺省按汇报+培训。 */
  usage?: KnowledgeUsage;
  /** 仅内训：禁止进客户资料与对外 PPT。编排页默认排除。 */
  internalOnly?: boolean;
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

/** 专利库卡片类型：与知识点总库分开，不进 /open、不进编排 */
export type PatentKind =
  | "rule"
  | "roadmap"
  | "layout"
  | "cluster"
  | "retrieved"
  | "gap"
  /** 交底书撰写指南：模板、采访清单、红线自检 */
  | "draft";

export type PatentRisk = "critical" | "high" | "medium" | "low" | "green";

export type PatentCluster = "1" | "2" | "3" | "4" | "5" | "6" | "cross";

/**
 * 卡片是否还算数。库里同时存着现行结论和被推翻的旧结论，
 * 没有这个字段就只能靠读标题猜，读错会按作废方案去申请。
 */
export type PatentLifecycle = "active" | "superseded" | "killed" | "stale";

/** 申请分组（PAT-BATCH-002）。母案框架已退役，改按特定技术特征分组。 */
export type PatentGroup = "g1" | "g2" | "g3" | "g4" | "g5" | "none";

export interface PatentRecord {
  id: string;
  kind: PatentKind;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  cluster: PatentCluster;
  risk?: PatentRisk;
  lifecycle?: PatentLifecycle;
  group?: PatentGroup;
  /** superseded 时指向取代它的卡，便于顺着读到现行结论 */
  supersededBy?: string;
  /** 公开号 / 申请号，检索卡必填 */
  publicationNo?: string;
  applicationNo?: string;
  jurisdiction?: string;
  techBranch?: string;
  productLine?: string;
  familyId?: string;
  relatedIds: string[];
  examples: string[];
  source: KnowledgeSource;
  status: KnowledgeStatus;
  /** 默认内部。未公开交底不得改 public */
  confidentiality: "internal" | "public";
  createdAt: string;
  updatedAt: string;
}

export interface PatentSourceFile {
  id: string;
  filename: string;
  cluster?: PatentCluster;
  fileType: SourceFile["fileType"];
  uploadedAt: string;
  patentIds: string[];
  status: SourceFile["status"];
  splitMode?: SourceFile["splitMode"];
  note?: string;
}
