-- CreateTable
CREATE TABLE "DdrAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,
    "rawXmlSize" INTEGER NOT NULL,
    "totalTables" INTEGER NOT NULL,
    "totalFields" INTEGER NOT NULL,
    "totalRelationships" INTEGER NOT NULL,
    "totalScripts" INTEGER NOT NULL,
    "totalLayouts" INTEGER NOT NULL,
    "totalValueLists" INTEGER NOT NULL,
    "totalCustomFunctions" INTEGER NOT NULL,
    "technicalDebt" INTEGER NOT NULL,
    "schemaComplexity" INTEGER NOT NULL,
    "scriptComplexity" INTEGER NOT NULL,
    "migrationDifficulty" INTEGER NOT NULL,
    "riskIndex" INTEGER NOT NULL
);
