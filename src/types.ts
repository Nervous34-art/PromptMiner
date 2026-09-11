export interface Scores {
  frequency: number;
  willingnessToPay: number;
  feasibility: number;
  competition: number;
  overall: number;
}

export type DifficultyLevel = 'Low' | 'Medium' | 'High';

export interface AppIdea {
  title: string;
  oneLiner: string;
  problem: string;
  targetUser: string;
  mvpFeatures: string[];
  monetization: string;
  difficulty: DifficultyLevel;
  scores: Scores;
  whyItFits: string;
  evidence: string[];
}

export interface Cluster {
  name: string;
  frequency: number;
  painPoint: string;
  evidence: string[];
}

export interface BuildPlan {
  prd: string;
  techStack: string[];
  schema: string;
  sprint: string[];
}

export interface AnalysisResult {
  summary: string;
  clusters: Cluster[];
  ideas: AppIdea[];
  buildPlan: BuildPlan;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  promptsCount: number;
  promptsRaw: string;
  result: AnalysisResult;
  modelUsed: string;
  isDemo?: boolean;
}

export type TabType = 'summary' | 'clusters' | 'ideas' | 'buildPlan' | 'rawJson';

export interface SamplePreset {
  id: string;
  label: string;
  description: string;
  prompts: string[];
}
