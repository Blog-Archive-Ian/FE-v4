'use client'

import { extractApiMessage } from '@/shared/lib/format'
import { Button } from '@blog/ui'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-6xl font-bold tracking-tight text-muted-foreground/30">500</p>
        <h1 className="text-2xl font-semibold">문제가 발생했습니다.</h1>
        <p className="text-sm text-muted-foreground">
          {extractApiMessage(error)} <br /> 잠시 후 다시 시도해주세요.
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 size-4" />
            홈으로
          </Link>
        </Button>

        <Button onClick={reset}>다시 시도</Button>

        <Button asChild variant="secondary">
          <button onClick={() => history.back()}>
            <ArrowLeft className="mr-2 size-4" />
            이전 페이지
          </button>
        </Button>
      </div>
    </div>
  )
}
