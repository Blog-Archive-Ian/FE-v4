import { generateTroubleshootDraft } from '@/shared/api/ai.api'
import { Button, Input, Label, Textarea, toast } from '@blog/ui'
import { useMemo, useState } from 'react'

export const AiDashboardPage = () => {
  const [githubUrl, setGithubUrl] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [cursorChatLogFile, setCursorChatLogFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidGithubUrl = useMemo(() => {
    const v = githubUrl.trim()
    if (!v) return false
    return /^https?:\/\/github\.com\/.+/.test(v)
  }, [githubUrl])

  const onPickCursorLogFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setCursorChatLogFile(null)
      return
    }

    // Cursor export md 파일만 받기
    if (!file.name.toLowerCase().endsWith('.md')) {
      toast.error('Cursor 대화 로그는 .md 파일만 업로드 가능합니다.')
      setCursorChatLogFile(null)
      return
    }

    setCursorChatLogFile(file)
  }

  const onClickGenerate = async () => {
    const url = githubUrl.trim()
    if (!url) {
      toast.error('GitHub URL을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      await generateTroubleshootDraft({
        githubUrl: url,
        additionalContext: additionalContext.trim() || undefined,
        cursorChatLogFile,
      })

      toast.success('초안 생성 요청이 완료되었습니다.')
      setAdditionalContext('')
      setCursorChatLogFile(null)
    } catch (err) {
      toast.error((err as Error)?.message ?? '초안 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">AI Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            GitHub URL과 Cursor 대화 로그로 트러블슈팅 블로그 초안을 생성합니다.
          </p>
        </div>
      </div>

      {/* Screen 1: Create Draft */}
      <section className="rounded-xl border bg-card p-6 mt-5">
        <h2 className="text-lg font-semibold">Create Draft</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          PR / Issue / Commit URL을 넣고, 필요하면 Cursor export md 로그를 같이 업로드하세요.
        </p>

        <div className="mt-6 space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              placeholder="https://github.com/user/repo/pull/123"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              지원: Pull Request / Issue / Commit (필수)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cursorChatLog">Cursor Chat Log (.md)</Label>
            <Input id="cursorChatLog" type="file" accept=".md" onChange={onPickCursorLogFile} />
            {cursorChatLogFile ? (
              <p className="text-xs text-muted-foreground">선택됨: {cursorChatLogFile.name}</p>
            ) : (
              <p className="text-xs text-muted-foreground">선택 사항</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="additionalContext">Additional Context</Label>
            <Textarea
              id="additionalContext"
              placeholder="버그 발생 배경, 환경 설명, 글에 꼭 들어가야 하는 맥락 등을 적어주세요."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">선택 사항</p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              onClick={onClickGenerate}
              disabled={!isValidGithubUrl || isSubmitting}
              className="rounded-full px-6"
            >
              {isSubmitting ? 'Generating...' : 'Generate Draft'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
