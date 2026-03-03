import { WEBBRIDGE_MESSAGE_TYPE } from '@/libs/constants/webbridge'
import { useGetWebviewMessage } from '@/libs/hooks/useGetWebviewMessage'
import { useHandleAuthToken } from '@/libs/hooks/useHandleAuthToken'
import { useTripCreateImageSelect } from '@/libs/hooks/useUploadImage'
import { WebBridge } from '@/libs/utils/sendMessageToWeb'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import Webview, { WebView } from 'react-native-webview'

export default function Page() {
  const webviewRef = useRef<WebView>(null)

  /** 인증 토큰 처리 */
  const { sendAuthToken, setAuthToken } = useHandleAuthToken()
  const onAuthTokenSet = useCallback((payload: unknown) => void setAuthToken(payload), [setAuthToken])
  /** 여행 생성 플로우 이미지 선택 */
  const { onTripCreateImageSelect } = useTripCreateImageSelect()

  const webviewMassageHandlers = useMemo(
    () => ({
      [WEBBRIDGE_MESSAGE_TYPE.TRIP_CREATE_IMAGE_SELECT]: onTripCreateImageSelect,
      [WEBBRIDGE_MESSAGE_TYPE.AUTH_SET_TOKEN]: onAuthTokenSet,
    }),
    [onAuthTokenSet, onTripCreateImageSelect]
  )
  const { onMessage } = useGetWebviewMessage({ handlers: webviewMassageHandlers })

  useEffect(() => {
    WebBridge.setRef(webviewRef)
  }, [])

  return (
    // REF: https://github.com/react-native-webview/react-native-webview/blob/5bc526fce5b9d6225df183bdf3d8cf542007d90a/docs/Reference.md
    <Webview
      ref={webviewRef}
      className="flex-1"
      source={{ uri: 'https://www.naver.com' }}
      onMessage={onMessage}
      onLoadEnd={sendAuthToken}
      allowsBackForwardNavigationGestures
      cacheEnabled
      webviewDebuggingEnabled
      startInLoadingState
    />
  )
}
