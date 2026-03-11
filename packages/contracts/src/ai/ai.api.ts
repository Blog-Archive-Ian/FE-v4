import { z } from 'zod'
import { ApiResponseStrict } from '../common'
import {
  GenerateTroubleshootDraftResultSchema,
  GenerateTroubleshootDraftSchema,
} from './ai.schema'

// AI 트러블슈팅 초안 생성 (Nest API에서 multipart로 md 파일을 수신)
export const GenerateTroubleshootDraft = {
  method: 'POST',
  path: '/ai/generate',
  Body: GenerateTroubleshootDraftSchema,
  // NOTE: cursorChatLog(.md) 파일은 multipart의 file 필드로 업로드됨 (contracts에서는 타입만 명시)
  Response: ApiResponseStrict(GenerateTroubleshootDraftResultSchema),
} as const

export type GenerateTroubleshootDraftBody = z.infer<typeof GenerateTroubleshootDraft.Body>
export type GenerateTroubleshootDraftResponse = z.infer<
  typeof GenerateTroubleshootDraft.Response
>
export type GenerateTroubleshootDraftData = GenerateTroubleshootDraftResponse['data']

