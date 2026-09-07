import {
  AIReportDocument,
  IAIReportDocument,
} from "../../../models/AIReportDocument";
import mongoose from "mongoose";

export class VectorDocumentRepository {
  async upsertDocument(docData: Partial<IAIReportDocument>) {
    await AIReportDocument.findOneAndUpdate(
      { sourceId: docData.sourceId },
      { $set: docData },
      { upsert: true, new: true },
    );
  }

  async deleteBySource(sourceId: string) {
    await AIReportDocument.deleteOne({ sourceId });
  }

  // Search similar documents using MongoDB Atlas Vector Search.
  async searchSimilar(
    embedding: number[],
    filters: {
      projectId?: string;
      ownerId?: string;
      weekStart?: Date;
      weekEnd?: Date;
      status?: string;
    },
    limit: number = 5,
  ) {
    const filterQuery: any = {};
    if (filters.projectId)
      filterQuery["projectId"] = new mongoose.Types.ObjectId(filters.projectId);
    if (filters.ownerId)
      filterQuery["ownerId"] = new mongoose.Types.ObjectId(filters.ownerId);
    if (filters.status) filterQuery["metadata.status"] = filters.status;
    if (filters.weekStart || filters.weekEnd) {
      filterQuery["weekStart"] = {};
      if (filters.weekStart) filterQuery["weekStart"].$gte = filters.weekStart;
      if (filters.weekEnd) filterQuery["weekStart"].$lte = filters.weekEnd;
    }

    try {
      const results = await AIReportDocument.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: embedding,
            numCandidates: 100,
            limit: limit,
            filter: filterQuery,
          },
        },
        {
          $project: {
            embedding: 0, // exclude large vector from results
            score: { $meta: "vectorSearchScore" },
          },
        },
      ]);

      return results;
    } catch (error) {
      console.error(
        "Vector search failed. Ensure Atlas Vector Search is configured.",
        error,
      );
      throw new Error(
        "Vector search failed. Ensure Atlas Vector Search is configured.",
      );
    }
  }
}

export const vectorDocumentRepository = new VectorDocumentRepository();
