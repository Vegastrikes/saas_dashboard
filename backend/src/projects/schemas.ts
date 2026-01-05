import { z } from "zod";

export const projectStatusSchema = z.enum(["active", "paused", "completed"]);

export const createProjectSchema = z.object({
  name: z.string().min(2).max(200),
  status: projectStatusSchema.optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  status: projectStatusSchema.optional(),
});

export const listProjectsQuerySchema = z.object({
  status: projectStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});
