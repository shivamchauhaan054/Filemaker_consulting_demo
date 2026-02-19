export interface AssessmentScores {
  technicalDebt: number;
  schemaComplexity: number;
  scriptComplexity: number;
  migrationDifficulty: number;
  riskIndex: number;
}

export type RiskLevel = "Low" | "Medium" | "High";

export interface ConsultingReport {
  executiveSummary: string[];
  recommendations: ModernizationRecommendation[];
  roiEstimate: ROIEstimate;
}

export interface ModernizationRecommendation {
  title: string;
  description: string;
  items: string[];
}

export interface ROIEstimate {
  estimatedMigrationCost: number;
  threeYearROI: number;
  breakEvenMonths: number;
}

export interface RadarChartData {
  subject: string;
  value: number;
  fullMark: number;
}

