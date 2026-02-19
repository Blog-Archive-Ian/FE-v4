import { formatKoreanDate } from '@/shared/utils/format'
import { forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

type PostDetailJson = {
  title: string
  content: string // markdown
  category?: string | null
  tags?: string[] | null
  createdAt?: string | null
}

export const PostDetailPdf = forwardRef<HTMLDivElement, { post: PostDetailJson }>(
  ({ post }, ref) => {
    return (
      <div ref={ref} className="pdf-root">
        <style>
          {`
            @page { size: A4; margin: 18mm 16mm; }
            @media print {
                .no-print { display: none !important; }
            }

            .pdf-root {
                font-family: ui-sans-serif, system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
                color: #111;
                font-size: 10.5pt;    
                line-height: 1.45; 
            }

            .pdf-root .md table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin: 6mm 0;
                font-size: 9.5pt;
                line-height: 1.4;
                border: 1px solid #e6e6e6;
                border-radius: 10px;
                overflow: hidden; /* radius 살리기 */
            }

            .pdf-root .md thead th {
                background: #f6f7f9;
                color: #111;
                font-weight: 700;
                text-align: left;
                padding: 8px 10px;
                border-bottom: 1px solid #e6e6e6;
                vertical-align: top;
            }

            .pdf-root .md tbody td {
                padding: 8px 10px;
                border-bottom: 1px solid #efefef;
                vertical-align: top;
                word-break: break-word;
                overflow-wrap: anywhere;
            }

            .pdf-root .md tbody tr:nth-child(even)  {
                background: #fafafa;
            }

            .pdf-root .md tbody tr:last-child td    {
                border-bottom: 0;
            }

            .pdf-root .md td code,
            .pdf-root .md th code {
                font-size: 9pt;
                background: #f0f0f0;
                padding: 1px 4px;
                border-radius: 4px;
            }

            .pdf-root .md a {
                color: #0969da;
                text-decoration: underline;
            }

            .pdf-root .md table,
            .pdf-root .md tr,
            .pdf-root .md td,
            .pdf-root .md th {
                page-break-inside: avoid;
            }

            .pdf-title { font-size: 18pt; font-weight: 700; margin-bottom: 6mm; }
            .pdf-meta { font-size: 9pt; color:#555; margin-bottom: 8mm; display:flex; gap:8px; flex-wrap:wrap; }
            .badge { display:inline-block; border:1px solid #ddd; padding:2px 8px; border-radius:999px; }
           
            .pdf-root .md h1 { font-size: 16pt; font-weight: 650; margin: 8mm 0 3mm; line-height: 1.18; }
            .pdf-root .md h2 { font-size: 13pt; font-weight: 650; margin: 6mm 0 3mm; line-height: 1.2;  }
            .pdf-root .md h3 { font-size: 11pt; font-weight: 600; margin: 5mm 0 2.5mm; line-height: 1.25; }
            .pdf-root .md p { font-size: 10pt; margin: 0 0 3.5mm; line-height: 1.45; }

            .pdf-root .md ul,
            .pdf-root .md ol {
                margin: 0 0 4mm 6mm;
                padding-left: 6mm;
            }
            .pdf-root .md ul { list-style: disc !important; }
            .pdf-root .md ol { list-style: decimal !important; }
            .pdf-root .md li { 
                margin: 1.5mm 0; 
                font-size: 10pt;    
                line-height: 1.45;   
            }

            .pdf-root .md ul ul { list-style: circle !important; }
            .pdf-root .md ul ul ul { list-style: square !important; }

            .pdf-root .md blockquote { margin: 0 0 4mm; padding-left: 4mm; border-left: 3px solid #ddd; color: #444; }

            .pdf-root .md img { max-width: 70%; height: auto; margin: 5mm 0; }

            .pdf-root .md code {
                background:#f3f4f6;
                border:1px solid #e5e7eb;
                padding: 1px 4px;
                border-radius: 6px;
                font-size: 9.5pt;
            }

            .pdf-root .md pre {
                background:#f8fafc;
                color:#111827;
                border:1px solid #e5e7eb;
                padding: 10px 12px;
                border-radius: 10px;
                overflow:auto;
            }

            .pdf-root .md pre code {
                background: transparent;
                border: 0;
                padding: 0;
                font-size: 9.5pt;
            }

            .hljs { display:block; padding:0; background:transparent; color:#111827; }
            .hljs-comment,.hljs-quote { color:#6b7280; }
            .hljs-keyword,.hljs-selector-tag,.hljs-subst { color:#7c3aed; }
            .hljs-string,.hljs-doctag { color:#0ea5e9; }
            .hljs-title,.hljs-section,.hljs-selector-id { color:#111827; font-weight:700; }
            .hljs-literal,.hljs-number { color:#b45309; }
            .hljs-built_in,.hljs-type,.hljs-selector-class { color:#2563eb; }
            .hljs-attribute,.hljs-name,.hljs-tag { color:#16a34a; }
            .hljs-meta { color:#374151; }
            `}
        </style>

        <div className="pdf-title">{post.title}</div>

        <div className="pdf-meta">
          {post.createdAt && (
            <span className="badge">작성: {formatKoreanDate(post.createdAt)}</span>
          )}
          {post.category && <span className="badge">카테고리: {post.category}</span>}
          {(post.tags ?? []).map((t) => (
            <span key={t} className="badge">
              #{t}
            </span>
          ))}
        </div>

        <div className="md">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    )
  },
)

PostDetailPdf.displayName = 'PostDetailPdf'
