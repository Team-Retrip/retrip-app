export const WEBBRIDGE_MESSAGE_TYPE = {
  TRIP_CREATE_IMAGE_SELECT: 'trip-create/image-select',
  TRIP_CREATE_IMAGE_SELECT_SUCCESS: 'trip-create/image-select/success',
  TRIP_CREATE_IMAGE_SELECT_CANCEL: 'trip-create/image-select/cancel',
  TRIP_CREATE_IMAGE_SELECT_ERROR: 'trip-create/image-select/error',

  AUTH_TOKEN_SET: 'auth/token/set',
  AUTH_TOKEN_DELETE: 'auth/token/delete',
  AUTH_TOKEN_SYNC_REQUEST: 'auth/token/sync',
} as const

export const WEBBRIDGE_IMAGE_SOURCE_TYPE = {
  GALLERY: 'GALLERY',
  CAMERA: 'CAMERA',
} as const
