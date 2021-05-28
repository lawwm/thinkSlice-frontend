import {
  HOMEPAGE_LOADED,
  HOMEPAGE_LOAD_FAIL,
  VIDEO_LOADED,
  // FAILED_LOAD,
  VIDEO_LOADING,
  UPLOAD_STARTED,
  UPLOAD_ENDED,
  // UPDATE_WINDOW_SIZE
} from "./actionTypes.js"

const initialState = {
  videos: [],
  videoLoading: true,
  currentVideo: {},
  isUploading: false,
}

export const home = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case HOMEPAGE_LOADED:
      return {
        ...state,
        videos: payload,
        videoLoading: false
      }
    case VIDEO_LOADED:
      return {
        ...state,
        currentVideo: payload,
        videoLoading: false
      }
    case VIDEO_LOADING:
      return {
        ...state,
        videoLoading: true
      }
    case HOMEPAGE_LOAD_FAIL:
      return {
        ...state
      }
    case UPLOAD_STARTED:
      return {
        ...state,
        isUploading: true
      }
    case UPLOAD_ENDED:
      return {
        ...state,
        isUploading: false
      }
    // case UPDATE_WINDOW_SIZE:
    //   return {
    //     ...state,
    //     videoArranged: payload
    //   }
    default:
      return state;
  }
}