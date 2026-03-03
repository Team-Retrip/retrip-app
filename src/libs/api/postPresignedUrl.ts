import axios from 'axios'
import { STORAGE_KEY } from '../constants/auth'
import { ApiResponseT } from '../types/api.types'
import { PostPresignedURLRequestT, PostPresignedURLResponseT } from '../types/uploadImage'
import { getToken } from '../utils/handleSecureStorage'

export const postPresignedUrl = async ({ extension }: PostPresignedURLRequestT) => {
  const accessToken = await getToken(STORAGE_KEY.ACCESS_TOKEN)
  if (!accessToken) throw new Error('[AUTH] access token is missing')

  const { data } = await axios.post<ApiResponseT<PostPresignedURLResponseT>>(
    `${process.env.EXPO_PUBLIC_API_URL}:8081/images/presigned-url`,
    { extension },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return data.data
}
