import { useSearchParams } from '@/hooks/use-search-params'
import { Route } from '@/routes/(auth)/posts/list'
import { usePostList } from '@/shared/query-hook/post.query'
import type { GetPostListData, GetPostListQuery } from '@blog/contracts'
import { Button } from '@blog/ui'
import { Link, useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Archive, Pencil, Pin, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { PostTable } from './post-table'

export const PostListPage = () => {
  const navigate = useNavigate()
  const defaultSearch: GetPostListQuery = {
    page: 1,
    size: 100,
  }

  const { search, applySearch, resetSearch } = useSearchParams<GetPostListQuery>({
    defaultSearch: defaultSearch,
    Route: Route,
  })

  const [filters, setFilters] = useState<GetPostListQuery>({
    ...defaultSearch,
    ...search,
  })

  const { data: postList } = usePostList({ ...defaultSearch, ...search })

  const handleSearch = () => {
    applySearch(filters)
  }

  const handleReset = () => {
    setFilters(defaultSearch)
    resetSearch()
  }

  const postColumns: ColumnDef<GetPostListData['posts'][number]>[] = [
    {
      accessorKey: 'postSeq',
      header: 'No',
      cell: ({ row }) => <p className="text-xs text-muted-foreground">{row.original.postSeq}</p>,
    },
    {
      accessorKey: 'title',
      header: '제목',
      cell: ({ row }) => (
        <Link to="/posts/$postSeq" params={{ postSeq: String(row.original.postSeq) }}>
          <p className="truncate font-medium  max-w-60 hover:text-blue-400 transition-all duration-200">
            {row.original.title}
          </p>
        </Link>
      ),
    },
    {
      accessorKey: 'category',
      header: '카테고리',
      cell: ({ getValue }) => getValue<string>() ?? '-',
    },
    {
      accessorKey: 'tags',
      header: '태그',
      cell: ({ row }) => {
        const tags = (row.original as any).tags as string[] | undefined // 타입에 tags가 없으면 any 제거하고 PostRow 타입 보완
        if (!tags?.length) return <span className="text-muted-foreground">-</span>

        return (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )
      },
    },
    {
      id: 'edit',
      header: () => <span className="w-full flex justify-center">Edit</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              navigate({
                to: '/posts/edit/$postSeq',
                params: { postSeq: String(row.original.postSeq) },
              })
            }}
            size="icon"
            variant="ghost"
            aria-label="Edit"
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      ),
    },
    {
      id: 'delete',
      header: () => <span className="w-full flex justify-center">Delete</span>,
      enableSorting: false,
      enableHiding: false,
      cell: () => (
        <div className="flex justify-center">
          <Button size="icon" variant="ghost" aria-label="Delete">
            <Trash2 className="size-4 text-red-500" />
          </Button>
        </div>
      ),
    },
    {
      id: 'pin',
      header: () => <span className="flex w-full justify-center">Pin</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const pinned = row.original.pinned

        return (
          <div className="flex justify-center">
            <Button
              size="icon"
              variant={pinned ? 'secondary' : 'ghost'}
              aria-label={pinned ? 'Unpin' : 'Pin'}
              className={pinned ? 'text-foreground' : 'text-muted-foreground'}
            >
              <Pin className={pinned ? 'size-4 fill-current' : 'size-4'} />
            </Button>
          </div>
        )
      },
    },
    {
      id: 'archive',
      header: () => <span className="flex w-full justify-center">Archive</span>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const archived = row.original.archived

        return (
          <div className="flex justify-center">
            <Button
              size="icon"
              variant={archived ? 'secondary' : 'ghost'}
              aria-label={archived ? 'Unarchive' : 'Archive'}
              className={archived ? 'text-foreground' : 'text-muted-foreground'}
            >
              <Archive className={archived ? 'size-4 fill-current' : 'size-4'} />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl min-w-6xl px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">All Posts</h1>
          <p className="text-sm text-muted-foreground">모든 작성글 확인</p>
        </div>
      </div>
      <div className="w-full border rounded-lg pb-5 p-10 my-5 flex items-end justify-end">
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            초기화
          </Button>
          <Button onClick={handleSearch}>검색</Button>
        </div>
      </div>
      <PostTable columns={postColumns} data={postList?.posts} isLoading={!postList} />
    </div>
  )
}
