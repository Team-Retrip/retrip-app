import { RefObject } from 'react'
import type { WebView } from 'react-native-webview'
import { LOG } from './logger'

let webviewRef: RefObject<WebView | null>

export const WebBridge = {
  /** 최초 1회 WebView 등록 */
  setRef(ref: RefObject<WebView | null>) {
    webviewRef = ref
  },

  /** 웹으로 메시지 전송 */
  postMessage(type: string, payload?: unknown) {
    const target = webviewRef?.current
    if (!target) return LOG('[WEBVIEW] WebView 참조 없음')

    target.postMessage(JSON.stringify({ type, payload }))
  },
}
