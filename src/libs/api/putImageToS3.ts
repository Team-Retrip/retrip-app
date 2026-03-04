export const putImageToS3 = async (presignedUrl: string, image: Blob, mimeType: string) => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body: image,
  })

  if (!response.ok) throw new Error('[IMAGE_UPLOAD] 이미지 업로드 실패')
}
