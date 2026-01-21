'use client'

import { cn } from '@blog/ui'
import { useEffect, useMemo, useState } from 'react'

type TOCItem = { id: string; text: string; level: number }

interface TableOfContentsProps {
  title?: string
}

export const TableOfContents = ({ title = 'On this page' }: TableOfContentsProps) => {
  const [items, setItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>('h1[id], h2[id], h3[id]'),
    )

    const toc = headings
      .map((h) => ({
        id: h.id,
        text: h.textContent?.trim() ?? '',
        level: Number(h.tagName.replace('H', '')),
      }))
      .filter((x) => x.id && x.text)

    setItems(toc)
    if (toc[0]?.id) setActiveId(toc[0].id)
  }, [])

  const elements = useMemo(() => {
    return items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
  }, [items])

  useEffect(() => {
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const candidates = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const next = candidates[0]?.target?.id
        if (next) setActiveId(next)
      },
      {
        root: null,
        rootMargin: '-88px 0px -60% 0px',
        threshold: 0.01,
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [elements])

  const onClickItem = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const el = document.getElementById(id)
    if (!el) return

    const headerOffset = 88
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset

    window.history.pushState(null, '', `#${id}`)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <aside className="sticky top-24 w-[320px] border-l pl-6">
      <p className="mb-3 text-md font-semibold text-foreground">{title}</p>

      <div className="max-h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
        <ul className="space-y-1 text-sm">
          {items.map((item) => {
            const isActive = item.id === activeId

            return (
              <li key={item.id} style={{ marginLeft: (item.level - 1) * 12 }}>
                <a
                  href={`#${item.id}`}
                  onClick={onClickItem(item.id)}
                  className={cn(
                    'block truncate transition-colors',
                    isActive
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.text}
                </a>

                <div
                  className={cn(
                    'mt-1 h-0.5 w-10 rounded-full transition-opacity',
                    isActive ? 'bg-point opacity-100' : 'opacity-0',
                  )}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
