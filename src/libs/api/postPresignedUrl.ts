import { STORAGE_KEY } from '../constants/auth'
import { ApiResponseT } from '../types/api.types'
import { PostPresignedURLRequestT, PostPresignedURLResponseT } from '../types/uploadImage.types'
import { getToken } from '../utils/handleSecureStorage'

export const postPresignedUrl = async ({ extension }: PostPresignedURLRequestT) => {
  const accessToken = await getToken(STORAGE_KEY.ACCESS_TOKEN)
  if (!accessToken) throw new Error('[AUTH] access token is missing')

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}:8080/images/presigned-url`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ extension }),
  })

  if (!response.ok) throw new Error(`[IMAGE_UPLOAD] presigned-url 요청 실패: ${response.status}`)

  const json: ApiResponseT<PostPresignedURLResponseT> = await response.json()
  return json.data
}
