import { API } from '@/shared/api/client'
import {
  GenerateTroubleshootDraft,
  type GenerateTroubleshootDraftResponse,
  type GenerateTroubleshootDraftData,
} from '@blog/contracts'

export type GenerateTroubleshootDraftFormInput = {
  githubUrl: string
  additionalContext?: string
  cursorChatLogFile?: File | null
}

// AI 트러블슈팅 초안 생성 (multipart)
export async function generateTroubleshootDraft(
  input: GenerateTroubleshootDraftFormInput,
): Promise<GenerateTroubleshootDraftData> {
  const formData = new FormData()
  formData.append('githubUrl', input.githubUrl)
  if (input.additionalContext) formData.append('additionalContext', input.additionalContext)
  if (input.cursorChatLogFile) formData.append('cursorChatLog', input.cursorChatLogFile)

  const res = await API.postForm<GenerateTroubleshootDraftResponse>(GenerateTroubleshootDraft.path, formData)
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

