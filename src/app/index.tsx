import Webview from 'react-native-webview'

export default function Page() {
  return <Webview className="flex-1" source={{ uri: 'https://www.naver.com' }} />
}
