import { WEBBRIDGE_IMAGE_SOURCE_TYPE, WEBBRIDGE_MESSAGE_TYPE } from '../constants/webbridge'

/** 웹에서 수신하는 메시지 타입 */
export type WebviewMessageT =
  | TripCreateImageSelectMessageT
  | AuthTokenSetMessageT
  | AuthTokenDeleteMessageT
  | AuthTokenSyncRequestMessageT

export type TripCreateImageSelectMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.TRIP_CREATE_IMAGE_SELECT
  payload: {
    type: (typeof WEBBRIDGE_IMAGE_SOURCE_TYPE)[keyof typeof WEBBRIDGE_IMAGE_SOURCE_TYPE]
  }
}

export type AuthTokenSetMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.AUTH_TOKEN_SET
  payload: {
    accessToken: string
  }
}

export type AuthTokenDeleteMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.AUTH_TOKEN_DELETE
}

export type AuthTokenSyncRequestMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.AUTH_TOKEN_SYNC_REQUEST
}
