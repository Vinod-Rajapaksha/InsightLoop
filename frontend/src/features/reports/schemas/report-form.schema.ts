import { z } from 'zod';
import { TaskPriority, TaskStatus } from '@/types';

export const taskSchema = z.object({
  taskName: z.string().min(1, 'Task name is required'),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  plannedPercentage: z.coerce.number().min(0).max(100),
  actualPercentage: z.coerce.number().min(0).max(100),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.NOT_STARTED),
  plannedHours: z.coerce.number().min(0),
  spentHours: z.coerce.number().min(0),
  deliverable: z.string().optional(),
});

export const blockerSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  isKeyIssue: z.boolean().default(false),
});

export const achievementSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  isKeyAchievement: z.boolean().default(false),
});

export const reportFormSchema = z.object({
  weekStart: z.string().min(1, 'Week start date is required'),
  weekEnd: z.string().min(1, 'Week end date is required'),
  project: z.string().min(1, 'Project selection is required'),
  tasksCompleted: z.array(taskSchema),
  nextWeekTasks: z.array(taskSchema),
  blockers: z.array(blockerSchema),
  achievements: z.array(achievementSchema),
  hoursByTaskType: z.record(z.string(), z.coerce.number().min(0)).optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (!data.weekStart || !data.weekEnd) return true;
  const start = new Date(data.weekStart);
  const end = new Date(data.weekEnd);
  return end >= start;
}, {
  message: 'Week end date cannot be earlier than week start date',
  path: ['weekEnd'],
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
