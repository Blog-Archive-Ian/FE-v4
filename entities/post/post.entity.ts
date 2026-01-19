export interface Post {
  postSeq: number
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  authorName: string
  views: number
  pinned: boolean
  archived: boolean
}
