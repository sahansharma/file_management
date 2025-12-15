import { z } from "zod";

export const uploadFileSchema = z.object({
  folderId: z.coerce.number().int().positive().optional(),
});

export const updateFileSchema = z.object({
  folderId: z.coerce.number().int().positive().optional(),
  filename: z.string().min(1).max(255).optional(),
});

export const fileIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const fileNameParamSchema = z.object({
  filename: z.string().min(1),
});
