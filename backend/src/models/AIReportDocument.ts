import mongoose, { Schema, Document } from "mongoose";

export interface IAIReportDocument extends Document {
  sourceType: string;
  sourceId: mongoose.Types.ObjectId;
  reportId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  weekStart: Date;
  weekEnd: Date;
  content: string;
  embedding: number[];
  metadata: {
    status: string;
    project: string;
    member: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AIReportDocumentSchema = new Schema<IAIReportDocument>(
  {
    sourceType: { type: String, default: "report_chunk", required: true },
    sourceId: { type: Schema.Types.ObjectId, required: true },
    reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    content: { type: String, required: true },
    embedding: { type: [Number], required: true },
    metadata: {
      status: { type: String, required: true },
      project: { type: String, required: true },
      member: { type: String, required: true },
    },
  },
  { timestamps: true },
);

AIReportDocumentSchema.index({ reportId: 1 });
AIReportDocumentSchema.index({ projectId: 1, weekStart: 1 });
AIReportDocumentSchema.index({ ownerId: 1, weekStart: 1 });

export const AIReportDocument = mongoose.model<IAIReportDocument>(
  "AIReportDocument",
  AIReportDocumentSchema,
);
