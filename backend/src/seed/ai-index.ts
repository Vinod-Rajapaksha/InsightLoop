import mongoose from "mongoose";
import dotenv from "dotenv";
import { env } from "../config/env";
import { Report, ReportStatus } from "../models/Report";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { embeddingService } from "../modules/ai/rag/EmbeddingService";
import { vectorDocumentRepository } from "../modules/ai/rag/VectorDocumentRepository";

dotenv.config();

async function runIndexer() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected.");

  if (!env.GEMINI_API_KEY) {
    console.error(
      "Error: GEMINI_API_KEY is not configured. Cannot generate embeddings.",
    );
    process.exit(1);
  }

  const _registeredModels = [User.modelName, Project.modelName];
  const eligibleStatuses = [ReportStatus.SUBMITTED, ReportStatus.APPROVED];
  const reports = await Report.find({
    currentStatus: { $in: eligibleStatuses },
  })
    .populate("owner")
    .populate("project");

  console.log(`Found ${reports.length} eligible reports to index.`);

  let successCount = 0;
  let errorCount = 0;

  for (const report of reports) {
    try {
      console.log(`Processing report ID: ${report._id}...`);
      const content = embeddingService.convertReportToText(report);
      const embedding = await embeddingService.generateEmbedding(content);

      await vectorDocumentRepository.upsertDocument({
        sourceType: "report_chunk",
        sourceId: report._id as any, // 1:1 mapping for simplicity
        reportId: report._id as any,
        projectId: report.project as any,
        ownerId: report.owner as any,
        weekStart: report.weekStart,
        weekEnd: report.weekEnd,
        content,
        embedding,
        metadata: {
          status: report.currentStatus,
          project: report.project.toString(),
          member: report.owner.toString(),
        },
      });
      successCount++;
    } catch (error) {
      console.error(`Failed to index report ${report._id}:`, error);
      errorCount++;
    }
  }

  console.log(`\nIndexing Complete.`);
  console.log(`Successfully indexed: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

runIndexer();
