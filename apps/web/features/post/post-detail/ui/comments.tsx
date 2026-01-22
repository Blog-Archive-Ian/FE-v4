'use client'

import type { Post } from '@blog/contracts'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

interface Props {
  post: Post
}

export const Comments = ({ post }: Props) => {
  const commentsEl = useRef<HTMLDivElement | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!commentsEl.current) return
    if (commentsEl.current.hasChildNodes()) return

    const scriptEl = document.createElement('script')
    scriptEl.async = true
    scriptEl.src = 'https://utteranc.es/client.js'
    scriptEl.setAttribute('repo', process.env.NEXT_PUBLIC_GITHUB_REPO || '')
    scriptEl.setAttribute('issue-term', 'pathname')
    scriptEl.setAttribute('theme', resolvedTheme === 'dark' ? 'github-dark' : 'github-light')
    scriptEl.setAttribute('crossorigin', 'anonymous')

    commentsEl.current.appendChild(scriptEl)
  }, [post, resolvedTheme])

  useEffect(() => {
    const iframe = commentsEl.current?.querySelector<HTMLIFrameElement>('iframe.utterances-frame')
    if (!iframe) return

    iframe.contentWindow?.postMessage(
      {
        type: 'set-theme',
        theme: resolvedTheme === 'dark' ? 'github-dark' : 'github-light',
      },
      'https://utteranc.es',
    )
  }, [resolvedTheme])
  return (
    <section className="w-full min-w-0 ">
      <div ref={commentsEl} />
    </section>
  )
}
