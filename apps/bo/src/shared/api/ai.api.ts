import { API } from '@/shared/api/client'
import {
  GenerateTroubleshootDraft,
  type GenerateTroubleshootDraftData,
  type GenerateTroubleshootDraftResponse,
} from '@blog/contracts'

export type GenerateTroubleshootDraftFormInput = {
  githubUrl: string
  additionalContext?: string
  cursorChatLogFile?: File | null
}

// draftId로 조회할 때 내려오는 실제 초안 데이터 타입
export type AiDraft = {
  draftId: string
  title: string
  summary: string
  tags: string[]
  content: string
}

// AI 트러블슈팅 초안 생성 (multipart)
export async function generateTroubleshootDraft(
  input: GenerateTroubleshootDraftFormInput,
): Promise<GenerateTroubleshootDraftData> {
  const formData = new FormData()
  formData.append('githubUrl', input.githubUrl)
  if (input.additionalContext) formData.append('additionalContext', input.additionalContext)
  if (input.cursorChatLogFile) formData.append('cursorChatLog', input.cursorChatLogFile)

  const res = await API.postForm<GenerateTroubleshootDraftResponse>(
    GenerateTroubleshootDraft.path,
    formData,
  )
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// draftId로 생성된 초안 조회
export async function getDraftById(draftId: string): Promise<AiDraft | null> {
  const res = await API.get<{
    status: number
    message: string
    data: AiDraft | null
  }>(`/ai/drafts/${draftId}`)

  if (res.status === 404) return null
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}


