import {
  HOMEPAGE_LOADED,
  HOMEPAGE_LOAD_FAIL,
  VIDEO_LOADED,
  VIDEO_LOADING,
  UPLOAD_STARTED,
  UPLOAD_ENDED,
  CLEAR_VIDEO_PAGE,
  REACHED_END,
  CHANGE_FILTER,
  CHANGE_ASCENDING,
  CHANGE_PAGE
  // UPDATE_WINDOW_SIZE
} from "./actionTypes.js"

const initialState = {
  videos: [],
  videoLoading: true,
  currentVideo: {},
  isUploading: false,
  reachedEnd: false,
  filterBy: "recent",
  ascending: false,
  page: 1
}

export const home = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case HOMEPAGE_LOADED:
      return {
        ...state,
        videos: state.videos.concat(payload),
        videoLoading: false
      }
    case CLEAR_VIDEO_PAGE:
      return {
        ...state,
        videos: [],
        reachedEnd: false
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
    case REACHED_END:
      return {
        ...state,
        reachedEnd: true
      }
    case CHANGE_FILTER:
      return {
        ...state,
        filterBy: payload
      }
    case CHANGE_ASCENDING:
      return {
        ...state,
        ascending: payload
      }
    case CHANGE_PAGE:
      return {
        ...state,
        page: payload
      }
    default:
      return state;
  }
}