import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

type Body = {
  tags?: string[]
  paths?: string[]
}

/**
 * Nest(API)에서 호출해서 Next 캐시를 무효화하는 엔드포인트
 */
export async function POST(req: NextRequest) {
  // 1) 인증(시크릿)
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
  }

  // 2) payload 파싱
  const body = (await req.json().catch(() => ({}))) as Body
  const tags = body.tags ?? []
  const paths = body.paths ?? []

  // 3) 태그 기반 무효화
  for (const tag of tags) revalidateTag(tag, 'max')

  // 4) 경로 기반 무효화
  for (const path of paths) revalidatePath(path)

  return NextResponse.json({
    ok: true,
    revalidated: { tags, paths },
  })
}
