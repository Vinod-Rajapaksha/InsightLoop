import { z } from "zod";
import { TaskPriority, TaskStatus } from "../models/Report";

const taskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  priority: z.nativeEnum(TaskPriority).optional(),
  plannedPercentage: z.coerce.number().min(0).max(100),
  actualPercentage: z.coerce.number().min(0).max(100),
  status: z.nativeEnum(TaskStatus).optional(),
  plannedHours: z.coerce.number().min(0),
  spentHours: z.coerce.number().min(0),
  deliverable: z.string().optional(),
});

const blockerSchema = z.object({
  description: z.string().min(1, "Blocker description is required"),
  isKeyIssue: z.boolean().optional().default(false),
});

const achievementSchema = z.object({
  description: z.string().min(1, "Achievement description is required"),
  isKeyAchievement: z.boolean().optional().default(false),
});

const reportBodySchema = z.object({
  weekStart: z.string(),
  weekEnd: z.string(),
  project: z.string().min(1, "Project ID is required"),
  tasksCompleted: z.array(taskSchema),
  nextWeekTasks: z.array(taskSchema),
  blockers: z.array(blockerSchema),
  achievements: z.array(achievementSchema),
  hoursByTaskType: z.record(z.string(), z.coerce.number()).optional(),
  notes: z.string().optional(),
});

export const createReportSchema = z.object({
  body: reportBodySchema,
});

export const updateReportSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Report ID is required"),
  }),
  body: reportBodySchema,
});

export const requestChangesSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Report ID is required"),
  }),
  body: z.object({
    comment: z.string().min(1, "Comment is required for requesting changes"),
  }),
});
