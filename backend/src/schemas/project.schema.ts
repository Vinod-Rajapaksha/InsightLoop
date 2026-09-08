import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    type: z.string().optional(),
    assignedMembers: z.array(z.string()).optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Project ID is required'),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    type: z.string().optional(),
    isActive: z.boolean().optional(),
    assignedMembers: z.array(z.string()).optional(),
  }),
});
