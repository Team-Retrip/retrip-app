import { useCallback } from 'react'
import type { WebViewMessageEvent } from 'react-native-webview'
import type { WebviewMessageT } from '../types/webBridge.types'
import { LOG } from '../utils/logger'

export const isWebviewMessage = (data: unknown): data is WebviewMessageT => {
  return typeof data === 'object' && data !== null && 'type' in data && typeof data.type === 'string'
}

/** 웹뷰 메시지 수신 훅 */
export const useGetWebviewMessage = (handler: (message: WebviewMessageT) => void) => {
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message = event.nativeEvent.data
        if (!message) return LOG('[WEBVIEW] 수신 메시지 존재하지 않음')

        const parsedMessage = JSON.parse(message)
        if (!isWebviewMessage(parsedMessage)) return LOG('[WEBVIEW] 수신 메시지 형식 오류', parsedMessage)

        LOG('[WEBVIEW] 수신 메시지:', parsedMessage)
        handler(parsedMessage)
      } catch {
        LOG('[WEBVIEW] 오류', event.nativeEvent.data)
      }
    },
    [handler]
  )

  return { onMessage }
}
