import { XMLParser } from "fast-xml-parser";
import type {
  AssessmentScores,
  DdrAnalyticsResponse,
  DdrTotals,
  RadarChartData,
  DdrBarDatum,
  ConsultingReport,
} from "@/types";

type AnyObject = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  allowBooleanAttributes: true,
  attributeNamePrefix: "@_",
});

interface TraversalResult extends DdrTotals {
  scriptSteps: number;
}

const initialTraversalResult: TraversalResult = {
  totalTables: 0,
  totalFields: 0,
  totalRelationships: 0,
  totalScripts: 0,
  totalLayouts: 0,
  totalValueLists: 0,
  totalCustomFunctions: 0,
  scriptSteps: 0,
};

function traverseDdr(node: unknown, acc: TraversalResult): void {
  if (!node) return;

  if (Array.isArray(node)) {
    for (const item of node) {
      traverseDdr(item, acc);
    }
    return;
  }

  if (typeof node !== "object") {
    return;
  }

  const obj = node as AnyObject;

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    if (
      lowerKey === "table" ||
      lowerKey === "basetable" ||
      lowerKey === "tables"
    ) {
      if (Array.isArray(value)) {
        acc.totalTables += value.length;
      } else {
        acc.totalTables += 1;
      }
    }

    if (lowerKey === "field" || lowerKey === "fields") {
      if (Array.isArray(value)) {
        acc.totalFields += value.length;
      } else {
        acc.totalFields += 1;
      }
    }

    if (
      lowerKey === "relationship" ||
      lowerKey === "relationships" ||
      lowerKey === "relation"
    ) {
      if (Array.isArray(value)) {
        acc.totalRelationships += value.length;
      } else {
        acc.totalRelationships += 1;
      }
    }

    if (lowerKey === "script" || lowerKey === "scripts") {
      if (Array.isArray(value)) {
        acc.totalScripts += value.length;
      } else {
        acc.totalScripts += 1;
      }
    }

    if (lowerKey === "layout" || lowerKey === "layouts") {
      if (Array.isArray(value)) {
        acc.totalLayouts += value.length;
      } else {
        acc.totalLayouts += 1;
      }
    }

    if (
      lowerKey === "valuelist" ||
      lowerKey === "valuelists" ||
      lowerKey === "value_list"
    ) {
      if (Array.isArray(value)) {
        acc.totalValueLists += value.length;
      } else {
        acc.totalValueLists += 1;
      }
    }

    if (
      lowerKey === "customfunction" ||
      lowerKey === "customfunctions" ||
      lowerKey === "custom_function"
    ) {
      if (Array.isArray(value)) {
        acc.totalCustomFunctions += value.length;
      } else {
        acc.totalCustomFunctions += 1;
      }
    }

    if (lowerKey === "step" || lowerKey === "steps") {
      if (Array.isArray(value)) {
        acc.scriptSteps += value.length;
      } else {
        acc.scriptSteps += 1;
      }
    }

    traverseDdr(value, acc);
  }
}

export function parseDdrXml(xml: string): DdrTotals & { scriptSteps: number } {
  const parsed = parser.parse(xml);
  const acc: TraversalResult = { ...initialTraversalResult };

  traverseDdr(parsed, acc);

  return acc;
}

function clampScore(val: number): number {
  if (Number.isNaN(val) || !Number.isFinite(val)) return 0;
  if (val < 0) return 0;
  if (val > 100) return 100;
  return Math.round(val);
}

export function computeScores(totals: DdrTotals & { scriptSteps: number }): AssessmentScores {
  const {
    totalTables,
    totalFields,
    totalRelationships,
    totalScripts,
    totalLayouts,
    totalValueLists,
    totalCustomFunctions,
    scriptSteps,
  } = totals;

  const sizeFactor =
    Math.log10(Math.max(1, totalFields + totalTables)) * 18 +
    Math.log10(Math.max(1, totalRelationships)) * 10;

  const scriptPerTable = totalTables ? totalScripts / totalTables : totalScripts;
  const avgStepsPerScript = totalScripts ? scriptSteps / totalScripts : scriptSteps;

  const technicalDebtBase =
    sizeFactor +
    scriptPerTable * 4 +
    (totalValueLists + totalCustomFunctions) * 0.6;

  const schemaComplexityBase =
    (totalFields / Math.max(1, totalTables)) * 4 +
    totalRelationships * 0.6 +
    totalLayouts * 0.4;

  const scriptComplexityBase =
    scriptPerTable * 6 +
    avgStepsPerScript * 1.5 +
    totalScripts * 0.4;

  const migrationDifficultyBase =
    schemaComplexityBase * 0.5 +
    scriptComplexityBase * 0.4 +
    technicalDebtBase * 0.3;

  const technicalDebt = clampScore(technicalDebtBase);
  const schemaComplexity = clampScore(schemaComplexityBase);
  const scriptComplexity = clampScore(scriptComplexityBase);
  const migrationDifficulty = clampScore(migrationDifficultyBase / 2);
  const riskIndex = clampScore(
    technicalDebt * 0.3 +
      schemaComplexity * 0.2 +
      scriptComplexity * 0.25 +
      migrationDifficulty * 0.25
  );

  return {
    technicalDebt,
    schemaComplexity,
    scriptComplexity,
    migrationDifficulty,
    riskIndex,
  };
}

export function buildRadarData(scores: AssessmentScores): RadarChartData[] {
  return [
    { subject: "Technical Debt", value: scores.technicalDebt, fullMark: 100 },
    { subject: "Schema Complexity", value: scores.schemaComplexity, fullMark: 100 },
    { subject: "Script Complexity", value: scores.scriptComplexity, fullMark: 100 },
    { subject: "Migration Difficulty", value: scores.migrationDifficulty, fullMark: 100 },
    { subject: "Risk Index", value: scores.riskIndex, fullMark: 100 },
  ];
}

