import { z } from 'zod'
import { PaginationQuerySchema } from '../common'

export const PostSchema = z.object({
  postSeq: z.number(),
  title: z.string(),
  content: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  authorName: z.string(),
  views: z.number(),
  pinned: z.boolean(),
  archived: z.boolean(),
})

export type PostType = z.infer<typeof PostSchema>

export const PostListQuerySchema = PaginationQuerySchema.extend({
  tag: z.string().optional(),
  category: z.string().optional(),
})

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  tags: z.array(z.string()).max(10),
  category: z.string().min(1),
})
