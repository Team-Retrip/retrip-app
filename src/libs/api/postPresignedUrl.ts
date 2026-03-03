import axios from 'axios'
import { ApiResponseT } from '../types/api.types'
import { PostPresignedURLRequestT, PostPresignedURLResponseT } from '../types/uploadImage'

export const postPresignedUrl = async ({ extension }: PostPresignedURLRequestT) => {
  const { data } = await axios.post<ApiResponseT<PostPresignedURLResponseT>>(
    `${process.env.EXPO_PUBLIC_API_URL}:8081/images/presigned-url`,
    { extension }
  )
  return data.data
}