export function buildBarData(scores: AssessmentScores): DdrBarDatum[] {
  const colorFor = (v: number) =>
    v <= 40 ? "#22c55e" : v <= 70 ? "#eab308" : "#ef4444";

  return [
    {
      name: "Technical Debt",
      value: scores.technicalDebt,
      fill: colorFor(scores.technicalDebt),
    },
    {
      name: "Schema Complexity",
      value: scores.schemaComplexity,
      fill: colorFor(scores.schemaComplexity),
    },
    {
      name: "Script Complexity",
      value: scores.scriptComplexity,
      fill: colorFor(scores.scriptComplexity),
    },
    {
      name: "Migration Difficulty",
      value: scores.migrationDifficulty,
      fill: colorFor(scores.migrationDifficulty),
    },
    {
      name: "Risk Index",
      value: scores.riskIndex,
      fill: colorFor(scores.riskIndex),
    },
  ];
}

export function buildConsultingReport(
  totals: DdrTotals,
  scores: AssessmentScores
): ConsultingReport {
  const {
    totalTables,
    totalFields,
    totalRelationships,
    totalScripts,
    totalLayouts,
    totalValueLists,
    totalCustomFunctions,
  } = totals;

  const { technicalDebt, schemaComplexity, scriptComplexity, migrationDifficulty, riskIndex } =
    scores;

  const executiveSummary = [
    `The DDR analysis found ${totalTables} tables, ${totalFields} fields and ${totalRelationships} relationships, indicating a solution of moderate to high structural complexity. The schema complexity score of ${schemaComplexity}/100 reflects the density of fields per table and the number of inter-table dependencies.`,
    `The script inventory includes ${totalScripts} scripts across ${totalLayouts} layouts, with a script complexity score of ${scriptComplexity}/100. Combined with ${totalValueLists} value lists and ${totalCustomFunctions} custom functions, the technical debt score of ${technicalDebt}/100 highlights the effort required to safely refactor business logic.`,
    `Overall risk is measured at ${riskIndex}/100, and migration difficulty at ${migrationDifficulty}/100. These scores suggest that modernization should follow a phased approach with early focus on stabilizing schema hotspots and high-churn scripts before full replatforming.`,
  ];

  const recommendations = [
    {
      title: "Stabilize Core Schema",
      description:
        "Prioritize tables and relationships that drive the highest complexity scores before changing platform boundaries.",
      items: [
        `Identify the top 10–20 tables by field count and relationship fan-out from the ${totalTables} detected.`,
        "Normalize overly wide tables and reduce deeply nested dependencies where feasible.",
        "Introduce clear ownership boundaries around high-traffic tables used by critical layouts.",
      ],
    },
    {
      title: "Refactor High-Risk Scripts",
      description:
        "Reduce behavioral complexity and coupling in the script layer to lower migration risk.",
      items: [
        `Rank the ${totalScripts} scripts by usage and complexity, focusing on those attached to critical layouts.`,
        "Extract reusable routines from long scripts into smaller, composable units.",
        "Eliminate dead or rarely used scripts to reduce surface area before migration.",
      ],
    },
    {
      title: "Plan Phased Modernization",
      description:
        "Use the DDR-derived metrics to stage modernization into manageable, low-risk phases.",
      items: [
        "Phase 1: Read-only extraction of schema and reference data into a modern database.",
        "Phase 2: Wrap high-value workflows with APIs while FileMaker remains the system of record.",
        "Phase 3: Gradually replace UI and scripting with cloud-native components, driven by risk and complexity scores.",
      ],
    },
  ];

  const estimatedMigrationCost =
    (totalTables * 1200 +
      totalFields * 80 +
      totalRelationships * 200 +
      totalScripts * 250) *
    (0.5 + riskIndex / 200);

  const threeYearROI =
    80 +
    technicalDebt * 0.8 +
    scriptComplexity * 0.4 -
    migrationDifficulty * 0.2;

  const breakEvenMonths = clampScore(
    6 + migrationDifficulty / 5 + riskIndex / 8
  );

  const roiEstimate = {
    estimatedMigrationCost: Math.round(estimatedMigrationCost),
    threeYearROI: clampScore(threeYearROI),
    breakEvenMonths,
  };

  return {
    executiveSummary,
    recommendations,
    roiEstimate,
  };
}

export function buildArchitectureDiagram(totals: DdrTotals, scores: AssessmentScores): string {
  const sizeLabel =
    totals.totalTables > 80
      ? "Large"
      : totals.totalTables > 30
      ? "Medium"
      : "Small";

  const riskLabel =
    scores.riskIndex > 70 ? "High" : scores.riskIndex > 40 ? "Medium" : "Low";

  return `graph TD
    A[Legacy FileMaker (${sizeLabel} solution)] --> B[AI DDR Analysis]
    B --> C[Schema Service]
    B --> D[Script Analytics]
    C --> E[(Modern Database)]
    D --> F[API Layer]
    F --> G[New Applications]
    B --> H[Risk Engine (${riskLabel} Risk)]
  `;
}

export function buildDdrAnalyticsResponse(params: {
  id: string;
  fileName: string;
  totals: DdrTotals & { scriptSteps: number };
  scores: AssessmentScores;
}): DdrAnalyticsResponse {
  const { id, fileName, totals, scores } = params;

  const radarData = buildRadarData(scores);
  const barData = buildBarData(scores);
  const consultingReport = buildConsultingReport(totals, scores);
  const architectureDiagram = buildArchitectureDiagram(totals, scores);

  return {
    id,
    fileName,
    totals,
    scores,
    radarData,
    barData,
    consultingReport,
    architectureDiagram,
  };
}

