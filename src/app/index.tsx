import { useGetWebviewMessage } from '@/libs/hooks/useGetWebviewMessage'
import { WebBridge } from '@/libs/utils/sendMessageToWeb'
import { useEffect, useRef } from 'react'
import Webview, { WebView } from 'react-native-webview'

export default function Page() {
  const webviewRef = useRef<WebView>(null)
  const { onMessage } = useGetWebviewMessage(webviewRef)

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
      allowsBackForwardNavigationGestures
      cacheEnabled
      webviewDebuggingEnabled
      startInLoadingState
    />
  )
}
