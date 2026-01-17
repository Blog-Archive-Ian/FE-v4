export type ApiResponse<T> = {
  status: number
  data: T
  message: string
}
