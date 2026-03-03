import axios from 'axios'

export const putImageToS3 = async (presignedUrl: string, image: Blob, mimeType: string) => {
  await axios.put(presignedUrl, image, { headers: { 'Content-Type': mimeType } })
}
