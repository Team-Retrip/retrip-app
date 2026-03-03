import { useCallback } from 'react'
import type { WebViewMessageEvent } from 'react-native-webview'
import { WebviewMessage } from '../types/webBridge.types'
import { LOG } from '../utils/logger'

const parseWebviewMessage = (event: WebViewMessageEvent): WebviewMessage | null => {
  const parsedData: unknown = JSON.parse(event.nativeEvent.data)
  if (typeof parsedData !== 'object' || parsedData === null) return null

  const messageType = Reflect.get(parsedData, 'type')
  if (typeof messageType !== 'string') return null

  const payload = Reflect.get(parsedData, 'payload')
  return { type: messageType, payload }
}

type Props = {
  handlers: Record<string, (payload: unknown) => void | undefined>
}

/** 웹뷰 메시지 수신 훅 */
export const useGetWebviewMessage = ({ handlers }: Props) => {
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message = parseWebviewMessage(event)
        if (!message) return LOG('[WEBVIEW] 수신 메시지 형식 오류', event.nativeEvent.data)

        LOG('[WEBVIEW] 메시지:', message)

        const handleMessage = handlers[message.type]
        if (handleMessage) handleMessage(message.payload)
        else LOG('[WEBVIEW] 미처리 메시지 타입', message)
      } catch (err) {
        console.error('[WEBVIEW] 오류: ', event.nativeEvent.data)
      }
    },
    [handlers]
  )

  return { onMessage }
}
