'use client'

import type { Post } from '@blog/contracts'
import MDEditor from '@uiw/react-md-editor'

interface Props {
  post: Post
}

export const PostContent = ({ post }: Props) => {
  return (
    <div className="min-w-0 w-full overflow-hidden [&_pre]:overflow-x-auto [&_pre]:max-w-full">
      <MDEditor.Markdown
        source={post.content}
        className="w-full wrap-break-words"
        style={{
          lineHeight: '30px',
          position: 'relative',
          zIndex: 10,
        }}
      />
    </div>
  )
}
