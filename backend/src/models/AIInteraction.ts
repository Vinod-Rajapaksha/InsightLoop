import mongoose, { Schema, Document } from "mongoose";

export interface IAIInteraction extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  question?: string;
  filters?: Record<string, any>;
  sources: Array<{
    type: string;
    id: string;
    project?: string;
    week?: string;
    relevance?: number;
  }>;
  success: boolean;
  aiModel: string;
  latencyMs: number;
  createdAt: Date;
}

const AIInteractionSchema = new Schema<IAIInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    question: { type: String },
    filters: { type: Schema.Types.Mixed },
    sources: [
      {
        type: { type: String, default: "report" },
        id: String,
        project: String,
        week: String,
        relevance: Number,
      },
    ],
    success: { type: Boolean, required: true },
    aiModel: { type: String, required: true },
    latencyMs: { type: Number, required: true },
  },
  { timestamps: true },
);

AIInteractionSchema.index({ user: 1, createdAt: -1 });
AIInteractionSchema.index({ type: 1, createdAt: -1 });

export const AIInteraction = mongoose.model<IAIInteraction>(
  "AIInteraction",
  AIInteractionSchema,
);
