import { Button } from '@blog/ui'
import { Download } from 'lucide-react'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { PostDetailPdf } from '../organisms/post-detail-pdf'

type PostDetailJson = {
  title: string
  content: string
  category?: string | null
  tags?: string[] | null
  createdAt?: string | null
}

export function PostPdfDownloadButton({ post }: { post: PostDetailJson }) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    documentTitle: post.title || 'post',
  })

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        aria-label="download"
        className="text-muted-foreground"
        onClick={() => {
          if (!printRef.current) return
          handlePrint(() => printRef.current)
        }}
      >
        <Download className="size-4" />
      </Button>
      <div style={{ position: 'absolute', left: -99999, top: 0 }}>
        <PostDetailPdf ref={printRef} post={post} />
      </div>
    </>
  )
}
