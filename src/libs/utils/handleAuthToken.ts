import { STORAGE_KEY } from '@/libs/constants/auth'
import { WEBBRIDGE_MESSAGE_TYPE } from '@/libs/constants/webbridge'
import { getToken, setToken } from '@/libs/utils/handleSecureStorage'
import { LOG } from '@/libs/utils/logger'
import { WebBridge } from '@/libs/utils/sendMessageToWeb'
import { AuthTokenSetMessageT } from '../types/webBridge.types'

const sendAuthToken = async () => {
  try {
    const accessToken = await getToken(STORAGE_KEY.ACCESS_TOKEN)
    const refreshToken = await getToken(STORAGE_KEY.REFRESH_TOKEN)

    WebBridge.postMessage(WEBBRIDGE_MESSAGE_TYPE.AUTH_TOKEN_SET, { accessToken, refreshToken })
  } catch (error) {
    LOG('[AUTH] 토큰 불러오기 실패', error)
  }
}

const setAuthToken = async (tokens: AuthTokenSetMessageT['payload']) => {
  try {
    const { accessToken, refreshToken } = tokens
    await setToken(STORAGE_KEY.ACCESS_TOKEN, accessToken)
    await setToken(STORAGE_KEY.REFRESH_TOKEN, refreshToken)
  } catch (error) {
    LOG('[AUTH] 토큰 저장 실패', error)
  }
}

export { sendAuthToken, setAuthToken }
