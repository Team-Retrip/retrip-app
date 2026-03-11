/** 공통 API 응답 타입 */
export type ApiResponseT<T = unknown> = {
  success: boolean
  status: number
  message: string
  data: T
}
