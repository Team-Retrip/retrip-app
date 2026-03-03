import { STORAGE_KEY } from '@/libs/constants/auth'
import { WEBBRIDGE_MESSAGE_TYPE } from '@/libs/constants/webbridge'
import { getToken, setToken } from '@/libs/utils/handleSecureStorage'
import { LOG } from '@/libs/utils/logger'
import { WebBridge } from '@/libs/utils/sendMessageToWeb'
import { useCallback } from 'react'

interface ParsedTokenPayload {
  accessToken: string
  refreshToken: string
}

function parseAuthToken(payload: unknown): ParsedTokenPayload | null {
  if (
    payload === null ||
    typeof payload !== 'object' ||
    !('accessToken' in payload && typeof payload.accessToken === 'string') ||
    !('refreshToken' in payload && typeof payload.refreshToken === 'string')
  )
    return null

  const accessToken = payload.accessToken
  const refreshToken = payload.refreshToken

  return { accessToken, refreshToken }
}

export function useHandleAuthToken() {
  const sendAuthToken = useCallback(async () => {
    try {
      const accessToken = await getToken(STORAGE_KEY.ACCESS_TOKEN)
      const refreshToken = await getToken(STORAGE_KEY.REFRESH_TOKEN)

      WebBridge.postMessage(WEBBRIDGE_MESSAGE_TYPE.AUTH_SYNC_TOKEN, { accessToken, refreshToken })
    } catch (error) {
      LOG('[AUTH] 토큰 불러오기 실패', error)
    }
  }, [])

  const setAuthToken = useCallback(async (payload: unknown) => {
    try {
      const tokens = parseAuthToken(payload)
      if (!tokens) return LOG('[AUTH] 토큰 파싱 실패', payload)

      await setToken(STORAGE_KEY.ACCESS_TOKEN, tokens.accessToken)
      await setToken(STORAGE_KEY.REFRESH_TOKEN, tokens.refreshToken)
    } catch (error) {
      LOG('[AUTH] 토큰 저장 실패', error)
    }
  }, [])

  return {
    sendAuthToken,
    setAuthToken,
  }
}
