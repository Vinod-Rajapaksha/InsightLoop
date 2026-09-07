import mongoose, { Schema, Document } from 'mongoose';

export enum ReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  NEEDS_CORRECTION = 'NEEDS_CORRECTION',
  APPROVED = 'APPROVED',
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ITask {
  taskName: string;
  priority: TaskPriority;
  plannedPercentage: number;
  actualPercentage: number;
  status: TaskStatus;
  plannedHours: number;
  spentHours: number;
  deliverable: string;
}

export interface IBlocker {
  description: string;
  isKeyIssue: boolean;
}

export interface IAchievement {
  description: string;
  isKeyAchievement: boolean;
}

export interface IReport extends Document {
  owner: mongoose.Types.ObjectId;
  weekStart: Date;
  weekEnd: Date;
  project: mongoose.Types.ObjectId;
  tasksCompleted: ITask[];
  nextWeekTasks: ITask[];
  blockers: IBlocker[];
  achievements: IAchievement[];
  hoursByTaskType?: Record<string, number>;
  notes?: string;
  currentStatus: ReportStatus;
  latestReviewComment?: string;
  latestReviewedBy?: mongoose.Types.ObjectId;
  latestReviewedAt?: Date;
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  taskName: { type: String, required: true },
  priority: { type: String, enum: Object.values(TaskPriority), default: TaskPriority.MEDIUM },
  plannedPercentage: { type: Number, required: true, min: 0, max: 100 },
  actualPercentage: { type: Number, required: true, min: 0, max: 100 },
  status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.NOT_STARTED },
  plannedHours: { type: Number, required: true, min: 0 },
  spentHours: { type: Number, required: true, min: 0 },
  deliverable: { type: String, default: '' },
});

const BlockerSchema = new Schema<IBlocker>({
  description: { type: String, required: true },
  isKeyIssue: { type: Boolean, default: false },
});

const AchievementSchema = new Schema<IAchievement>({
  description: { type: String, required: true },
  isKeyAchievement: { type: Boolean, default: false },
});

const ReportSchema = new Schema<IReport>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    tasksCompleted: [TaskSchema],
    nextWeekTasks: [TaskSchema],
    blockers: [BlockerSchema],
    achievements: [AchievementSchema],
    hoursByTaskType: { type: Map, of: Number },
    notes: { type: String, default: '' },
    currentStatus: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.DRAFT,
    },
    latestReviewComment: { type: String },
    latestReviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    latestReviewedAt: { type: Date },
    currentVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Indexes
ReportSchema.index({ owner: 1 });
ReportSchema.index({ weekStart: 1, weekEnd: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ project: 1 });
ReportSchema.index({ owner: 1, weekStart: 1 }, { unique: true });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
