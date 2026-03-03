import { RefObject } from 'react'
import type { WebView } from 'react-native-webview'
import { LOG } from './logger'

interface Params {
  type: string
  payload?: string
}

let webviewRef: RefObject<WebView | null>

export const WebBridge = {
  /** 최초 1회 WebView 등록 */
  setRef(ref: RefObject<WebView | null>) {
    webviewRef = ref
  },

  /** 웹으로 메시지 전송 */
  postMessage({ type, payload }: Params) {
    const target = webviewRef?.current
    if (!target) {
      LOG('webview not initialized')
      return
    }
    target.postMessage(JSON.stringify({ type, payload }))
  },
}
