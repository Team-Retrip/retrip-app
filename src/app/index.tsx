import { useGetWebviewMessage } from '@/libs/hooks/useGetWebviewMessage'
import { WebBridge } from '@/libs/utils/sendMessageToWeb'
import { useEffect, useRef } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import Webview, { WebView } from 'react-native-webview'

export default function Page() {
  const webviewRef = useRef<WebView>(null)
  const { onMessage } = useGetWebviewMessage(webviewRef)

  useEffect(() => {
    WebBridge.setRef(webviewRef)
  }, [])

  return (
    // REF: https://github.com/react-native-webview/react-native-webview/blob/5bc526fce5b9d6225df183bdf3d8cf542007d90a/docs/Reference.md
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Webview
        ref={webviewRef}
        className="flex-1"
        /**
         * - ios simulator 사용 시: `http://localhost:3000`
         * - 실기기 사용 시: LAN IP 주소 ex) `http://192.0.0.1:3000`
         */
        source={{ uri: 'http://192.168.45.186:3000/trip' }}
        onMessage={onMessage}
        allowsBackForwardNavigationGestures
        cacheEnabled
        webviewDebuggingEnabled
        startInLoadingState
      />
    </KeyboardAvoidingView>
  )
}
