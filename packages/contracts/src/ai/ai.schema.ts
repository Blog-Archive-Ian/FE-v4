import { z } from 'zod'

// AI 초안 생성 요청 (파일은 multipart로 업로드하므로 스키마에는 메타 필드만 포함)
export const GenerateTroubleshootDraftSchema = z.object({
  githubUrl: z.string().min(1),
  additionalContext: z.string().optional(),
})

export type GenerateTroubleshootDraftType = z.infer<typeof GenerateTroubleshootDraftSchema>

export const GenerateTroubleshootDraftResultSchema = z.object({
  draftId: z.string(),
})

export type GenerateTroubleshootDraftResultType = z.infer<
  typeof GenerateTroubleshootDraftResultSchema
>

