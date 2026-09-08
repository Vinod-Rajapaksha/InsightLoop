import mongoose, { Schema, Document } from 'mongoose';
import { IReport } from './Report';

export interface IReportVersion extends Document {
  reportId: mongoose.Types.ObjectId;
  versionNumber: number;
  snapshot: Partial<IReport>;
  submittedAt: Date;
  submittedBy: mongoose.Types.ObjectId;
  statusAtSubmission: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportVersionSchema = new Schema<IReportVersion>(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
    versionNumber: { type: Number, required: true },
    snapshot: { type: Schema.Types.Mixed, required: true },
    submittedAt: { type: Date, default: Date.now },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    statusAtSubmission: { type: String, required: true },
  },
  { timestamps: true }
);

// Indexes
ReportVersionSchema.index({ reportId: 1, versionNumber: 1 }, { unique: true });

export const ReportVersion = mongoose.model<IReportVersion>('ReportVersion', ReportVersionSchema);
