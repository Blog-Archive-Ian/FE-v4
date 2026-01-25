import { z } from 'zod'

export const ApiResponse = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    status: z.number(),
    message: z.string(),
    data: schema.optional().nullable(),
  })

export const PaginatedResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    posts: z.array(itemSchema),
    totalCount: z.number(),
  })

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
})

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>
