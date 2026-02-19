import type { AssessmentScores, ConsultingReport, RadarChartData } from "@/types";

export const MOCK_SCORES: AssessmentScores = {
  technicalDebt: 72,
  schemaComplexity: 64,
  scriptComplexity: 78,
  migrationDifficulty: 69,
  riskIndex: 74,
};

export const MOCK_RADAR_DATA: RadarChartData[] = [
  { subject: "Technical Debt", value: 72, fullMark: 100 },
  { subject: "Schema Complexity", value: 64, fullMark: 100 },
  { subject: "Script Complexity", value: 78, fullMark: 100 },
  { subject: "Migration Difficulty", value: 69, fullMark: 100 },
  { subject: "Risk Index", value: 74, fullMark: 100 },
];

export const MOCK_BAR_DATA = [
  { name: "Technical Debt", value: 72, fill: "#ef4444" },
  { name: "Schema Complexity", value: 64, fill: "#eab308" },
  { name: "Script Complexity", value: 78, fill: "#ef4444" },
  { name: "Migration Difficulty", value: 69, fill: "#eab308" },
  { name: "Risk Index", value: 74, fill: "#ef4444" },
];

export const MOCK_CONSULTING_REPORT: ConsultingReport = {
  executiveSummary: [
    "The comprehensive DDR (Data Dictionary Report) analysis reveals a FileMaker solution with significant technical debt accumulation. The legacy architecture exhibits high coupling between business logic and presentation layers, with approximately 78% script complexity indicating substantial refactoring requirements. Critical schema dependencies and undocumented relationships pose migration risks that warrant immediate strategic attention.",
    "Our AI-powered assessment identifies 47 custom scripts with circular dependencies and 12 tables with orphaned relationships. The migration difficulty score of 69/100 suggests a phased approach is essential—attempting a big-bang migration would expose the organization to unacceptable operational risk. The current state analysis indicates an estimated 14-month timeline to achieve production parity on modern infrastructure.",
    "The risk index of 74 (High) underscores the urgency for executive decision-making. Organizations continuing on the current trajectory face increasing maintenance costs, talent scarcity for legacy platforms, and competitive disadvantage. The recommended AWS replatforming with modular monolith architecture offers a balanced path to modernization while preserving business continuity.",
  ],
  recommendations: [
    {
      title: "Replatform to AWS",
      description: "Migrate the FileMaker solution to a cloud-native architecture on Amazon Web Services, leveraging managed services for database, compute, and storage.",
      items: [
        "Amazon RDS (PostgreSQL) for relational data",
        "AWS Lambda for serverless business logic",
        "Amazon S3 for file storage and attachments",
        "AWS API Gateway for RESTful APIs",
      ],
    },
    {
      title: "Modular Monolith Architecture",
      description: "Adopt a modular monolith pattern that allows incremental decomposition while maintaining a single deployable unit during transition.",
      items: [
        "Domain-driven design boundaries",
        "Clear module interfaces via internal APIs",
        "Shared kernel for cross-cutting concerns",
        "Path to microservices when business justifies",
      ],
    },
    {
      title: "Phased Migration Approach",
      description: "Execute migration in four phases over 14 months, minimizing business disruption and enabling continuous value delivery.",
      items: [
        "Phase 1 (Months 1-3): Schema extraction and API layer",
        "Phase 2 (Months 4-7): Core business logic migration",
        "Phase 3 (Months 8-11): UI modernization and integration",
        "Phase 4 (Months 12-14): Cutover and optimization",
      ],
    },
  ],
  roiEstimate: {
    estimatedMigrationCost: 185000,
    threeYearROI: 240,
    breakEvenMonths: 14,
  },
};

export const ARCHITECTURE_DIAGRAM = `graph TD
    A[Legacy FileMaker] --> B[AI Analysis Layer]
    B --> C[API Layer]
    C --> D[PostgreSQL]
    C --> E[Cloud Infrastructure]
    E --> F[AWS]`;

