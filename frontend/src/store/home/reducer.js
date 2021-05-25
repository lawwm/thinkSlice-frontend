import {
  HOMEPAGE_LOADED,
  HOMEPAGE_LOAD_FAIL,
  VIDEO_LOADED,
  FAILED_LOAD,
  VIDEO_LOADING,
} from "./actionTypes.js"

const initialState = {
  videos: [],
  videoLoading: true,
  currentVideo: {}
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
    default:
      return state;
  }
}