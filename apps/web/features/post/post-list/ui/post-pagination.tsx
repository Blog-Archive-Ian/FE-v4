'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@blog/ui'
import { useRouter } from 'next/navigation'

interface Props {
  page: number
  size: number
  totalPages: number
}

export function PostPagination({ page, size, totalPages }: Props) {
  const router = useRouter()

  const go = (p: number) => {
    router.push(`?page=${p}&size=${size}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onClick = (p: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    go(p)
  }

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        {/* 이전 */}
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${Math.max(page - 1, 1)}&size=${size}`}
            aria-disabled={page === 1}
            onClick={onClick(Math.max(page - 1, 1))}
          />
        </PaginationItem>

        {/* 페이지 번호 */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1
          return (
            <PaginationItem key={p}>
              <PaginationLink
                href={`?page=${p}&size=${size}`}
                onClick={onClick(p)}
                isActive={p === page}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {/* 다음 */}
        <PaginationItem>
          <PaginationNext
            href={`?page=${Math.min(page + 1, totalPages)}&size=${size}`}
            aria-disabled={page === totalPages}
            onClick={onClick(Math.min(page + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
