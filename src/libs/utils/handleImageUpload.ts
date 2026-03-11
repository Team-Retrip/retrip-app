import { WEBBRIDGE_IMAGE_SOURCE_TYPE, WEBBRIDGE_MESSAGE_TYPE } from '@/libs/constants/webbridge'
import * as ImagePicker from 'expo-image-picker'
import { postPresignedUrl } from '../api/postPresignedUrl'
import { putImageToS3 } from '../api/putImageToS3'
import { WebBridge } from './sendMessageToWeb'

/** 선택한 이미지에서 확장자 추출 */
const getImageExtension = (image: ImagePicker.ImagePickerAsset) => {
  const { fileName, mimeType, uri } = image

  /** 파일명에서 추출 */
  if (fileName) {
    const fileNameParts = fileName.split('.')
    const fileNameExtension = fileNameParts[fileNameParts.length - 1]
    if (fileNameExtension) return fileNameExtension.toLowerCase()
  }

  /** MIME 타입에서 추출 */
  if (mimeType) {
    const mimeTypeParts = mimeType.split('/')
    const mimeTypeExtension = mimeTypeParts[mimeTypeParts.length - 1]
    if (mimeTypeExtension) return mimeTypeExtension.toLowerCase()
  }

  /** URI에서 추출 */
  const uriWithoutQuery = uri.split('?')[0]
  const uriParts = uriWithoutQuery.split('.')
  const uriExtension = uriParts[uriParts.length - 1]
  if (uriExtension && uriExtension !== uriWithoutQuery) return uriExtension.toLowerCase()

  /** 기본 확장자 */
  return 'jpg'
}

/** 갤러리 또는 카메라에서 이미지 선택 */
const handleImageSelect = async (
  type: (typeof WEBBRIDGE_IMAGE_SOURCE_TYPE)[keyof typeof WEBBRIDGE_IMAGE_SOURCE_TYPE]
): Promise<ImagePicker.ImagePickerResult | null> => {
  /** 갤러리에서 이미지 선택 */
  if (type === WEBBRIDGE_IMAGE_SOURCE_TYPE.GALLERY) {
    /** 갤러리 접근 권한 없는 경우 */
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      WebBridge.postMessage(WEBBRIDGE_MESSAGE_TYPE.TRIP_CREATE_IMAGE_SELECT_ERROR)
      return null
    }

    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [1, 1],
      quality: 1,
    })
  } else if (type === WEBBRIDGE_IMAGE_SOURCE_TYPE.CAMERA) {
    /** 카메라에서 이미지 촬영 */

    /** 카메라 접근 권한 없는 경우 */
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      WebBridge.postMessage(WEBBRIDGE_MESSAGE_TYPE.TRIP_CREATE_IMAGE_SELECT_ERROR)
      return null
    }

    return await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      aspect: [1, 1],
      quality: 0.5,
    })
  }

  return Promise.resolve(null)
}

export const handleTripCreateImageSelect = async (
  sourceType: (typeof WEBBRIDGE_IMAGE_SOURCE_TYPE)[keyof typeof WEBBRIDGE_IMAGE_SOURCE_TYPE]
) => {
  try {
    /** 이미지 선택 (카메라 or 갤러리) */
    const result = await handleImageSelect(sourceType)

    /** 이미지 선택을 취소한 경우 */
    if (!result || result.canceled) {
      WebBridge.postMessage(WEBBRIDGE_MESSAGE_TYPE.TRIP_CREATE_IMAGE_SELECT_CANCEL)
      return
    }

    const targetImage = result.assets[0]
    const extension = getImageExtension(targetImage)
    const { readImageUrl, presignedUrl } = await postPresignedUrl({ extension })

    /** 이미지 업로드 성공한 경우 */
    const imageObject = await fetch(targetImage.uri)
    const imageBlob = await imageObject.blob()
    await putImageToS3(presignedUrl, imageBlob, targetImage.mimeType ?? 'image/jpeg')

    WebBridge.postMessage(WEBBRIDGE_MESSAGE_TYPE.TRIP_CREATE_IMAGE_SELECT_SUCCESS, { imageUrl: readImageUrl })
  } catch (error) {
    /** 이미지 업로드 실패한 경우  */
    WebBridge.postMessage(WEBBRIDGE_MESSAGE_TYPE.TRIP_CREATE_IMAGE_SELECT_ERROR)
  }
}
