/**
 * console.log 대체 함수
 *
 * - 개발환경에서만 로그 보임
 */
export function LOG(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') console.log(...args)
}
