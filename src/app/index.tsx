import { STORAGE_KEY } from '@/libs/constants/auth'
import { WEBBRIDGE_MESSAGE_TYPE } from '@/libs/constants/webbridge'
import { useGetWebviewMessage } from '@/libs/hooks/useGetWebviewMessage'
import type { WebviewMessageT } from '@/libs/types/webBridge.types'
import { sendAuthToken, setAuthToken } from '@/libs/utils/handleAuthToken'
import { handleTripCreateImageSelect } from '@/libs/utils/handleImageUpload'
import { deleteToken } from '@/libs/utils/handleSecureStorage'
import { WebBridge } from '@/libs/utils/sendMessageToWeb'
import { useCallback, useEffect, useRef } from 'react'
import Webview, { WebView } from 'react-native-webview'

export default function Page() {
  const webviewRef = useRef<WebView>(null)

  /** 여행 생성 플로우 이미지 선택 */
  const onWebviewMessage = useCallback(async (message: WebviewMessageT) => {
    /** 앱 토큰 설정 */
    if (message.type === WEBBRIDGE_MESSAGE_TYPE.AUTH_TOKEN_SET) await setAuthToken(message.payload)
    /** 앱 토큰 삭제 */
    if (message.type === WEBBRIDGE_MESSAGE_TYPE.AUTH_TOKEN_DELETE) {
      deleteToken(STORAGE_KEY.ACCESS_TOKEN)
      deleteToken(STORAGE_KEY.REFRESH_TOKEN)
    }
    /** 웹에서 보낸 토큰 동기화 요청 (앱 → 웹 토큰 전송 요청) */
    if (message.type === WEBBRIDGE_MESSAGE_TYPE.AUTH_TOKEN_SYNC_REQUEST) await sendAuthToken()

    /** 여행 생성 플로우 대표 이미지 선택 */
    if (message.type === WEBBRIDGE_MESSAGE_TYPE.TRIP_CREATE_IMAGE_SELECT)
      await handleTripCreateImageSelect(message.payload.type)
  }, [])

  const { onMessage } = useGetWebviewMessage(onWebviewMessage)

  useEffect(() => {
    WebBridge.setRef(webviewRef)
  }, [])

  return (
    // REF: https://github.com/react-native-webview/react-native-webview/blob/5bc526fce5b9d6225df183bdf3d8cf542007d90a/docs/Reference.md
    <Webview
      ref={webviewRef}
      className="flex-1"
      /**
       * - ios simulator 사용 시: `http://localhost:3000`
       * - 실기기 사용 시: LAN IP 주소 ex) `http://192.0.0.1:3000`
       */
      source={{ uri: 'http://localhost:3000/trip' }}
      onMessage={onMessage}
      allowsBackForwardNavigationGestures
      cacheEnabled
      webviewDebuggingEnabled
      startInLoadingState
    />
  )
}
