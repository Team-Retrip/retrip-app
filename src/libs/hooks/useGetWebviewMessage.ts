import { useCallback } from 'react'
import type { WebView, WebViewMessageEvent } from 'react-native-webview'
import { LOG } from '../utils/logger'

/**
 * 웹에서 보낸 메시지 수신 훅
 */
export function useGetWebviewMessage(webRef: React.RefObject<WebView | null>) {
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data)
        LOG('[웹뷰 메시지]', data)

        switch (data.type) {
          /** SEE: Message Type별 case 생성하여 사용 */
          default:
            LOG('[웹뷰 메시지]', data)
        }
      } catch (err) {
        console.error('[웹뷰 메시지] 오류: ', event.nativeEvent.data)
      }
    },
    [webRef]
  )

  return { onMessage }
}
