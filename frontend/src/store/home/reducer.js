import {
  HOMEPAGE_LOADED,
  HOMEPAGE_LOAD_FAIL,
  VIDEO_LOADED,
  VIDEO_LOADING,
  UPLOAD_STARTED,
  UPLOAD_ENDED,
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
      let payloadId = payload.map(video => video.id)
      let newVideos = state.videos.filter(val => !payloadId.includes(val.id))
      console.log(payload.concat(newVideos))
      return {
        ...state,
        // videos: state.videos.concat(payload),
        videos: payload.concat(state.videos.filter(val => !(payload.map(video => video.id)).includes(val.id))),
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
        ...state,
        videoLoading: false
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
        filterBy: payload,
        videos: [],
        reachedEnd: false,
        page: 1
      }
    case CHANGE_ASCENDING:
      return {
        ...state,
        ascending: payload,
        videos: [],
        reachedEnd: false,
        page: 1
      }
    case CHANGE_PAGE:
      return {
        ...state,
        page: state.page + 1
      }
    default:
      return state;
  }
}