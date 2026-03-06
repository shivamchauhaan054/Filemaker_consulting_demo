import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseDdrXml,
  computeScores,
  buildDdrAnalyticsResponse,
} from "@/lib/ddrAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data upload." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing DDR XML file in request." },
        { status: 400 }
      );
    }

    const fileName = file.name || "ddr.xml";
    const size = file.size;

    if (size === 0) {
      return NextResponse.json(
        { error: "Uploaded DDR file is empty." },
        { status: 400 }
      );
    }

    if (size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error:
            "DDR file is too large for this demo. Please upload a file under 25MB.",
        },
        { status: 413 }
      );
    }

    const text = await file.text();

    if (!text.trim().startsWith("<")) {
      return NextResponse.json(
        { error: "Uploaded file does not appear to be valid XML." },
        { status: 400 }
      );
    }

    const totalsWithSteps = parseDdrXml(text);

    if (
      totalsWithSteps.totalTables === 0 &&
      totalsWithSteps.totalFields === 0 &&
      totalsWithSteps.totalRelationships === 0 &&
      totalsWithSteps.totalScripts === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Could not detect expected DDR structures (tables, fields, relationships, scripts) in the XML.",
        },
        { status: 422 }
      );
    }

    const scores = computeScores(totalsWithSteps);

    const created = await prisma.ddrAnalysis.create({
      data: {
        fileName,
        rawXmlSize: size,
        totalTables: totalsWithSteps.totalTables,
        totalFields: totalsWithSteps.totalFields,
        totalRelationships: totalsWithSteps.totalRelationships,
        totalScripts: totalsWithSteps.totalScripts,
        totalLayouts: totalsWithSteps.totalLayouts,
        totalValueLists: totalsWithSteps.totalValueLists,
        totalCustomFunctions: totalsWithSteps.totalCustomFunctions,
        technicalDebt: scores.technicalDebt,
        schemaComplexity: scores.schemaComplexity,
        scriptComplexity: scores.scriptComplexity,
        migrationDifficulty: scores.migrationDifficulty,
        riskIndex: scores.riskIndex,
      },
    });

    const response = buildDdrAnalyticsResponse({
      id: created.id,
      fileName,
      totals: totalsWithSteps,
      scores,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    console.error("Error processing DDR upload:", err);

    return NextResponse.json(
      {
        error:
          "Failed to process DDR XML. Ensure the export is valid and try again.",
      },
      { status: 500 }
    );
  }
}

