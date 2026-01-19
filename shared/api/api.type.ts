export type ApiResponse<T> = {
  status: number
  data: T
  message: string
}

export type PaginatedResponse<T> = {
  totalCount: number
  posts: T[]
}
