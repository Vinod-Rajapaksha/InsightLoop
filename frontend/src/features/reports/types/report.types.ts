import { ReportStatus, TaskPriority, TaskStatus } from "@/enums";
import { User } from "@/features/users/types/user.types";
import { Project } from "@/features/projects/types/project.types";

export interface Task {
  taskName: string;
  priority: TaskPriority;
  plannedPercentage: number;
  actualPercentage: number;
  status: TaskStatus;
  plannedHours: number;
  spentHours: number;
  deliverable: string;
  _id?: string;
}

export interface Blocker {
  description: string;
  isKeyIssue: boolean;
  _id?: string;
}

export interface Achievement {
  description: string;
  isKeyAchievement: boolean;
  _id?: string;
}

export interface Report {
  _id: string;
  owner: User | string; // May be populated
  weekStart: string;
  weekEnd: string;
  project: Project | string; // May be populated
  tasksCompleted: Task[];
  nextWeekTasks: Task[];
  blockers: Blocker[];
  achievements: Achievement[];
  hoursByTaskType: Record<string, number>;
  notes: string;
  currentStatus: ReportStatus;
  latestReviewComment?: string;
  latestReviewedBy?: User | string;
  latestReviewedAt?: string;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportVersion {
  _id: string;
  reportId: string;
  version: number;
  data: Partial<Report>;
  submittedBy: string;
  submittedAt: string;
  statusAtSubmission: ReportStatus;
}
