import mongoose, { Schema, Document } from 'mongoose';

export enum ReviewActionType {
  APPROVED = 'APPROVED',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
}

export interface IReviewAction extends Document {
  reportId: mongoose.Types.ObjectId;
  reportVersionId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  action: ReviewActionType;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewActionSchema = new Schema<IReviewAction>(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
    reportVersionId: { type: Schema.Types.ObjectId, ref: 'ReportVersion', required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: Object.values(ReviewActionType),
      required: true,
    },
    comment: { type: String, required: function(this: any): boolean { return this.action === ReviewActionType.CHANGES_REQUESTED; } },
  },
  { timestamps: true }
);

// Indexes
ReviewActionSchema.index({ reportId: 1 });
ReviewActionSchema.index({ createdAt: -1 });

export const ReviewAction = mongoose.model<IReviewAction>('ReviewAction', ReviewActionSchema);
